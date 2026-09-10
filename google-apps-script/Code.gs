/** @OnlyCurrentDoc */

// Точка входа веб-приложения. Kvaligate — в Kvaligate.gs, Telegram — в Telegram.gs,
// служебные функции для запуска из редактора — в Setup.gs. Все файлы делят одну область видимости.

// Лист с заявками (куда пишет форма) и лист со списком получателей в Telegram.
const LEADS_SHEET = 'Заявки';
const RECIPIENTS_SHEET = 'Telegram';
const TIMEZONE = 'Europe/Moscow';

// Лист с заказами Kvaligate и лист с подтверждёнными оплатами.
const ORDERS_SHEET = 'Заказы';
const PAYMENTS_SHEET = 'Оплаты';

// Оплата консультации. Сумма в API Kvaligate — в копейках.
const PRICE_KOPECKS = 9900;

// Единственная точка входа с сайта. Тело — JSON в text/plain (простой CORS-запрос без preflight).
//   { action: 'lead',  name, phone, birth_date, source, submitted_at } → { ok, order_id, redirect_url }
//   { action: 'check', order_id }                                      → { ok, state }
// Без action — старый формат заявки, ведёт себя как 'lead'.
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ ok: false, error: 'Invalid JSON' });
  }
  try {
    if (data.action === 'check') return jsonOut(checkOrder(String(data.order_id || '')));
    return jsonOut(handleLead(data));
  } catch (err) {
    console.error('doPost failed: ' + err + (err.stack ? '\n' + err.stack : ''));
    return jsonOut({ ok: false, error: String(err) });
  }
}

function handleLead(data) {
  const name = String(data.name || '').trim().slice(0, 200);
  const phone = String(data.phone || '').trim().slice(0, 50);
  const birthDate = String(data.birth_date || '').trim().slice(0, 10);
  const submittedAt = data.submitted_at || new Date().toISOString();
  if (!name || !phone) return { ok: false, error: 'Missing fields' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(LEADS_SHEET) || ss.getSheets()[0];
  sheet.appendRow([name, phone, birthDate, submittedAt]);
  const leadRow = sheet.getLastRow();

  // Заказ создаём до уведомления: клиент ждёт redirect_url, Telegram может подождать.
  let order = null;
  try {
    order = createOrder({ name: name, phone: phone, birthDate: birthDate, source: String(data.source || ''), leadRow: leadRow });
  } catch (err) {
    console.error('Kvaligate order failed: ' + err);
  }

  // Уведомления не должны ломать запись заявки: любая ошибка только в лог.
  try {
    notifyTelegram(formatLeadMessage({ name: name, phone: phone, birth_date: birthDate, submitted_at: submittedAt }, leadRow));
  } catch (err) {
    console.error('Telegram notify failed: ' + err);
  }

  return { ok: true, order_id: order ? order.id : null, redirect_url: order ? order.redirectUrl : null };
}

// Проверка с сайта после возврата с оплаты. Блокировка — чтобы вызов с сайта и
// триггер sweepPendingOrders не обновили один заказ одновременно и не отправили два уведомления.
function checkOrder(orderId) {
  if (!/^elv_[0-9a-f]{20}$/.test(orderId)) return { ok: false, error: 'Bad order_id' };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getOrdersSheet();
    const found = findOrder(sheet, orderId);
    if (!found) return { ok: false, error: 'Not found' };
    return { ok: true, state: refreshOrder(sheet, found) };
  } finally {
    lock.releaseLock();
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
