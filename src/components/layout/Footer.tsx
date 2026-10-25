import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#292929]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="relative w-48 h-16">
              <img
                src="/logo.png"
                alt="Gandhara Traders Company"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-[#A6A6A6] leading-relaxed">
              Discover the art of precision with Gandhara Traders Company. Premium watches for discerning individuals.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-6">
              Collections
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/collections/mens-watches" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  Men's Watches
                </Link>
              </li>
              <li>
                <Link href="/collections/womens-watches" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  Women's Watches
                </Link>
              </li>
              <li>
                <Link href="/collections/antique" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  Antique Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/gemstone" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  Gemstone Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-6">
              Customer Service
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Connect */}
          <div>
            <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <p className="text-sm text-[#A6A6A6]">gandharatraderscompany@gmail.com</p>
              </li>
              <li>
                <p className="text-sm text-[#A6A6A6]">Sunny_8080880@yaoo.com</p>
              </li>
              <li>
                <p className="text-sm text-[#A6A6A6]">+92 315 945 2946</p>
              </li>
              <li>
                <p className="text-sm text-[#A6A6A6]">03338080880</p>
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-6 mt-8">
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#292929] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#A6A6A6]">
            © 2024 Gandhara Traders Company. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/watch-laboratory" className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors">
              Watch Laboratory
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
