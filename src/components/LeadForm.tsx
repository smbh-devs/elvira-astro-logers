import { useMemo, useState } from 'react';
import { CheckCircle, ChevronDown, Clock, CreditCard, Loader2, Phone, ShieldCheck, User } from 'lucide-react';
import { submitLead } from '@/lib/leads';
import { reachGoal } from '@/lib/metrika';
import { formatPhone, isValidPhone, normalizePhone, PHONE_MAX_LENGTH } from '@/lib/phone';
import { CALL_NOW, getCallSlots } from '@/lib/callSlots';

const TOPICS = ['Отношения', 'Работа и самореализация', 'Другое'] as const;
type Topic = (typeof TOPICS)[number];

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
  const [topic, setTopic] = useState<Topic | ''>('');
  const [callNow, setCallNow] = useState(true);
  const [slot, setSlot] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // The button stays disabled until the form would pass validation, so a
  // click can only ever be a real submission (Metrika's form auto-goal counts
  // every click on a submit button, including ones that fail validation).
  const canSubmit =
    !loading && name.trim() !== '' && isValidPhone(phone) && topic !== '' && toIsoDate(birthDate) !== null;

  // Интервалы считаем один раз за монтирование: список зависит от текущего времени.
  const callSlots = useMemo(() => getCallSlots(), []);
  const callTime = callNow ? CALL_NOW : slot || callSlots[0];

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
    if (!topic) {
      setError('Выберите тему разговора');
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
      topic,
      call_time: callTime,
      birth_date: isoBirthDate,
      source: 'lead_form',
    });
    if (result.success && result.redirectUrl) {
      // Off to the Kvaligate SBP page; the client comes back to /?payment=…&order=… (see PaymentResult).
      reachGoal('payment_redirect', { source: 'lead_form' });
      window.location.assign(result.redirectUrl);
      return; // keep the spinner until the browser navigates away
    }
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setName('');
      setPhone('');
      setTopic('');
      setCallNow(true);
      setSlot('');
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
              Заполните анкету — оплатите 99 ₽ — получите звонок эксперта
            </p>

            {success ? (
              <div className="text-center py-8 animate-scale-in">
                <CheckCircle size={48} className="text-gold-400 mx-auto mb-4" />
                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-ivory-100 mb-2">
                  Заявка отправлена!
                </h3>
                <p className="text-ivory-100/70 text-base sm:text-lg">
                  После оплаты я перезвоню вам в течение 15 минут
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
                    placeholder="Телефон"
                    maxLength={PHONE_MAX_LENGTH}
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-ivory-100 text-charcoal-900 rounded-xl text-base sm:text-lg placeholder:text-charcoal-800/40 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                    required
                  />
                </div>
                <div>
                  <p className="text-ivory-100/70 text-sm sm:text-base mb-2 px-1">Тема разговора</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {TOPICS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={topic === item}
                        onClick={() => setTopic(item)}
                        className={`px-3 py-3 rounded-xl text-sm sm:text-base font-medium transition-all ${
                          topic === item
                            ? 'bg-gold-500 text-charcoal-900'
                            : 'bg-ivory-100/10 text-ivory-100 hover:bg-ivory-100/20'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-ivory-100/70 text-sm sm:text-base mb-2 px-1">Время звонка</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      aria-pressed={callNow}
                      onClick={() => setCallNow(true)}
                      className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm sm:text-base font-medium transition-all ${
                        callNow ? 'bg-gold-500 text-charcoal-900' : 'bg-ivory-100/10 text-ivory-100 hover:bg-ivory-100/20'
                      }`}
                    >
                      <Phone size={16} />
                      {CALL_NOW}
                    </button>
                    <button
                      type="button"
                      aria-pressed={!callNow}
                      onClick={() => setCallNow(false)}
                      className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm sm:text-base font-medium transition-all ${
                        !callNow ? 'bg-gold-500 text-charcoal-900' : 'bg-ivory-100/10 text-ivory-100 hover:bg-ivory-100/20'
                      }`}
                    >
                      <Clock size={16} />
                      Выбрать интервал
                    </button>
                  </div>
                  {!callNow && (
                    <div className="relative mt-2">
                      <select
                        value={callTime}
                        onChange={(e) => setSlot(e.target.value)}
                        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 pr-11 bg-ivory-100 text-charcoal-900 rounded-xl text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all appearance-none"
                      >
                        {callSlots.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={20}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-bordeaux-600"
                      />
                    </div>
                  )}
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

                {/* Карточка-памятка: что именно покупают, кто звонит и когда платить */}
                <div className="bg-ivory-100/10 rounded-xl p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                  <p className="flex items-start gap-2.5 text-ivory-100/90 text-xs sm:text-sm leading-relaxed">
                    <Phone size={16} className="flex-shrink-0 mt-0.5 text-gold-400" />
                    <span>
                      Это <strong className="font-semibold text-ivory-100">телефонная консультация</strong> — разговор
                      голосом, не переписка.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5 text-ivory-100/90 text-xs sm:text-sm leading-relaxed">
                    <User size={16} className="flex-shrink-0 mt-0.5 text-gold-400" />
                    <span>
                      Позвонит лично <strong className="font-semibold text-ivory-100">Эльвира</strong>, астролог с
                      12-летним опытом.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5 text-ivory-100/90 text-xs sm:text-sm leading-relaxed">
                    <CreditCard size={16} className="flex-shrink-0 mt-0.5 text-gold-400" />
                    <span>
                      Стоимость — <strong className="font-semibold text-ivory-100">99 ₽</strong>. Оплата онлайн на сайте{' '}
                      <strong className="font-semibold text-ivory-100">сразу после отправки заявки</strong>, до звонка.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5 text-ivory-100/90 text-xs sm:text-sm leading-relaxed">
                    <ShieldCheck size={16} className="flex-shrink-0 mt-0.5 text-gold-400" />
                    <span>После оплаты я перезвоню в течение 15 минут в выбранное время.</span>
                  </p>
                </div>

                {/* Largest, most saturated button on the site */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  title={canSubmit ? undefined : 'Заполните имя, телефон и тему разговора'}
                  className="w-full px-6 sm:px-8 py-3.5 sm:py-4 bg-gold-500 text-charcoal-900 rounded-full text-base sm:text-lg font-bold hover:bg-gold-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-gold-500 disabled:hover:shadow-lg disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Переходим к оплате...
                    </>
                  ) : (
                    <>
                      <Phone size={20} />
                      Оставить заявку на звонок эксперта за 99 руб
                    </>
                  )}
                </button>

                <p className="text-ivory-100/50 text-xs sm:text-sm text-center">
                  Нажимая «Оставить заявку», вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
