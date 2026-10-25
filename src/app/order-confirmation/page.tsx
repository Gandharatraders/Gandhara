import { Suspense } from 'react';
import OrderConfirmationContent from './OrderConfirmationContent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function OrderConfirmationPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:8 py-12 text-center">
            <p className="text-[#A6A6A6]">Loading order details...</p>
          </div>
        }>
          <OrderConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
