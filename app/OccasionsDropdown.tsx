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

const LEFT = OCCASIONS.slice(0, 7);
const RIGHT = OCCASIONS.slice(7);

export default function OccasionsDropdown() {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold cursor-pointer flex items-center gap-1">
        Occasions
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>

      {show && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] overflow-hidden w-[480px]">
            <div className="p-4">
              <p className="text-xs font-semibold text-[#5B6B75] uppercase tracking-wide mb-3 px-2">All Occasions</p>
              <div className="grid grid-cols-2 gap-1">
                {LEFT.map((o) => (
                  <Link
                    key={o.href}
                    href={o.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#E8F5F4] text-[#0B1F2A] hover:text-[#2CB1A6] text-sm font-medium transition-colors"
                  >
                    {o.label}
                  </Link>
                ))}
                {RIGHT.map((o) => (
                  <Link
                    key={o.href}
                    href={o.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#E8F5F4] text-[#0B1F2A] hover:text-[#2CB1A6] text-sm font-medium transition-colors"
                  >
                    {o.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
