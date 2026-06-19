import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import ChristmasHeroLottie from "./ChristmasHeroLottie";

const FAQS = [
  { question: "Can I send a Christmas card by myself, without inviting others?", answer: "Absolutely. Write your own warm Christmas message, customise the design, and send it. No need to involve anyone else." },
  { question: "Is Cardora free for Christmas cards?", answer: "Yes, completely free. Create a Christmas card, invite unlimited contributors, and send it with no credit card required." },
  { question: "Can a whole team send a Christmas card together?", answer: "Yes. Share one link and everyone adds their own message, photo, or GIF — without signing up. Perfect for a team Christmas card to a manager, client, or colleague." },
  { question: "Can I schedule the Christmas card delivery?", answer: "Yes. Schedule it to arrive on Christmas morning, Christmas Eve, or any date that feels right — even if you create it weeks in advance." },
  { question: "Does it work for remote teams?", answer: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules." },
  { question: "Do contributors need to create an account?", answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." },
];

export default function ChristmasCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-red-50 via-green-50 to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  🎄 Christmas Cards
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Create a Group Christmas Card —
                  <span className="text-[#2CB1A6]"> Everyone Signs, One Beautiful Card</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Send a heartfelt Christmas message yourself or get the whole team, family, or friend group to sign together. Add photos and GIFs. Schedule it for Christmas morning. Free — no credit card needed.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=christmas">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                      Create a Christmas Card 🎄
                    </button>
                  </Link>
                  <Link href="/templates">
                    <button className="px-8 py-3.5 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] border-2 border-[#2CB1A6] text-base lg:text-lg rounded-lg font-semibold transition-all">
                      Explore Templates
                    </button>
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-[#5B6B75]">
                  {["100% Free", "No sign-up for contributors", "Schedule for Dec 25th"].map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ChristmasHeroLottie />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Perfect for every Christmas occasion</h2>
              <p className="text-xl text-[#5B6B75]">Better than a generic card, more personal than a group email</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "💼", title: "Team Christmas card", description: "Get everyone in the office to sign one beautiful card — for a manager, a colleague, or the whole team. Share one link, messages pour in, no chasing anyone." },
                { emoji: "👨‍👩‍👧", title: "Family Christmas card", description: "Gather the whole family in one card. Grandparents, cousins, siblings spread across the country — all signing one heartfelt message for someone they love." },
                { emoji: "🎅", title: "Secret Santa card", description: "Going along with a Secret Santa? Send a warm Christmas card alongside the gift — or instead of one — for a personal touch that&apos;ll be remembered." },
                { emoji: "🏢", title: "Company-wide holiday message", description: "Leadership sending season&apos;s greetings to the whole company? Collect personal messages from the leadership team and deliver something that feels genuinely warm." },
                { emoji: "🌍", title: "Remote team Christmas card", description: "Your team is spread across time zones. One link, everyone contributes — a group Christmas card that brings the whole distributed team together for a moment." },
                { emoji: "💌", title: "A personal Christmas message", description: "Sometimes you just want to write something personal and beautiful for someone who matters. No group needed — just you, your words, and a stunning design." },
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Everything you need for the perfect Christmas card</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: "✍️", title: "Solo or group — your choice", description: "Write a warm message yourself or get the whole team, class, or family to sign. Both create something genuinely special." },
                { emoji: "📸", title: "Photos, GIFs & videos", description: "Add Christmas photos, festive GIFs, or a video message. Make the card feel like a real celebration." },
                { emoji: "⏰", title: "Schedule for Christmas morning", description: "Create it now, set it to arrive on December 25th — a warm surprise waiting for them when they wake up." },
                { emoji: "🌍", title: "Works across any distance", description: "Family or team spread across the world? One link, everyone contributes at their own pace." },
                { emoji: "🎨", title: "Festive templates", description: "Choose from beautiful Christmas designs and personalise fonts, colours, and layout to match your style." },
                { emoji: "🔒", title: "Private & secure", description: "Only the recipient sees the card. A warm, personal surprise kept just for them." },
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
      <section className="py-20 bg-gradient-to-br from-red-600 to-green-700">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Spread the Christmas spirit — beautifully</h2>
            <p className="text-xl text-white opacity-90 mb-8">Write it yourself or get everyone to join in. Either way, it&apos;ll be a Christmas card they actually keep.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=christmas">
                <button className="px-10 py-4 bg-white hover:bg-red-50 text-red-700 text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create a Christmas Card 🎄</button>
              </Link>
              <Link href="/templates">
                <button className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-red-700 text-white text-lg rounded-lg font-semibold transition-all">Explore Templates</button>
              </Link>
            </div>
            <p className="text-white opacity-70 text-sm mt-6">No credit card required · No sign-up for contributors · Schedule for Dec 25th</p>
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
