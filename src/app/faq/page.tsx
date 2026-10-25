import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Gandhara Traders Company',
  description: 'Frequently asked questions about Gandhara Traders Company watches, shipping, returns, and authentication services.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We currently accept Cash on Delivery (COD) across Pakistan. We are working to integrate online payment methods including credit cards and bank transfers.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-5 business days across Pakistan. Premium and express delivery options are available for select locations.',
    },
    {
      question: 'Are your watches authentic?',
      answer: 'Yes, all watches sold by Gandhara Traders Company are guaranteed authentic. We source from authorized dealers and certified pre-owned specialists. We also offer a Watch Laboratory service for third-party authentication.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unworn watches in their original packaging. Please see our Returns & Refunds page for full details.',
    },
    {
      question: 'Do you offer warranty?',
      answer: 'Warranty terms vary by manufacturer and watch type. Most of our watches come with manufacturer warranty. Pre-owned watches may have limited warranty coverage.',
    },
    {
      question: 'How does the Watch Laboratory work?',
      answer: 'Submit your watch details and photographs through our Watch Laboratory page. Our team will assess the information and provide an authenticity report. This is a preliminary assessment based on provided images.',
    },
  ];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="py-16 bg-[#101010]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-6">
              Frequently Asked <span className="font-semibold text-[#C7CBD0]">Questions</span>
            </h1>
            <p className="text-[#A6A6A6] text-lg">
              Find answers to common questions about our watches and services.
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-[#151515] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#F5F5F5] mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-[#A6A6A6]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
