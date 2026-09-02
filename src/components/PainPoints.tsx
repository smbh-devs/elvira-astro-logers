import { Heart, Briefcase, CloudRain, Compass, ArrowRight } from 'lucide-react';

const PAINS = [
  {
    icon: Heart,
    title: 'Сомнения в отношениях',
    desc: 'Не понимаете, куда движетесь вместе, стоит ли продолжать',
  },
  {
    icon: Briefcase,
    title: 'Застой в карьере',
    desc: 'Чувствуете, что упёрлись в потолок и не знаете, куда расти',
  },
  {
    icon: CloudRain,
    title: 'Тревога о будущем',
    desc: 'Беспокойство о том, что принесёт завтрашний день',
  },
  {
    icon: Compass,
    title: 'Поиск своего пути',
    desc: 'Не понимаете своего предназначения и истинных желаний',
  },
];

export function PainPoints() {
  const scrollToForm = () => document.querySelector('#form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-12 sm:py-24 bg-ivory-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 text-center mb-8 sm:mb-12">
          Узнаёте себя?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {PAINS.map((pain, i) => {
            const Icon = pain.icon;
            return (
              <div
                key={i}
                className="bg-ivory-50 rounded-2xl p-5 sm:p-8 border border-bordeaux-600/5 hover:border-gold-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-bordeaux-600/8 mb-4 sm:mb-5 group-hover:bg-bordeaux-600/12 transition-colors">
                  <Icon size={20} strokeWidth={1.5} className="text-bordeaux-600" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-charcoal-900 mb-2">
                  {pain.title}
                </h3>
                <p className="text-charcoal-800/70 text-sm sm:text-base leading-relaxed">
                  {pain.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Text link with arrow — most subtle CTA on page */}
        <div className="text-center">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 text-bordeaux-600 hover:text-bordeaux-700 text-base sm:text-lg font-medium group transition-colors"
          >
            Оставить заявку
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
