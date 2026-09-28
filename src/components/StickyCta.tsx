import { useEffect, useState } from 'react';
import { scrollToForm } from '@/lib/scrollToForm';

/**
 * Mobile-only button pinned to the bottom of the screen. Shows once the hero button
 * has scrolled out of view and hides while the lead form is on screen, so it never covers it.
 */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById('hero-cta');
    const form = document.getElementById('form');
    if (!heroCta || !form) return;

    const heroObserver = new IntersectionObserver(([entry]) => {
      // Past the hero only when the button left through the top edge, not before it appeared.
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const formObserver = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting));

    heroObserver.observe(heroCta);
    formObserver.observe(form);
    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !formVisible;

  return (
    <div
      className={`sm:hidden fixed inset-x-0 bottom-0 z-40 px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <button
        type="button"
        tabIndex={visible ? 0 : -1}
        onClick={() => scrollToForm('sticky_mobile')}
        className="w-full px-6 py-3 bg-bordeaux-600 text-ivory-100 rounded-full text-base font-semibold shadow-xl active:scale-[0.98] transition-transform"
      >
        Записаться за 99 ₽
      </button>
    </div>
  );
}
