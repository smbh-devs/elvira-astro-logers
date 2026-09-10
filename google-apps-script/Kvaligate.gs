// Платёжный виджет Kvaligate (Checkout page): создание заказа, проверка статуса, лист «Заказы».

// Свойства скрипта (Настройки проекта → Свойства скрипта):
//   KVALIGATE_POINT        — id API в кабинете Kvaligate (Мерчанты → API)
//   KVALIGATE_PRIVATE_KEY  — приватный ключ API, PEM (PKCS#8, «BEGIN PRIVATE KEY»)
//   KVALIGATE_SERVICE      — id тарифа, по умолчанию 3
//   KVALIGATE_API_URL      — по умолчанию https://app.kvaligate.com
//   SITE_URL               — куда Kvaligate возвращает клиента, по умолчанию https://elviraastrologers.com
function kvaligateConfig() {
  const props = PropertiesService.getScriptProperties();
  const point = props.getProperty('KVALIGATE_POINT');
  const privateKey = props.getProperty('KVALIGATE_PRIVATE_KEY');
  if (!point || !privateKey) return null;
  return {
    apiUrl: (props.getProperty('KVALIGATE_API_URL') || 'https://app.kvaligate.com').replace(/\/$/, ''),
    point: point,
    privateKey: normalizePem(privateKey),
    service: Number(props.getProperty('KVALIGATE_SERVICE') || 3),
    siteUrl: (props.getProperty('SITE_URL') || 'https://elviraastrologers.com').replace(/\/$/, ''),
  };
}

// Поле «Свойства скрипта» однострочное: переносы в PEM теряются или приходят как «\\n».
// Собираем ключ заново из base64-тела, чтобы вставка в любом виде давала корректный PEM.
function normalizePem(raw) {
  const body = String(raw)
    .replace(/\\n/g, '\n')
    .replace(/-----(BEGIN|END) [^-]+-----/g, '')
    .replace(/\s+/g, '');
  const lines = body.match(/.{1,64}/g) || [];
  return '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
}

const KV_REGISTER_PATH = '/psp/payment-widget/register';
// Состояния Kvaligate: 0 NEW, 40 PROCESS, 60 SUCCESS, 80 ERROR, 81 ERROR_EXPIRED.
const KV_STATES = { 0: 'new', 40: 'process', 60: 'paid', 80: 'failed', 81: 'expired' };
const FINAL_STATES = ['paid', 'failed', 'expired'];

// Колонки листа «Заказы» (0-based).
const ORDER_COLS = {
  id: 0, name: 1, phone: 2, birthDate: 3, sum: 4, state: 5, kvOrderId: 6,
  requestBody: 7, createdAt: 8, updatedAt: 9, notifiedAt: 10, source: 11, leadRow: 12,
};

const ORDER_HEADERS = ['Заказ', 'Имя', 'Телефон', 'Дата рождения', 'Сумма, ₽', 'Статус', 'ID Kvaligate',
  'Тело запроса', 'Создан', 'Обновлён', 'Уведомлён', 'Источник', 'Строка заявки'];

// Кодировку задаём явно: без неё кириллица в теле подписывается не теми байтами, что уходят в запрос.
function kvaligateSign(config, value) {
  return Utilities.base64Encode(
    Utilities.computeRsaSha256Signature(value, config.privateKey, Utilities.Charset.UTF_8)
  );
}

function kvaligateRegister(config, bodyJson) {
  const signature = kvaligateSign(config, 'POST' + KV_REGISTER_PATH + bodyJson);
  const response = UrlFetchApp.fetch(config.apiUrl + KV_REGISTER_PATH, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'PSP-Point': config.point, 'PSP-Sign': signature },
    payload: bodyJson,
    muteHttpExceptions: true,
  });
  const text = response.getContentText();
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error('Kvaligate non-JSON (HTTP ' + response.getResponseCode() + '): ' + text.slice(0, 200));
  }
}

function newOrderId() {
  // Префикс: API общий с другим сайтом, а дедупликация у Kvaligate — по id.
  return 'elv_' + Utilities.getUuid().replace(/-/g, '').slice(0, 20);
}

function createOrder(lead) {
  const config = kvaligateConfig();
  if (!config) {
    console.warn('Kvaligate is not configured (KVALIGATE_POINT / KVALIGATE_PRIVATE_KEY)');
    return null;
  }
  const id = newOrderId();
  const body = {
    client: String(lead.leadRow || ''),
    currency: 'RUB',
    date: new Date().toISOString(),
    id: id,
    product: 'Консультация астролога',
    description: 'Консультация астролога, заявка ' + lead.leadRow,
    sum: PRICE_KOPECKS,
    service: config.service,
    source: 'SBP',
    redirectUrlSuccess: config.siteUrl + '/?payment=success&order=' + id,
    redirectUrlError: config.siteUrl + '/?payment=error&order=' + id,
    params: [{ code: 'client-agentName', value: 'elvira-astro-logers' }],
  };
  const bodyJson = JSON.stringify(body);
  const result = kvaligateRegister(config, bodyJson);
  if (result.error !== 0 || !result.redirectUrl) {
    throw new Error('register rejected: ' + JSON.stringify(result));
  }

  const now = new Date().toISOString();
  getOrdersSheet().appendRow([
    id, lead.name, lead.phone, lead.birthDate, PRICE_KOPECKS / 100, 'new', result.orderId || '',
    bodyJson, now, now, '', lead.source, lead.leadRow,
  ]);
  return { id: id, redirectUrl: result.redirectUrl };
}

function getOrdersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(ORDERS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(ORDERS_SHEET);
    sheet.getRange(1, 1, 1, ORDER_HEADERS.length).setValues([ORDER_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Текстовый формат: id, дата рождения, тело запроса и ISO-даты не должны превращаться в числа/даты.
    ['A:A', 'D:D', 'G:G', 'H:H', 'I:I', 'J:J', 'K:K'].forEach(r => sheet.getRange(r).setNumberFormat('@'));
  }
  return sheet;
}

// Возвращает { row: номер строки в листе, values: [...] } или null.
function findOrder(sheet, orderId) {
  if (sheet.getLastRow() < 2) return null;
  const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === orderId) {
      const row = i + 2;
      return { row: row, values: sheet.getRange(row, 1, 1, ORDER_HEADERS.length).getValues()[0] };
    }
  }
  return null;
}

// Обновляет состояние заказа повторным register; при переходе в paid шлёт уведомление один раз.
function refreshOrder(sheet, found) {
  const values = found.values;
  const state = String(values[ORDER_COLS.state]);
  if (FINAL_STATES.indexOf(state) !== -1) return state;

  const config = kvaligateConfig();
  if (!config) return state;
  const result = kvaligateRegister(config, String(values[ORDER_COLS.requestBody]));
  if (result.error !== 0) {
    console.error('Kvaligate status rejected for ' + values[ORDER_COLS.id] + ': ' + JSON.stringify(result));
    return state;
  }
  const next = KV_STATES[result.state] || 'new';
  const now = new Date().toISOString();
  sheet.getRange(found.row, ORDER_COLS.state + 1).setValue(next);
  sheet.getRange(found.row, ORDER_COLS.updatedAt + 1).setValue(now);
  if (result.orderId) sheet.getRange(found.row, ORDER_COLS.kvOrderId + 1).setValue(String(result.orderId));

  if (next === 'paid' && !values[ORDER_COLS.notifiedAt]) {
    sheet.getRange(found.row, ORDER_COLS.notifiedAt + 1).setValue(now);
    try {
      recordPayment({
        order_id: String(values[ORDER_COLS.id]),
        name: values[ORDER_COLS.name],
        phone: values[ORDER_COLS.phone],
        birth_date: values[ORDER_COLS.birthDate],
        sum: PRICE_KOPECKS,
        paid_at: now,
      });
    } catch (err) {
      // Отметка уже стоит: лучше потерять одно уведомление, чем слать дубли при каждом ретрае.
      console.error('Payment notify failed for ' + values[ORDER_COLS.id] + ': ' + err);
    }
  }
  return next;
}

// Строка на листе «Оплаты» и сообщение в Telegram.
function recordPayment(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(PAYMENTS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(PAYMENTS_SHEET);
    sheet.getRange(1, 1, 1, 6)
      .setValues([['Имя', 'Телефон', 'Дата рождения', 'Сумма, ₽', 'Оплачено', 'Заказ']])
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([data.name, data.phone, data.birth_date, data.sum / 100, data.paid_at, data.order_id]);
  notifyTelegram(formatPaymentMessage(data, sheet.getLastRow()));
}

// Триггер по времени (см. setupPaymentTrigger): добирает клиентов, которые оплатили в банке
// и не вернулись на сайт. Проверяет незавершённые заказы за последние 24 часа.
function sweepPendingOrders() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    const sheet = getOrdersSheet();
    if (sheet.getLastRow() < 2) return;
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, ORDER_HEADERS.length).getValues();
    const since = Date.now() - 24 * 3600 * 1000;
    let checked = 0;
    rows.forEach((values, i) => {
      const state = String(values[ORDER_COLS.state]);
      if (FINAL_STATES.indexOf(state) !== -1) return;
      if (new Date(values[ORDER_COLS.createdAt]).getTime() < since) return;
      try {
        refreshOrder(sheet, { row: i + 2, values: values });
        checked++;
      } catch (err) {
        console.error('sweep failed for ' + values[ORDER_COLS.id] + ': ' + err);
      }
    });
    console.log('sweep: checked ' + checked);
  } finally {
    lock.releaseLock();
  }
}
