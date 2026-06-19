import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import WorkAnniversaryHeroLottie from "./WorkAnniversaryHeroLottie";

const FAQS = [
  { question: "Can I send a work anniversary card by myself, without inviting others?", answer: "Absolutely. Write your own personal message, customise the design, and send it. No need to involve anyone else." },
  { question: "Is Cardora free for work anniversary cards?", answer: "Yes, completely free. Create a work anniversary card, invite unlimited contributors, and send it with no credit card required." },
  { question: "Can the whole team sign a work anniversary card?", answer: "Yes. Share one link and everyone can add their own message, photo, or GIF — without signing up. Perfect for celebrating a colleague's milestone with the whole team." },
  { question: "Can I schedule the work anniversary card delivery?", answer: "Yes. Schedule it to arrive on the exact anniversary date — even if you set it up weeks in advance." },
  { question: "Does it work for remote teams?", answer: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules." },
  { question: "Do contributors need to create an account?", answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." },
];

export default function WorkAnniversaryCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  📅 Work Anniversary Cards
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Create a Work Anniversary Card —
                  <span className="text-[#2CB1A6]"> From You or the Whole Team</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Recognise a colleague&apos;s loyalty and dedication with a card that actually means something. Write it yourself or invite everyone to share their appreciation. Free — no credit card needed.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=work-anniversary">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                      Create an Anniversary Card 📅
                    </button>
                  </Link>
                  <Link href="/templates">
                    <button className="px-8 py-3.5 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] border-2 border-[#2CB1A6] text-base lg:text-lg rounded-lg font-semibold transition-all">
                      Explore Templates
                    </button>
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-[#5B6B75]">
                  {["100% Free", "No sign-up for contributors", "Schedule delivery"].map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <WorkAnniversaryHeroLottie />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Perfect for every work anniversary</h2>
              <p className="text-xl text-[#5B6B75]">From 1 year to 25 — every milestone deserves recognition</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "🥇", title: "1-year anniversary", description: "The first year is a milestone worth celebrating. Welcome them as a real part of the team with a card that shows they made an impact from day one." },
                { emoji: "🏆", title: "5 or 10-year milestone", description: "Half a decade or more of dedication — this deserves more than a handshake. A card filled with messages from the whole team makes the moment unforgettable." },
                { emoji: "👑", title: "Long-service recognition", description: "For the person who has been there through everything — the growth, the change, the wins. Give them a card as lasting as their loyalty." },
                { emoji: "👔", title: "From a manager to a team member", description: "A personal message from a manager acknowledging the years, the effort, and the impact carries real weight. Write it yourself, make it specific, make it meaningful." },
                { emoji: "👥", title: "From the whole team", description: "Everyone adds their message — memories shared, things learned, moments that defined the working relationship. The result is a card unlike any gift." },
                { emoji: "🌍", title: "For a remote colleague", description: "Distance makes recognition even more important. One link, your whole team contributes — no timezone headaches, no coordination required." },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5EAF0]">
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <h3 className="text-lg font-bold text-[#0B1F2A] mb-2">{item.title}</h3>
                  <p className="text-[#5B6B75] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Everything you need for a meaningful anniversary card</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: "✍️", title: "Solo or group — your choice", description: "Write a personal recognition yourself or collect appreciation from the whole team. Both feel genuine and lasting." },
                { emoji: "📸", title: "Photos, GIFs & videos", description: "Add team photos, throwbacks, or heartfelt video messages. Turn the card into a keepsake worth keeping." },
                { emoji: "⏰", title: "Schedule for the exact date", description: "Set it up weeks ahead and schedule delivery for the exact anniversary date — never miss the moment." },
                { emoji: "🌍", title: "Works for remote teams", description: "One link reaches your whole distributed team — everyone contributes at their own pace." },
                { emoji: "🎨", title: "Professional templates", description: "Choose from beautifully designed anniversary templates and personalise fonts, colours, and layout." },
                { emoji: "🔒", title: "Private & secure", description: "Only the recipient can see the card. A personal recognition kept just for them." },
              ].map((f) => (
                <div key={f.title} className="flex gap-4 p-6 bg-[#F7FAFC] rounded-2xl">
                  <span className="text-2xl flex-shrink-0">{f.emoji}</span>
                  <div><h3 className="font-bold text-[#0B1F2A] mb-1">{f.title}</h3><p className="text-[#5B6B75] text-sm leading-relaxed">{f.description}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Make their anniversary feel as big as their contribution</h2>
            <p className="text-xl text-white opacity-90 mb-8">Write it yourself or get the whole team to celebrate. Either way, they&apos;ll feel truly valued.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=work-anniversary">
                <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create an Anniversary Card 📅</button>
              </Link>
              <Link href="/templates">
                <button className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-[#2CB1A6] text-white text-lg rounded-lg font-semibold transition-all">Explore Templates</button>
              </Link>
            </div>
            <p className="text-white opacity-70 text-sm mt-6">No credit card required · No sign-up for contributors</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Frequently asked questions</h2></div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.question} className="bg-[#F7FAFC] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#0B1F2A] mb-2">{faq.question}</h3>
                  <p className="text-[#5B6B75] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SharedFooter />
    </div>
  );
}
