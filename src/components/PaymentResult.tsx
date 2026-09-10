import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, X, XCircle } from 'lucide-react';
import { checkPayment, isOrderId, type PaymentState } from '@/lib/payments';
import { reachGoal } from '@/lib/metrika';
import { scrollToForm } from '@/lib/scrollToForm';

/**
 * Kvaligate sends the client back to /?payment=success|error&order=elv_…; this modal asks
 * check-payment for the real state (the query string is only a hint) and tells the client
 * what happens next. Pending states are re-polled a few times: SBP confirmation can lag
 * the redirect by a couple of seconds.
 */

const POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2500;

type View = 'checking' | 'paid' | 'failed' | 'pending';

function readQuery(): { hint: string; orderId: string } | null {
  const params = new URLSearchParams(window.location.search);
  const hint = params.get('payment');
  const orderId = params.get('order');
  if (!hint || !isOrderId(orderId)) return null;
  return { hint, orderId };
}

function toView(state: PaymentState): View {
  if (state === 'paid') return 'paid';
  if (state === 'failed' || state === 'expired') return 'failed';
  return 'checking';
}

export function PaymentResult() {
  const [query] = useState(readQuery);
  const [view, setView] = useState<View>('checking');
  const [open, setOpen] = useState(query !== null);

  useEffect(() => {
    if (!query) return;
    // Drop the query string so a reload or a shared link does not re-open the modal.
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);

    let cancelled = false;
    (async () => {
      for (let attempt = 1; attempt <= POLL_ATTEMPTS && !cancelled; attempt++) {
        try {
          const next = toView(await checkPayment(query.orderId));
          if (next !== 'checking') {
            if (!cancelled) setView(next);
            if (next === 'paid') reachGoal('payment_success', { order: query.orderId });
            return;
          }
        } catch {
          // Network hiccup: fall through to the next attempt.
        }
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
      if (!cancelled) setView('pending');
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!open || !query) return null;

  const close = () => setOpen(false);
  const retry = () => {
    close();
    scrollToForm('payment_retry');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={close} />
      <div className="relative bg-ivory-100 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 max-w-md w-full shadow-2xl animate-scale-in text-center">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-charcoal-800/40 hover:text-charcoal-800 transition-colors z-10"
          aria-label="Закрыть"
        >
          <X size={22} />
        </button>

        {view === 'checking' && (
          <>
            <Loader2 size={48} className="text-bordeaux-600 mx-auto mb-4 animate-spin" />
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-charcoal-900 mb-2">
              Проверяем оплату…
            </h3>
            <p className="text-charcoal-800/70">Это займёт несколько секунд</p>
          </>
        )}

        {view === 'paid' && (
          <>
            <CheckCircle size={48} className="text-gold-500 mx-auto mb-4" />
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-charcoal-900 mb-2">
              Оплата прошла!
            </h3>
            <p className="text-charcoal-800/70 mb-6">Я перезвоню вам в течение 15 минут</p>
            <button
              onClick={close}
              className="w-full px-6 py-3.5 bg-bordeaux-600 text-ivory-100 rounded-full font-semibold hover:bg-bordeaux-700 transition-all"
            >
              Хорошо
            </button>
          </>
        )}

        {view === 'failed' && (
          <>
            <XCircle size={48} className="text-bordeaux-600 mx-auto mb-4" />
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-charcoal-900 mb-2">
              Оплата не прошла
            </h3>
            <p className="text-charcoal-800/70 mb-6">
              Деньги не списаны. Заявка сохранена, можно попробовать оплатить ещё раз
            </p>
            <button
              onClick={retry}
              className="w-full px-6 py-3.5 bg-gold-500 text-charcoal-900 rounded-full font-bold hover:bg-gold-400 transition-all"
            >
              Попробовать снова
            </button>
          </>
        )}

        {view === 'pending' && (
          <>
            <Loader2 size={48} className="text-charcoal-800/40 mx-auto mb-4" />
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-charcoal-900 mb-2">
              Платёж ещё обрабатывается
            </h3>
            <p className="text-charcoal-800/70 mb-6">
              Если вы оплатили, банк подтвердит перевод в течение нескольких минут, и я вам перезвоню
            </p>
            <button
              onClick={close}
              className="w-full px-6 py-3.5 bg-bordeaux-600 text-ivory-100 rounded-full font-semibold hover:bg-bordeaux-700 transition-all"
            >
              Понятно
            </button>
          </>
        )}
      </div>
    </div>
  );
}
