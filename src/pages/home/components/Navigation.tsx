import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { label: 'PORTFOLIO', id: 'hero' },
  { label: 'ABOUT', id: 'about' },
  { label: 'WORKS', id: 'works' },
  { label: 'CONTACT', id: 'contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled || isOpen ? 'bg-[#121212] border-b border-[#1E1E1E]' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 lg:px-20 h-16 md:h-20">
          <span
            className="hs text-[#F5F5F5] text-xs font-medium tracking-[0.12em] uppercase cursor-pointer whitespace-nowrap z-[101]"
            onClick={() => scrollTo('hero')}
          >
            NIKITA MOKROV
          </span>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.id)}
                className="hs text-[#AAAAAA] md:hover:text-[#F5F5F5] text-[10px] lg:text-xs tracking-[0.12em] uppercase transition-colors duration-300 cursor-pointer whitespace-nowrap bg-transparent border-none outline-none"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Burger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-[101] bg-transparent border-none outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <div 
              className={`w-6 h-px bg-[#F5F5F5] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} 
            />
            <div 
              className={`w-6 h-px bg-[#F5F5F5] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} 
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[99] bg-[#0E0E0E] transition-all duration-500 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.id)}
              className="text-[#F5F5F5] text-2xl font-bold tracking-[0.1em] uppercase bg-transparent border-none outline-none transition-all duration-500"
              style={{ 
                fontFamily: "'Space Grotesk', sans-serif",
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isOpen ? 1 : 0,
                transitionDelay: `${i * 100}ms`
              }}
            >
              {item.label}
            </button>
          ))}
          
          <div 
            className="mt-8 flex flex-col items-center gap-4 transition-all duration-700"
            style={{ 
              opacity: isOpen ? 1 : 0, 
              transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '400ms'
            }}
          >
            <div className="w-12 h-px bg-[#3A3A3A]" />
            <span className="text-[#5A5A5A] text-[10px] tracking-[0.2em] font-mono">
              AVAILABLE WORLDWIDE
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
