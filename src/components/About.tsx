import { Check } from 'lucide-react';
import { scrollToForm } from '@/lib/scrollToForm';

const ABOUT_IMAGE = '/images/express/438da235-4155-43a2-8969-9a132ad51a53_(2).png';

const EXPERT_GALLERY = [
  '/images/express/IMG_7651_(1).JPG',
  '/images/express/3822c999-f35c-4324-9185-3d0af878aea5.png',
  '/images/express/a72eabb2-e82b-4c23-b87c-952300128414_(2).png',
];

// 19 s intro with burned-in subtitles, re-encoded to 720p (~1.3 MB) from the 1080p original.
const ABOUT_VIDEO = { src: '/videos/elvira-intro.mp4', poster: '/videos/elvira-intro-poster.jpg' };

const REQUESTS = [
  'Отношения: остаться или уйти, почему повторяются одни и те же сценарии',
  'Работа и деньги: сменить ли работу, откуда застой в доходе',
  'Тревога и сложные решения: как понять, куда двигаться дальше',
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
            <video
              src={ABOUT_VIDEO.src}
              poster={ABOUT_VIDEO.poster}
              controls
              playsInline
              preload="metadata"
              className="relative mt-3 sm:mt-4 w-full aspect-video rounded-[1.5rem] shadow-xl bg-charcoal-900 object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 mb-5 sm:mb-6">
              Обо мне
            </h2>

            <p className="text-base sm:text-lg text-charcoal-800/80 leading-relaxed mb-4 sm:mb-5">
              Меня зовут Эльвира. Я астролог с 12-летним опытом и более чем 10 000 проведённых консультаций. Мой метод — это соединение классической астрологии с внимательным, человечным подходом.
            </p>
            <p className="text-base sm:text-lg text-charcoal-800/80 leading-relaxed mb-5 sm:mb-6">
              Я не делаю туманных предсказаний. Я помогаю увидеть конкретную картину вашей жизни — и найти ответы, которые уже есть внутри вас. Ко мне приходят, когда нужна ясность, а не развлечение.
            </p>

            <div className="text-sm sm:text-base font-semibold text-charcoal-900 mb-3">Чаще всего ко мне приходят с вопросами</div>
            <ul className="space-y-2.5 mb-6 sm:mb-8">
              {REQUESTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-charcoal-800 text-sm sm:text-base">
                  <Check size={18} strokeWidth={2} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

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

            <button
              onClick={() => scrollToForm('about')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-bordeaux-600 text-ivory-100 rounded-full text-base font-semibold hover:bg-bordeaux-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Записаться за 99 ₽
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
