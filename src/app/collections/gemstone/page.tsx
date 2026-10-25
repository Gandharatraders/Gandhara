import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProductsByCategoryServer } from '@/lib/data-server';
import { Metadata } from 'next';
import Image from 'next/image';
import GemstoneFilter from '@/components/gemstone/GemstoneFilter';

export const metadata: Metadata = {
  title: 'Gemstone Collection | Gandhara Traders Company',
  description: 'Discover our exquisite collection of precious gemstones at Gandhara Traders Company Pakistan.',
};

export default function GemstoneCollectionPage() {
  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Banner */}
        <section className="relative h-64 md:h-80 lg:h-96 bg-[#101010]">
          <Image
            src="/gemstone-banner.png"
            alt="Gemstone Collection"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 to-[#050505]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#F5F5F5] mb-4">
                Gemstone <span className="font-semibold text-[#C7CBD0]">Collection</span>
              </h1>
              <p className="text-[#A6A6A6] max-w-2xl mx-auto">
                Discover our exquisite collection of precious gemstones
              </p>
            </div>
          </div>
        </section>

        {/* Filter Buttons */}
        <section className="py-8 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GemstoneFilter />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
