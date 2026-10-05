import { Clock, CheckCircle } from 'lucide-react';
import { scrollToForm } from '@/lib/scrollToForm';

// 20 s intro with burned-in subtitles, re-encoded to 720p H.264 CRF 26 (~2.1 MB) from the 26 MB iPhone original.
const HERO_VIDEO = { src: '/videos/elvira-intro-2.mp4', poster: '/videos/elvira-intro-2-poster.jpg' };
const HERO_BG_IMAGE = '/images/express/f661eae8-f96e-46ce-b139-4c8d573d3def_(1).png';

export function Hero() {
  return (
    <section className="relative pt-14 sm:pt-20 md:min-h-screen flex items-center overflow-hidden">
      {/* Background image full-width, focal point shifted left */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG_IMAGE}
          alt=""
          className="w-full h-full object-cover object-[35%_center] md:object-[38%_center] lg:object-[40%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory-100/90 via-ivory-100/50 to-ivory-100/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full grid md:grid-cols-2 gap-6 sm:gap-8 items-center py-8 sm:py-16">
        {/* Left: offer. On mobile it goes under the video. */}
        <div className="animate-slide-up">
          <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-bordeaux-600/10 text-bordeaux-600 rounded-full text-sm font-medium mb-6">
            <Clock size={14} />
            <span>Принимаю сегодня</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 leading-[1.15] mb-3 sm:mb-5">
            Личная консультация астролога по вашему вопросу
          </h1>

          <p className="text-base sm:text-xl text-charcoal-800/80 leading-relaxed mb-4 sm:mb-6">
            Разберём вашу ситуацию в отношениях или работе. До 45 минут по телефону — 99 ₽
          </p>

          <div className="flex items-baseline gap-2 sm:gap-3 mb-4">
            <span className="font-heading text-3xl sm:text-5xl font-bold text-bordeaux-600">99 ₽</span>
            <span className="text-base sm:text-xl text-charcoal-800/50 line-through font-body">1000 ₽</span>
          </div>

          {/* Main CTA — largest on page. The mobile sticky button appears once this scrolls away. */}
          <button
            id="hero-cta"
            onClick={() => scrollToForm('hero')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-bordeaux-600 text-ivory-100 rounded-full text-base sm:text-lg font-semibold hover:bg-bordeaux-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Записаться на консультацию за 99 ₽
          </button>

          <p className="mt-3 text-sm text-charcoal-800/60 text-center sm:text-left">
            12 лет практики · более 10 000 клиентов
          </p>
        </div>

        {/* Intro video: right column on md+, above the heading on mobile. */}
        <div className="order-first md:order-none flex justify-center items-center animate-fade-in">
          <div className="relative w-full">
            <div className="absolute -inset-4 bg-bordeaux-600/5 rounded-[2rem] blur-2xl" />
            <video
              src={HERO_VIDEO.src}
              poster={HERO_VIDEO.poster}
              controls
              playsInline
              preload="metadata"
              aria-label="Видео: Эльвира рассказывает о себе"
              className="relative w-full aspect-video rounded-[1.5rem] md:rounded-[2rem] shadow-2xl bg-charcoal-900 object-cover"
            />
            <div className="absolute -top-3 left-3 md:-top-4 md:-left-4 bg-ivory-100 rounded-2xl shadow-lg px-3 py-2 md:px-5 md:py-3 flex items-center gap-2 md:gap-3">
              <CheckCircle className="text-gold-500" size={20} />
              <div>
                <div className="font-heading text-base md:text-xl font-semibold text-bordeaux-600">10 000+</div>
                <div className="text-xs md:text-sm text-charcoal-800/70">клиентов</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
