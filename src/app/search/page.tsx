'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/data';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(products => {
      setAllProducts(products);
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return allProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(lowerQuery) ||
        product.sku.toLowerCase().includes(lowerQuery) ||
        product.shortDescription.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query, allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setQuery('');
  };

  return (
    <>
      <Header />
      
      <main className="pt-20 min-h-screen">
        {/* Search Header */}
        <section className="py-12 bg-[#101010]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-light text-[#F5F5F5] mb-8 text-center">
              Search <span className="font-semibold text-[#C7CBD0]">Products</span>
            </h1>
            
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        </section>

        {/* Search Results */}
        <section className="py-12 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-[#A6A6A6]">Loading products...</p>
              </div>
            ) : query && (
              <div className="mb-8 flex items-center justify-between">
                <p className="text-[#A6A6A6]">
                  {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{query}"
                </p>
                <button
                  onClick={clearSearch}
                  className="flex items-center gap-2 text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>
            )}

            {!query ? (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 mx-auto mb-4 text-[#292929]" />
                <p className="text-[#A6A6A6]">Enter a search term to find products</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#A6A6A6] mb-4">No products found matching "{query}"</p>
                <button
                  onClick={clearSearch}
                  className="text-[#E50920] hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
