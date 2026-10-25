'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import LuxuryProductCard from '@/components/product/LuxuryProductCard';
import { getProductsByCategory } from '@/lib/data';

export default function GemstoneFilter() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsByCategory('gemstone').then(setProducts).finally(() => setLoading(false));
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = selectedFilter === 'All'
    ? safeProducts
    : safeProducts.filter(product => {
        const gemstone = product.specifications?.gemstone?.toLowerCase() || '';
        const gemstones = product.specifications?.gemstones?.toLowerCase() || '';
        const search = gemstone || gemstones || '';

        if (selectedFilter === 'Diamonds') return search.includes('diamond');
        if (selectedFilter === 'Rubies') return search.includes('ruby');
        if (selectedFilter === 'Sapphires') return search.includes('sapphire');
        if (selectedFilter === 'Emeralds') return search.includes('emerald');
        if (selectedFilter === 'Other') {
          return !search.includes('diamond') &&
                 !search.includes('ruby') &&
                 !search.includes('sapphire') &&
                 !search.includes('emerald');
        }
        return true;
      });

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-[#A6A6A6]">Loading gemstones...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {['All', 'Diamonds', 'Rubies', 'Sapphires', 'Emeralds', 'Other'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-6 py-2 border-2 rounded-lg font-semibold transition-colors ${
              selectedFilter === filter
                ? 'border-[#E50920] bg-[#E50920]/10 text-[#E50920]'
                : 'border-[#292929] text-[#A6A6A6] hover:border-[#C7CBD0] hover:text-[#F5F5F5]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-[#A6A6A6]">No gemstones found in this category.</p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <LuxuryProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
