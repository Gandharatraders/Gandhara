import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductContent from './ProductContent';

export default function ProductPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050505]"><p className="text-[#A6A6A6]">Loading product...</p></div>}>
        <ProductContent />
      </Suspense>
      <Footer />
    </>
  );
}
