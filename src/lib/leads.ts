import { reachGoal } from './metrika';
import { callSheetsApi } from './sheetsApi';

export interface LeadData {
  name: string;
  phone: string;
  /** Тема разговора; обязательна в форме на странице, пустая в коротких формах. */
  topic?: string;
  /** Когда звонить: «Готова поговорить сейчас» либо выбранный интервал. */
  call_time?: string;
  birth_date?: string;
  source?: string;
}

export interface SubmitLeadResult {
  success: boolean;
  error?: string;
  /** Kvaligate payment page; undefined when the lead was saved but payment is unavailable. */
  redirectUrl?: string;
}

interface LeadResponse {
  ok: boolean;
  order_id: string | null;
  redirect_url: string | null;
}

/** Stores the lead in the Google Sheet and gets the Kvaligate payment page for it. */
export async function submitLead(data: LeadData): Promise<SubmitLeadResult> {
  let response: LeadResponse;
  try {
    response = await callSheetsApi<LeadResponse>({
      action: 'lead',
      name: data.name,
      phone: data.phone,
      topic: data.topic || '',
      call_time: data.call_time || '',
      birth_date: data.birth_date || '',
      source: data.source || '',
      submitted_at: new Date().toISOString(),
    });
  } catch {
    return { success: false, error: 'Не удалось отправить заявку. Попробуйте ещё раз.' };
  }

  // Conversion goal: fired once the lead is actually stored, for every form.
  reachGoal('lead_submit', { source: data.source ?? 'unknown' });

  return { success: true, redirectUrl: response.redirect_url ?? undefined };
}
