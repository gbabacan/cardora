import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../../SharedFooter";
import BenefitsNav from "../BenefitsNav";
import CorporateHeroLottie from "./CorporateHeroLottie";
import CorporateBenefitsLotties from "./CorporateBenefitsLotties";

export default function CorporateBenefitsPage() {
  return (
    <div className="min-h-screen bg-white">
      <BenefitsNav variant="corporate" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B1F2A] to-[#1F8F86] py-8 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center">
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-xl mx-auto lg:mx-0">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                  Build a Culture Where Everyone Thrives
                  <span className="sr-only"> — Corporate Digital Greeting Cards for Teams</span>
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
              <CorporateHeroLottie />
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-20 bg-white relative overflow-hidden">
        <CorporateBenefitsLotties />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">The Power of Recognition at Scale</h2>
              <p className="text-xl text-[#5B6B75]">See how Cardora transforms your employee experience</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0"><svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                <div><h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Boost Employee Engagement</h3><p className="text-[#5B6B75] leading-relaxed">Engaged employees are 87% less likely to leave. Cardora makes recognition easy and meaningful, creating a workplace where people feel valued every day. Watch productivity soar as team members feel genuinely appreciated for their contributions.</p></div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0"><svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
                <div><h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Foster Multi-Directional Recognition</h3><p className="text-[#5B6B75] leading-relaxed">Recognition shouldn&apos;t just flow top-down. Enable peer-to-peer appreciation, upward recognition, and cross-team celebration. Build a culture where everyone feels empowered to acknowledge great work, creating stronger bonds across your entire organization.</p></div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0"><svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <div><h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Increase Retention &amp; Reduce Turnover</h3><p className="text-[#5B6B75] leading-relaxed">The cost of replacing an employee averages 6-9 months of their salary. Regular, heartfelt recognition makes employees feel valued and connected, dramatically reducing turnover. Invest in appreciation today, save on recruitment tomorrow.</p></div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0"><svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <div><h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Strengthen Company Culture</h3><p className="text-[#5B6B75] leading-relaxed">Culture isn&apos;t built in annual retreats—it&apos;s built in daily moments of recognition. Cardora helps you celebrate your values in action, reinforce desired behaviors, and create a positive environment where your culture truly comes alive.</p></div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0"><svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <div><h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Enhance Job Satisfaction</h3><p className="text-[#5B6B75] leading-relaxed">Employees who feel appreciated report higher job satisfaction, better work-life balance, and greater pride in their work. Happy employees don&apos;t just stay longer—they perform better, innovate more, and become your best advocates.</p></div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0"><svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
                <div><h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Drive Measurable Results</h3><p className="text-[#5B6B75] leading-relaxed">Recognition isn&apos;t just feel-good fluff—it&apos;s a business driver. Companies with strong recognition programs see 31% lower voluntary turnover, 12x higher productivity, and stronger bottom-line results. Recognition is an investment that pays dividends.</p></div>
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
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">Recognition That Flows Every Direction</h2>
              <p className="text-xl text-[#5B6B75]">Enable appreciation across your entire organization</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center mb-4"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Top-Down Recognition</h3><p className="text-[#5B6B75]">Managers and leaders acknowledge outstanding performance and reinforce company values.</p></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center mb-4"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg></div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Peer-to-Peer</h3><p className="text-[#5B6B75]">Teammates celebrate each other&apos;s wins, building trust and camaraderie across the organization.</p></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center mb-4"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg></div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Bottom-Up</h3><p className="text-[#5B6B75]">Team members recognize great leadership, fostering mutual respect and appreciation.</p></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center mb-4"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg></div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Cross-Functional</h3><p className="text-[#5B6B75]">Break down silos by celebrating collaboration between departments and teams.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">Perfect for Every Milestone</h2>
              <p className="text-xl text-[#5B6B75]">Celebrate what matters in your organization</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8"><div className="text-4xl mb-4">🎉</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Work Anniversaries</h3><p className="text-[#5B6B75]">Celebrate tenure with messages from across the company. Show long-term employees how much their dedication means.</p></div>
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8"><div className="text-4xl mb-4">🏆</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Project Launches</h3><p className="text-[#5B6B75]">Recognize the entire team&apos;s effort when a big project ships. Acknowledge everyone who contributed to success.</p></div>
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8"><div className="text-4xl mb-4">⭐</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Employee of the Month</h3><p className="text-[#5B6B75]">Make awards more meaningful with personalized messages from colleagues sharing specific examples.</p></div>
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8"><div className="text-4xl mb-4">👋</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Farewells &amp; Retirements</h3><p className="text-[#5B6B75]">Send teammates off with heartfelt messages they&apos;ll treasure. A beautiful keepsake of their impact.</p></div>
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8"><div className="text-4xl mb-4">🎯</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Goal Achievement</h3><p className="text-[#5B6B75]">Celebrate when teams hit their targets. Public recognition reinforces winning behaviors.</p></div>
              <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] rounded-2xl p-8"><div className="text-4xl mb-4">🌟</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Going Above &amp; Beyond</h3><p className="text-[#5B6B75]">Recognize exceptional effort that embodies your values. Make your culture visible and tangible.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#0B1F2A] to-[#1F8F86] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Recognition Drives Real Results</h2>
              <p className="text-xl opacity-90">The business impact of a strong recognition culture</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center"><div className="text-5xl font-bold mb-2">31%</div><p className="opacity-90">Lower voluntary turnover</p></div>
              <div className="text-center"><div className="text-5xl font-bold mb-2">2x</div><p className="opacity-90">Higher employee engagement</p></div>
              <div className="text-center"><div className="text-5xl font-bold mb-2">12x</div><p className="opacity-90">Better business outcomes</p></div>
              <div className="text-center"><div className="text-5xl font-bold mb-2">56%</div><p className="opacity-90">Less likely to job hunt</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-6">Ready to Transform Your Culture?</h2>
            <p className="text-xl text-[#5B6B75] mb-8">Start building a workplace where recognition is part of everyday life. Your team will thank you for it.</p>
            <Link href="/boards/create">
              <button className="px-10 py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create a Cardora</button>
            </Link>
          </div>
        </div>
      </section>
      <SharedFooter />
    </div>
  );
}
