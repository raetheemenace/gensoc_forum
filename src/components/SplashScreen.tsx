import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  key?: string;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // No global fallback timer; rely on video onEnded or onError events
    // to ensure the full video plays without interruption.
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center overflow-hidden"
    >
      {!videoError && (
        <video
          autoPlay
          muted
          playsInline
          onEnded={onComplete}
          onError={() => {
            console.warn('Video failed to load or play.');
            setVideoError(true);
            // Don't call onComplete immediately so the title screen is still visible for a few seconds
            setTimeout(onComplete, 5000);
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="/Remember_the_Week_Gender_Mo.mp4" type="video/mp4" />
        </video>
      )}
      
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-1 bg-white rounded-full mb-4"></div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-4xl leading-tight">
            Gender and Society
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light mt-4 tracking-wide">
            Week 10 Educational Forum
          </p>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        onClick={onComplete}
        className="absolute bottom-8 right-8 z-20 text-white/50 hover:text-white text-sm uppercase tracking-widest transition-colors"
      >
        Skip
      </motion.button>
    </motion.div>
  );
}
