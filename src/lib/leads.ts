import { supabase } from './supabase';

export interface LeadData {
  name: string;
  phone: string;
  birth_date?: string;
  source?: string;
}

export async function submitLead(data: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('leads').insert({
      name: data.name,
      phone: data.phone,
      birth_date: data.birth_date || null,
      source: data.source || null,
    });

    if (error) {
      return { success: false, error: 'Не удалось отправить заявку. Попробуйте ещё раз.' };
    }

    // Fire-and-forget copy to the Google Sheet via an Apps Script web app.
    // text/plain avoids a CORS preflight (Apps Script does not answer OPTIONS);
    // no-cors makes the response opaque, which is fine: the row is already in Supabase.
    const sheetsUrl = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
    if (sheetsUrl) {
      fetch(sheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          birth_date: data.birth_date || '',
          submitted_at: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Произошла ошибка. Проверьте подключение к интернету.' };
  }
}
