import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Gandhara Traders Company',
  description: 'Shipping policy and delivery information for Gandhara Traders Company watches across Pakistan.',
};

export default function ShippingPage() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="py-16 bg-[#101010]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-6">
              Shipping <span className="font-semibold text-[#C7CBD0]">Policy</span>
            </h1>
          </div>
        </section>

        <section className="py-16 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">Delivery Times</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                Standard delivery across Pakistan takes 3-5 business days. Orders are processed within 1-2 business days. Delivery times may vary during holidays and special promotions.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">Shipping Costs</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                Standard shipping is complimentary on all orders. Express delivery options are available for select locations at an additional cost.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">Delivery Areas</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                We deliver to all major cities across Pakistan. For remote areas, delivery times may be extended. Contact us for specific location inquiries.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">Order Tracking</h2>
              <p className="text-[#A6A6A6] leading-relaxed">
                Once your order is shipped, you will receive a tracking number via email to monitor your delivery status.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
