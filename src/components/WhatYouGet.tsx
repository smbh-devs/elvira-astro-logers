import { Check, Heart, Coins, Compass, TrendingUp, Quote } from 'lucide-react';

const TOPICS = [
  { icon: Heart, title: 'Отношения' },
  { icon: Coins, title: 'Деньги и работа' },
  { icon: Compass, title: 'Личный путь' },
  { icon: TrendingUp, title: 'Прогноз на год' },
];

const VALUE_ITEMS = [
  'Разбор натальной карты по дате рождения',
  'Ответы на ваши вопросы — до 3 ключевых',
  'Понятные рекомендации: что делать в ближайший период',
  'Аудиозапись разговора по желанию',
];

// A real client case from Elvira's materials (public/images/reviews/IMG_7009.JPG).
const CASE = {
  name: 'Наталья, 32 года',
  request: 'Тревога, неуверенность в себе, сложно принимать решения. Хотела понять, как двигаться дальше.',
  result: [
    'Разобрали ситуацию и нашли основные причины тревоги',
    'Ответили на все её вопросы',
    'Подобрали практики для укрепления уверенности',
    'Наметили первые шаги для изменений',
  ],
  quote: 'После звонка стало легче. Вы всё понятно объяснили, ответили на мои вопросы и поддержали.',
};

export function WhatYouGet() {
  return (
    <section className="py-12 sm:py-24 bg-ivory-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 text-center mb-3 sm:mb-4">
          Что вы получите
        </h2>
        <p className="text-base sm:text-lg text-charcoal-800/70 text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
          Не абстрактные предсказания, а конкретный разговор о вашей ситуации
        </p>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {TOPICS.map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="flex items-center gap-2 sm:gap-3 bg-ivory-50 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 border border-bordeaux-600/5"
                >
                  <Icon size={18} strokeWidth={1.5} className="text-bordeaux-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-charcoal-900 font-medium">{title}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 sm:space-y-4">
              {VALUE_ITEMS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check size={20} strokeWidth={2} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-800 text-base sm:text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Example outcome: what a client came with and what they left with */}
          <div className="bg-ivory-50 rounded-2xl p-5 sm:p-8 border border-gold-500/20 shadow-sm">
            <div className="text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-gold-600 mb-2">
              Пример консультации
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-charcoal-900 mb-4">
              {CASE.name}
            </h3>

            <div className="text-sm font-semibold text-charcoal-900 mb-1">С чем пришла</div>
            <p className="text-charcoal-800/80 text-sm sm:text-base leading-relaxed mb-4">{CASE.request}</p>

            <div className="text-sm font-semibold text-charcoal-900 mb-2">Что получила</div>
            <ul className="space-y-2 mb-5">
              {CASE.result.map((item) => (
                <li key={item} className="flex items-start gap-2 text-charcoal-800/80 text-sm sm:text-base">
                  <Check size={16} strokeWidth={2} className="text-gold-500 flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <blockquote className="border-t border-bordeaux-600/10 pt-4 flex gap-3">
              <Quote size={20} className="text-gold-500/60 flex-shrink-0" />
              <p className="text-charcoal-800 text-sm sm:text-base italic leading-relaxed">{CASE.quote}</p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
