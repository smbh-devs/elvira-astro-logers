/**
 * Варианты ответа на вопрос «когда позвонить». Первый — звонок сразу,
 * остальные — интервалы рабочего дня, из которых показываем только ещё не прошедшие.
 */

/** Значение, которое уходит в заявку, когда клиент готов говорить прямо сейчас. */
export const CALL_NOW = 'Готова поговорить сейчас';

/** Рабочий день: границы трёхчасовых интервалов, 10:00–21:00. */
const HOURS = [10, 13, 16, 19, 21];

/** Сколько интервалов показываем помимо «сейчас». */
const SLOT_COUNT = 4;

/** Интервал берём, только если до его конца осталось хотя бы столько минут. */
const MIN_MINUTES_LEFT = 30;

function label(day: 'Сегодня' | 'Завтра', from: number, to: number): string {
  return `${day}, ${from}:00–${to}:00`;
}

/**
 * Доступные интервалы: остаток сегодняшнего дня, дальше завтрашний,
 * пока не наберётся SLOT_COUNT штук.
 */
export function getCallSlots(now: Date = new Date()): string[] {
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const slots: string[] = [];
  for (let i = 0; i + 1 < HOURS.length && slots.length < SLOT_COUNT; i++) {
    if (HOURS[i + 1] * 60 - minutesNow >= MIN_MINUTES_LEFT) {
      slots.push(label('Сегодня', HOURS[i], HOURS[i + 1]));
    }
  }
  for (let i = 0; i + 1 < HOURS.length && slots.length < SLOT_COUNT; i++) {
    slots.push(label('Завтра', HOURS[i], HOURS[i + 1]));
  }
  return slots;
}
