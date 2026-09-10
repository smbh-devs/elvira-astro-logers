import { useState, useEffect, useRef } from 'react';
import { X, Clock, Loader2, CheckCircle } from 'lucide-react';
import { submitLead } from '@/lib/leads';
import { reachGoal } from '@/lib/metrika';
import { formatPhone, isValidPhone, normalizePhone, PHONE_MAX_LENGTH, PHONE_PLACEHOLDER } from '@/lib/phone';
import { useCountdown } from '@/hooks/useCountdown';

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const shownRef = useRef(false);
  const { formatted } = useCountdown(10 * 60);

  useEffect(() => {
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shownRef.current) {
        shownRef.current = true;
        setVisible(true);
      }
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 600 && currentY < lastScrollY - 50 && !shownRef.current) {
        shownRef.current = true;
        setVisible(true);
      }
      lastScrollY = currentY;
    };

    document.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dismissed]);

  // Same rule as LeadForm: no clickable button until the data would pass
  // validation, so Metrika's form auto-goal only sees real submissions.
  const canSubmit = !loading && name.trim() !== '' && isValidPhone(phone);

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
    setLoading(true);
    setError('');
    const result = await submitLead({ name, phone: normalizePhone(phone), source: 'exit_intent_popup' });
    if (result.success && result.redirectUrl) {
      reachGoal('payment_redirect', { source: 'exit_intent_popup' });
      window.location.assign(result.redirectUrl);
      return; // keep the spinner until the browser navigates away
    }
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setVisible(false), 2500);
    } else {
      setError(result.error || 'Произошла ошибка');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm"
        onClick={() => { setVisible(false); setDismissed(true); }}
      />
      <div className="relative bg-ivory-100 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 max-w-md w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => { setVisible(false); setDismissed(true); }}
          className="absolute top-4 right-4 text-charcoal-800/40 hover:text-charcoal-800 transition-colors z-10"
          aria-label="Закрыть"
        >
          <X size={22} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="text-gold-500 mx-auto mb-4" />
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-charcoal-900 mb-2">
              Заявка отправлена!
            </h3>
            <p className="text-charcoal-800/70 text-base sm:text-lg">
              Я перезвоню вам в течение 15 минут
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-bordeaux-600 mb-4">
              <Clock size={20} />
              <span className="text-sm font-medium">Ваша скидка сгорит через: {formatted}</span>
            </div>
            <h3 className="font-heading text-xl sm:text-3xl font-semibold text-charcoal-900 mb-3">
              Стоп! Ваша скидка 99 ₽ действует ещё немного
            </h3>
            <p className="text-charcoal-800/70 text-sm sm:text-base mb-6">
              Оставьте имя и телефон — я перезвоню в течение 15 минут
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 bg-ivory-50 text-charcoal-900 rounded-xl text-base placeholder:text-charcoal-800/40 focus:outline-none focus:ring-2 focus:ring-bordeaux-600/30 transition-all border border-bordeaux-600/10"
                required
              />
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={PHONE_PLACEHOLDER}
                maxLength={PHONE_MAX_LENGTH}
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="w-full px-4 py-3.5 bg-ivory-50 text-charcoal-900 rounded-xl text-base placeholder:text-charcoal-800/40 focus:outline-none focus:ring-2 focus:ring-bordeaux-600/30 transition-all border border-bordeaux-600/10"
                required
              />
              {error && <p className="text-bordeaux-600 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={!canSubmit}
                title={canSubmit ? undefined : 'Заполните имя и телефон'}
                className="w-full px-6 py-4 bg-bordeaux-600 text-ivory-100 rounded-full text-base sm:text-lg font-semibold hover:bg-bordeaux-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-bordeaux-600 disabled:hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  'Записаться за 99 ₽'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
