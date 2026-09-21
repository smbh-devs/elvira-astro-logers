// Уведомления в Telegram: список получателей на листе «Telegram», отправка, формат сообщений.

// Токен бота хранится в свойствах скрипта, а не в таблице:
// Настройки проекта (шестерёнка) → Свойства скрипта → TELEGRAM_BOT_TOKEN.
function getBotToken() {
  return PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN');
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
  if (data.topic) lines.push('💬 ' + escapeHtml(data.topic));
  if (data.call_time) lines.push('📅 ' + escapeHtml(data.call_time));
  if (data.birth_date) lines.push('🎂 ' + escapeHtml(formatBirthDate(data.birth_date)));
  lines.push('🕒 ' + escapeHtml(formatSubmittedAt(data.submitted_at)));
  if (rowNumber) lines.push('', '<i>Строка ' + rowNumber + ' в таблице</i>');
  return lines.join('\n');
}

function formatPaymentMessage(data, rowNumber) {
  const lines = [
    '💰 <b>Оплата ' + ((data.sum || 0) / 100) + ' ₽</b>',
    '',
    '👤 ' + escapeHtml(data.name || '—'),
    '📞 ' + escapeHtml(data.phone || '—'),
  ];
  if (data.birth_date) lines.push('🎂 ' + escapeHtml(formatBirthDate(data.birth_date)));
  lines.push('🕒 ' + escapeHtml(formatSubmittedAt(data.paid_at)));
  lines.push('', '<i>Заказ ' + escapeHtml(data.order_id || '—') + (rowNumber ? ', строка ' + rowNumber + ' на листе «' + PAYMENTS_SHEET + '»' : '') + '</i>');
  return lines.join('\n');
}

function formatBirthDate(value) {
  // Sheets могла превратить строку «1990-01-01» в дату при записи на лист.
  if (value instanceof Date) return Utilities.formatDate(value, TIMEZONE, 'dd.MM.yyyy');
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
