import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import GraduationHeroLottie from "./GraduationHeroLottie";

const STEPS = [
  {
    number: "01",
    title: "Create your graduation card",
    description: "Choose a template, personalise it, and decide: write a proud message yourself or get the whole class and family involved.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Go solo or invite the class",
    description: "Writing alone? Add your message and you're done. Getting everyone involved? Share one link — no sign-up needed for contributors.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Deliver on graduation day",
    description: "Send it instantly or schedule it to arrive on graduation day itself — a surprise that captures the moment perfectly.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
];

const FEATURES = [
  { emoji: "✍️", title: "Solo or group — your choice", description: "Write a personal congratulations yourself or collect messages from the whole class, family, or team. Both feel genuinely special." },
  { emoji: "📸", title: "Photos, GIFs & videos", description: "Add shared memories, campus photos, funny GIFs, or heartfelt video messages. Create a keepsake they'll look back on for years." },
  { emoji: "⏰", title: "Schedule delivery", description: "Time it perfectly — deliver the card on graduation day, the night before, or at any moment that feels just right." },
  { emoji: "🌍", title: "Works across distances", description: "Classmates, teachers, and family spread across the country? One link, everyone contributes at their own pace." },
  { emoji: "🎨", title: "Beautiful templates", description: "Choose from professionally designed graduation templates and personalise fonts, colours, and layout to match the occasion." },
  { emoji: "🔒", title: "Private & secure", description: "Only people with the link can see the card. Keep it a surprise until the perfect moment." },
];

const FAQS = [
  {
    question: "Can I send a graduation card by myself, without inviting others?",
    answer: "Absolutely. Cardora works perfectly for solo graduation cards — write your own proud message, customise the design, and send it. No need to involve anyone else.",
  },
  {
    question: "Is Cardora free for graduation cards?",
    answer: "Yes, Cardora is completely free. Create a graduation card, invite unlimited contributors, and send it with no credit card required.",
  },
  {
    question: "Can a whole class or team send a graduation card together?",
    answer: "Yes. Share one link and everyone — classmates, teachers, colleagues, family — can add their own message, photo, or GIF without signing up.",
  },
  {
    question: "Can I schedule the graduation card delivery?",
    answer: "Yes. Set a specific date and time and Cardora will automatically deliver the card — perfect for sending it on graduation day itself or as a surprise the night before.",
  },
  {
    question: "Can contributors add photos and GIFs?",
    answer: "Yes. Each contributor can add text messages, photos, GIFs, and videos — turning the graduation card into a rich keepsake full of shared memories.",
  },
  {
    question: "Does it work for online or remote groups?",
    answer: "Perfectly. Whether classmates are spread across the country or colleagues are remote, one link lets everyone contribute at their own pace from anywhere.",
  },
  {
    question: "Do contributors need to create an account?",
    answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required.",
  },
];

export default function GraduationCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">

              {/* Left Content */}
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  🎓 Graduation Cards
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Create a Graduation Card —
                  <span className="text-[#2CB1A6]"> From You or the Whole Class</span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Celebrate years of hard work and dedication. Write a proud message yourself
                  or invite classmates, teachers, and family to sign together.
                  Free — no credit card needed.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=graduation">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                      Create a Graduation Card 🎓
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

              {/* Right — Lottie animation */}
              <GraduationHeroLottie />

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
              <p className="text-xl text-[#5B6B75]">A memorable graduation card in three simple steps</p>
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
                Perfect for every graduation moment
              </h2>
              <p className="text-xl text-[#5B6B75]">From high school to doctorate — every milestone deserves a card worth keeping</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "💌", title: "A personal message from you", description: "Write exactly what you want to say — pride, joy, a shared memory, advice for the road ahead. A personal message from one person who means it is always treasured." },
                { emoji: "🏫", title: "From the whole class", description: "Organise a group card from all classmates. Share one link and everyone adds their message, a favourite memory, or a funny inside joke — no chasing anyone down." },
                { emoji: "👨‍👩‍👧", title: "From family & friends", description: "Grandparents, siblings, old friends — gather everyone's pride and well-wishes in one beautiful card. A keepsake they'll return to long after the ceremony." },
                { emoji: "👩‍🏫", title: "From teachers or mentors", description: "A card from the people who helped them get there. Teachers, tutors, mentors — collect their words of wisdom and congratulations in one meaningful place." },
                { emoji: "💼", title: "From work colleagues", description: "A colleague just finished their degree while working. Celebrate their dedication with a card from the whole team — they&apos;ll never forget that their effort was noticed." },
                { emoji: "🎓", title: "For any degree or milestone", description: "High school, university, MBA, PhD — every graduation is worth celebrating. Cardora works for any level, any subject, any achievement." },
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
                Everything you need for a graduation card worth keeping
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
              Celebrate the achievement they&apos;ve worked so hard for
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Write it yourself or get everyone to share their pride. Either way, it&apos;ll be something they keep forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=graduation">
                <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  Create a Graduation Card 🎓
                </button>
              </Link>
              <Link href="/templates">
                <button className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-[#2CB1A6] text-white text-lg rounded-lg font-semibold transition-all">
                  Explore Templates
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
