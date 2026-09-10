// Создаёт триггер sweepPendingOrders раз в 10 минут (повторный запуск не плодит дубли).
function setupPaymentTrigger() {
  const exists = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'sweepPendingOrders');
  if (exists) {
    console.log('Триггер sweepPendingOrders уже есть');
    return;
  }
  ScriptApp.newTrigger('sweepPendingOrders').timeBased().everyMinutes(10).create();
  console.log('Триггер sweepPendingOrders создан: каждые 10 минут');
}

// Проверка ключа и подписи: создаёт заказ на 99 ₽ и сразу запрашивает его состояние.
// Оплачивать не нужно — неоплаченный заказ сам перейдёт в expired. Первый запуск попросит
// разрешение на внешние запросы.
function testKvaligate() {
  const config = kvaligateConfig();
  if (!config) throw new Error('KVALIGATE_POINT / KVALIGATE_PRIVATE_KEY не заданы в свойствах скрипта');
  // Самопроверка ключа: подпись фиксированной строки детерминирована, сравниваем с эталоном,
  // посчитанным тем же ключом в openssl. Не совпало — ключ вставлен неверно или не тот.
  const selfTest = kvaligateSign(config, 'kvaligate-selftest').slice(0, 24);
  const expected = 'fPdb4FP11VbJqUE+Yup63GFL';
  console.log('key self-test: ' + selfTest + (selfTest === expected ? ' — ключ верный' : ' — НЕ совпадает с эталоном ' + expected));

  const id = newOrderId();
  const bodyJson = JSON.stringify({
    client: 'test', currency: 'RUB', date: new Date().toISOString(), id: id,
    product: 'Консультация астролога', description: 'Тестовый заказ, не оплачивать',
    sum: PRICE_KOPECKS, service: config.service, source: 'SBP',
    redirectUrlSuccess: config.siteUrl + '/?payment=success&order=' + id,
    redirectUrlError: config.siteUrl + '/?payment=error&order=' + id,
    params: [{ code: 'client-agentName', value: 'elvira-astro-logers' }],
  });
  const created = kvaligateRegister(config, bodyJson);
  console.log('create: ' + JSON.stringify(created));
  if (created.error !== 0) throw new Error('Kvaligate отклонил заказ: ' + created.errorMessage);
  const polled = kvaligateRegister(config, bodyJson);
  console.log('poll: state ' + polled.state + ' → ' + (KV_STATES[polled.state] || 'new'));
  console.log('OK: подпись принята, redirectUrl ' + created.redirectUrl);
}

// Создаёт лист "Telegram" с заголовками, чекбоксами и стартовым списком получателей.
// Если лист уже есть — только дописывает недостающие ID.
function setupTelegramSheet() {
  const seed = [
    ['731708341', 'Руслан'],
    ['7897855088', 'Никита'],
  ];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(RECIPIENTS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(RECIPIENTS_SHEET);
    sheet.getRange(1, 1, 1, 3).setValues([['Chat ID', 'Кто', 'Активен']]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('@');
    sheet.setColumnWidth(2, 200);
  }
  const existing = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => String(r[0]).trim())
    : [];
  seed.filter(([id]) => existing.indexOf(id) === -1).forEach(([id, who]) => {
    const row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, 2).setValues([[id, who]]);
    sheet.getRange(row, 3).insertCheckboxes().check();
  });
  console.log('Получатели: ' + getRecipients().join(', '));
}

// Проверка настройки: отправит тестовое сообщение всем получателям.
// Первый запуск попросит разрешение на внешние запросы — это нужно сделать до деплоя.
function testTelegram() {
  const token = getBotToken();
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set in Script Properties');
  const me = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/getMe', {
    muteHttpExceptions: true,
  }).getContentText());
  if (!me.ok) throw new Error('Token is rejected by Telegram: ' + JSON.stringify(me));
  console.log('Bot: @' + me.result.username + ' (id ' + me.result.id + ')');
  console.log('Recipients: ' + (getRecipients().join(', ') || 'none'));
  notifyTelegram(formatLeadMessage({
    name: 'Тест',
    phone: '+70000000000',
    birth_date: '1990-01-01',
    submitted_at: new Date().toISOString(),
  }, null));
}

// Показывает chat ID всех, кто недавно написал боту (посмотреть в логе выполнения).
// Пользователь должен сначала отправить боту любое сообщение (например, /start).
function printChatIds() {
  const token = getBotToken();
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set in Script Properties');
  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/getUpdates', {
    muteHttpExceptions: true,
  });
  const updates = JSON.parse(response.getContentText()).result || [];
  const seen = {};
  updates.forEach(u => {
    const chat = (u.message || u.edited_message || {}).chat;
    if (chat && !seen[chat.id]) {
      seen[chat.id] = true;
      console.log(chat.id + ' — ' + [chat.first_name, chat.last_name, chat.username && '@' + chat.username, chat.title]
        .filter(Boolean).join(' '));
    }
  });
  if (Object.keys(seen).length === 0) console.log('Нет сообщений: напишите боту /start и запустите снова');
}
