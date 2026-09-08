import { supabase } from './supabase';
import { reachGoal } from './metrika';

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

    // Conversion goal: fired once the lead is actually stored, for every form.
    reachGoal('lead_submit', { source: data.source ?? 'unknown' });

    // Fire-and-forget notifications (Google Sheet row + Telegram) via the
    // `notify-lead` edge function. The lead is already in Supabase, so a failure
    // here must not affect the visitor: errors are logged by the function itself.
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      fetch(`${supabaseUrl}/functions/v1/notify-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          birth_date: data.birth_date || '',
        }),
      }).catch(() => {});
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Произошла ошибка. Проверьте подключение к интернету.' };
  }
}
