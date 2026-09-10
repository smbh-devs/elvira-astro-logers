import { callSheetsApi } from './sheetsApi';

export type PaymentState = 'new' | 'process' | 'paid' | 'failed' | 'expired';

/** Asks the Apps Script for the real order state (it re-polls Kvaligate when not final). */
export async function checkPayment(orderId: string): Promise<PaymentState> {
  const data = await callSheetsApi<{ state: PaymentState }>({ action: 'check', order_id: orderId });
  return data.state;
}

/** Client-side id shape check so a garbage query string never hits the script. */
export function isOrderId(value: string | null): value is string {
  return value !== null && /^elv_[0-9a-f]{20}$/.test(value);
}
