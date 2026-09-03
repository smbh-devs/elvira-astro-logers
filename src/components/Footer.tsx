import { scrollToForm } from '@/lib/scrollToForm';

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-ivory-100/70 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="mb-8 sm:mb-10">
          {/* Brand */}
          <div>
            <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-bordeaux-600/20 px-3 py-1.5 sm:px-4 sm:py-2 mb-3">
              <span className="font-heading text-xl sm:text-2xl font-semibold text-ivory-100 tracking-wide">
                Эльвира
              </span>
              <span className="h-5 sm:h-6 w-px bg-ivory-100/30" aria-hidden="true" />
              <span className="font-heading text-base sm:text-xl font-medium text-gold-400 tracking-wide">
                Астролог
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              Персональные астрологические консультации. 12 лет практики, более 10 000 клиентов.
            </p>
          </div>
        </div>

        {/* Minimal text link */}
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => scrollToForm('footer')}
            className="text-ivory-100/50 hover:text-ivory-100 text-sm transition-colors"
          >
            Записаться на консультацию
          </button>
        </div>
      </div>
    </footer>
  );
}
