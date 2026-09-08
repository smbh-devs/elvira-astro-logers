// Notifies about a new lead: appends a row to the Google Sheet (Apps Script web app)
// and sends a Telegram message to every chat id from TELEGRAM_CHAT_IDS.
// The lead itself is already stored in the `leads` table by the frontend, so both
// deliveries are best-effort: a failure is logged and reported, never thrown.
//
// Secrets: GOOGLE_SHEETS_WEBHOOK_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_IDS ("id1,id2").

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TIMEZONE = "Europe/Moscow";

interface LeadPayload {
  name?: string;
  phone?: string;
  birth_date?: string;
}

interface Lead {
  name: string;
  phone: string;
  birthDate: string;
  submittedAt: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const lead: Lead = {
    name: String(body.name ?? "").trim().slice(0, 200),
    phone: String(body.phone ?? "").trim().slice(0, 50),
    birthDate: String(body.birth_date ?? "").trim().slice(0, 20),
    submittedAt: new Date().toISOString(),
  };
  if (!lead.name || !lead.phone) {
    return json({ error: "Missing fields" }, 400);
  }

  const [sheets, telegram] = await Promise.all([appendToSheet(lead), notifyTelegram(lead)]);
  return json({ success: true, sheets, telegram });
});

async function appendToSheet(lead: Lead): Promise<string> {
  const url = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL");
  if (!url) return "skipped: GOOGLE_SHEETS_WEBHOOK_URL is not set";
  try {
    // Apps Script answers with a 302 to the actual output; fetch follows it.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        birth_date: lead.birthDate,
        submitted_at: lead.submittedAt,
      }),
    });
    if (!res.ok) {
      console.error(`Sheets webhook failed: HTTP ${res.status}`);
      return `failed: HTTP ${res.status}`;
    }
    return "ok";
  } catch (err) {
    console.error(`Sheets webhook failed: ${err}`);
    return "failed";
  }
}

async function notifyTelegram(lead: Lead): Promise<string> {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  if (!token) return "skipped: TELEGRAM_BOT_TOKEN is not set";
  const chatIds = (Deno.env.get("TELEGRAM_CHAT_IDS") ?? "")
    .split(/[\s,;]+/)
    .filter((id) => /^-?\d+$/.test(id));
  if (chatIds.length === 0) return "skipped: TELEGRAM_CHAT_IDS is empty";

  const text = formatMessage(lead);
  const results = await Promise.all(chatIds.map(async (chatId) => {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
      if (!res.ok) {
        // 403: the recipient has not pressed Start in the bot chat, or blocked it.
        console.error(`sendMessage to ${chatId} failed: ${await res.text()}`);
        return false;
      }
      return true;
    } catch (err) {
      console.error(`sendMessage to ${chatId} failed: ${err}`);
      return false;
    }
  }));
  const sent = results.filter(Boolean).length;
  return `${sent}/${chatIds.length} sent`;
}

function formatMessage(lead: Lead): string {
  const lines = ["📩 <b>Новая заявка</b>", "", `👤 ${escapeHtml(lead.name)}`, `📞 ${escapeHtml(lead.phone)}`];
  if (lead.birthDate) lines.push(`🎂 ${escapeHtml(formatBirthDate(lead.birthDate))}`);
  lines.push(`🕒 ${formatSubmittedAt(lead.submittedAt)}`);
  return lines.join("\n");
}

function formatBirthDate(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : value;
}

function formatSubmittedAt(iso: string): string {
  const formatted = new Intl.DateTimeFormat("ru-RU", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
  return `${formatted} (МСК)`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
