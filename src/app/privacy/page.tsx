import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Gandhara Traders Company',
  description: 'Privacy policy for Gandhara Traders Company. Learn how we protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="py-16 bg-[#101010]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-6">
              Privacy <span className="font-semibold text-[#C7CBD0]">Policy</span>
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
                Gandhara Traders Company respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">1. Information We Collect</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, payment information, and shipping address.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">2. How We Use Your Information</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                We use the information we collect to process your orders, provide customer service, send you notifications about your orders, and improve our services. We may also use your information to send marketing communications if you have consented to receive them.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">3. Data Security</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 mt-8">4. Your Rights</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-6">
                You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time.
              </p>
              <p className="text-[#A6A6A6] leading-relaxed">
                For detailed information about our privacy practices, please contact us at info@crownixcollection.pk
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
