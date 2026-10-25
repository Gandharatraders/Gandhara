'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface LogoIntroProps {
  shouldPlay?: boolean;
}

export default function LogoIntro({ shouldPlay = true }: LogoIntroProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [skipped, setSkipped] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'zoomed' | 'unzoom' | 'exit'>('zoomed');
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    // Skip intro if on admin routes
    if (pathname.startsWith('/admin')) {
      setShowIntro(false);
      return;
    }

    const shouldPlayAnimation = shouldPlay && !reducedMotion && !skipped;

    if (shouldPlayAnimation) {
      const runAnimation = async () => {
        // Phase 1: Zoomed in on watch portion (1.5s)
        setAnimationPhase('zoomed');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Phase 2: Zoom out to full logo (2s)
        setAnimationPhase('unzoom');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Phase 3: Exit (0.5s)
        setAnimationPhase('exit');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setShowIntro(false);
      };
      
      runAnimation();
    } else {
      setShowIntro(false);
    }
  }, [reducedMotion, skipped, pathname, shouldPlay]);

  const handleSkip = () => {
    setSkipped(true);
    setShowIntro(false);
  };

  if (!showIntro) return null;

  return (
    <AnimatePresence mode="wait">
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: animationPhase === 'exit' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]"
        >
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-8 right-8 px-4 py-2 text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors z-10"
            aria-label="Skip intro animation"
          >
            Skip Intro
          </button>

          {/* Logo container with zoom effect */}
          <motion.div
            initial={{ scale: 3, x: -80, y: -20 }}
            animate={{ 
              scale: animationPhase === 'zoomed' ? 3 : 1,
              x: animationPhase === 'zoomed' ? -80 : 0,
              y: animationPhase === 'zoomed' ? -20 : 0,
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: animationPhase === 'unzoom' ? 2 : 0.5,
              ease: 'easeOut',
            }}
            className="relative z-10 flex flex-col items-center overflow-hidden"
            style={{ width: '384px', height: '160px' }}
          >
            {/* Glow effect behind logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: animationPhase === 'zoomed' ? 0.3 : animationPhase === 'unzoom' ? 0.2 : 0,
              }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-[#C7CBD0]/20 blur-3xl"
            />
            
            {/* Actual Gandhara Traders Company logo */}
            <div className="relative w-full h-full">
              <img
                src="/logo.png"
                alt="Gandhara Traders Company"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Animated needle overlay - only during zoomed phase */}
            {animationPhase === 'zoomed' && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
                className="absolute top-1/3 left-1/4 origin-bottom"
                style={{ 
                  transformOrigin: 'bottom center',
                  width: '100px',
                  height: '2px',
                }}
              >
                <div className="w-full h-full bg-gradient-to-r from-[#C7CBD0] via-[#E50920] to-[#C7CBD0] rounded-full" />
              </motion.div>
            )}

            {/* COLLECTION text - appears during unzoom */}
            {animationPhase === 'unzoom' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                className="relative mt-8"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '64px' }}
                    transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
                    className="h-px bg-[#E50920]"
                  />
                  <motion.h2 
                    className="text-2xl md:text-3xl font-light tracking-[0.3em] text-[#C7CBD0]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    COLLECTION
                  </motion.h2>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '64px' }}
                    transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
                    className="h-px bg-[#E50920]"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
