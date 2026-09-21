import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { scrollToForm } from '@/lib/scrollToForm';

const FAQ_ITEMS = [
  {
    q: 'Как проходит консультация?',
    a: 'Порядок такой: вы заполняете анкету, оплачиваете 99 ₽ и я перезваниваю вам по телефону в течение 15 минут — сразу или в выбранный вами интервал. Разговор длится до 45 минут. Вы можете задать до 3 ключевых вопросов по темам: отношения, деньги, карьера, будущее.',
  },
  {
    q: 'Нужно ли точное время рождения?',
    a: 'Нет, точное время рождения не обязательно. Для разбора натальной карты достаточно даты рождения. Если время известно — это дополнительная информация, но не обязательная.',
  },
  {
    q: 'Как проходит оплата?',
    a: 'Оплата 99 ₽ происходит онлайн на сайте сразу после того, как вы оставили заявку — до звонка. После оплаты я перезвоню вам в течение 15 минут в удобное время, указанное в заявке.',
  },
  {
    q: 'Сколько длится звонок?',
    a: 'Консультация длится до 45 минут. Этого времени достаточно для подробного разбора и ответов на ваши вопросы.',
  },
  {
    q: 'Можно ли получить запись разговора?',
    a: 'Да, по желанию я могу предоставить аудиозапись разговора. Просто сообщите мне об этом во время консультации.',
  },
  {
    q: 'Что если консультация не поможет?',
    a: 'Если консультация не принесёт вам пользы — мы обсудим это и найдём решение. Вы ничем не рискуете.',
  },
  {
    q: 'Можно ли задать вопросы заранее?',
    a: 'Да, вы можете подготовить вопросы заранее. Это поможет мне максимально точно настроить разбор под вашу ситуацию.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-12 sm:py-24 bg-ivory-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 text-center mb-8 sm:mb-12">
          Частые вопросы
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="bg-ivory-100 rounded-xl border border-bordeaux-600/8 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left gap-3"
              >
                <span className="font-heading text-base sm:text-xl font-medium text-charcoal-900">
                  {item.q}
                </span>
                <ChevronDown
                  size={22}
                  className={`flex-shrink-0 text-bordeaux-600 transition-transform duration-300 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-charcoal-800/70 text-sm sm:text-lg leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Text link with arrow */}
        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={() => scrollToForm('faq')}
            className="inline-flex items-center gap-2 text-bordeaux-600 hover:text-bordeaux-700 text-base sm:text-lg font-medium group transition-colors"
          >
            Не нашли ответ — задайте вопрос
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
