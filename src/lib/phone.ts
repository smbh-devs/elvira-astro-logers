/**
 * Phone input mask. Russian numbers are the main case and are laid out as
 * `+7 (999) 123-45-67`; any other country code typed with a leading `+` is kept
 * as `+` and digits only (E.164, max 15 digits).
 *
 * Formatting is always rebuilt from the digits, and trailing separators are
 * never added until the next digit exists, so Backspace keeps removing digits
 * instead of fighting a separator that gets re-inserted.
 */

const RU_MAX_DIGITS = 10; // after the country code
const E164_MAX_DIGITS = 15;

/** Longest formatted value: `+7 (999) 123-45-67`. Use for the input's maxLength. */
export const PHONE_MAX_LENGTH = 18;
export const PHONE_PLACEHOLDER = '+7 (999) 123-45-67';

function formatRussian(rest: string): string {
  const d = rest.slice(0, RU_MAX_DIGITS);
  let out = '+7';
  if (d.length > 0) out += ` (${d.slice(0, 3)}`;
  if (d.length > 3) out += `) ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

export function formatPhone(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  const hasPlus = trimmed.startsWith('+');

  if (hasPlus) {
    if (digits.length === 0) return '+';
    if (digits.startsWith('7')) return formatRussian(digits.slice(1));
    return `+${digits.slice(0, E164_MAX_DIGITS)}`;
  }

  if (digits.length === 0) return '';
  // Leading 8 or 7 is the Russian trunk/country prefix; anything else is a
  // local number typed without it.
  const rest = digits[0] === '8' || digits[0] === '7' ? digits.slice(1) : digits;
  return formatRussian(rest);
}

/** `+7 (999) 123-45-67` → `+79991234567`. Empty stays empty. */
export function normalizePhone(formatted: string): string {
  const canonical = formatPhone(formatted);
  const digits = canonical.replace(/\D/g, '');
  return digits ? `+${digits}` : '';
}

export function isValidPhone(formatted: string): boolean {
  const normalized = normalizePhone(formatted);
  if (!normalized) return false;
  const digits = normalized.slice(1);
  if (digits.startsWith('7')) return digits.length === 1 + RU_MAX_DIGITS;
  return digits.length >= 8 && digits.length <= E164_MAX_DIGITS;
}
