import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Gandhara Traders Company',
  description: 'Terms and conditions for using Gandhara Traders Company website and services.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="py-16 bg-[#101010]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-6">
              Terms & <span className="font-semibold text-[#C7CBD0]">Conditions</span>
            </h1>
          </div>
        </section>

        <section className="py-16 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-[#A6A6A6] mb-6">
                Last updated: January 1, 2024
              </p>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                By accessing and using Gandhara Traders Company website, you agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use our website.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">1. Use of the Website</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                The content of this website is for your general information and use only. It is subject to change without notice. We reserve the right to modify or discontinue the website at any time without notice.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">2. Products and Pricing</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                We strive to display accurate product information and pricing. However, we do not warrant that product descriptions, colors, or other content are accurate, complete, reliable, or error-free. Prices are subject to change without notice.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">3. Orders and Payment</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Payment is due at the time of ordering unless otherwise specified.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">4. Intellectual Property</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                All content on this website, including text, graphics, logos, and images, is the property of Gandhara Traders Company or its content suppliers and is protected by copyright laws.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">5. Limitation of Liability</h2>
              <p className="text-[#A6A6A6] leading-relaxed">
                In no event shall Gandhara Traders Company be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of this website.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
