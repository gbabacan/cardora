import Link from "next/link";
import Image from "next/image";
import PricingNav from "./PricingNav";
import PricingHeroLottie from "./PricingHeroLottie";
import PricingFeaturesLotties from "./PricingFeaturesLotties";
import PricingFaqLotties from "./PricingFaqLotties";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PricingNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center">
              {/* Left Content — server-rendered */}
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-[#2CB1A6] text-white px-5 py-2.5 rounded-full mb-4 shadow-lg">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="font-bold text-sm">Limited Time Offer</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Cardora is Free for a Short Time
                  <span className="sr-only"> — Free Digital Greeting Cards Online</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Create unlimited cards individually or as a group, invite unlimited contributors, and celebrate every moment — completely free for a limited time. No credit card required.
                </p>

                <Link href="/boards/create">
                  <button className="px-8 py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                    Create a Cardora Now
                  </button>
                </Link>
              </div>

              {/* Right Content — Lottie animation (client) */}
              <PricingHeroLottie />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section — server-rendered text + client decorative Lotties */}
      <section className="py-20 bg-white relative overflow-hidden">
        <PricingFeaturesLotties />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">
                Everything You Need to Celebrate
              </h2>
              <p className="text-xl text-[#5B6B75]">All features included. No limits. No catches.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Unlimited Cards</h3>
                <p className="text-[#5B6B75]">Create as many cards as you want — solo or group — for all your celebrations.</p>
              </div>

              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Unlimited Contributors</h3>
                <p className="text-[#5B6B75]">Invite everyone to join in. No limits on the number of people.</p>
              </div>

              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Photos &amp; GIFs</h3>
                <p className="text-[#5B6B75]">Add unlimited photos, GIFs, and videos to your cards.</p>
              </div>

              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Beautiful Templates</h3>
                <p className="text-[#5B6B75]">Choose from hundreds of stunning templates for any occasion.</p>
              </div>

              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Schedule Delivery</h3>
                <p className="text-[#5B6B75]">Schedule your cards to be delivered at the perfect moment.</p>
              </div>

              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Private &amp; Secure</h3>
                <p className="text-[#5B6B75]">Your cards are private and secure. Share only with who you choose.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — fully server-rendered */}
      <section className="py-20 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Start Celebrating?</h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Join thousands creating memorable cards with Cardora — solo or together — free for a limited time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create">
                <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  Create Your First Card
                </button>
              </Link>
              <Link href="/#features">
                <button className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-[#2CB1A6] text-white text-lg rounded-lg font-semibold transition-all">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section — server-rendered text + client decorative Lotties */}
      <section className="py-20 bg-white relative overflow-hidden">
        <PricingFaqLotties />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#0B1F2A] text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-[#F7FAFC] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">How long will Cardora be free?</h3>
                <p className="text-[#5B6B75] leading-relaxed">Cardora is completely free for a limited time. We&apos;ll give plenty of advance notice before introducing any pricing plans, and early users will receive special benefits.</p>
              </div>
              <div className="bg-[#F7FAFC] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Do I need a credit card to sign up?</h3>
                <p className="text-[#5B6B75] leading-relaxed">No! Sign up is completely free with no credit card required. Just create an account and start celebrating.</p>
              </div>
              <div className="bg-[#F7FAFC] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Are there any limits on the free plan?</h3>
                <p className="text-[#5B6B75] leading-relaxed">Currently, there are no limits. Create unlimited cards, invite unlimited contributors, and use all features without restrictions.</p>
              </div>
              <div className="bg-[#F7FAFC] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">What happens when pricing is introduced?</h3>
                <p className="text-[#5B6B75] leading-relaxed">We&apos;ll notify all users well in advance before any changes. Your existing cards will remain accessible, and we&apos;ll ensure a smooth transition for everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer — fully server-rendered */}
      <footer className="bg-[#2CB1A6] py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image src="/cardoraLogo.png" alt="Cardora" width={160} height={48} className="h-12 w-auto" />
                  <span className="text-2xl font-bold text-white">Cardora</span>
                </div>
                <p className="text-sm text-white opacity-90">Beautiful cards for every celebration</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/#features" className="text-white opacity-80 hover:opacity-100 transition-opacity">Features</Link></li>
                  <li><Link href="/pricing" className="text-white opacity-80 hover:opacity-100 transition-opacity">Pricing</Link></li>
                  <li><Link href="/templates" className="text-white opacity-80 hover:opacity-100 transition-opacity">Templates</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="text-white opacity-80 hover:opacity-100 transition-opacity">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="Facebook">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="X">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="LinkedIn">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="Instagram">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-white border-opacity-20 pt-8 text-center">
              <p className="text-sm text-white opacity-90">&copy; 2026 Cardora. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
