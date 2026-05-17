"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function PricingPage() {
  const { user } = useAuth();
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E5EAF0] bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/cardoraLogo.png"
                alt="Cardora"
                width={240}
                height={64}
                className="h-16 w-auto"
                priority
              />
              <span className="text-3xl font-bold text-[#2CB1A6]">Cardora</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-12">
              <div
                className="relative"
                onMouseEnter={() => setShowFeaturesDropdown(true)}
                onMouseLeave={() => setShowFeaturesDropdown(false)}
              >
                <span className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold cursor-pointer">
                  Features
                </span>

                {/* Features Dropdown */}
                {showFeaturesDropdown && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] overflow-hidden w-[600px]">
                    <div className="grid grid-cols-2">
                      {/* Personal Section */}
                      <Link href="/benefits/personal" className="p-6 border-r border-[#E5EAF0] bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] hover:from-[#E8F5F4] hover:to-[#D0EBE9] transition-colors cursor-pointer">
                        <h3 className="text-xl font-bold text-[#0B1F2A] mb-2 flex items-center gap-2">
                          <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Personal
                        </h3>
                        <p className="text-sm text-[#5B6B75] mb-4">Celebrate life's special moments</p>
                        <ul className="space-y-2 text-[#5B6B75]">
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                            Birthdays
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Valentine's Day
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Weddings
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            New Baby
                          </li>
                          <li className="text-[#2CB1A6] font-medium">and many more...</li>
                        </ul>
                      </Link>

                      {/* Corporate Section */}
                      <Link href="/benefits/corporate" className="p-6 bg-gradient-to-br from-[#0B1F2A] to-[#1F8F86] hover:from-[#1F8F86] hover:to-[#0B1F2A] transition-colors cursor-pointer">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Corporate
                        </h3>
                        <p className="text-sm text-white/80 mb-4">Build culture through recognition</p>
                        <ul className="space-y-2 text-white/80">
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Team Celebration
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Employee Appreciation
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Work Anniversary
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Congratulations
                          </li>
                          <li className="text-white font-medium">and many more...</li>
                        </ul>
                      </Link>
                    </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/pricing" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">
                Pricing
              </Link>
              <Link href="/#templates" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">
                Templates
              </Link>
            </nav>

            {/* CTA Buttons / User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-[#2CB1A6] text-white flex items-center justify-center font-bold">
                    {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-[#0B1F2A] font-medium">
                    {user.user_metadata?.name || user.email}
                  </span>
                </Link>
              ) : (
                <>
                  <Link href="/login?mode=signin">
                    <button className="px-4 py-2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-medium">
                      Sign in
                    </button>
                  </Link>
                  <Link href="/login?mode=signup">
                    <button className="px-6 py-2.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors shadow-sm">
                      Sign up free
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Limited Time Badge */}
            <div className="inline-flex items-center gap-2 bg-[#2CB1A6] text-white px-6 py-3 rounded-full mb-6 shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="font-bold">Limited Time Offer</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-[#0B1F2A] mb-6">
              Cardora is Free for a Short Time
            </h1>
            <p className="text-xl text-[#5B6B75] mb-8 leading-relaxed">
              Create unlimited group cards, invite unlimited contributors, and celebrate every moment — completely free for a limited time. No credit card required.
            </p>

            <Link href="/boards/create">
              <button className="px-10 py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                Create a Cardora Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">
                Everything You Need to Celebrate
              </h2>
              <p className="text-xl text-[#5B6B75]">
                All features included. No limits. No catches.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Unlimited Cards</h3>
                <p className="text-[#5B6B75]">
                  Create as many group cards as you want for all your celebrations.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Unlimited Contributors</h3>
                <p className="text-[#5B6B75]">
                  Invite everyone to join in. No limits on the number of people.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Photos & GIFs</h3>
                <p className="text-[#5B6B75]">
                  Add unlimited photos, GIFs, and videos to your cards.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Beautiful Templates</h3>
                <p className="text-[#5B6B75]">
                  Choose from hundreds of stunning templates for any occasion.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Schedule Delivery</h3>
                <p className="text-[#5B6B75]">
                  Schedule your cards to be delivered at the perfect moment.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#F7FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#2CB1A6] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Private & Secure</h3>
                <p className="text-[#5B6B75]">
                  Your cards are private and secure. Share only with who you choose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Celebrating?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Join thousands of people creating memorable group cards with Cardora. Free for a limited time.
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#0B1F2A] text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className="bg-[#F7FAFC] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">
                  How long will Cardora be free?
                </h3>
                <p className="text-[#5B6B75] leading-relaxed">
                  Cardora is completely free for a limited time. We'll give plenty of advance notice before introducing any pricing plans, and early users will receive special benefits.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="bg-[#F7FAFC] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">
                  Do I need a credit card to sign up?
                </h3>
                <p className="text-[#5B6B75] leading-relaxed">
                  No! Sign up is completely free with no credit card required. Just create an account and start celebrating.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="bg-[#F7FAFC] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">
                  Are there any limits on the free plan?
                </h3>
                <p className="text-[#5B6B75] leading-relaxed">
                  Currently, there are no limits. Create unlimited cards, invite unlimited contributors, and use all features without restrictions.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-[#F7FAFC] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">
                  What happens when pricing is introduced?
                </h3>
                <p className="text-[#5B6B75] leading-relaxed">
                  We'll notify all users well in advance before any changes. Your existing cards will remain accessible, and we'll ensure a smooth transition for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2CB1A6] py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Logo & Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/cardoraLogo.png"
                    alt="Cardora"
                    width={160}
                    height={48}
                    className="h-12 w-auto"
                  />
                  <span className="text-2xl font-bold text-white">Cardora</span>
                </div>
                <p className="text-sm text-white opacity-90">
                  Beautiful group cards for every celebration
                </p>
              </div>

              {/* Product Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="/#features" className="text-white opacity-80 hover:opacity-100 transition-opacity">Features</a></li>
                  <li><Link href="/pricing" className="text-white opacity-80 hover:opacity-100 transition-opacity">Pricing</Link></li>
                  <li><a href="/#templates" className="text-white opacity-80 hover:opacity-100 transition-opacity">Templates</a></li>
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity">Blog</a></li>
                  <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity">Help Center</a></li>
                  <li><a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity">Contact</a></li>
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {/* Facebook */}
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="Facebook">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* X (Twitter) */}
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="X">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="LinkedIn">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="Instagram">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-white border-opacity-20 pt-8 text-center">
              <p className="text-sm text-white opacity-90">
                &copy; 2026 Cardora. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}