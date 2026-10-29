'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  images: {
    main: string;
    gallery1?: string;
    gallery2?: string;
  };
  price: number;
  category: string;
}

interface ProductSlideshowProps {
  products: Product[];
}

export default function ProductSlideshow({ products }: ProductSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#292929] bg-[#101010] flex items-center justify-center">
        <p className="text-[#A6A6A6]">No products available</p>
      </div>
    );
  }

  const currentProduct = products[currentIndex];
  const productImage = currentProduct.images.main || currentProduct.images.gallery1 || '/placeholder.jpg';

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#292929] bg-[#101010]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={productImage}
            alt={currentProduct.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Product Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-[#C7CBD0] uppercase tracking-wider mb-1">
                {currentProduct.category}
              </p>
              <h3 className="text-xl font-semibold text-[#F5F5F5] mb-2 line-clamp-1">
                {currentProduct.name}
              </h3>
              <p className="text-lg text-[#E50920] font-semibold">
                PKR {currentProduct.price.toLocaleString()}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {products.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-[#E50920]' : 'w-2 bg-[#292929]'
            }`}
          />
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-16 right-4">
        <p className="text-xs text-[#A6A6A6]">
          {currentIndex + 1} / {products.length}
        </p>
      </div>
    </div>
  );
}
