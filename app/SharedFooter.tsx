import Link from "next/link";
import Image from "next/image";

const PERSONAL_CARDS = [
  { label: "Birthday Cards", href: "/birthday-cards" },
  { label: "Valentine's Day Cards", href: "/valentines-cards" },
  { label: "Wedding Cards", href: "/wedding-cards" },
  { label: "New Baby Cards", href: "/new-baby-cards" },
  { label: "Graduation Cards", href: "/graduation-cards" },
  { label: "Farewell Cards", href: "/farewell-cards" },
  { label: "Thank You Cards", href: "/thank-you-cards" },
  { label: "Congratulations Cards", href: "/congratulations-cards" },
  { label: "Retirement Cards", href: "/retirement-cards" },
  { label: "Christmas Cards", href: "/christmas-cards" },
];

const WORK_CARDS = [
  { label: "Work Anniversary Cards", href: "/work-anniversary-cards" },
  { label: "Employee Appreciation", href: "/employee-appreciation-cards" },
  { label: "Promotion Cards", href: "/promotion-cards" },
  { label: "Team Celebration Cards", href: "/team-celebration-cards" },
];

export default function SharedFooter() {
  return (
    <footer className="bg-[#2CB1A6] py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">

            {/* Logo & Description */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/cardoraLogo.png" alt="Cardora" width={160} height={48} className="h-10 w-auto" />
                <span className="text-xl font-bold text-white">Cardora</span>
              </div>
              <p className="text-sm text-white opacity-90 leading-relaxed">
                Beautiful digital cards for every celebration — solo or together.
              </p>
              <div className="flex gap-3 pt-1">
                <a href="#" className="w-8 h-8 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="Facebook">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="X">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="LinkedIn">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="Instagram">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/#features" className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">Features</Link></li>
                <li><Link href="/pricing" className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">Pricing</Link></li>
                <li><Link href="/templates" className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">Templates</Link></li>
                <li><Link href="/benefits/personal" className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">Personal</Link></li>
                <li><Link href="/benefits/corporate" className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">Corporate</Link></li>
                <li><Link href="/contact" className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">Contact Us</Link></li>
              </ul>
            </div>

            {/* Personal Cards */}
            <div>
              <h4 className="font-semibold text-white mb-4">Personal Cards</h4>
              <ul className="space-y-2">
                {PERSONAL_CARDS.map((card) => (
                  <li key={card.href}>
                    <Link href={card.href} className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">
                      {card.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Work Cards */}
            <div>
              <h4 className="font-semibold text-white mb-4">Work Cards</h4>
              <ul className="space-y-2">
                {WORK_CARDS.map((card) => (
                  <li key={card.href}>
                    <Link href={card.href} className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">
                      {card.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">Contact Us</Link></li>
                <li><Link href="/benefits/personal" className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">For Personal Use</Link></li>
                <li><Link href="/benefits/corporate" className="text-white opacity-80 hover:opacity-100 transition-opacity text-sm">For Teams</Link></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white border-opacity-20 pt-8 text-center">
            <p className="text-sm text-white opacity-90">&copy; 2026 Cardora. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
