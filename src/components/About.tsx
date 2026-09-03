import { Phone } from 'lucide-react';
import { scrollToForm } from '@/lib/scrollToForm';

const ABOUT_IMAGE = '/images/express/438da235-4155-43a2-8969-9a132ad51a53_(2).png';

const EXPERT_GALLERY = [
  '/images/express/IMG_7651_(1).JPG',
  '/images/express/3822c999-f35c-4324-9185-3d0af878aea5.png',
  '/images/express/a72eabb2-e82b-4c23-b87c-952300128414_(2).png',
];

const STATS = [
  { value: '12', label: 'лет практики' },
  { value: '10 000+', label: 'консультаций' },
  { value: '2013', label: 'год начала' },
];

export function About() {
  return (
    <section id="about" className="py-12 sm:py-24 bg-ivory-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Photo column: above the text on small screens, left column on lg+ */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-gold-500/10 to-bordeaux-600/10 rounded-[2rem] blur-2xl" />
            <img
              src={ABOUT_IMAGE}
              alt="Эльвира — астролог"
              className="relative rounded-[1.5rem] sm:rounded-[2rem] shadow-xl w-full object-cover max-h-[400px] sm:max-h-[560px]"
            />
            <div className="relative grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
              {EXPERT_GALLERY.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Эльвира — фото ${index + 1}`}
                  loading="lazy"
                  className="w-full aspect-square object-cover rounded-xl shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 mb-5 sm:mb-6">
              Обо мне
            </h2>

            <p className="text-base sm:text-lg text-charcoal-800/80 leading-relaxed mb-4 sm:mb-5">
              Меня зовут Эльвира. Я астролог с 12-летним опытом и более чем 10 000 проведённых консультаций. Мой метод — это соединение классической астрологии с внимательным, человечным подходом.
            </p>
            <p className="text-base sm:text-lg text-charcoal-800/80 leading-relaxed mb-6 sm:mb-8">
              Я не делаю туманных предсказаний. Я помогаю увидеть конкретную картину вашей жизни — и найти ответы, которые уже есть внутри вас. Ко мне приходят, когда нужна ясность, а не развлечение.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="font-heading text-2xl sm:text-4xl font-bold text-bordeaux-600">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-charcoal-800/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Compact button with phone icon */}
            <button
              onClick={() => scrollToForm('about')}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-bordeaux-600 text-ivory-100 rounded-full text-sm sm:text-base font-medium hover:bg-bordeaux-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Phone size={18} />
              Связаться со мной
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
