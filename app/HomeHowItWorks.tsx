"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Lottie from "lottie-react";

export default function HomeHowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [howItWorksLottie1, setHowItWorksLottie1] = useState<any>(null);
  const [howItWorksLottie2, setHowItWorksLottie2] = useState<any>(null);
  const [howItWorksLottie3, setHowItWorksLottie3] = useState<any>(null);
  const [howItWorksLottie4, setHowItWorksLottie4] = useState<any>(null);

  useEffect(() => {
    fetch('/lotties/love/love1.json').then(r => r.json()).then(setHowItWorksLottie1).catch(() => {});
    fetch('/lotties/love/love5.json').then(r => r.json()).then(setHowItWorksLottie2).catch(() => {});
    fetch('/lotties/newbaby/baby4.json').then(r => r.json()).then(setHowItWorksLottie3).catch(() => {});
    fetch('/lotties/christmas/christmas1.json').then(r => r.json()).then(setHowItWorksLottie4).catch(() => {});
  }, []);

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      {/* Decorative Lotties — desktop only */}
      {howItWorksLottie1 && (
        <div className="hidden md:block absolute top-16 left-16 w-64 h-64 opacity-30">
          <Lottie animationData={howItWorksLottie1} loop={true} style={{ width: '100%', height: '100%' }} />
        </div>
      )}
      {howItWorksLottie2 && (
        <div className="hidden md:block absolute top-16 right-16 w-64 h-64 opacity-30">
          <Lottie animationData={howItWorksLottie2} loop={true} style={{ width: '100%', height: '100%' }} />
        </div>
      )}
      {howItWorksLottie3 && (
        <div className="hidden md:block absolute bottom-16 left-16 w-64 h-64 opacity-30">
          <Lottie animationData={howItWorksLottie3} loop={true} style={{ width: '100%', height: '100%' }} />
        </div>
      )}
      {howItWorksLottie4 && (
        <div className="hidden md:block absolute bottom-16 right-16 w-64 h-64 opacity-30">
          <Lottie animationData={howItWorksLottie4} loop={true} style={{ width: '100%', height: '100%' }} />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#0B1F2A] text-center mb-8 md:mb-12">
            Make Celebrations Effortless
          </h2>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-2 md:gap-4 mb-8 md:mb-16 max-w-3xl mx-auto">
            {['Create', 'Invite', 'Share', 'Celebrate'].map((step, index) => (
              <button
                key={step}
                onClick={() => setActiveStep(index)}
                className={`flex-1 px-3 md:px-10 py-2 md:py-3 rounded-full font-semibold transition-all text-sm md:text-base ${
                  activeStep === index
                    ? 'bg-[#1F8F86] text-white'
                    : 'bg-white text-[#5B6B75] border-2 border-[#E5EAF0] hover:border-[#2CB1A6]'
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div>
              {activeStep === 0 && (
                <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                  <p className="text-sm font-semibold text-[#5B6B75] uppercase tracking-wide">CREATE</p>
                  <h3 className="text-2xl md:text-4xl font-bold text-[#0B1F2A]">Pick your occasion</h3>
                  <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed">
                    From birthdays to farewells, choose the perfect moment to celebrate. Customize with photos, videos, and heartfelt messages in just a few clicks.
                  </p>
                  <Link href="/boards/create">
                    <button className="px-6 md:px-8 py-3 md:py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors text-base md:text-lg">
                      Create a Cardora
                    </button>
                  </Link>
                </div>
              )}
              {activeStep === 1 && (
                <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                  <p className="text-sm font-semibold text-[#5B6B75] uppercase tracking-wide">INVITE</p>
                  <h3 className="text-2xl md:text-4xl font-bold text-[#0B1F2A]">Get everyone involved</h3>
                  <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed">
                    Choose the Board format to send a simple link to friends, family, or coworkers. They can contribute messages and memories instantly, without signing up.
                  </p>
                  <Link href="/boards/create">
                    <button className="px-6 md:px-8 py-3 md:py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors text-base md:text-lg">
                      Create a Cardora
                    </button>
                  </Link>
                </div>
              )}
              {activeStep === 2 && (
                <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                  <p className="text-sm font-semibold text-[#5B6B75] uppercase tracking-wide">SHARE</p>
                  <h3 className="text-2xl md:text-4xl font-bold text-[#0B1F2A]">Make the moment unforgettable</h3>
                  <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed">
                    Send your card instantly or schedule it for the perfect surprise. Share digitally, print it, or present it live—creating memories that last.
                  </p>
                  <Link href="/boards/create">
                    <button className="px-6 md:px-8 py-3 md:py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors text-base md:text-lg">
                      Create a Cardora
                    </button>
                  </Link>
                </div>
              )}
              {activeStep === 3 && (
                <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                  <p className="text-sm font-semibold text-[#5B6B75] uppercase tracking-wide">CELEBRATE</p>
                  <h3 className="text-2xl md:text-4xl font-bold text-[#0B1F2A]">Create memories that last</h3>
                  <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed">
                    Your recipient receives a heartfelt card filled with messages, photos, and love—whether from you alone or from everyone together. A keepsake they can treasure and revisit forever.
                  </p>
                  <Link href="/boards/create">
                    <button className="px-6 md:px-8 py-3 md:py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors text-base md:text-lg">
                      Create a Cardora
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Visual */}
            <div className="bg-[#F7FAFC] rounded-2xl p-4 md:p-8 min-h-[280px] md:min-h-[500px] flex items-center justify-center">
              {activeStep === 0 && (
                <div className="w-full">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm font-semibold text-[#5B6B75] mb-4">Select occasion</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-[#F7FAFC] rounded-lg"><span className="text-2xl">🎂</span><span className="font-medium text-[#0B1F2A]">Birthday</span></div>
                      <div className="flex items-center gap-3 p-3 hover:bg-[#F7FAFC] rounded-lg"><span className="text-2xl">📅</span><span className="font-medium text-[#0B1F2A]">Work Anniversary</span></div>
                      <div className="flex items-center gap-3 p-3 hover:bg-[#F7FAFC] rounded-lg"><span className="text-2xl">🏆</span><span className="font-medium text-[#0B1F2A]">Congrats</span></div>
                      <div className="flex items-center gap-3 p-3 hover:bg-[#F7FAFC] rounded-lg"><span className="text-2xl">💐</span><span className="font-medium text-[#0B1F2A]">Sympathy</span></div>
                      <div className="flex items-center gap-3 p-3 hover:bg-[#F7FAFC] rounded-lg"><span className="text-2xl">💌</span><span className="font-medium text-[#0B1F2A]">Thank You</span></div>
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 1 && (
                <div className="w-full">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm font-semibold text-[#5B6B75] mb-4">Invite contributors</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-4 py-2 bg-[#2CB1A6] text-white rounded-full text-sm">Emily Chen</span>
                      <span className="px-4 py-2 bg-[#2CB1A6] text-white rounded-full text-sm">Michael Rodriguez</span>
                      <span className="px-4 py-2 bg-[#2CB1A6] text-white rounded-full text-sm">Sarah Johnson</span>
                      <span className="px-4 py-2 bg-[#2CB1A6] text-white rounded-full text-sm">Design Team</span>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-[#5B6B75]">Message</label>
                      <div className="p-4 bg-[#F7FAFC] rounded-lg">
                        <p className="text-[#0B1F2A]">Hi everyone! Let&apos;s make Alex&apos;s farewell card extra special. Please add your favorite memory or message!</p>
                      </div>
                      <button className="w-full px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors">Send invites</button>
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 2 && (
                <div className="w-full space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#E5EAF0]">
                    <p className="text-sm font-semibold text-[#5B6B75] mb-4">Choose delivery</p>
                    <div className="bg-gradient-to-r from-[#2CB1A6] to-[#A7E8E2] rounded-lg p-4 mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div><p className="font-bold text-white">Send now</p><p className="text-sm text-white opacity-90">Deliver instantly</p></div>
                      </div>
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="bg-[#F7FAFC] rounded-lg p-4 flex items-center justify-between border-2 border-[#E5EAF0]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-[#2CB1A6]">
                          <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div><p className="font-bold text-[#0B1F2A]">Schedule for later</p><p className="text-sm text-[#5B6B75]">Pick the perfect moment</p></div>
                      </div>
                      <span className="text-2xl">📅</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-4xl opacity-50">🎉</div>
                    <div className="absolute bottom-2 left-2 text-3xl opacity-50">💝</div>
                    <h4 className="text-xl font-bold mb-2">Happy Birthday, Alex! 🎂</h4>
                    <p className="text-sm opacity-90 mb-3">15 heartfelt messages waiting inside</p>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
                      <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
                      <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
                      <div className="text-sm flex items-center text-white font-semibold">+12</div>
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 3 && (
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop&crop=faces)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2CB1A6]/80 to-[#1F8F86]/80"></div>
                  </div>
                  <div className="absolute top-8 left-8 animate-bounce">
                    <svg className="w-10 h-10 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  <div className="absolute top-12 right-12 animate-pulse">
                    <svg className="w-8 h-8 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <div className="absolute bottom-8 left-12 animate-bounce delay-100">
                    <svg className="w-9 h-9 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80">
                    <div className="bg-white rounded-xl shadow-2xl p-6 border-4 border-white">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2CB1A6] to-[#A7E8E2] rounded-full mx-auto mb-3 flex items-center justify-center">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>
                        </div>
                        <h4 className="text-2xl font-bold text-[#0B1F2A] mb-2">Happy Birthday!</h4>
                        <p className="text-sm text-[#5B6B75]">From your amazing team</p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="bg-[#F7FAFC] rounded-lg p-3 flex items-start gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#2CB1A6] to-[#A7E8E2] rounded-full flex-shrink-0"></div>
                          <p className="text-xs text-[#0B1F2A] leading-relaxed">&quot;Best wishes for an amazing year!&quot; - Sarah</p>
                        </div>
                        <div className="bg-[#F7FAFC] rounded-lg p-3 flex items-start gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#2CB1A6] to-[#A7E8E2] rounded-full flex-shrink-0"></div>
                          <p className="text-xs text-[#0B1F2A] leading-relaxed">&quot;You&apos;re amazing! Keep shining!&quot; - Mike</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#E5EAF0]">
                        <div className="flex -space-x-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-[#2CB1A6] to-[#A7E8E2] rounded-full border-2 border-white"></div>
                          <div className="w-7 h-7 bg-gradient-to-br from-[#FFB84D] to-[#FF9E1B] rounded-full border-2 border-white"></div>
                          <div className="w-7 h-7 bg-gradient-to-br from-[#FF6B9D] to-[#FF4081] rounded-full border-2 border-white"></div>
                          <div className="w-7 h-7 bg-gradient-to-br from-[#7C4DFF] to-[#6200EA] rounded-full border-2 border-white"></div>
                        </div>
                        <span className="text-sm font-bold text-[#2CB1A6]">+24 contributors</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
