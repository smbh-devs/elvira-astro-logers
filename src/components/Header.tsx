import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Обо мне', href: '#about' },
    { label: 'Отзывы', href: '#reviews' },
    { label: 'Записаться', href: '#form' },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ivory-100/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(107,39,55,0.1)]'
          : 'bg-ivory-100/70 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-20 flex items-center justify-between">
        <a href="#" className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-bordeaux-600/10 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm">
          <span className="font-heading text-xl sm:text-2xl font-semibold text-charcoal-900 tracking-wide">
            Эльвира
          </span>
          <span className="h-5 sm:h-6 w-px bg-charcoal-900/35" aria-hidden="true" />
          <span className="font-heading text-base sm:text-xl font-medium text-charcoal-900 tracking-wide">
            Астролог
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-charcoal-800 hover:text-bordeaux-600 transition-colors text-base font-medium"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('#form')}
            className="px-5 py-2.5 border border-bordeaux-600 text-bordeaux-600 rounded-full hover:bg-bordeaux-600 hover:text-ivory-100 transition-all duration-300 text-base font-medium"
          >
            Записаться
          </button>
        </nav>

        <button
          className="md:hidden p-2 text-bordeaux-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-ivory-100/98 backdrop-blur-md border-t border-bordeaux-600/10 animate-slide-down">
          <nav className="flex flex-col px-5 py-4 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left text-charcoal-800 hover:text-bordeaux-600 transition-colors text-lg font-medium py-3 px-2"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#form')}
              className="mt-2 px-5 py-3 border border-bordeaux-600 text-bordeaux-600 rounded-full hover:bg-bordeaux-600 hover:text-ivory-100 transition-all duration-300 text-base font-medium text-center"
            >
              Записаться
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
