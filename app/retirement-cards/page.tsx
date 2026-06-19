import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import RetirementHeroLottie from "./RetirementHeroLottie";

const FAQS = [
  { question: "Can I send a retirement card by myself, without inviting others?", answer: "Absolutely. Write your own heartfelt retirement message, customise the design, and send it. No need to involve anyone else." },
  { question: "Is Cardora free for retirement cards?", answer: "Yes, completely free. Create a retirement card, invite unlimited contributors, and send it with no credit card required." },
  { question: "Can the whole team sign a retirement card together?", answer: "Yes. Share one link and everyone adds their own message, photo, or GIF — without signing up. A retirement card signed by the whole team is something they'll keep forever." },
  { question: "Can I schedule the retirement card delivery?", answer: "Yes. Schedule it to arrive on their last day, the morning they retire, or any moment that feels perfect." },
  { question: "Does it work for remote teams?", answer: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules." },
  { question: "Do contributors need to create an account?", answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." },
];

export default function RetirementCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-50 via-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  🏖️ Retirement Cards
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Create a Retirement Card —
                  <span className="text-[#2CB1A6]"> A Send-Off Worth Remembering</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Celebrate a career&apos;s worth of dedication. Write a heartfelt message yourself or invite the whole team to share their memories, gratitude, and well-wishes. Free — no credit card needed.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=farewell">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create a Retirement Card 🏖️</button>
                  </Link>
                  <Link href="/templates">
                    <button className="px-8 py-3.5 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] border-2 border-[#2CB1A6] text-base lg:text-lg rounded-lg font-semibold transition-all">Explore Templates</button>
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
              <RetirementHeroLottie />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">The send-off they truly deserve</h2>
              <p className="text-xl text-[#5B6B75]">After years of dedication, a card that captures it all</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "💌", title: "A personal farewell from you", description: "Write exactly what you want to say — the memories, the gratitude, the admiration. A personal message from one person who means it is something they'll read again and again." },
                { emoji: "👥", title: "From the whole team", description: "Everyone who worked alongside them adds their message — a shared memory, something they taught, a moment that defined their legacy. The card becomes a lifetime keepsake." },
                { emoji: "🏢", title: "From leadership or HR", description: "A retirement card from the organisation's leadership carries real weight. Acknowledge the career, the contribution, and the person behind the role." },
                { emoji: "🌍", title: "For a remote colleague", description: "They may have worked from a different city or country — but their retirement deserves just as warm a send-off. One link, everyone contributes." },
                { emoji: "🎓", title: "Long-service recognition", description: "20, 30, 40 years of loyalty and hard work — celebrate the length of the journey as much as the destination." },
                { emoji: "🥂", title: "Alongside a retirement party", description: "Whether there&apos;s a party or not, a card filled with personal messages is the one retirement gift that lasts well beyond the day itself." },
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Everything you need for a retirement card worth keeping</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: "✍️", title: "Solo or group — your choice", description: "Write a personal farewell yourself or collect memories and messages from the whole team. Both create something truly meaningful." },
                { emoji: "📸", title: "Photos, GIFs & videos", description: "Add team photos, throwbacks, or a heartfelt video message. Turn the card into a keepsake they&apos;ll return to for years." },
                { emoji: "⏰", title: "Schedule for their last day", description: "Set it up ahead of time and schedule delivery for their final morning — a warm surprise to start the next chapter." },
                { emoji: "🌍", title: "Works across any distance", description: "Team or family spread across the globe? One link, everyone contributes at their own pace." },
                { emoji: "🎨", title: "Beautiful templates", description: "Choose from professionally designed retirement card templates and personalise fonts, colours, and layout." },
                { emoji: "🔒", title: "Private & secure", description: "Only the recipient sees the card. A personal, meaningful farewell kept just for them." },
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
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Honour a career the way it deserves</h2>
            <p className="text-xl text-white opacity-90 mb-8">Write it yourself or get everyone to share their memories. Either way, it&apos;ll be the retirement gift they treasure most.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=farewell">
                <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create a Retirement Card 🏖️</button>
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
