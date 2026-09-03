import { Heart, Coins, Compass, TrendingUp } from 'lucide-react';
import { scrollToForm } from '@/lib/scrollToForm';

const TOPICS = [
  {
    icon: Heart,
    title: 'Любовь и отношения',
    desc: 'Поймите, почему в отношениях возникают трудности и как их преодолеть. Разбор совместимости и перспектив.',
  },
  {
    icon: Coins,
    title: 'Деньги и карьера',
    desc: 'Узнайте, откуда взялся финансовый застой и в каком направлении двигаться для роста дохода.',
  },
  {
    icon: Compass,
    title: 'Личный путь и предназначение',
    desc: 'Откройте своё истинное предназначение и поймите, в чём ваша уникальная сила.',
  },
  {
    icon: TrendingUp,
    title: 'Прогноз на ближайший год',
    desc: 'Получите рекомендации на предстоящий период: благоприятные моменты и зоны внимания.',
  },
];

export function Topics() {
  return (
    <section className="py-12 sm:py-24 bg-ivory-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 text-center mb-3 sm:mb-4">
          Темы консультации
        </h2>
        <p className="text-base sm:text-lg text-charcoal-800/70 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          Выберите тему, которая волнует вас больше всего — или обсудите несколько за один звонок
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {TOPICS.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div
                key={i}
                className="bg-ivory-50 rounded-2xl p-5 sm:p-8 border border-bordeaux-600/5 hover:shadow-xl hover:border-gold-500/30 transition-all duration-300 group flex flex-col"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-bordeaux-600/8 mb-4 sm:mb-5 group-hover:bg-bordeaux-600/12 transition-colors">
                  <Icon size={24} strokeWidth={1.5} className="text-bordeaux-600" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-charcoal-900 mb-2 sm:mb-3">
                  {topic.title}
                </h3>
                <p className="text-charcoal-800/70 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-grow">
                  {topic.desc}
                </p>
                {/* Pill button */}
                <button
                  onClick={() => scrollToForm('topics')}
                  className="self-start px-4 sm:px-5 py-2 bg-bordeaux-600/10 text-bordeaux-600 rounded-full text-sm font-medium hover:bg-bordeaux-600 hover:text-ivory-100 transition-all duration-300"
                >
                  Выбрать тему
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
