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
              Submit your watch or gemstone details and send photos/video via WhatsApp for a professional authenticity assessment.
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
                  <svg className="w-6 h-6 text-[#E50920]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">Send via WhatsApp</h3>
                <p className="text-sm text-[#A6A6A6]">
                  Submit your details online, then send 2-3 photos and 1 video directly to our WhatsApp.
                </p>
              </div>

              <div className="bg-[#151515] rounded-xl p-6">
                <div className="w-12 h-12 bg-[#E50920]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#E50920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">Payment</h3>
                <p className="text-sm text-[#A6A6A6]">
                  PKR 1,000 fee for professional assessment. Pay via bank transfer and send receipt via WhatsApp.
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
