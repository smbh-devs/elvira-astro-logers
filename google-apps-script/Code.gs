/** @OnlyCurrentDoc */

// Лист с заявками (куда пишет форма) и лист со списком получателей в Telegram.
const LEADS_SHEET = 'Заявки';
const RECIPIENTS_SHEET = 'Telegram';
const TIMEZONE = 'Europe/Moscow';

// Токен бота хранится в свойствах скрипта, а не в таблице:
// Настройки проекта (шестерёнка) → Свойства скрипта → TELEGRAM_BOT_TOKEN.
function getBotToken() {
  return PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN');
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(LEADS_SHEET) || ss.getSheets()[0];
  sheet.appendRow([data.name, data.phone, data.birth_date, data.submitted_at]);

  // Уведомления не должны ломать запись заявки: любая ошибка только в лог.
  try {
    notifyTelegram(formatLeadMessage(data, sheet.getLastRow()));
  } catch (err) {
    console.error('Telegram notify failed: ' + err);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Лист "Telegram": колонка A — chat ID, колонка B — кто это (для себя),
// колонка C — если стоит FALSE (снятый чекбокс), получатель пропускается.
// Первая строка — заголовки.
function getRecipients() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RECIPIENTS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 3)
    .getValues()
    .filter(row => row[2] !== false)
    .map(row => String(row[0]).trim())
    .filter(id => /^-?\d+$/.test(id));
}

function notifyTelegram(text) {
  const token = getBotToken();
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not set in Script Properties');
    return;
  }
  const recipients = getRecipients();
  if (recipients.length === 0) {
    console.warn('No Telegram recipients on sheet "' + RECIPIENTS_SHEET + '"');
    return;
  }

  const url = 'https://api.telegram.org/bot' + token + '/sendMessage';
  recipients.forEach(chatId => {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      muteHttpExceptions: true,
    });
    if (response.getResponseCode() !== 200) {
      // 403 — пользователь не нажал Start у бота или заблокировал его.
      console.error('sendMessage to ' + chatId + ' failed: ' + response.getContentText());
    }
  });
}

function formatLeadMessage(data, rowNumber) {
  const lines = [
    '📩 <b>Новая заявка</b>',
    '',
    '👤 ' + escapeHtml(data.name || '—'),
    '📞 ' + escapeHtml(data.phone || '—'),
  ];
  if (data.birth_date) lines.push('🎂 ' + escapeHtml(formatBirthDate(data.birth_date)));
  lines.push('🕒 ' + escapeHtml(formatSubmittedAt(data.submitted_at)));
  if (rowNumber) lines.push('', '<i>Строка ' + rowNumber + ' в таблице</i>');
  return lines.join('\n');
}

function formatBirthDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  return m ? m[3] + '.' + m[2] + '.' + m[1] : String(value);
}

function formatSubmittedAt(value) {
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value || '—');
  return Utilities.formatDate(date, TIMEZONE, 'dd.MM.yyyy HH:mm') + ' (МСК)';
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- Служебные функции: запускать вручную из редактора (Выполнить → выбрать функцию) ----

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
