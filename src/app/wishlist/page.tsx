'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { useWishlist } from '@/lib/wishlist-context';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <>
      <Header />
      
      <main className="pt-20 min-h-screen">
        {/* Wishlist Header */}
        <section className="py-12 bg-[#101010]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-light text-[#F5F5F5] mb-2">
                  My <span className="font-semibold text-[#C7CBD0]">Wishlist</span>
                </h1>
                <p className="text-[#A6A6A6]">
                  {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
                </p>
              </div>
              {wishlist.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="px-4 py-2 text-sm text-[#A6A6A6] hover:text-[#E50920] transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Wishlist Content */}
        <section className="py-12 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-[#151515] rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-[#292929]" />
                </div>
                <h2 className="text-2xl font-light text-[#F5F5F5] mb-4">
                  Your wishlist is empty
                </h2>
                <p className="text-[#A6A6A6] mb-8">
                  Save your favorite watches by clicking the heart icon on any product.
                </p>
                <a
                  href="/collections/mens-watches"
                  className="inline-block px-6 py-3 bg-[#E50920] text-white rounded-lg hover:bg-[#C4081B] transition-colors"
                >
                  Browse Collection
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
