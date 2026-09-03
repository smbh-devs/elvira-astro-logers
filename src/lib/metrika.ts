/**
 * Yandex.Metrika goals. The counter itself is installed in index.html; this is
 * the only place that talks to `window.ym`, so the rest of the code never has
 * to care whether the tag loaded (blocked by an ad blocker, offline, etc.).
 *
 * Goals to create in Metrika as "JavaScript-событие":
 *   lead_submit  — a lead was saved (params.source = which form)
 *   cta_click    — a "Записаться" button was pressed (params.source = which block)
 */

export const METRIKA_ID = 112270673;

type Ym = (id: number, method: 'reachGoal', goal: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    ym?: Ym;
  }
}

export function reachGoal(goal: string, params?: Record<string, unknown>): void {
  try {
    window.ym?.(METRIKA_ID, 'reachGoal', goal, params);
  } catch {
    // Analytics must never break the page.
  }
}
