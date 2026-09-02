import { Check } from 'lucide-react';

const VALUE_ITEMS = [
  'Разбор натальной карты по дате рождения',
  'Ответы на 3 ключевых вопроса: любовь, деньги, карьера, будущее',
  'Рекомендации на ближайший период',
  'Аудиозапись разговора по желанию',
];

export function ValueProposition() {
  const scrollToForm = () => document.querySelector('#form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-12 sm:py-24 bg-ivory-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: text */}
          <div>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 leading-tight mb-5 sm:mb-6">
              Мой разбор — это не абстрактные предсказания
            </h2>
            <p className="text-base sm:text-lg text-charcoal-800/80 leading-relaxed mb-6 sm:mb-8">
              Это конкретная карта происходящего в вашей жизни: почему буксуют отношения и как это изменить, откуда взялся застой в деньгах и куда двигаться в карьере.
            </p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {VALUE_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Check size={20} strokeWidth={2} className="text-gold-500" />
                  </div>
                  <span className="text-charcoal-800 text-base sm:text-lg">{item}</span>
                </div>
              ))}
            </div>

            {/* Outline button */}
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 border-2 border-bordeaux-600 text-bordeaux-600 rounded-full text-base sm:text-lg font-medium hover:bg-bordeaux-600 hover:text-ivory-100 transition-all duration-300"
            >
              Записаться за 99 ₽
            </button>
          </div>

          {/* Right: decorative card */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-gold-500/10 to-bordeaux-600/10 rounded-[2.5rem] blur-2xl" />
              <div className="relative bg-ivory-100 rounded-[2rem] p-10 border border-gold-500/20 shadow-xl">
                <div className="text-center">
                  <div className="font-heading text-6xl font-bold text-bordeaux-600 mb-2">99 ₽</div>
                  <div className="text-xl text-charcoal-800/50 line-through mb-4">1000 ₽</div>
                  <div className="inline-block px-4 py-2 bg-gold-500/15 text-gold-600 rounded-full text-sm font-medium">
                    Только сегодня
                  </div>
                  <div className="mt-8 pt-8 border-t border-bordeaux-600/10 space-y-3">
                    <div className="flex justify-between text-charcoal-800/80">
                      <span>Длительность</span>
                      <span className="font-medium">до 45 минут</span>
                    </div>
                    <div className="flex justify-between text-charcoal-800/80">
                      <span>Формат</span>
                      <span className="font-medium">телефонный звонок</span>
                    </div>
                    <div className="flex justify-between text-charcoal-800/80">
                      <span>Перезвон</span>
                      <span className="font-medium">в течение 15 минут</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
