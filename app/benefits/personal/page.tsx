import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../../SharedFooter";
import BenefitsNav from "../BenefitsNav";
import PersonalHeroLottie from "./PersonalHeroLottie";
import PersonalBenefitsLotties from "./PersonalBenefitsLotties";

export default function PersonalBenefitsPage() {
  return (
    <div className="min-h-screen bg-white">
      <BenefitsNav variant="personal" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center">
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#2CB1A6] rounded-3xl flex items-center justify-center mb-5 shadow-xl mx-auto lg:mx-0">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Celebrate Every Moment Together
                  <span className="sr-only"> — Personal Digital Greeting Cards for Every Occasion</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Transform ordinary occasions into extraordinary memories. Cardora makes it easy to gather heartfelt messages from everyone who matters.
                </p>
                <Link href="/boards/create">
                  <button className="px-8 py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                    Create a Cardora
                  </button>
                </Link>
              </div>
              <PersonalHeroLottie />
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-20 bg-white relative overflow-hidden">
        <PersonalBenefitsLotties />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">Why Cardora for Personal Celebrations?</h2>
              <p className="text-xl text-[#5B6B75]">The perfect way to make someone feel truly special</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Connect Across Any Distance</h3>
                  <p className="text-[#5B6B75] leading-relaxed">Distance doesn&apos;t matter anymore. Whether your friends and family are across town or around the globe, everyone can contribute to one beautiful, unified card. No more coordinating schedules or shipping physical cards—just share a link and watch the love pour in.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Perfect Timing, Every Time</h3>
                  <p className="text-[#5B6B75] leading-relaxed">Schedule your card to be delivered at the exact right moment. Wake them up on their birthday with heartfelt wishes, surprise them during a difficult time, or celebrate a milestone right when it happens. Set it and forget it—we&apos;ll make sure it arrives perfectly.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Rich Multimedia Memories</h3>
                  <p className="text-[#5B6B75] leading-relaxed">Words are wonderful, but sometimes you need more. Add photos from cherished moments, funny GIFs that capture inside jokes, or videos with heartfelt messages. Create a multi-dimensional keepsake that truly captures the depth of your relationships and shared experiences.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Stunning Personalization</h3>
                  <p className="text-[#5B6B75] leading-relaxed">Choose from hundreds of professionally designed templates tailored to every occasion imaginable. Customize colors, fonts, and layouts to match the recipient&apos;s personality perfectly. Make it elegant, playful, sentimental, or silly—the choice is yours.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Forever Keepsake</h3>
                  <p className="text-[#5B6B75] leading-relaxed">Unlike physical cards that get misplaced or damaged, Cardora cards live forever in the cloud. Recipients can revisit their card whenever they need a boost, download it for safekeeping, or share it with others. These memories won&apos;t fade with time.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#A7E8E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Effortlessly Simple</h3>
                  <p className="text-[#5B6B75] leading-relaxed">Creating a Cardora takes minutes, not hours. No design skills needed, no complicated software to learn. Pick a template, add your personal touch, invite contributors, and you&apos;re done. Spend less time organizing and more time celebrating.</p>
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
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">Perfect for Every Occasion</h2>
              <p className="text-xl text-[#5B6B75]">Whatever you&apos;re celebrating, Cardora makes it memorable</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="text-4xl mb-4">🎂</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Birthdays</h3><p className="text-[#5B6B75]">Gather wishes from everyone who loves them. Include childhood photos, funny memories, and heartfelt messages that&apos;ll make them cry happy tears.</p></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="text-4xl mb-4">💍</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Weddings</h3><p className="text-[#5B6B75]">Create a beautiful guestbook alternative where wedding guests can share their love, advice, and well-wishes for the happy couple.</p></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="text-4xl mb-4">🎓</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Graduations</h3><p className="text-[#5B6B75]">Celebrate their achievement with messages of pride and encouragement from teachers, classmates, and family as they start a new chapter.</p></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="text-4xl mb-4">👶</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">New Baby</h3><p className="text-[#5B6B75]">Welcome the newest family member with love and advice from everyone who can&apos;t wait to meet them. A keepsake they&apos;ll treasure forever.</p></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="text-4xl mb-4">💪</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Get Well Soon</h3><p className="text-[#5B6B75]">Lift their spirits during tough times with encouraging messages, funny stories, and reminders that they&apos;re loved and missed.</p></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg"><div className="text-4xl mb-4">❤️</div><h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Just Because</h3><p className="text-[#5B6B75]">Sometimes the best surprises come for no reason at all. Show someone they&apos;re appreciated and thought of, even on an ordinary day.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Create Something Special?</h2>
            <p className="text-xl text-white opacity-90 mb-8">Start celebrating life&apos;s beautiful moments with the people you love. Create your first Cardora in minutes—completely free.</p>
            <Link href="/boards/create">
              <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create a Cardora</button>
            </Link>
          </div>
        </div>
      </section>
      <SharedFooter />
    </div>
  );
}
