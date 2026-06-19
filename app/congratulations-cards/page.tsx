import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import CongratulationsHeroLottie from "./CongratulationsHeroLottie";

const STEPS = [
  {
    number: "01",
    title: "Create your congratulations card",
    description: "Choose a template, personalise it, and decide: write a heartfelt message yourself or get everyone to celebrate together.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Go solo or rally the group",
    description: "Writing alone? Add your message and you're done. Getting everyone involved? Share one link — no sign-up needed for contributors.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Send it at the right moment",
    description: "Deliver instantly or schedule it to arrive right when they get the news, on their first day, or at any milestone moment.",
    icon: (
      <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
];

const FEATURES = [
  { emoji: "✍️", title: "Solo or group — your choice", description: "Write a personal congratulations yourself or collect celebration messages from the whole team. Both feel genuine and memorable." },
  { emoji: "📸", title: "Photos, GIFs & videos", description: "Add a celebratory GIF, a favourite photo, or a heartfelt video message to make the card truly special." },
  { emoji: "⏰", title: "Schedule delivery", description: "Set a date and time — send it right when the news breaks, on their first day, or as a perfectly timed surprise." },
  { emoji: "🌍", title: "Works for remote teams", description: "Team spread across the globe? One link, everyone celebrates together — no timezone headaches." },
  { emoji: "🎨", title: "Beautiful templates", description: "Choose from professionally designed congratulations templates and customise fonts, colours, and layout." },
  { emoji: "🔒", title: "Private & secure", description: "Only people with the link can see the card. Keep it a surprise until the perfect moment." },
];

const FAQS = [
  {
    question: "Can I send a congratulations card by myself, without inviting others?",
    answer: "Absolutely. Cardora works perfectly for solo congratulations cards — write your own message, customise the design, and send it. No need to involve anyone else.",
  },
  {
    question: "Is Cardora free for congratulations cards?",
    answer: "Yes, Cardora is completely free. Create a congratulations card, invite unlimited contributors, and send it with no credit card required.",
  },
  {
    question: "Can a whole team send a congratulations card together?",
    answer: "Yes. Share one link and everyone can add their own message, photo, or GIF — without signing up. Perfect for celebrating a colleague's promotion, graduation, or big achievement.",
  },
  {
    question: "Can I schedule the congratulations card delivery?",
    answer: "Yes. Set a specific date and time and Cardora will automatically deliver the card — perfect for sending it right when they get the news or on a special milestone date.",
  },
  {
    question: "Can contributors add photos and GIFs?",
    answer: "Yes. Each contributor can add text messages, photos, GIFs, and videos — making the congratulations card a rich, memorable keepsake.",
  },
  {
    question: "Does it work for remote teams?",
    answer: "Perfectly. Share one link and your whole distributed team can contribute from anywhere in the world — no coordinating schedules or chasing people down.",
  },
  {
    question: "Do contributors need to create an account?",
    answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required.",
  },
];

export default function CongratulationsCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">

              {/* Left Content */}
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  🎉 Congratulations Cards
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Create a Congratulations Card —
                  <span className="text-[#2CB1A6]"> Solo or From the Whole Team</span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Celebrate a promotion, graduation, new job, or any achievement.
                  Write a heartfelt message yourself or invite everyone to join in.
                  Free — no credit card needed.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=congratulations">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                      Create a Congratulations Card 🎉
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
              <CongratulationsHeroLottie />

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
              <p className="text-xl text-[#5B6B75]">A memorable congratulations card in three simple steps</p>
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
                Perfect for every achievement
              </h2>
              <p className="text-xl text-[#5B6B75]">Big milestones deserve a card worth keeping</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "🚀", title: "Promotion or new role", description: "Celebrate a colleague's big career moment with messages from the whole team. Let them know exactly how proud everyone is of how far they've come." },
                { emoji: "🎓", title: "Graduation", description: "Years of hard work, late nights, and dedication — all leading to this. Send a card filled with pride and well-wishes from everyone who supported them." },
                { emoji: "💼", title: "New job", description: "They're starting a new chapter. Whether they're leaving the team or stepping into a new role, a congratulations card sends them off on a high." },
                { emoji: "💌", title: "A personal congratulations", description: "Sometimes the most meaningful message is just one person saying the right thing. Write from the heart and send something they'll read again and again." },
                { emoji: "🏆", title: "Award or recognition", description: "They won a prize, hit a major target, or were recognised for outstanding work. Amplify that recognition with a card from the whole team." },
                { emoji: "🏠", title: "Life milestone", description: "New home, engagement, new baby — life's big moments deserve to be celebrated. A group card from everyone who cares makes the moment unforgettable." },
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
                Everything you need to celebrate in style
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
              Make their achievement feel extraordinary
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Write it yourself or get everyone to celebrate together. Either way, they&apos;ll never forget it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=congratulations">
                <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  Create a Congratulations Card 🎉
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
