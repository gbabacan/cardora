"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import MobileMenuContent from "../MobileMenuContent";
import OccasionsDropdown from "../OccasionsDropdown";

export default function ContactNav() {
  const [user, setUser] = useState<any>(null);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <header className="border-b border-[#E5EAF0] bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-4">
            <Image src="/cardoraLogo.png" alt="Cardora" width={240} height={64} className="h-9 md:h-16 w-auto" priority />
            <span className="text-xl md:text-3xl font-bold text-[#2CB1A6]">Cardora</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            <div
              className="relative"
              onMouseEnter={() => setShowFeaturesDropdown(true)}
              onMouseLeave={() => setShowFeaturesDropdown(false)}
            >
              <span className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold cursor-pointer">Features</span>
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
            <OccasionsDropdown />
            <Link href="/pricing" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">Pricing</Link>
            <Link href="/templates" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">Templates</Link>
            <Link href="/contact" className="text-[#2CB1A6] font-bold">Contact Us</Link>
          </nav>

          {/* Right: CTA + Hamburger */}
          <div className="flex items-center gap-2 md:gap-3">
            {user ? (
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-[#2CB1A6] text-white flex items-center justify-center font-bold text-sm">
                  {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <span className="hidden md:block text-[#0B1F2A] font-medium">
                  {user.user_metadata?.name || user.email}
                </span>
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
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-[#F7FAFC] transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && <MobileMenuContent user={user} onClose={() => setShowMobileMenu(false)} />}
      </div>
    </header>
  );
}
