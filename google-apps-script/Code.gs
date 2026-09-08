/** @OnlyCurrentDoc */

// Принимает заявку от edge-функции Supabase `notify-lead` и дописывает строку
// в лист "Заявки". Уведомления в Telegram шлёт сама edge-функция.
const LEADS_SHEET = 'Заявки';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(LEADS_SHEET) || ss.getSheets()[0];
  sheet.appendRow([data.name, data.phone, data.birth_date, data.submitted_at]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
