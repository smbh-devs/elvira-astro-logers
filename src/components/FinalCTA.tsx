import { useCountdown } from '@/hooks/useCountdown';
import { scrollToForm } from '@/lib/scrollToForm';

export function FinalCTA() {
  const { formatted } = useCountdown(5 * 3600 + 59 * 60 + 12);
  return (
    <section className="py-12 sm:py-24 bg-ivory-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 mb-4 sm:mb-5">
          Успейте до конца дня
        </h2>
        <p className="text-base sm:text-lg text-charcoal-800/70 mb-3 sm:mb-4">
          Акция действует ещё:
        </p>
        <div className="font-heading text-2xl sm:text-4xl font-bold text-bordeaux-600 tabular-nums tracking-wider mb-8 sm:mb-10">
          {formatted}
        </div>

        {/* Full-width button */}
        <button
          onClick={() => scrollToForm('final_cta')}
          className="w-full sm:w-auto sm:min-w-[400px] px-6 sm:px-8 py-3.5 sm:py-4 bg-bordeaux-600 text-ivory-100 rounded-full text-base sm:text-lg font-semibold hover:bg-bordeaux-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          Записаться сейчас
        </button>
      </div>
    </section>
  );
}
