import { Phone, Clock, CheckCircle } from 'lucide-react';
import { scrollToForm } from '@/lib/scrollToForm';

const HERO_IMAGE = '/images/express/188ae980-8d53-4c3d-a2f2-ff2ff84578bc.png';
const HERO_BG_IMAGE = '/images/express/f661eae8-f96e-46ce-b139-4c8d573d3def_(1).png';

export function Hero() {
  return (
    <section className="relative pt-14 sm:pt-20 min-h-screen flex items-center overflow-hidden">
      {/* Background image full-width, focal point shifted left */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG_IMAGE}
          alt=""
          className="w-full h-full object-cover object-[35%_center] md:object-[38%_center] lg:object-[40%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory-100/90 via-ivory-100/50 to-ivory-100/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full grid md:grid-cols-2 gap-6 sm:gap-8 items-center py-10 sm:py-16">
        {/* Left: text content */}
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-bordeaux-600/10 text-bordeaux-600 rounded-full text-xs sm:text-sm font-medium mb-5 sm:mb-6">
            <Clock size={14} />
            <span>Принимаю сегодня</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 leading-[1.2] sm:leading-[1.15] mb-4 sm:mb-5">
            Финансы, отношения, карьера — мой разбор покажет, что происходит на самом деле, и что делать дальше
          </h1>

          <p className="text-base sm:text-xl text-charcoal-800/80 leading-relaxed mb-5 sm:mb-6">
            Персональная консультация по телефону. 12 лет практики, более 10 000 клиентов.
          </p>

          {/* Price block */}
          <div className="flex items-baseline gap-2 sm:gap-3 mb-4 flex-wrap">
            <span className="font-heading text-3xl sm:text-5xl font-bold text-bordeaux-600">99 ₽</span>
            <span className="text-xl sm:text-2xl text-charcoal-800/50 line-through font-body">1000 ₽</span>
            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gold-500 text-white text-xs sm:text-sm font-medium rounded-full">Только сегодня</span>
          </div>

          {/* Main CTA — largest on page */}
          <button
            onClick={() => scrollToForm('hero')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-bordeaux-600 text-ivory-100 rounded-full text-base sm:text-lg font-semibold hover:bg-bordeaux-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Записаться на консультацию за 99 ₽
          </button>

          <p className="flex items-center gap-2 text-charcoal-800/70 mt-3 sm:mt-4 text-sm sm:text-base">
            <Phone size={16} className="text-bordeaux-600" />
            Я перезвоню вам лично в течение 15 минут
          </p>
        </div>

        {/* Right on md+: portrait. Below md it goes first, above the badge and headline. */}
        <div className="order-first md:order-none flex justify-center items-center animate-fade-in mb-2 md:mb-0">
          <div className="relative w-full md:w-auto">
            <div className="absolute -inset-4 bg-bordeaux-600/5 rounded-[2rem] blur-2xl" />
            <img
              src={HERO_IMAGE}
              alt="Эльвира — астролог"
              className="relative rounded-[1.5rem] md:rounded-[2rem] shadow-2xl w-full md:w-auto max-h-[340px] md:max-h-[600px] object-cover object-top"
            />
            <div className="absolute bottom-3 left-3 md:-bottom-4 md:-left-4 bg-ivory-100 rounded-2xl shadow-lg px-4 py-2.5 md:px-5 md:py-3 flex items-center gap-3">
              <CheckCircle className="text-gold-500" size={24} />
              <div>
                <div className="font-heading text-xl font-semibold text-bordeaux-600">10 000+</div>
                <div className="text-sm text-charcoal-800/70">клиентов</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
