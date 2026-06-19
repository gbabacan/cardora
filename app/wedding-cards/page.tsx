import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import WeddingHeroLottie from "./WeddingHeroLottie";

const FAQS = [
  { question: "Can I send a wedding card by myself, without inviting others?", answer: "Absolutely. Write your own heartfelt wedding message, choose a beautiful design, and send it. No need to involve anyone else." },
  { question: "Is Cardora free for wedding cards?", answer: "Yes, completely free. Create a wedding card, invite unlimited contributors, and send it with no credit card required." },
  { question: "Can multiple guests sign a wedding card together?", answer: "Yes. Share one link and all guests can add their own message, photo, or GIF — without signing up. A beautiful digital guestbook alternative." },
  { question: "Can I schedule the wedding card delivery?", answer: "Yes. Schedule it to arrive on the wedding day, the night before, or any moment that feels just right." },
  { question: "Can contributors add photos and GIFs?", answer: "Yes. Each contributor can add messages, photos, GIFs, and videos — creating a rich wedding keepsake the couple will treasure forever." },
  { question: "Do contributors need to create an account?", answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." },
];

export default function WeddingCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  💍 Wedding Cards
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Create a Wedding Card —
                  <span className="text-[#2CB1A6]"> From You or All the Guests</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Write a heartfelt message for the happy couple yourself, or invite all guests to sign together — adding messages, photos, and GIFs. A beautiful digital alternative to a guestbook. Free.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=wedding">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create a Wedding Card 💍</button>
                  </Link>
                  <Link href="/templates">
                    <button className="px-8 py-3.5 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] border-2 border-[#2CB1A6] text-base lg:text-lg rounded-lg font-semibold transition-all">Explore Templates</button>
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-[#5B6B75]">
                  {["100% Free", "No sign-up for contributors", "Schedule for the big day"].map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <WeddingHeroLottie />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">The wedding card that goes beyond paper</h2>
              <p className="text-xl text-[#5B6B75]">A keepsake the couple will return to for years</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "💌", title: "A personal message from you", description: "Write exactly what you want to say to the happy couple — your love, your advice, your wishes for their future. Personal, heartfelt, and beautifully presented." },
                { emoji: "👰", title: "Digital guestbook alternative", description: "Invite all wedding guests to sign one card. Everyone adds their message, a memory, a photo, or their best marriage advice — no paper, no pen, no collecting." },
                { emoji: "🌍", title: "For guests who can't attend", answer: "Some guests can't make it in person. A group digital card lets them still send their love — contributing just as meaningfully from anywhere in the world." },
                { emoji: "💐", title: "From the wedding party", description: "The bridesmaids, groomsmen, or closest friends sign one beautiful card together — a personal keepsake from the people who stood beside them on the day." },
                { emoji: "🎉", title: "Bridal shower or hen party card", description: "Organise the whole group to sign a card for the bride-to-be. Share one link, everyone adds their message and a fun GIF — delivered right to her." },
                { emoji: "💑", title: "From the whole family", description: "Grandparents, parents, cousins — gather the whole family&apos;s love and wishes in one card. A family wedding card they&apos;ll treasure alongside the photos." },
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Everything you need for a wedding card they&apos;ll keep forever</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: "✍️", title: "Solo or group — your choice", description: "Write a personal message yourself or invite all guests to contribute. Both create a card the couple will treasure long after the wedding." },
                { emoji: "📸", title: "Photos, GIFs & videos", description: "Add favourite photos, wedding GIFs, or heartfelt video messages. Create a rich multimedia keepsake the couple will revisit for years." },
                { emoji: "⏰", title: "Schedule for the wedding day", description: "Set it up in advance and schedule delivery for the morning of the wedding — a beautiful surprise to start the day." },
                { emoji: "🌍", title: "Reaches guests anywhere", description: "Share one link and guests from across the world can contribute at their own pace — no matter where they are." },
                { emoji: "🎨", title: "Beautiful wedding templates", description: "Choose from elegant, romantic designs and personalise fonts, colours, and layout to match the wedding style." },
                { emoji: "🔒", title: "Private & secure", description: "Only the couple sees the card. A personal, intimate gift kept just for them." },
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
      <section className="py-20 bg-gradient-to-br from-pink-500 to-rose-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Give the happy couple a wedding card they&apos;ll never forget</h2>
            <p className="text-xl text-white opacity-90 mb-8">Write it yourself or invite everyone to share their love. Either way, it&apos;ll be the wedding gift they return to again and again.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=wedding">
                <button className="px-10 py-4 bg-white hover:bg-pink-50 text-pink-700 text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create a Wedding Card 💍</button>
              </Link>
              <Link href="/templates">
                <button className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-pink-700 text-white text-lg rounded-lg font-semibold transition-all">Explore Templates</button>
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
