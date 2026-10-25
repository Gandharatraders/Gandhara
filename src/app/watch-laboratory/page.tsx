import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WatchLaboratoryForm from '@/components/laboratory/WatchLaboratoryForm';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Watch Laboratory | Gandhara Traders Company',
  description: 'Submit your watch for authenticity assessment with the Gandhara Traders Company Watch Laboratory. Professional verification service in Pakistan.',
};

export default function WatchLaboratoryPage() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-16 bg-[#101010]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-4">
              THE CROWNIX <span className="font-semibold text-[#C7CBD0]">LABORATORY</span>
            </h1>
            <p className="text-[#A6A6A6] max-w-2xl mx-auto mb-6">
              Submit your watch or gemstone details (max 5 images, 1 video), pay PKR 1,000, and upload payment receipt
              for a professional authenticity assessment.
            </p>
            <Link href="/track-case">
              <Button variant="outline">
                Track Existing Case
              </Button>
            </Link>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <WatchLaboratoryForm />
          </div>
        </section>

        {/* Information */}
        <section className="py-12 bg-[#101010]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#151515] rounded-xl p-6">
                <div className="w-12 h-12 bg-[#E50920]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#E50920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">Upload Requirements</h3>
                <p className="text-sm text-[#A6A6A6]">
                  Maximum 5 images from different angles and 1 video (1 minute max) of your watch.
                </p>
              </div>

              <div className="bg-[#151515] rounded-xl p-6">
                <div className="w-12 h-12 bg-[#E50920]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#E50920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">Payment Required</h3>
                <p className="text-sm text-[#A6A6A6]">
                  PKR 1,000 fee for professional assessment. Upload payment receipt to complete.
                </p>
              </div>

              <div className="bg-[#151515] rounded-xl p-6">
                <div className="w-12 h-12 bg-[#E50920]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#E50920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">Secure Process</h3>
                <p className="text-sm text-[#A6A6A6]">
                  Your information and files are handled securely. All submissions sent to admin for review.
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
