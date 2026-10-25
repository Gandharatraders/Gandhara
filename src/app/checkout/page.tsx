import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Gandhara Traders Company',
  description: 'Complete your purchase at Gandhara Traders Company. Secure checkout with cash on delivery available across Pakistan.',
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-light text-[#F5F5F5] mb-8">
            <span className="font-semibold text-[#C7CBD0]">Checkout</span>
          </h1>
          <CheckoutForm />
        </div>
      </main>

      <Footer />
    </>
  );
}
