import { useState } from 'react';
import { Phone, CheckCircle, Loader2 } from 'lucide-react';
import { submitLead } from '@/lib/leads';
import { formatPhone, isValidPhone, normalizePhone, PHONE_MAX_LENGTH, PHONE_PLACEHOLDER } from '@/lib/phone';

/** Keeps only digits and lays them out as ДД.ММ.ГГГГ while typing. */
function formatBirthDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('.');
}

/** ДД.ММ.ГГГГ → YYYY-MM-DD for the `date` column; '' when empty; null when not a real date. */
function toIsoDate(value: string): string | null {
  if (!value) return '';
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Date.UTC(+year, +month - 1, +day));
  const valid =
    date.getUTCFullYear() === +year && date.getUTCMonth() === +month - 1 && date.getUTCDate() === +day;
  return valid ? `${year}-${month}-${day}` : null;
}

export function LeadForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // The button stays disabled until the form would pass validation, so a
  // click can only ever be a real submission (Metrika's form auto-goal counts
  // every click on a submit button, including ones that fail validation).
  const canSubmit = !loading && name.trim() !== '' && isValidPhone(phone) && toIsoDate(birthDate) !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Заполните имя и телефон');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Введите телефон в формате +7 (999) 123-45-67');
      return;
    }
    const isoBirthDate = toIsoDate(birthDate);
    if (isoBirthDate === null) {
      setError('Дата рождения в формате 31.12.1999');
      return;
    }
    setLoading(true);
    setError('');
    const result = await submitLead({
      name,
      phone: normalizePhone(phone),
      birth_date: isoBirthDate,
      source: 'lead_form',
    });
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setName('');
      setPhone('');
      setBirthDate('');
    } else {
      setError(result.error || 'Произошла ошибка');
    }
  };

  return (
    <section id="form" className="py-12 sm:py-24 bg-ivory-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        {/* Contrasting plate */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-bordeaux-600/10 to-gold-500/10 rounded-[2rem] blur-xl" />
          <div className="relative bg-bordeaux-600 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-12 shadow-2xl">
            <h2 className="font-heading text-2xl sm:text-4xl font-semibold text-ivory-100 text-center mb-2">
              Запишитесь на консультацию
            </h2>
            <p className="text-ivory-100/70 text-center mb-6 sm:mb-8 text-sm sm:text-lg">
              Я перезвоню вам лично в течение 15 минут
            </p>

            {success ? (
              <div className="text-center py-8 animate-scale-in">
                <CheckCircle size={48} className="text-gold-400 mx-auto mb-4" />
                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-ivory-100 mb-2">
                  Заявка отправлена!
                </h3>
                <p className="text-ivory-100/70 text-base sm:text-lg">
                  Я перезвоню вам в течение 15 минут
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-ivory-100 text-charcoal-900 rounded-xl text-base sm:text-lg placeholder:text-charcoal-800/40 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={PHONE_PLACEHOLDER}
                    maxLength={PHONE_MAX_LENGTH}
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-ivory-100 text-charcoal-900 rounded-xl text-base sm:text-lg placeholder:text-charcoal-800/40 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                    required
                  />
                </div>
                <div>
                  {/* Plain text instead of type="date": iOS Safari ignores the container width for
                      native date inputs and never shows a placeholder. */}
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="bday"
                    placeholder="31.12.1999"
                    maxLength={10}
                    value={birthDate}
                    onChange={(e) => setBirthDate(formatBirthDate(e.target.value))}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-ivory-100 text-charcoal-900 rounded-xl text-base sm:text-lg placeholder:text-charcoal-800/40 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                  />
                  <p className="text-ivory-100/50 text-xs sm:text-sm mt-1.5 px-2">Дата рождения (по желанию)</p>
                </div>

                {error && (
                  <p className="text-gold-400 text-sm text-center">{error}</p>
                )}

                {/* Largest, most saturated button on the site */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  title={canSubmit ? undefined : 'Заполните имя и телефон'}
                  className="w-full px-6 sm:px-8 py-3.5 sm:py-4 bg-gold-500 text-charcoal-900 rounded-full text-base sm:text-lg font-bold hover:bg-gold-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-gold-500 disabled:hover:shadow-lg disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <Phone size={20} />
                      Записаться за 99 ₽
                    </>
                  )}
                </button>

                <p className="text-ivory-100/50 text-xs sm:text-sm text-center pt-2">
                  Нажимая «Записаться», вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
