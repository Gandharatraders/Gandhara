import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrackCaseForm from '@/components/laboratory/TrackCaseForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Track Case | Gandhara Traders Company',
  description: 'Track your Watch Laboratory authentication case status with Gandhara Traders Company Pakistan.',
};

export default function TrackCasePage() {
  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Header */}
        <section className="py-16 bg-[#101010]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-4">
              Track Your <span className="font-semibold text-[#C7CBD0]">Case</span>
            </h1>
            <p className="text-[#A6A6A6] max-w-2xl mx-auto">
              Enter your case reference number to check the status of your authentication assessment.
            </p>
          </div>
        </section>

        {/* Track Form */}
        <section className="py-12 bg-[#050505]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#101010] rounded-xl p-8 border border-[#292929]">
              <Suspense fallback={<div className="text-[#A6A6A6]">Loading...</div>}>
                <TrackCaseForm />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Information */}
        <section className="py-12 bg-[#101010]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#151515] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">How to Track</h3>
                <p className="text-sm text-[#A6A6A6]">
                  Enter your case reference number from your submission confirmation to check the current status.
                </p>
              </div>

              <div className="bg-[#151515] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">Case Statuses</h3>
                <p className="text-sm text-[#A6A6A6]">
                  Your case will move through: Submitted → Awaiting Info → Under Review → Expert Review → Completed.
                </p>
              </div>

              <div className="bg-[#151515] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">Need Help?</h3>
                <p className="text-sm text-[#A6A6A6]">
                  Contact our support team if you have any questions about your case status.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
