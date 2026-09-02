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

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lead-to-sheets`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        birth_date: data.birth_date || '',
      }),
    }).catch(() => {});

    return { success: true };
  } catch {
    return { success: false, error: 'Произошла ошибка. Проверьте подключение к интернету.' };
  }
}
