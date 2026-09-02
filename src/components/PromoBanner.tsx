import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export function PromoBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || dismissed) return;
    const onScroll = () => {
      if (window.scrollY > 100) setVisible(false);
      else setVisible(true);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [visible, dismissed]);

  const scrollToForm = () => document.querySelector('#form')?.scrollIntoView({ behavior: 'smooth' });

  if (!visible || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-bordeaux-600 text-ivory-100 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3">
        <button
          onClick={scrollToForm}
          className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-gold-400 transition-colors text-left"
        >
          <Sparkles size={16} className="text-gold-400 flex-shrink-0" />
          <span>Только сегодня — консультация за 99 ₽ вместо 1000 ₽</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-ivory-100/70 hover:text-ivory-100 transition-colors p-1"
          aria-label="Закрыть"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
