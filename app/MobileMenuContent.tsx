"use client";

import { useState } from "react";
import Link from "next/link";

const OCCASIONS = [
  { label: "🎂 Birthday Cards", href: "/birthday-cards" },
  { label: "👋 Farewell Cards", href: "/farewell-cards" },
  { label: "🙏 Thank You Cards", href: "/thank-you-cards" },
  { label: "🎉 Congratulations Cards", href: "/congratulations-cards" },
  { label: "👶 New Baby Cards", href: "/new-baby-cards" },
  { label: "🎓 Graduation Cards", href: "/graduation-cards" },
  { label: "❤️ Valentine's Day Cards", href: "/valentines-cards" },
  { label: "🚀 Promotion Cards", href: "/promotion-cards" },
  { label: "📅 Work Anniversary Cards", href: "/work-anniversary-cards" },
  { label: "🌟 Employee Appreciation", href: "/employee-appreciation-cards" },
  { label: "🎄 Christmas Cards", href: "/christmas-cards" },
  { label: "🏖️ Retirement Cards", href: "/retirement-cards" },
  { label: "💍 Wedding Cards", href: "/wedding-cards" },
  { label: "🎊 Team Celebration Cards", href: "/team-celebration-cards" },
];

interface Props {
  user: any;
  onClose: () => void;
}

export default function MobileMenuContent({ user, onClose }: Props) {
  const [showFeatures, setShowFeatures] = useState(false);
  const [showOccasions, setShowOccasions] = useState(false);

  return (
    <nav className="md:hidden border-t border-[#E5EAF0] pt-3 pb-2 mt-3 flex flex-col gap-0.5">

      {/* Features — accordion */}
      <div>
        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors"
        >
          <span>Features</span>
          <svg
            className={`w-4 h-4 transition-transform ${showFeatures ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showFeatures && (
          <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l-2 border-[#E8F5F4] pl-3">
            <Link
              href="/benefits/personal"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#5B6B75] font-medium hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-[#2CB1A6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Personal
            </Link>
            <Link
              href="/benefits/corporate"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#5B6B75] font-medium hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-[#2CB1A6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Corporate
            </Link>
          </div>
        )}
      </div>

      {/* Occasions — accordion */}
      <div>
        <button
          onClick={() => setShowOccasions(!showOccasions)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors"
        >
          <span>Occasions</span>
          <svg
            className={`w-4 h-4 transition-transform ${showOccasions ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showOccasions && (
          <div className="ml-4 mt-0.5 border-l-2 border-[#E8F5F4] pl-3">
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              {OCCASIONS.map((o) => (
                <Link
                  key={o.href}
                  href={o.href}
                  onClick={onClose}
                  className="px-2 py-2 text-xs text-[#5B6B75] font-medium hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors"
                >
                  {o.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Direct links */}
      <Link href="/pricing" onClick={onClose} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Pricing</Link>
      <Link href="/templates" onClick={onClose} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Templates</Link>
      <Link href="/contact" onClick={onClose} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Contact Us</Link>

      {/* Auth */}
      {user ? (
        <Link href="/dashboard" onClick={onClose} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Dashboard</Link>
      ) : (
        <Link href="/login?mode=signin" onClick={onClose} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Sign in</Link>
      )}
    </nav>
  );
}
