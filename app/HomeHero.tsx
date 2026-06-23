"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LottieSafe from "@/components/LottieSafe";

export default function HomeHero() {
  const [alternateText, setAlternateText] = useState<'together' | 'individually'>('together');
  const [currentHeroItem, setCurrentHeroItem] = useState(0);
  const [heroLottie1, setHeroLottie1] = useState<any>(null);
  const [heroLottie2, setHeroLottie2] = useState<any>(null);
  const [heroLottie3, setHeroLottie3] = useState<any>(null);
  const [heroLottie4, setHeroLottie4] = useState<any>(null);
  const [heroLottie5, setHeroLottie5] = useState<any>(null);

  // Alternate "Together" / "Individually" every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAlternateText(prev => prev === 'together' ? 'individually' : 'together');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Load hero Lottie files
  useEffect(() => {
    fetch('/lotties/birthday/birthday1.json').then(r => r.json()).then(setHeroLottie1).catch(() => {});
    fetch('/lotties/welcome/welcome4.json').then(r => r.json()).then(setHeroLottie2).catch(() => {});
    fetch('/lotties/love/love3.json').then(r => r.json()).then(setHeroLottie3).catch(() => {});
    fetch('/lotties/newbaby/baby1.json').then(r => r.json()).then(setHeroLottie4).catch(() => {});
    fetch('/lotties/love/love2.json').then(r => r.json()).then(setHeroLottie5).catch(() => {});
  }, []);

  // Rotate hero items every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroItem(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#F7FAFC] py-10 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1F2A] leading-tight flex flex-col">
                <span>Send digital cards.<span className="sr-only"> — Digital Greeting Cards Online</span></span>
                <span className="flex items-center justify-center lg:justify-start gap-2 md:gap-3">
                  <span className="relative inline-block min-w-[160px] sm:min-w-[220px] lg:min-w-[280px]">
                    <span className={`absolute left-0 transition-all duration-500 ${alternateText === 'together' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                      Together.
                    </span>
                    <span className={`absolute left-0 transition-all duration-500 ${alternateText === 'individually' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      Individually.
                    </span>
                    <span className="invisible">Individually.</span>
                  </span>
                  <Image src="/cardoraHeart.png" alt="heart" width={80} height={80} className="inline-block w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20" unoptimized />
                </span>
              </h1>
              <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed max-w-lg mx-auto lg:mx-0">
                Create beautiful digital cards for birthdays, farewells, and celebrations. Send solo or collect heartfelt messages from everyone in one place.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
              <Link href="/boards/create">
                <button className="px-6 md:px-8 py-3 md:py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  Create a Cardora
                </button>
              </Link>
              <Link href="/templates">
                <button className="px-6 md:px-8 py-3 md:py-3.5 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] border-2 border-[#2CB1A6] hover:border-[#1F8F86] rounded-lg font-semibold transition-all">
                  Explore templates
                </button>
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#2CB1A6] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-[#5B6B75] font-medium text-sm md:text-base">Free to get started</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#2CB1A6] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <span className="text-[#5B6B75] font-medium text-sm md:text-base">Private and secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#2CB1A6] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <span className="text-[#5B6B75] font-medium text-sm md:text-base">Loved by teams worldwide</span>
              </div>
            </div>
          </div>

          {/* Mobile Lottie */}
          <div className="lg:hidden flex items-center justify-center h-56 sm:h-72 relative">
            {[heroLottie1, heroLottie2, heroLottie3, heroLottie4, heroLottie5].map((lottie, index) => (
              lottie && (
                <div key={index} className={`absolute inset-0 transition-opacity duration-500 ${currentHeroItem === index + 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <LottieSafe animationData={lottie} loop={true} style={{ width: '100%', height: '100%' }} />
                </div>
              )
            ))}
            <div className={`absolute inset-0 transition-opacity duration-500 ${currentHeroItem === 0 ? 'opacity-100' : 'opacity-0'} flex items-center justify-center`}>
              <Image src="/cardoraDemo.png" alt="Cardora Demo" width={400} height={400} className="w-full h-auto max-h-full object-contain" unoptimized />
            </div>
          </div>

          {/* Right Content — desktop rotating display */}
          <div className="hidden lg:block relative overflow-visible">
            <div className="relative scale-125 origin-center">
              <div className="invisible">
                <Image src="/cardoraDemo.png" alt="Cardora Demo" width={700} height={700} className="w-full h-auto" unoptimized />
              </div>

              <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 0 ? 'opacity-100' : 'opacity-0'}`}>
                <Image src="/cardoraDemo.png" alt="Cardora Demo" width={700} height={700} className="w-full h-auto" unoptimized />
              </div>

              {heroLottie1 && (
                <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <LottieSafe animationData={heroLottie1} loop={true} style={{ width: '100%', height: '100%' }} />
                </div>
              )}
              {heroLottie2 && (
                <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <LottieSafe animationData={heroLottie2} loop={true} style={{ width: '100%', height: '100%' }} />
                </div>
              )}
              {heroLottie3 && (
                <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 3 ? 'opacity-100' : 'opacity-0'}`}>
                  <LottieSafe animationData={heroLottie3} loop={true} style={{ width: '100%', height: '100%' }} />
                </div>
              )}
              {heroLottie4 && (
                <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 4 ? 'opacity-100' : 'opacity-0'}`}>
                  <LottieSafe animationData={heroLottie4} loop={true} style={{ width: '100%', height: '100%' }} />
                </div>
              )}
              {heroLottie5 && (
                <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 5 ? 'opacity-100' : 'opacity-0'}`}>
                  <LottieSafe animationData={heroLottie5} loop={true} style={{ width: '100%', height: '100%' }} />
                </div>
              )}
            </div>

            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#A7E8E2] rounded-full opacity-50 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#2CB1A6] rounded-full opacity-30 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
