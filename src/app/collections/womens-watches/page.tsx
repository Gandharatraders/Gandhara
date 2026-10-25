'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LuxuryProductCard from '@/components/product/LuxuryProductCard';
import CollectionFilters from '@/components/product/CollectionFilters';
import { getProductsByCategory } from '@/lib/data';
import { useState, useMemo, useEffect } from 'react';

interface FilterState {
  priceRange: string;
  availability: string;
  sortBy: string;
  brand: string;
}

export default function WomensCollectionPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: 'all',
    availability: 'all',
    sortBy: 'featured',
    brand: 'all',
  });

  useEffect(() => {
    getProductsByCategory('womens').then(products => {
      setAllProducts(products);
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    if (loading) return [];
    let filtered = [...allProducts];

    // Filter by brand
    if (filters.brand !== 'all') {
      filtered = filtered.filter((product) => {
        const brandName = product.name.toLowerCase();
        return brandName.includes(filters.brand.toLowerCase());
      });
    }

    // Filter by price range
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter((product) => {
        const price = product.salePrice || product.price;
        switch (filters.priceRange) {
          case 'under-100k':
            return price < 100000;
          case '100k-200k':
            return price >= 100000 && price <= 200000;
          case '200k-500k':
            return price > 200000 && price <= 500000;
          case 'over-500k':
            return price > 500000;
          default:
            return true;
        }
      });
    }

    // Filter by availability
    if (filters.availability !== 'all') {
      filtered = filtered.filter(
        (product) => product.availability === filters.availability
      );
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [allProducts, filters]);

  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Collection Header */}
        <section className="py-12 md:py-16 bg-[#101010]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-[#F5F5F5] mb-4">
              Women's <span className="font-semibold text-[#C7CBD0]">Collection</span>
            </h1>
            <p className="text-sm md:text-base text-[#A6A6A6] max-w-2xl">
              Explore our curated selection of women's timepieces, from elegant minimalist designs to sophisticated complications and refined bracelets.
            </p>
          </div>
        </section>

        {/* Brand Categories */}
        <section className="py-8 md:py-12 bg-[#050505] border-b border-[#292929]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl font-light text-[#F5F5F5] mb-4 md:mb-6">
              Shop by <span className="font-semibold text-[#C7CBD0]">Brand</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {[
                { name: 'All', color: 'from-gray-900/20 to-gray-800/10', value: 'all', textColor: 'text-[#C7CBD0]' },
                { name: 'Rolex', color: 'from-green-900/30 to-green-800/20', value: 'rolex', textColor: 'text-green-400' },
                { name: 'Rado', color: 'from-blue-900/30 to-blue-800/20', value: 'rado', textColor: 'text-blue-400' },
                { name: 'Tissot', color: 'from-red-900/30 to-red-800/20', value: 'tissot', textColor: 'text-red-400' },
                { name: 'Omega', color: 'from-orange-900/30 to-orange-800/20', value: 'omega', textColor: 'text-orange-400' },
                { name: 'Cartier', color: 'from-purple-900/30 to-purple-800/20', value: 'cartier', textColor: 'text-purple-400' },
                { name: 'Seiko', color: 'from-teal-900/30 to-teal-800/20', value: 'seiko', textColor: 'text-teal-400' },
              ].map((brand) => (
                <button
                  key={brand.name}
                  onClick={() => setFilters({ ...filters, brand: brand.value })}
                  className={`relative group bg-gradient-to-br bg-[#101010] rounded-xl p-4 md:p-6 border-2 transition-all duration-300 hover:scale-105 ${
                    filters.brand === brand.value
                      ? 'border-[#C7CBD0] shadow-lg shadow-[#C7CBD0]/20'
                      : 'border-[#292929] hover:border-[#C7CBD0]/50'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    filters.brand === brand.value ? 'opacity-100' : ''
                  }`} />
                  <div className="relative">
                    <h3 className={`text-base md:text-lg lg:text-xl font-bold mb-1 ${brand.textColor} group-hover:text-[#F5F5F5] transition-colors`}>
                      {brand.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-[#A6A6A6] group-hover:text-[#C7CBD0] transition-colors">
                      {brand.name === 'All' ? 'All Brands' : 'Collection'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Collection Content */}
        <section className="py-8 md:py-12 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <CollectionFilters onFilterChange={setFilters} />
                </div>
              </aside>

              {/* Product Grid */}
              <div className="flex-1">
                <div className="mb-4 md:mb-6 flex items-center justify-between">
                  <p className="text-xs md:text-sm text-[#A6A6A6]">
                    {loading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-[#A6A6A6]">Loading products...</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {filteredProducts.map((product) => (
                      <LuxuryProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[#A6A6A6]">No products found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
