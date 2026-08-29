import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 px-4 sm:px-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#121212]/80 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/50 to-[#121212] z-10" />
        <img
          src="/jpg.jpg"
          alt="Historical context"
          className="w-full h-full object-cover object-center filter grayscale contrast-125"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-auto py-8">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#FFFFFF] font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4"
        >
          <span className="w-6 sm:w-8 h-[1px] bg-[#FFFFFF]" />
          Module 10 • GEE001B
          <span className="w-6 sm:w-8 h-[1px] bg-[#FFFFFF]" />
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.15] max-w-3xl"
        >
          Understanding the Roots of Gender Oppression & Feminist Advocacy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-base md:text-lg text-gray-300 font-light max-w-2xl leading-relaxed mb-8 sm:mb-12"
        >
          Exploring the historical, ideological, and economic forces that shape gender inequality.
          Understanding these foundational theories is essential to critically examining gender relations and engaging in informed advocacy for gender justice.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 sm:bottom-10 z-20 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={scrollToContent}
      >
        <span className="text-white/60 text-[11px] tracking-widest uppercase group-hover:text-white transition-colors duration-300">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-colors duration-300"
        >
          <ArrowDown size={14} className="text-white" />
        </motion.div>
      </motion.div>
    </section>
  );
}
