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

export default function AntiqueCollectionPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: 'all',
    availability: 'all',
    sortBy: 'featured',
    brand: 'all',
  });

  useEffect(() => {
    getProductsByCategory('antique').then(products => {
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

    // Only show products with 1-2 pieces (low stock or antique pieces)
    filtered = filtered.filter((product) => {
      const stock = product.stockQuantity || 0;
      return stock <= 2;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.salePrice || a.price) - (a.salePrice || a.price));
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
        {/* Collection Header with Banner */}
        <section className="relative h-64 md:h-80 lg:h-96 bg-[#101010] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/banner.jpg"
              alt="Antique Collection Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#101010]" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-[#F5F5F5] mb-4">
                Antique <span className="font-semibold text-[#C7CBD0]">Collection</span>
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-[#A6A6A6] max-w-2xl">
                Discover timeless masterpieces from legendary watchmakers. Our antique collection features rare vintage timepieces with extraordinary craftsmanship and historical significance.
              </p>
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
