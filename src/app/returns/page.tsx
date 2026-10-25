import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds | Gandhara Traders Company',
  description: 'Return and refund policy for Gandhara Traders Company watches.',
};

export default function ReturnsPage() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="py-16 bg-[#101010]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-6">
              Returns & <span className="font-semibold text-[#C7CBD0]">Refunds</span>
            </h1>
          </div>
        </section>

        <section className="py-16 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">Return Policy</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                We accept returns within 30 days of delivery. The watch must be unworn, in its original packaging, and with all documentation and accessories included.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">How to Return</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                To initiate a return, contact our customer service team with your order number. We will provide return instructions and a shipping label if applicable.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">Refunds</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                Refunds are processed within 7-10 business days of receiving and inspecting the returned item. Refunds will be issued to the original payment method.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">Exchanges</h2>
              <p className="text-[#A6A6A6] leading-relaxed">
                Exchanges are subject to availability. If you wish to exchange for a different model, you may return the original item and place a new order.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
