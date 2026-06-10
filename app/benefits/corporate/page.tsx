"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import { useAuth } from "@/hooks/useAuth";

export default function CorporateBenefitsPage() {
  const { user } = useAuth();
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [welcomeAnimation, setWelcomeAnimation] = useState<any>(null);
  const [benefitAnimation1, setBenefitAnimation1] = useState<any>(null);
  const [benefitAnimation2, setBenefitAnimation2] = useState<any>(null);
  const [benefitAnimation3, setBenefitAnimation3] = useState<any>(null);
  const [benefitAnimation4, setBenefitAnimation4] = useState<any>(null);

  useEffect(() => {
    // Load welcome animation
    fetch('/lotties/welcome/welcome1.json')
      .then(res => res.json())
      .then(data => setWelcomeAnimation(data))
      .catch(err => console.error('Error loading welcome animation:', err));

    // Load benefit section animations
    fetch('/lotties/farewell/farewell4.json')
      .then(res => res.json())
      .then(data => setBenefitAnimation1(data))
      .catch(err => console.error('Error loading benefit animation 1:', err));

    fetch('/lotties/congratulations/congratulations3.json')
      .then(res => res.json())
      .then(data => setBenefitAnimation2(data))
      .catch(err => console.error('Error loading benefit animation 2:', err));

    fetch('/lotties/welcome/welcome3.json')
      .then(res => res.json())
      .then(data => setBenefitAnimation3(data))
      .catch(err => console.error('Error loading benefit animation 3:', err));

    fetch('/lotties/thankyou/thankYou1.json')
      .then(res => res.json())
      .then(data => setBenefitAnimation4(data))
      .catch(err => console.error('Error loading benefit animation 4:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E5EAF0] bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 md:gap-4">
              <Image src="/cardoraLogo.png" alt="Cardora" width={240} height={64} className="h-9 md:h-16 w-auto" priority />
              <span className="text-xl md:text-3xl font-bold text-[#2CB1A6]">Cardora</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-12">
              <div className="relative" onMouseEnter={() => setShowFeaturesDropdown(true)} onMouseLeave={() => setShowFeaturesDropdown(false)}>
                <span className="text-[#2CB1A6] font-bold cursor-pointer">Features</span>
                {showFeaturesDropdown && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] overflow-hidden w-[600px]">
                      <div className="grid grid-cols-2">
                        <Link href="/benefits/personal" className="p-6 border-r border-[#E5EAF0] bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] hover:from-[#E8F5F4] hover:to-[#D0EBE9] transition-colors cursor-pointer">
                          <h3 className="text-xl font-bold text-[#0B1F2A] mb-2 flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            Personal
                          </h3>
                          <p className="text-sm text-[#5B6B75] mb-4">Celebrate life&apos;s special moments</p>
                          <ul className="space-y-2 text-[#5B6B75]">
                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>Birthdays</li>
                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>Valentine&apos;s Day</li>
                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>Weddings</li>
                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>New Baby</li>
                            <li className="text-[#2CB1A6] font-medium">and many more...</li>
                          </ul>
                        </Link>
                        <Link href="/benefits/corporate" className="p-6 bg-gradient-to-br from-[#0B1F2A] to-[#1F8F86] hover:from-[#1F8F86] hover:to-[#0B1F2A] transition-colors cursor-pointer">
                          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            Corporate
                          </h3>
                          <p className="text-sm text-white/80 mb-4">Build culture through recognition</p>
                          <ul className="space-y-2 text-white/80">
                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Team Celebration</li>
                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Employee Appreciation</li>
                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Work Anniversary</li>
                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>Congratulations</li>
                            <li className="text-white font-medium">and many more...</li>
                          </ul>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/pricing" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">Pricing</Link>
              <Link href="/templates" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">Templates</Link>
              <Link href="/contact" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">Contact Us</Link>
            </nav>

            {/* Right: CTA + Hamburger */}
            <div className="flex items-center gap-2 md:gap-3">
              {user ? (
                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-9 h-9 rounded-full bg-[#2CB1A6] text-white flex items-center justify-center font-bold text-sm">
                    {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block text-[#0B1F2A] font-medium">{user.user_metadata?.name || user.email}</span>
                </Link>
              ) : (
                <>
                  <Link href="/login?mode=signin" className="hidden md:block">
                    <button className="px-4 py-2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-medium">Sign in</button>
                  </Link>
                  <Link href="/login?mode=signup">
                    <button className="px-4 md:px-6 py-2 md:py-2.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors shadow-sm text-sm md:text-base">Sign up free</button>
                  </Link>
                </>
              )}
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 rounded-lg hover:bg-[#F7FAFC] transition-colors" aria-label="Toggle menu">
                {showMobileMenu ? (
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <nav className="md:hidden border-t border-[#E5EAF0] pt-4 pb-2 mt-3 flex flex-col gap-1">
              <Link href="/benefits/personal" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Features — Personal</Link>
              <Link href="/benefits/corporate" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#2CB1A6] font-semibold hover:bg-[#F7FAFC] rounded-lg transition-colors">Features — Corporate</Link>
              <Link href="/pricing" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Pricing</Link>
              <Link href="/templates" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Templates</Link>
              <Link href="/contact" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Contact Us</Link>
              {user ? (
                <Link href="/dashboard" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Dashboard</Link>
              ) : (
                <Link href="/login?mode=signin" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Sign in</Link>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B1F2A] to-[#1F8F86] py-8 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center">
              {/* Left Content */}
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-xl mx-auto lg:mx-0">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                  Build a Culture Where Everyone Thrives
                </h1>
                <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Transform your workplace with meaningful recognition that drives engagement, strengthens culture, and helps your organization succeed.
                </p>
                <Link href="/boards/create">
                  <button className="px-8 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                    Create a Cardora
                  </button>
                </Link>
              </div>

              {/* Right Content - Lottie Animation */}
              {welcomeAnimation && (
                <div className="w-full max-w-xs sm:max-w-sm lg:max-w-none mx-auto lg:mx-0 h-64 sm:h-80 lg:h-[500px] relative lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[600px] lg:-mr-16">
                  <Lottie animationData={welcomeAnimation} loop={true} style={{ width: '100%', height: '100%' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Lotties */}
        {benefitAnimation1 && (
          <div className="hidden md:block absolute top-0 left-0 w-[300px] h-[300px] opacity-20 pointer-events-none">
            <Lottie
              animationData={benefitAnimation1}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
        {benefitAnimation2 && (
          <div className="hidden md:block absolute top-0 right-0 w-[300px] h-[300px] opacity-20 pointer-events-none">
            <Lottie
              animationData={benefitAnimation2}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
        {benefitAnimation3 && (
          <div className="hidden md:block absolute bottom-0 left-0 w-[300px] h-[300px] opacity-20 pointer-events-none">
            <Lottie
              animationData={benefitAnimation3}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
        {benefitAnimation4 && (
          <div className="hidden md:block absolute bottom-0 right-0 w-[300px] h-[300px] opacity-20 pointer-events-none">
            <Lottie
              animationData={benefitAnimation4}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">
                The Power of Recognition at Scale
              </h2>
              <p className="text-xl text-[#5B6B75]">
                See how Cardora transforms your employee experience
              </p>
            </div>

            {/* Detailed Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* Benefit 1 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Boost Employee Engagement</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Engaged employees are 87% less likely to leave. Cardora makes recognition easy and meaningful, creating a workplace where people feel valued every day. Watch productivity soar as team members feel genuinely appreciated for their contributions.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Foster Multi-Directional Recognition</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Recognition shouldn't just flow top-down. Enable peer-to-peer appreciation, upward recognition, and cross-team celebration. Build a culture where everyone feels empowered to acknowledge great work, creating stronger bonds across your entire organization.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Increase Retention & Reduce Turnover</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    The cost of replacing an employee averages 6-9 months of their salary. Regular, heartfelt recognition makes employees feel valued and connected, dramatically reducing turnover. Invest in appreciation today, save on recruitment tomorrow.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Strengthen Company Culture</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Culture isn't built in annual retreats—it's built in daily moments of recognition. Cardora helps you celebrate your values in action, reinforce desired behaviors, and create a positive environment where your culture truly comes alive.
                  </p>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Enhance Job Satisfaction</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Employees who feel appreciated report higher job satisfaction, better work-life balance, and greater pride in their work. Happy employees don't just stay longer—they perform better, innovate more, and become your best advocates.
                  </p>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Drive Measurable Results</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Recognition isn't just feel-good fluff—it's a business driver. Companies with strong recognition programs see 31% lower voluntary turnover, 12x higher productivity, and stronger bottom-line results. Recognition is an investment that pays dividends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition Types */}
      <section className="py-20 bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">
                Recognition That Flows Every Direction
              </h2>
              <p className="text-xl text-[#5B6B75]">
                Enable appreciation across your entire organization
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Type 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Top-Down Recognition</h3>
                <p className="text-[#5B6B75]">
                  Managers and leaders acknowledge outstanding performance and reinforce company values.
                </p>
              </div>

              {/* Type 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Peer-to-Peer</h3>
                <p className="text-[#5B6B75]">
                  Teammates celebrate each other's wins, building trust and camaraderie across the organization.
                </p>
              </div>

              {/* Type 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Bottom-Up</h3>
                <p className="text-[#5B6B75]">
                  Team members recognize great leadership, fostering mutual respect and appreciation.
                </p>
              </div>

              {/* Type 4 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Cross-Functional</h3>
                <p className="text-[#5B6B75]">
                  Break down silos by celebrating collaboration between departments and teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">
                Perfect for Every Milestone
              </h2>
              <p className="text-xl text-[#5B6B75]">
                Celebrate what matters in your organization
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Use Case 1 */}
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Work Anniversaries</h3>
                <p className="text-[#5B6B75]">
                  Celebrate tenure with messages from across the company. Show long-term employees how much their dedication means.
                </p>
              </div>

              {/* Use Case 2 */}
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Project Launches</h3>
                <p className="text-[#5B6B75]">
                  Recognize the entire team's effort when a big project ships. Acknowledge everyone who contributed to success.
                </p>
              </div>

              {/* Use Case 3 */}
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Employee of the Month</h3>
                <p className="text-[#5B6B75]">
                  Make awards more meaningful with personalized messages from colleagues sharing specific examples.
                </p>
              </div>

              {/* Use Case 4 */}
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8">
                <div className="text-4xl mb-4">👋</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Farewells & Retirements</h3>
                <p className="text-[#5B6B75]">
                  Send teammates off with heartfelt messages they'll treasure. A beautiful keepsake of their impact.
                </p>
              </div>

              {/* Use Case 5 */}
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Goal Achievement</h3>
                <p className="text-[#5B6B75]">
                  Celebrate when teams hit their targets. Public recognition reinforces winning behaviors.
                </p>
              </div>

              {/* Use Case 6 */}
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Going Above & Beyond</h3>
                <p className="text-[#5B6B75]">
                  Recognize exceptional effort that embodies your values. Make your culture visible and tangible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#0B1F2A] to-[#1F8F86] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Recognition Drives Real Results
              </h2>
              <p className="text-xl opacity-90">
                The business impact of a strong recognition culture
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">31%</div>
                <p className="opacity-90">Lower voluntary turnover</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">2x</div>
                <p className="opacity-90">Higher employee engagement</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">12x</div>
                <p className="opacity-90">Better business outcomes</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">56%</div>
                <p className="opacity-90">Less likely to job hunt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-6">
              Ready to Transform Your Culture?
            </h2>
            <p className="text-xl text-[#5B6B75] mb-8">
              Start building a workplace where recognition is part of everyday life. Your team will thank you for it.
            </p>
            <Link href="/boards/create">
              <button className="px-10 py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                Create a Cardora
              </button>
            </Link>
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
                  Beautiful cards for every celebration
                </p>
              </div>

              {/* Product Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="/#features" className="text-white opacity-80 hover:opacity-100 transition-opacity">Features</a></li>
                  <li><Link href="/pricing" className="text-white opacity-80 hover:opacity-100 transition-opacity">Pricing</Link></li>
                  <li><a href="/templates" className="text-white opacity-80 hover:opacity-100 transition-opacity">Templates</a></li>
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
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="Facebook">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="X">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="LinkedIn">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>

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