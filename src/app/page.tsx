import LogoIntro from '@/components/layout/LogoIntro';
import Header from '@/components/layout/Header';
import Hero from '@/components/layout/Hero';
import Footer from '@/components/layout/Footer';
import LuxuryProductCard from '@/components/product/LuxuryProductCard';
import ProductReviews from '@/components/product/ProductReviews';
import { getFeaturedProductsServer } from '@/lib/data-server';
import { getApprovedReviews } from '@/lib/supabase-db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProductsServer(8);

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#A6A6A6]">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {featuredProducts.map((product) => (
        <LuxuryProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function CustomerReviews() {
  const reviews = await getApprovedReviews();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#A6A6A6]">No reviews yet. Customers can leave reviews after confirming order receipt.</p>
      </div>
    );
  }

  // Filter only reviews with 4+ rating, max 5
  const topReviews = reviews
    .filter((r: any) => r.rating >= 4)
    .slice(0, 5);

  if (topReviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#A6A6A6]">No approved reviews yet. Reviews will appear here after admin approval.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topReviews.map((review: any) => (
        <div key={review.id} className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= review.rating ? 'fill-[#E50920] text-[#E50920]' : 'text-[#292929]'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[#F5F5F5] font-semibold">{review.rating}.0</span>
          </div>

          <p className="text-[#A6A6A6] mb-4 line-clamp-3">{review.comment}</p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#F5F5F5] font-medium">{review.customer_name}</p>
              <p className="text-xs text-[#555555]">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
            {review.photos && review.photos.length > 0 && (
              <div className="flex gap-1">
                {review.photos.slice(0, 2).map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ))}
                {review.photos.length > 2 && (
                  <div className="w-12 h-12 bg-[#292929] rounded-lg flex items-center justify-center text-[#A6A6A6] text-xs">
                    +{review.photos.length - 2}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <LogoIntro shouldPlay={true} />
      <Header />

      <main>
        <Hero />

        {/* Featured Products Section */}
        <section className="py-1 md:py-2 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#F5F5F5] mb-4">
                Featured <span className="font-semibold text-[#C7CBD0]">Collection</span>
              </h2>
              <p className="text-sm md:text-base text-[#A6A6A6] max-w-2xl mx-auto">
                Discover our carefully curated selection of exceptional timepieces.
              </p>
            </div>

            <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-[#101010] rounded-xl p-2 md:p-3 border border-[#292929] h-64 animate-pulse" />
              ))}
            </div>}>
              <FeaturedProducts />
            </Suspense>

            <div className="text-center mt-8 md:mt-12">
              <Link href="/collections/mens-watches">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View All Collections
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-20 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-[#F5F5F5] mb-4">
                Customer <span className="font-semibold text-[#C7CBD0]">Reviews</span>
              </h2>
              <p className="text-[#A6A6A6] max-w-2xl mx-auto">
                See what our customers say about their Gandhara Traders Company experience.
              </p>
            </div>

            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-[#101010] rounded-xl p-6 border border-[#292929] h-48 animate-pulse" />
              ))}
            </div>}>
              <CustomerReviews />
            </Suspense>
          </div>
        </section>

        {/* Watch Laboratory Preview */}
        <section className="py-20 bg-[#101010]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-[#F5F5F5] mb-6">
                  The Gandhara Traders Company <span className="font-semibold text-[#C7CBD0]">Laboratory</span>
                </h2>
                <p className="text-[#A6A6A6] mb-8 leading-relaxed">
                  Submit your watch details and photographs for a professional authenticity assessment. Our expert team uses advanced analysis to help you verify the legitimacy of your timepiece.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 bg-[#E50920] rounded-full flex-shrink-0" />
                    <p className="text-[#A6A6A6]">
                      Multi-step verification process
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 bg-[#E50920] rounded-full flex-shrink-0" />
                    <p className="text-[#A6A6A6]">
                      Secure photo and document upload
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 bg-[#E50920] rounded-full flex-shrink-0" />
                    <p className="text-[#A6A6A6]">
                      AI-powered analysis with expert review
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 bg-[#E50920] rounded-full flex-shrink-0" />
                    <p className="text-[#A6A6A6]">
                      Detailed assessment reports
                    </p>
                  </div>
                </div>
                <Link href="/watch-laboratory">
                  <Button size="lg">
                    Start Authentication
                  </Button>
                </Link>
              </div>
              <div className="relative h-96 lg:h-auto bg-[#151515] rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 border-2 border-[#C7CBD0] rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#C7CBD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-[#A6A6A6]">Authentication Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-20 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-[#F5F5F5] mb-6">
              Precision <span className="font-semibold text-[#C7CBD0]">Redefined</span>
            </h2>
            <p className="text-[#A6A6A6] text-lg leading-relaxed mb-8">
              At Gandhara Traders Company, we believe that a watch is more than a timekeeper—it's a statement of style, a testament to craftsmanship, and a companion for life's most meaningful moments. Each timepiece in our collection is selected for its exceptional quality, distinctive design, and enduring value.
            </p>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Our Story
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
