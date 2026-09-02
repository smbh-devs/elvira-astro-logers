import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export function ChatWidget() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToForm = () => {
    setOpen(false);
    document.querySelector('#form')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50">
      {open && (
        <div className="absolute bottom-16 right-0 w-64 sm:w-72 bg-ivory-100 rounded-2xl shadow-2xl border border-bordeaux-600/10 animate-scale-in overflow-hidden">
          <div className="bg-bordeaux-600 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-ivory-100">
              <MessageCircle size={20} />
              <span className="font-medium text-sm sm:text-base">Поддержка</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-ivory-100/70 hover:text-ivory-100">
              <X size={18} />
            </button>
          </div>
          <div className="p-5">
            <p className="text-charcoal-800/80 text-sm leading-relaxed mb-4">
              Остались вопросы? Оставьте заявку — я перезвоню и помогу.
            </p>
            <button
              onClick={scrollToForm}
              className="w-full px-4 py-3 bg-bordeaux-600 text-ivory-100 rounded-xl text-sm font-medium hover:bg-bordeaux-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Оставить заявку
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-bordeaux-600 text-ivory-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Чат"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
