"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import { useAuth } from "@/hooks/useAuth";

export default function PersonalBenefitsPage() {
  const { user } = useAuth();
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [birthdayAnimation, setBirthdayAnimation] = useState<any>(null);
  const [benefitAnimation1, setBenefitAnimation1] = useState<any>(null);
  const [benefitAnimation2, setBenefitAnimation2] = useState<any>(null);
  const [benefitAnimation3, setBenefitAnimation3] = useState<any>(null);
  const [benefitAnimation4, setBenefitAnimation4] = useState<any>(null);

  useEffect(() => {
    // Load birthday animation
    fetch('/lotties/birthday/birthday7.json')
      .then(res => res.json())
      .then(data => setBirthdayAnimation(data))
      .catch(err => console.error('Error loading birthday animation:', err));

    // Load benefit section animations
    fetch('/lotties/love/love8.json')
      .then(res => res.json())
      .then(data => setBenefitAnimation1(data))
      .catch(err => console.error('Error loading benefit animation 1:', err));

    fetch('/lotties/newbaby/baby1.json')
      .then(res => res.json())
      .then(data => setBenefitAnimation2(data))
      .catch(err => console.error('Error loading benefit animation 2:', err));

    fetch('/lotties/wedding/wedding2.json')
      .then(res => res.json())
      .then(data => setBenefitAnimation3(data))
      .catch(err => console.error('Error loading benefit animation 3:', err));

    fetch('/lotties/valentinesday/valentine4.json')
      .then(res => res.json())
      .then(data => setBenefitAnimation4(data))
      .catch(err => console.error('Error loading benefit animation 4:', err));
  }, []);

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
              <Link href="/templates" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">
                Templates
              </Link>
              <Link href="/contact" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">
                Contact Us
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
      <section className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto relative">
            <div className="grid lg:grid-cols-2 items-center">
              {/* Left Content */}
              <div className="relative z-10 py-8">
                <div className="w-20 h-20 bg-[#2CB1A6] rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-[#0B1F2A] mb-4">
                  Celebrate Every Moment Together
                </h1>
                <p className="text-xl text-[#5B6B75] mb-6 leading-relaxed">
                  Transform ordinary occasions into extraordinary memories. Cardora makes it easy to gather heartfelt messages from everyone who matters.
                </p>
                <Link href="/boards/create">
                  <button className="px-10 py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                    Create a Cardora
                  </button>
                </Link>
              </div>

              {/* Right Content - Lottie Animation */}
              {birthdayAnimation && (
                <div className="absolute right-0 top-0 w-[700px] h-[700px] -mr-32 -mt-16">
                  <Lottie
                    animationData={birthdayAnimation}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                  />
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
          <div className="absolute top-0 left-0 w-[300px] h-[300px] opacity-20 pointer-events-none">
            <Lottie
              animationData={benefitAnimation1}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
        {benefitAnimation2 && (
          <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-20 pointer-events-none">
            <Lottie
              animationData={benefitAnimation2}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
        {benefitAnimation3 && (
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-20 pointer-events-none">
            <Lottie
              animationData={benefitAnimation3}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
        {benefitAnimation4 && (
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] opacity-20 pointer-events-none">
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
                Why Cardora for Personal Celebrations?
              </h2>
              <p className="text-xl text-[#5B6B75]">
                The perfect way to make someone feel truly special
              </p>
            </div>

            {/* Detailed Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* Benefit 1 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Connect Across Any Distance</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Distance doesn't matter anymore. Whether your friends and family are across town or around the globe, everyone can contribute to one beautiful, unified card. No more coordinating schedules or shipping physical cards—just share a link and watch the love pour in.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Perfect Timing, Every Time</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Schedule your card to be delivered at the exact right moment. Wake them up on their birthday with heartfelt wishes, surprise them during a difficult time, or celebrate a milestone right when it happens. Set it and forget it—we'll make sure it arrives perfectly.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Rich Multimedia Memories</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Words are wonderful, but sometimes you need more. Add photos from cherished moments, funny GIFs that capture inside jokes, or videos with heartfelt messages. Create a multi-dimensional keepsake that truly captures the depth of your relationships and shared experiences.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Stunning Personalization</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Choose from hundreds of professionally designed templates tailored to every occasion imaginable. Customize colors, fonts, and layouts to match the recipient's personality perfectly. Make it elegant, playful, sentimental, or silly—the choice is yours.
                  </p>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Forever Keepsake</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Unlike physical cards that get misplaced or damaged, Cardora cards live forever in the cloud. Recipients can revisit their card whenever they need a boost, download it for safekeeping, or share it with others. These memories won't fade with time.
                  </p>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Effortlessly Simple</h3>
                  <p className="text-[#5B6B75] leading-relaxed">
                    Creating a Cardora takes minutes, not hours. No design skills needed, no complicated software to learn. Pick a template, add your personal touch, invite contributors, and you're done. Spend less time organizing and more time celebrating.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">
                Perfect for Every Occasion
              </h2>
              <p className="text-xl text-[#5B6B75]">
                Whatever you're celebrating, Cardora makes it memorable
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Use Case 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">🎂</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Birthdays</h3>
                <p className="text-[#5B6B75]">
                  Gather wishes from everyone who loves them. Include childhood photos, funny memories, and heartfelt messages that'll make them cry happy tears.
                </p>
              </div>

              {/* Use Case 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">💍</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Weddings</h3>
                <p className="text-[#5B6B75]">
                  Create a beautiful guestbook alternative where wedding guests can share their love, advice, and well-wishes for the happy couple.
                </p>
              </div>

              {/* Use Case 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Graduations</h3>
                <p className="text-[#5B6B75]">
                  Celebrate their achievement with messages of pride and encouragement from teachers, classmates, and family as they start a new chapter.
                </p>
              </div>

              {/* Use Case 4 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">👶</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">New Baby</h3>
                <p className="text-[#5B6B75]">
                  Welcome the newest family member with love and advice from everyone who can't wait to meet them. A keepsake they'll treasure forever.
                </p>
              </div>

              {/* Use Case 5 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">💪</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Get Well Soon</h3>
                <p className="text-[#5B6B75]">
                  Lift their spirits during tough times with encouraging messages, funny stories, and reminders that they're loved and missed.
                </p>
              </div>

              {/* Use Case 6 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Just Because</h3>
                <p className="text-[#5B6B75]">
                  Sometimes the best surprises come for no reason at all. Show someone they're appreciated and thought of, even on an ordinary day.
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
              Ready to Create Something Special?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Start celebrating life's beautiful moments with the people you love. Create your first Cardora in minutes—completely free.
            </p>
            <Link href="/boards/create">
              <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
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