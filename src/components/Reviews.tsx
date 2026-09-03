import { Star, Quote, Image as ImageIcon } from 'lucide-react';
import { scrollToForm } from '@/lib/scrollToForm';

const REVIEW_IMAGES = [
  { src: '/images/reviews/photo_2026-09-01_18.00.21.jpeg', alt: 'Скриншот отзыва клиента' },
  { src: '/images/reviews/photo_2026-09-01_18.00.23.jpeg', alt: 'Скриншот отзыва клиента' },
  { src: '/images/reviews/photo_2026-09-01_18.00.25.jpeg', alt: 'Скриншот отзыва клиента' },
  { src: '/images/reviews/photo_2026-09-01_18.00.27.jpeg', alt: 'Скриншот отзыва клиента' },
  { src: '/images/reviews/photo_2026-09-01_18.00.29.jpeg', alt: 'Скриншот отзыва клиента' },
  { src: '/images/reviews/IMG_7009.JPG', alt: 'Скриншот отзыва клиента' },
];

const REVIEWS = [
  {
    name: 'Ольга, 42 года',
    text: 'Эльвира назвала вещи, которые я сама чувствовала, но не могла сформулировать. После консультации поняла, в каком направлении двигаться в карьере. Через 2 месяца получила повышение.',
    rating: 5,
  },
  {
    name: 'Марина, 35 лет',
    text: 'Пришла с сомнениями в отношениях. Эльвира помогла увидеть, что проблема не в партнёре, а в моих ожиданиях. Разговор был очень тёплым и честным, без эзотерической воды.',
    rating: 5,
  },
  {
    name: 'Екатерина, 28 лет',
    text: 'Долго не могла понять своё предназначение. Разбор натальной карты дал мне такую ясность, которой не дали 5 лет самостоятельных поисков. Очень благодарна!',
    rating: 5,
  },
  {
    name: 'Анна, 51 год',
    text: 'Была настроена скептически, но решила попробовать за 99 ₽. Не жалею ни секунды. Эльвира — профессионал, который говорит по делу, без пустых обещаний.',
    rating: 5,
  },
  {
    name: 'Светлана, 38 лет',
    text: 'Прогноз на год оказался удивительно точным. Эльвира предупредила о сложном периоде в сентябре — я была готова и прошла его спокойно. Рекомендую всем своим подругам.',
    rating: 5,
  },
  {
    name: 'Наталья, 45 лет',
    text: 'Третья консультация за год. Каждый раз получаю именно то, что нужно услышать. Эльвира умеет найти корень проблемы и дать понятные рекомендации.',
    rating: 5,
  },
];

function ReviewCard({ review }: { review: typeof REVIEWS[number] }) {
  return (
    <div className="bg-ivory-50 rounded-2xl p-5 sm:p-6 border border-bordeaux-600/5 hover:shadow-lg transition-all duration-300 h-full">
      <Quote size={28} className="text-gold-500/40 mb-3" />
      <p className="text-charcoal-800/80 leading-relaxed mb-5 text-sm sm:text-base">
        {review.text}
      </p>
      <div className="flex items-center justify-between">
        <div className="font-medium text-charcoal-900 text-sm sm:text-base">{review.name}</div>
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, j) => (
            <Star key={j} size={14} className="text-gold-500 fill-gold-500" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="py-12 sm:py-24 bg-ivory-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 text-center mb-3 sm:mb-4">
          Отзывы
        </h2>
        <p className="text-base sm:text-lg text-charcoal-800/70 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          Более 10 000 клиентов уже получили ясность и направление
        </p>

        {/* Text reviews — desktop grid */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {REVIEWS.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>

        {/* Text reviews — mobile carousel */}
        <div className="sm:hidden overflow-x-auto pb-6 mb-8 -mx-4 px-4 snap-x snap-mandatory flex gap-4">
          {REVIEWS.map((review, i) => (
            <div key={i} className="flex-shrink-0 w-[85vw] snap-center">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        {/* Screenshot reviews — full image, no cropping */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-5 sm:mb-6">
            <ImageIcon size={18} className="text-gold-500" />
            <h3 className="font-heading text-xl sm:text-3xl font-semibold text-charcoal-900">
              Отзывы клиентов
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {REVIEW_IMAGES.map((reviewImage) => (
              <figure
                key={reviewImage.src}
                className="bg-ivory-50 rounded-2xl p-1.5 sm:p-2.5 border border-bordeaux-600/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={reviewImage.src}
                  alt={reviewImage.alt}
                  loading="lazy"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </figure>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => scrollToForm('reviews')}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-bordeaux-600/10 text-bordeaux-600 rounded-full text-sm sm:text-base font-medium hover:bg-bordeaux-600/20 transition-all duration-300"
          >
            Хочу такой же результат — записаться
          </button>
        </div>
      </div>
    </section>
  );
}
