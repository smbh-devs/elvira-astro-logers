import { reachGoal } from './metrika';

/** Scrolls to the lead form and records which block's CTA was used. */
export function scrollToForm(source: string): void {
  reachGoal('cta_click', { source });
  document.querySelector('#form')?.scrollIntoView({ behavior: 'smooth' });
}
