import { useCountdown } from '@/hooks/useCountdown';

export function PriceComparison() {
  const { formatted } = useCountdown(5 * 3600 + 59 * 60 + 12);
  const scrollToForm = () => document.querySelector('#form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-12 sm:py-24 bg-ivory-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 mb-3 sm:mb-4">
            Специальная цена для новых клиентов
          </h2>
          <p className="text-base sm:text-lg text-charcoal-800/70 px-2">
            Обычная стоимость консультации — 1000 ₽. Сегодня — 99 ₽
          </p>
        </div>

        {/* Price card */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute -inset-3 bg-gradient-to-br from-gold-500/15 to-bordeaux-600/15 rounded-[2rem] blur-xl" />
          <div className="relative bg-ivory-100 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 border-2 border-gold-500/30 shadow-2xl text-center">
            {/* Timer */}
            <div className="mb-5 sm:mb-6">
              <div className="text-xs sm:text-sm text-charcoal-800/60 mb-2">Акция действует ещё:</div>
              <div className="font-heading text-2xl sm:text-4xl font-bold text-bordeaux-600 tabular-nums tracking-wider">
                {formatted}
              </div>
            </div>

            <div className="border-t border-bordeaux-600/10 pt-5 sm:pt-6 mb-5 sm:mb-6">
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="font-heading text-4xl sm:text-6xl font-bold text-bordeaux-600">99 ₽</span>
                <span className="text-xl sm:text-2xl text-charcoal-800/40 line-through">1000 ₽</span>
              </div>
              <div className="inline-block px-4 py-1.5 bg-gold-500/15 text-gold-600 rounded-full text-sm font-medium mb-4">
                Скидка 90%
              </div>
            </div>

            {/* Slots counter */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 text-charcoal-800/70 text-sm sm:text-base">
                <span className="w-2 h-2 rounded-full bg-bordeaux-600 animate-pulse" />
                Осталось мест сегодня: <span className="font-bold text-bordeaux-600">3</span>
              </div>
            </div>

            {/* Second most prominent button */}
            <button
              onClick={scrollToForm}
              className="w-full px-6 sm:px-8 py-3.5 sm:py-4 bg-bordeaux-600 text-ivory-100 rounded-full text-base sm:text-lg font-semibold hover:bg-bordeaux-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Записаться со скидкой
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
