import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import ValentinesHeroLottie from "./ValentinesHeroLottie";

const STEPS = [
  {
    number: "01",
    title: "Create your Valentine's card",
    description: "Choose a romantic template, personalise it with your own words, and make it as heartfelt or playful as you like.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Write from the heart — or invite the group",
    description: "Send a personal message just from you, or share a link so friends and family can all add their love together.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Surprise them at the perfect moment",
    description: "Deliver instantly or schedule it to arrive right at midnight on February 14th — a romantic surprise they won't forget.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
];

const FEATURES = [
  { emoji: "❤️", title: "Personal & heartfelt", description: "Write exactly what you feel in a beautifully designed card. No generic messages — your words, your way." },
  { emoji: "📸", title: "Photos, GIFs & videos", description: "Add a favourite photo together, a romantic GIF, or a heartfelt video message that says more than words alone." },
  { emoji: "⏰", title: "Schedule for February 14th", description: "Set it to arrive right at midnight on Valentine's Day — a perfect surprise waiting for them when they wake up." },
  { emoji: "👥", title: "Group cards for friends & family", description: "Valentine's Day isn't just for couples. Get a group together to send love to a friend, parent, or anyone who deserves it." },
  { emoji: "🎨", title: "Beautiful romantic templates", description: "Choose from stunning Valentine's Day designs and personalise fonts, colours, and layout to make it truly yours." },
  { emoji: "🔒", title: "Private & secure", description: "Only the recipient can see the card. A personal, intimate surprise kept just between you." },
];

const FAQS = [
  {
    question: "Can I send a Valentine's Day card online for free?",
    answer: "Yes, Cardora is completely free. Create a beautiful Valentine's Day card, personalise it, and send it with no credit card required.",
  },
  {
    question: "Can multiple people sign a Valentine's Day card?",
    answer: "Yes. Share one link and everyone can add their own message, photo, or GIF — without signing up. Perfect for a group card from friends, family, or a whole team.",
  },
  {
    question: "Can I schedule the Valentine's Day card delivery?",
    answer: "Absolutely. Set a specific date and time and Cardora will automatically deliver the card — perfect for surprising someone right at midnight on February 14th.",
  },
  {
    question: "Can I add photos and GIFs to the Valentine's card?",
    answer: "Yes. Add photos, romantic GIFs, or heartfelt videos to make the card truly personal and memorable.",
  },
  {
    question: "Is a Valentine's card just for romantic partners?",
    answer: "Not at all. Valentine's Day is a celebration of love in all forms — send a card to a best friend, a parent, a sibling, or anyone who means the world to you.",
  },
  {
    question: "Do recipients need to create an account to view the card?",
    answer: "No. The recipient simply clicks the link to open their card. No account, no app, no friction.",
  },
  {
    question: "Do contributors need to create an account?",
    answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required.",
  },
];

export default function ValentinesCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">

              {/* Left Content */}
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  ❤️ Valentine&apos;s Day Cards
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Create a Valentine&apos;s Day Card
                  <span className="text-[#2CB1A6]"> That Says It Perfectly</span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Write a heartfelt message for someone special, or invite friends and
                  family to share their love together. Beautiful, personal, and free —
                  no credit card needed.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=valentines_day">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                      Create a Valentine&apos;s Card ❤️
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
                    <span>Schedule for Feb 14th</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>Photos & GIFs included</span>
                  </div>
                </div>
              </div>

              {/* Right — Lottie animation */}
              <ValentinesHeroLottie />

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
              <p className="text-xl text-[#5B6B75]">A beautiful Valentine&apos;s card in three simple steps</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
      <section className="py-20 bg-gradient-to-br from-rose-50 via-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">
                Love comes in many forms
              </h2>
              <p className="text-xl text-[#5B6B75]">Valentine&apos;s Day is for everyone who matters to you</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "💑", title: "For your partner", description: "Say what you always mean to say but never quite find the words for. A personal, beautiful card that captures exactly how you feel — sent at midnight on February 14th." },
                { emoji: "👫", title: "From friends to a friend", description: "Galentine's Day is real. Get the whole friend group to sign a card for someone who deserves to feel loved this Valentine's Day." },
                { emoji: "👨‍👩‍👧", title: "From kids to parents — or parents to kids", description: "Sometimes the sweetest Valentine's cards are the family ones. A card from the whole family to mum, dad, or a grandparent means everything." },
                { emoji: "💌", title: "A secret admirer card", description: "Say what you feel anonymously or add a little mystery. Cardora lets you be as bold or as subtle as you like." },
                { emoji: "💼", title: "A workplace appreciation card", description: "Spread the love at the office. A light-hearted Valentine's card from the whole team to a manager or colleague is a fun way to celebrate the day." },
                { emoji: "🌍", title: "For someone far away", description: "Distance makes the heart grow fonder — and Cardora makes the card arrive perfectly. Schedule it to land right when they wake up on Valentine's Day." },
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
                Everything you need for the perfect Valentine&apos;s card
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex gap-4 p-6 bg-rose-50 rounded-2xl">
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
      <section className="py-20 bg-gradient-to-br from-rose-500 to-pink-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Say it with a card they&apos;ll never forget
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Heartfelt, beautiful, and completely free. Create your Valentine&apos;s card today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=valentines_day">
                <button className="px-10 py-4 bg-white hover:bg-rose-50 text-rose-600 text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  Create a Valentine&apos;s Card ❤️
                </button>
              </Link>
              <Link href="/templates">
                <button className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-rose-600 text-white text-lg rounded-lg font-semibold transition-all">
                  Explore Templates
                </button>
              </Link>
            </div>
            <p className="text-white opacity-70 text-sm mt-6">No credit card required · Schedule delivery for Feb 14th</p>
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
