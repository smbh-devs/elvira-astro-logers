import { ArrowRight, ClipboardList, CreditCard, PhoneCall } from 'lucide-react';

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Заполнение анкеты',
    text: 'Оставьте имя, телефон, тему разговора и удобное время звонка.',
  },
  {
    icon: CreditCard,
    title: 'Оплата 99 ₽',
    text: 'Сразу после заявки — быстрая онлайн-оплата прямо на сайте.',
  },
  {
    icon: PhoneCall,
    title: 'Звонок эксперта',
    text: 'Эльвира лично перезвонит вам в течение 15 минут и проведёт консультацию.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-24 bg-ivory-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 text-center mb-3 sm:mb-4">
          Как это работает — 3 простых шага
        </h2>
        <p className="text-base sm:text-lg text-charcoal-800/70 text-center max-w-2xl mx-auto mb-10 sm:mb-14 px-2">
          Понятный порядок действий: анкета, оплата и звонок эксперта. Ничего лишнего.
        </p>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="relative">
              {/* Бейдж сидит на верхней кромке карточки, как ярлык */}
              <div className="absolute -top-4 left-5 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bordeaux-600 shadow-md">
                <span className="text-ivory-100 text-[0.65rem] sm:text-xs font-medium tracking-[0.15em] uppercase">
                  Шаг
                </span>
                <span className="font-heading text-gold-400 text-base sm:text-lg font-bold leading-none">
                  {i + 1}
                </span>
              </div>

              <div className="h-full bg-ivory-100 rounded-2xl p-5 pt-8 sm:p-7 sm:pt-9 border border-bordeaux-600/8 shadow-sm">
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-bordeaux-600/10 mb-4 sm:mb-5">
                  <step.icon size={24} strokeWidth={1.5} className="text-bordeaux-600" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-charcoal-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-charcoal-800/70 text-sm sm:text-base leading-relaxed">{step.text}</p>
              </div>

              {/* Стрелка в промежутке между карточками — только там, где они стоят в ряд */}
              {i < STEPS.length - 1 && (
                <div className="hidden sm:flex absolute top-1/2 -right-5 -translate-y-1/2 w-7 h-7 items-center justify-center rounded-full bg-gold-500 text-charcoal-900 shadow-sm">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
