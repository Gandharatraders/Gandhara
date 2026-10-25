import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/contact/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Gandhara Traders Company',
  description: 'Get in touch with Gandhara Traders Company for inquiries, support, or assistance with your watch purchase.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="py-16 bg-[#101010]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-6">
              Contact <span className="font-semibold text-[#C7CBD0]">Us</span>
            </h1>
            <p className="text-[#A6A6A6] text-lg">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactForm />

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">Email</h3>
                  <p className="text-[#A6A6A6] mb-2">gandharatraderscompany@gmail.com</p>
                  <p className="text-[#A6A6A6]">Sunny_8080880@yaoo.com</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">Phone</h3>
                  <p className="text-[#A6A6A6] mb-2">+92 315 945 2946</p>
                  <p className="text-[#A6A6A6]">03338080880</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
