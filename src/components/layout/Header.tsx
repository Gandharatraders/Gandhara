'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import CartDrawer from '@/components/cart/CartDrawer';
import { useWishlist } from '@/lib/wishlist-context';

export default function Header() {
  const { wishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/collections/mens-watches', label: "Men's Collection" },
    { href: '/collections/womens-watches', label: "Women's Collection" },
    { href: '/collections/antique', label: 'Antique' },
    { href: '/collections/gemstone', label: 'Gemstone' },
    { href: '/watch-laboratory', label: 'Laboratory' },
    { href: '/track-order', label: 'Track Order' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-[#292929] bg-gradient-to-b from-[#050505] to-[#0a0a0a]',
        isScrolled ? 'bg-[#050505]/98 backdrop-blur-xl shadow-2xl shadow-black/50' : 'bg-[#050505]/95 backdrop-blur-md'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left navigation items - desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#F5F5F5] hover:text-[#E50920] transition-all duration-300 border-b-2 border-transparent hover:border-[#E50920] pb-1 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E50920] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Centered Logo */}
          <Link href="/" className="flex-shrink-0 relative w-64 h-20 group">
            <img
              src="/logo.png"
              alt="Gandhara Traders Company"
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Right navigation items - desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.slice(3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#F5F5F5] hover:text-[#E50920] transition-all duration-300 border-b-2 border-transparent hover:border-[#E50920] pb-1 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E50920] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <Link href="/search">
              <button
                className="p-2.5 text-[#F5F5F5] hover:text-[#E50920] hover:bg-[#292929]/30 rounded-full transition-all duration-300"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/wishlist">
              <button
                className="p-2.5 text-[#F5F5F5] hover:text-[#E50920] hover:bg-[#292929]/30 rounded-full transition-all duration-300 relative hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E50920] text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg shadow-[#E50920]/50">
                    {wishlist.length}
                  </span>
                )}
              </button>
            </Link>
            <CartDrawer />

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2.5 text-[#F5F5F5] hover:text-[#E50920] hover:bg-[#292929]/30 rounded-full transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-[#292929]"
          >
            <nav className="px-4 py-6 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-base text-[#A6A6A6] hover:text-[#E50920] hover:bg-[#292929]/30 rounded-lg px-4 py-3 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#292929] flex items-center gap-4">
                <Link href="/search" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="flex items-center gap-2 text-[#A6A6A6] hover:text-[#E50920] hover:bg-[#292929]/30 rounded-lg px-4 py-3 transition-all duration-300">
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </Link>
                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="flex items-center gap-2 text-[#A6A6A6] hover:text-[#E50920] hover:bg-[#292929]/30 rounded-lg px-4 py-3 transition-all duration-300">
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
