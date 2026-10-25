import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Gandhara Traders Company',
  description: 'Learn about Gandhara Traders Company and our approach to premium watch curation and craftsmanship.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="py-16 bg-[#101010]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-6">
              About <span className="font-semibold text-[#C7CBD0]">Gandhara Traders Company</span>
            </h1>
            <p className="text-[#A6A6A6] text-lg">
              Discover the art of precision with Gandhara Traders Company.
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-light text-[#F5F5F5] mb-6">
                Our <span className="font-semibold text-[#C7CBD0]">Story</span>
              </h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                Gandhara Traders Company was founded with a singular vision: to bring exceptional timepieces to discerning individuals in Pakistan. We believe that a watch is more than a timekeeper—it's a statement of style, a testament to craftsmanship, and a companion for life's most meaningful moments.
              </p>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                Each timepiece in our collection is carefully selected for its exceptional quality, distinctive design, and enduring value. We work directly with authorized dealers and certified pre-owned specialists to ensure authenticity and provide our customers with complete confidence in their purchase.
              </p>

              <h2 className="text-2xl font-light text-[#F5F5F5] mb-6 mt-12">
                Our <span className="font-semibold text-[#C7CBD0]">Approach</span>
              </h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                We take pride in offering a curated selection of watches that meet the highest standards of quality and craftsmanship. Our team combines technical expertise with a passion for horology to provide personalized guidance and exceptional service.
              </p>
              <p className="text-[#A6A6A6] leading-relaxed">
                Whether you're seeking your first luxury timepiece or adding to an established collection, Gandhara Traders Company is here to help you find the perfect watch that reflects your style and aspirations.
              </p>
            </div>
          </div>
        </section>

        {/* Official Registration Section */}
        <section className="py-16 bg-[#101010]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-[#F5F5F5] mb-4">
                Official <span className="font-semibold text-[#C7CBD0]">Registration</span>
              </h2>
              <p className="text-[#A6A6A6] text-lg">
                Gandhara Traders Company is officially registered with the Government of Pakistan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#050505] rounded-xl p-6 border border-[#292929]">
                <h3 className="text-xl font-semibold text-[#F5F5F5] mb-4">Registration Certificate</h3>
                <div className="relative w-full h-80 bg-[#151515] rounded-lg overflow-hidden">
                  <img
                    src="/documents/registration-certificate.jpg.jpeg"
                    alt="Registration Certificate"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="bg-[#050505] rounded-xl p-6 border border-[#292929]">
                <h3 className="text-xl font-semibold text-[#F5F5F5] mb-4">Government Registration</h3>
                <div className="relative w-full h-80 bg-[#151515] rounded-lg overflow-hidden">
                  <img
                    src="/documents/government-registration.jpg.jpeg"
                    alt="Government Registration"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#A6A6A6]">
                All documents are authentic and verifiable with relevant government authorities.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
