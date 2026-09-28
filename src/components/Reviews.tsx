import { useCallback, useEffect, useState } from 'react';
import { Star, Quote, Image as ImageIcon, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

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

function Lightbox({ index, onClose, onMove }: { index: number; onClose: () => void; onMove: (step: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onMove(-1);
      if (e.key === 'ArrowRight') onMove(1);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onMove]);

  const image = REVIEW_IMAGES[index];
  const navButton = 'absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-ivory-100/15 text-ivory-100 hover:bg-ivory-100/30 transition-colors';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Отзыв клиента"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal-900/90 p-3 sm:p-8 animate-fade-in"
      onClick={onClose}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="max-w-full max-h-full object-contain rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button type="button" onClick={onClose} aria-label="Закрыть" className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center justify-center w-11 h-11 rounded-full bg-ivory-100/15 text-ivory-100 hover:bg-ivory-100/30 transition-colors">
        <X size={24} />
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onMove(-1); }} aria-label="Предыдущий отзыв" className={`${navButton} left-2 sm:left-5`}>
        <ChevronLeft size={26} />
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onMove(1); }} aria-label="Следующий отзыв" className={`${navButton} right-2 sm:right-5`}>
        <ChevronRight size={26} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-ivory-100/70 text-sm">
        {index + 1} / {REVIEW_IMAGES.length}
      </div>
    </div>
  );
}

export function Reviews() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback(
    (step: number) => setOpenIndex((i) => (i === null ? i : (i + step + REVIEW_IMAGES.length) % REVIEW_IMAGES.length)),
    [],
  );

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

        {/* Screenshot reviews: large enough to read, tap opens full screen */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ImageIcon size={18} className="text-gold-500" />
            <h3 className="font-heading text-xl sm:text-3xl font-semibold text-charcoal-900">
              Отзывы клиентов
            </h3>
          </div>
          <p className="text-sm sm:text-base text-charcoal-800/60 text-center mb-5 sm:mb-6">
            Нажмите на скриншот, чтобы увеличить
          </p>
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0 snap-x snap-mandatory">
            {REVIEW_IMAGES.map((reviewImage, i) => (
              <button
                key={reviewImage.src}
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label="Открыть отзыв на весь экран"
                className="group relative flex-shrink-0 w-[85vw] sm:w-auto snap-center bg-ivory-50 rounded-2xl p-2 sm:p-3 border border-bordeaux-600/5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-zoom-in"
              >
                <img
                  src={reviewImage.src}
                  alt={reviewImage.alt}
                  loading="lazy"
                  className="w-full h-auto object-contain rounded-xl"
                />
                <span className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex items-center justify-center w-9 h-9 rounded-full bg-charcoal-900/60 text-ivory-100 group-hover:bg-bordeaux-600 transition-colors">
                  <ZoomIn size={18} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {openIndex !== null && <Lightbox index={openIndex} onClose={close} onMove={move} />}
    </section>
  );
}
