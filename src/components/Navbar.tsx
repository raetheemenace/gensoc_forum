import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, BookOpen, Layers, MessageSquare, Award, ArrowUp, Compass } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: typeof BookOpen;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Overview', icon: Compass },
  { id: 'origins', label: 'Historical Origins', icon: BookOpen },
  { id: 'feminist-theories', label: 'Feminist Theories', icon: Layers },
  { id: 'modern-critiques', label: 'Modern Critiques', icon: Layers },
  { id: 'anti-oppressive', label: 'Anti-Oppressive Praxis', icon: Layers },
  { id: 'forum', label: 'Discussion Board', icon: MessageSquare },
  { id: 'outcomes', label: 'Learning Outcomes', icon: Award },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine active section
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        id="main-navigation-bar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs py-3 text-black' 
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo / Course Brand */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex flex-col text-left group cursor-pointer"
            aria-label="Scroll to top"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest block opacity-75 leading-none mb-1">
              GEE001B • Section IT31S3
            </span>
            <span className="text-sm sm:text-base font-bold tracking-tight block leading-snug">
              Gender &amp; Society Forum
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? isScrolled
                        ? 'bg-black text-white font-semibold'
                        : 'bg-white text-black font-semibold'
                      : isScrolled
                        ? 'text-gray-600 hover:text-black hover:bg-gray-100'
                        : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Discussion Link + Hamburger Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToSection('forum')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                isScrolled
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Join Discussion</span>
            </button>

            {/* Hamburger Button */}
            <button
              id="mobile-menu-burger-btn"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-sm transition-colors cursor-pointer lg:hidden ${
                isScrolled 
                  ? 'text-black hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            />

            {/* Slide-out Menu */}
            <motion.aside
              id="mobile-drawer-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 sm:w-80 bg-white text-gray-900 shadow-2xl flex flex-col justify-between border-l border-gray-200 lg:hidden"
            >
              <div className="p-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block tracking-wider">
                      Course Navigation
                    </span>
                    <h3 className="text-base font-bold text-black">
                      Gender and Society
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-sm cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Nav Links */}
                <div className="flex flex-col gap-1.5">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={`drawer-${item.id}`}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-sm text-sm font-medium text-left transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-black text-white font-semibold shadow-xs' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer Info */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                    Class Module Info
                  </span>
                  <p className="text-xs text-gray-600 font-light">
                    GEE001B • Section IT31S3 • Group 1
                  </p>
                </div>
                <button
                  onClick={() => scrollToSection('forum')}
                  className="w-full py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open Student Board</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Floating Scroll-to-Top Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-30 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-105"
          aria-label="Scroll to top of page"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </>
  );
}
