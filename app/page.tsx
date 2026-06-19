import Link from "next/link";
import Image from "next/image";
import SharedFooter from "./SharedFooter";
import HomeNav from "./HomeNav";
import HomeHero from "./HomeHero";
import HomeTestimonials from "./HomeTestimonials";
import HomeOccasions from "./HomeOccasions";
import HomeHowItWorks from "./HomeHowItWorks";
import HomeExamples from "./HomeExamples";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HomeNav />
      <HomeHero />

      {/* Features Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#E5EAF0] hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F7FAFC] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Cards your way</h3>
                    <p className="text-[#5B6B75] leading-relaxed">Send individually or invite others to add messages, photos, GIFs, and more.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E5EAF0] hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F7FAFC] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Beautiful templates</h3>
                    <p className="text-[#5B6B75] leading-relaxed">Choose from hundreds of modern templates for any occasion.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E5EAF0] hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F7FAFC] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Send anywhere</h3>
                    <p className="text-[#5B6B75] leading-relaxed">Deliver by email or share a link. Fast, simple, meaningful.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeTestimonials />
      <HomeOccasions />
      <HomeHowItWorks />
      <HomeExamples />

      {/* Benefits Section */}
      <section id="features" className="bg-white">
        <div className="container mx-auto px-6 pt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">Why Choose Cardora?</h2>
              <p className="text-xl text-[#5B6B75]">Perfect for personal celebrations and professional recognition</p>
            </div>
          </div>
        </div>

        {/* Personal Section */}
        <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#0B1F2A] mb-4">For Personal Celebrations</h3>
                  <p className="text-lg text-[#5B6B75] leading-relaxed mb-6">Make every milestone memorable. Cardora helps you celebrate life&apos;s precious moments with the people who matter most.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-[#A7E8E2] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <h4 className="font-bold text-[#0B1F2A] mb-2 text-lg">Bring Everyone Together</h4>
                  <p className="text-[#5B6B75]">Connect friends and family from around the world in one beautiful, heartfelt card</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-[#A7E8E2] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h4 className="font-bold text-[#0B1F2A] mb-2 text-lg">Create Lasting Memories</h4>
                  <p className="text-[#5B6B75]">Preserve heartfelt messages and photos that your loved ones will treasure forever</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-[#A7E8E2] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  <h4 className="font-bold text-[#0B1F2A] mb-2 text-lg">Celebrate Your Way</h4>
                  <p className="text-[#5B6B75]">Choose from stunning templates and customize every detail to match the occasion</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link href="/benefits/personal">
                  <button className="px-10 py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Learn more</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Section */}
        <div className="bg-gradient-to-br from-[#0B1F2A] to-[#1F8F86] py-12 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">For Corporate Teams</h3>
                  <p className="text-lg opacity-90 leading-relaxed mb-6">Transform your workplace culture with meaningful recognition. Strengthen team bonds and drive results through authentic appreciation.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                  <h4 className="font-bold mb-2 text-lg">Energize Your Team</h4>
                  <p className="text-white/80 text-sm">Inspire higher engagement and motivation through collective appreciation</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
                  <h4 className="font-bold mb-2 text-lg">Build Stronger Culture</h4>
                  <p className="text-white/80 text-sm">Foster appreciation across all levels and strengthen team connections</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg></div>
                  <h4 className="font-bold mb-2 text-lg">Recognize Excellence</h4>
                  <p className="text-white/80 text-sm">Celebrate achievements and milestones that drive your business forward</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <h4 className="font-bold mb-2 text-lg">Retain Top Talent</h4>
                  <p className="text-white/80 text-sm">Increase satisfaction and loyalty by making employees feel valued</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link href="/benefits/corporate">
                  <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Learn more</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SharedFooter />
    </div>
  );
}
