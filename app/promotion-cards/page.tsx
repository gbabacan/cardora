import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import PromotionHeroLottie from "./PromotionHeroLottie";

const STEPS = [
  {
    number: "01",
    title: "Create the promotion card",
    description: "Choose a professional template, personalise the design, and decide: write a message yourself or rally the whole team to celebrate together.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Go solo or invite the team",
    description: "Writing alone? Add your message and you're done. Getting everyone involved? Share one link — no sign-up needed for contributors.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Deliver at the right moment",
    description: "Send it the moment the promotion is announced, on their first day in the new role, or schedule it as a perfectly timed surprise.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
];

const FEATURES = [
  { emoji: "✍️", title: "Solo or group — your choice", description: "Write a personal congratulations from you alone or collect celebration messages from the entire team. Both make an impact." },
  { emoji: "📸", title: "Photos, GIFs & videos", description: "Add team photos, celebratory GIFs, or heartfelt video messages. Make the promotion card a keepsake, not just a card." },
  { emoji: "⏰", title: "Schedule delivery perfectly", description: "Time it to arrive exactly when the promotion is announced, on their first day, or as a surprise they won't see coming." },
  { emoji: "🌍", title: "Works for remote teams", description: "Team spread across time zones? No problem. One link, everyone contributes — no coordinating schedules required." },
  { emoji: "🎨", title: "Professional templates", description: "Choose from beautifully designed promotion card templates and personalise fonts, colours, and layout to match your company culture." },
  { emoji: "🔒", title: "Private & secure", description: "Only the recipient can see the card. Keep the celebration a surprise until the perfect moment." },
];

const FAQS = [
  {
    question: "Can I send a promotion card by myself, without inviting others?",
    answer: "Absolutely. Cardora works perfectly for solo promotion cards — write a proud message from you, customise the design, and send it. No need to involve anyone else.",
  },
  {
    question: "Is Cardora free for employee promotion cards?",
    answer: "Yes, Cardora is completely free. Create a promotion card, invite unlimited contributors, and send it with no credit card required.",
  },
  {
    question: "Can the whole team sign a promotion card together?",
    answer: "Yes. Share one link and every team member can add their own message, photo, or GIF — without signing up. A powerful way to show a promoted colleague how proud everyone is.",
  },
  {
    question: "Can I schedule the promotion card delivery?",
    answer: "Yes. Set a specific date and time and Cardora will automatically deliver the card — perfect for sending it the moment the promotion is announced or on their first day in the new role.",
  },
  {
    question: "Can contributors add photos and GIFs?",
    answer: "Yes. Each contributor can add text messages, photos, GIFs, and videos — making the promotion card a memorable keepsake that goes beyond a standard congratulations.",
  },
  {
    question: "Does it work for remote teams?",
    answer: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules or chasing people down.",
  },
  {
    question: "Do contributors need to create an account?",
    answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required.",
  },
];

export default function PromotionCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">

              {/* Left Content */}
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  🚀 Employee Promotion Cards
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Celebrate a Promotion —
                  <span className="text-[#2CB1A6]"> From You or the Whole Team</span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Recognise a colleague&apos;s achievement with a card that goes beyond
                  a standard congratulations. Write a proud message yourself or invite
                  the whole team to celebrate together. Free — no credit card needed.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=promotion">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                      Create a Promotion Card 🚀
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
              <PromotionHeroLottie />

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
              <p className="text-xl text-[#5B6B75]">A memorable promotion card in three simple steps</p>
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
                Perfect for every promotion moment
              </h2>
              <p className="text-xl text-[#5B6B75]">Make recognition feel as big as the achievement</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "👔", title: "Manager celebrating a team member", description: "A personal message from a manager acknowledging the hard work, growth, and dedication that earned the promotion. This kind of recognition stays with people for years." },
                { emoji: "👥", title: "Team celebrating a colleague", description: "Get the whole team to sign. Each person adds what they know — a shared memory, a specific moment, something they admire. The result is a card unlike any other." },
                { emoji: "🏢", title: "HR or leadership team recognition", description: "Formal recognition from leadership carries extra weight. A beautifully designed card with messages from across the organisation shows the promoted employee they truly matter." },
                { emoji: "🌍", title: "Remote team promotion", description: "Distance shouldn&apos;t diminish the celebration. One link, your whole distributed team contributes — creating a card that feels as warm as being in the same room." },
                { emoji: "💼", title: "Internal move to new department", description: "Celebrating a cross-department promotion or internal transfer? Collect messages from both the old team and the new one — a unique send-off and welcome rolled into one." },
                { emoji: "🏆", title: "Long-deserved recognition", description: "For the person who&apos;s been putting in the work, waiting their turn, and finally getting the recognition they deserve. Make it count with a card that says exactly that." },
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
                Everything you need to make recognition meaningful
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
              Make their promotion moment unforgettable
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Write it yourself or get the whole team to celebrate. Either way, they&apos;ll remember it long after the first day in the new role.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=promotion">
                <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  Create a Promotion Card 🚀
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
