/**
 * The only backend of the site: the Apps Script web app (google-apps-script/Code.gs).
 *
 * The request is a "simple" CORS request (POST + text/plain body), so the browser sends no
 * preflight, which Apps Script cannot answer. The 302 to script.googleusercontent.com is
 * followed automatically and the final response carries Access-Control-Allow-Origin: *,
 * so the JSON is readable.
 */
export async function callSheetsApi<T>(payload: Record<string, unknown>): Promise<T> {
  const url = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
  if (!url) throw new Error('VITE_SHEETS_WEBHOOK_URL is not set');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}`);
  const data = (await res.json()) as T & { ok?: boolean; error?: string };
  if (data.ok === false) throw new Error(data.error || 'Apps Script error');
  return data;
}
