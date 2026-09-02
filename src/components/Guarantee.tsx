import { Shield } from 'lucide-react';

export function Guarantee() {
  const scrollToForm = () => document.querySelector('#form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-12 sm:py-20 bg-ivory-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <div className="bg-ivory-50 rounded-2xl p-6 sm:p-10 border border-gold-500/20 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-bordeaux-600/8 mx-auto mb-5 sm:mb-6">
            <Shield size={28} strokeWidth={1.5} className="text-bordeaux-600" />
          </div>
          <h2 className="font-heading text-xl sm:text-3xl font-semibold text-charcoal-900 mb-3 sm:mb-4">
            Моя гарантия
          </h2>
          <p className="text-base sm:text-lg text-charcoal-800/70 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto px-2">
            Если консультация не принесёт вам пользы — обсудим и найдём решение. Вы ничем не рискуете.
          </p>
          {/* Compact button with shield icon */}
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-bordeaux-600 text-bordeaux-600 rounded-full text-sm sm:text-base font-medium hover:bg-bordeaux-600 hover:text-ivory-100 transition-all duration-300"
          >
            <Shield size={18} />
            Записаться без риска
          </button>
        </div>
      </div>
    </section>
  );
}
