import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import BirthdayHeroLottie from "./BirthdayHeroLottie";

const STEPS = [
  {
    number: "01",
    title: "Create your card",
    description: "Choose a birthday template and personalise it. Then decide: write a heartfelt message yourself, or invite others to join.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Go solo or invite the group",
    description: "Writing alone? Add your message and move on. Getting everyone involved? Share one link — no sign-up needed for contributors.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Send it at the perfect moment",
    description: "Deliver instantly or schedule it to arrive right at midnight on their birthday. We handle the rest.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
];

const FEATURES = [
  { emoji: "✍️", title: "Solo or group — your choice", description: "Write a personal message yourself or invite your whole team. Both options are equally beautiful." },
  { emoji: "📸", title: "Photos, GIFs & videos", description: "Add memories, funny GIFs, or heartfelt videos — whether it's just you or a whole group contributing." },
  { emoji: "⏰", title: "Schedule delivery", description: "Set a date and time. The card arrives automatically — even at midnight on their birthday." },
  { emoji: "🌍", title: "Works for remote teams", description: "Your team is spread across the world? Doesn't matter. One link reaches everyone." },
  { emoji: "🎨", title: "Beautiful templates", description: "Dozens of birthday-themed designs to choose from. Personalise fonts, colours, and more." },
  { emoji: "🔒", title: "Private & secure", description: "Only people with the link can see the card. Share with confidence." },
];

const FAQS = [
  {
    question: "Can I send a birthday card by myself, without inviting others?",
    answer: "Absolutely. Cardora works perfectly for solo cards too — write your own message, customise the design, and send it. No need to invite anyone else.",
  },
  {
    question: "Is Cardora free for birthday cards?",
    answer: "Yes, Cardora is completely free. Whether you're sending solo or with a group, you can create a birthday card and send it with no credit card required.",
  },
  {
    question: "Can multiple people sign the birthday card?",
    answer: "Yes. Share one link and everyone can add their own message, photo, or GIF — without signing up. Perfect for teams and friend groups of any size.",
  },
  {
    question: "Can I schedule the birthday card delivery?",
    answer: "Absolutely. Set a specific date and time and Cardora will automatically deliver the card — perfect for surprising someone right at midnight on their birthday.",
  },
  {
    question: "Can contributors add photos and GIFs?",
    answer: "Yes. Each contributor — or just you — can add text messages, photos, GIFs, and videos. The result is a rich, multimedia birthday card they'll love.",
  },
  {
    question: "Does it work for remote teams?",
    answer: "Perfectly. Cardora was built for exactly this — just share a link and your whole team can contribute from anywhere in the world, no matter the timezone.",
  },
  {
    question: "Do contributors need to create an account?",
    answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required.",
  },
];

export default function BirthdayCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">

              {/* Left Content */}
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  🎂 Birthday Cards
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Create a Birthday Card —
                  <span className="text-[#2CB1A6]"> Send Solo or Get Everyone to Sign</span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Write a heartfelt message yourself, or invite your whole team to contribute.
                  Add photos, GIFs, and videos. Schedule delivery for the perfect moment.
                  Free — no credit card needed.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=birthday">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                      Create a Birthday Card 🎂
                    </button>
                  </Link>
                  <Link href="/templates">
                    <button className="px-8 py-3.5 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] border-2 border-[#2CB1A6] text-base lg:text-lg rounded-lg font-semibold transition-all">
                      Explore Templates
                    </button>
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-[#5B6B75]">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>No sign-up for contributors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>Schedule delivery</span>
                  </div>
                </div>
              </div>

              {/* Right — Lottie animation (client component) */}
              <BirthdayHeroLottie />

            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">How it works</h2>
              <p className="text-xl text-[#5B6B75]">A beautiful birthday card in three simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="text-5xl font-bold text-[#E5EAF0] mb-2">{step.number}</div>
                  <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">{step.title}</h3>
                  <p className="text-[#5B6B75] leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">
                Perfect for every birthday situation
              </h2>
              <p className="text-xl text-[#5B6B75]">Whether you&apos;re sending alone or organising the whole group</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "💌", title: "A personal message from you", description: "Sometimes the most meaningful card is just one person saying exactly the right thing. Write your message, choose a beautiful design, and send it." },
                { emoji: "👔", title: "Manager to team member", description: "A personal birthday message from a manager means a lot. Write something thoughtful, add a photo, and make that team member feel truly seen." },
                { emoji: "💼", title: "Coworker birthday", description: "Get the whole office to sign without chasing anyone down. Share one link on Slack or Teams and watch the messages roll in." },
                { emoji: "🌍", title: "Remote team birthday", description: "Your team is spread across time zones? No problem. Everyone contributes at their own pace from anywhere in the world." },
                { emoji: "👨‍👩‍👧", title: "Family & friends", description: "Bring the whole family together for a surprise birthday card. Cousins, grandparents, old school friends — one link reaches everyone." },
                { emoji: "🏫", title: "Teacher or mentor", description: "The whole class signs one beautiful card for a teacher&apos;s birthday. Personal, meaningful, and so much better than a generic gift." },
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

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">
                Everything you need for a great birthday card
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex gap-4 p-6 bg-[#F7FAFC] rounded-2xl">
                  <span className="text-2xl flex-shrink-0">{feature.emoji}</span>
                  <div>
                    <h3 className="font-bold text-[#0B1F2A] mb-1">{feature.title}</h3>
                    <p className="text-[#5B6B75] text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to make someone&apos;s birthday unforgettable?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Write it yourself or get everyone involved. Either way, it&apos;ll be beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cards/editor">
                <button className="px-8 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  ✍️ Create Solo Card
                </button>
              </Link>
              <Link href="/boards/create?occasion=birthday">
                <button className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-[#2CB1A6] text-white text-lg rounded-lg font-semibold transition-all">
                  👥 Create Group Card
                </button>
              </Link>
            </div>
            <p className="text-white opacity-70 text-sm mt-6">No credit card required · No sign-up for contributors</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Frequently asked questions</h2>
            </div>
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
