'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSettings } from '@/lib/settings';

export default function Hero() {
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') {
      return { heroVideoUrl: '/rolex-watches-video.mp4', heroPosterUrl: '/hero-poster.jpg' };
    }
    return getSettings();
  });
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const seoTexts = [
    'Luxury',
    'Precision',
    'Craftsmanship',
    'Excellence'
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear old localStorage settings to prevent hydration mismatch
      localStorage.removeItem('site-settings');
      setSettings(getSettings());
    }
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setSettings(getSettings());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Typing effect
  useEffect(() => {
    const currentFullText = seoTexts[textIndex];

    const typing = setTimeout(() => {
      if (!isDeleting && currentText.length < currentFullText.length) {
        setCurrentText(currentFullText.substring(0, currentText.length + 1));
      } else if (isDeleting && currentText.length > 0) {
        setCurrentText(currentFullText.substring(0, currentText.length - 1));
      } else if (!isDeleting && currentText.length === currentFullText.length) {
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && currentText.length === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % seoTexts.length);
      }
    }, isDeleting ? 100 : 200);

    return () => clearTimeout(typing);
  }, [currentText, isDeleting, textIndex]);

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - SEO Text with Typing Effect */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl lg:text-6xl font-light tracking-tight text-[#F5F5F5]">
              Discover{' '}
              <span className="font-semibold text-[#C7CBD0]">
                {currentText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-1 h-8 md:h-12 bg-[#E50920] ml-2"
                />
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-[#A6A6A6] leading-relaxed">
              Experience the pinnacle of horological excellence with Gandhara Traders Company.
              Luxury timepieces with Swiss craftsmanship and precision engineering.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link href="/collections/mens-watches">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Collection
                </Button>
              </Link>
              <Link href="/watch-laboratory">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Laboratory
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-[#292929]">
              <div>
                <p className="text-xl md:text-2xl font-semibold text-[#C7CBD0]">500+</p>
                <p className="text-xs md:text-sm text-[#A6A6A6]">Premium Watches</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-semibold text-[#C7CBD0]">50+</p>
                <p className="text-xs md:text-sm text-[#A6A6A6]">Luxury Brands</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-semibold text-[#C7CBD0]">24/7</p>
                <p className="text-xs md:text-sm text-[#A6A6A6]">Expert Support</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Video Box */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#292929] bg-[#101010]">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                poster={settings.heroPosterUrl}
                onCanPlay={() => setVideoLoaded(true)}
                onError={() => setVideoLoaded(false)}
              >
                <source src={settings.heroVideoUrl} type="video/mp4" />
              </video>

              {/* Fallback when video doesn't load */}
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#151515] to-[#050505]">
                  <div className="text-center">
                    <p className="text-[#A6A6A6] text-sm">Video placeholder</p>
                    <p className="text-[#666] text-xs mt-2">Add your video in admin settings</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Caption */}
            <div className="mt-4 text-center">
              <p className="text-sm text-[#A6A6A6]">
                Experience the art of precision watchmaking
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
