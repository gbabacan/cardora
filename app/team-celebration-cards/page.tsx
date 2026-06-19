import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import TeamCelebrationHeroLottie from "./TeamCelebrationHeroLottie";

const FAQS = [
  { question: "Can I send a team celebration card by myself?", answer: "Absolutely. Write your own celebratory message yourself, customise the design, and send it to the whole team or one person." },
  { question: "Is Cardora free for team celebration cards?", answer: "Yes, completely free. Create a team celebration card, invite unlimited contributors, and send it with no credit card required." },
  { question: "Can the whole team sign a celebration card together?", answer: "Yes. Share one link and everyone adds their own message, photo, or GIF — without signing up. Perfect for celebrating a team win, milestone, or achievement." },
  { question: "Can I schedule the team celebration card delivery?", answer: "Yes. Schedule it to arrive right when the win is announced, after a project launch, or at any moment that amplifies the celebration." },
  { question: "Does it work for remote teams?", answer: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules." },
  { question: "Do contributors need to create an account?", answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." },
];

export default function TeamCelebrationCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 via-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  🎉 Team Celebration Cards
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Celebrate Your Team —
                  <span className="text-[#2CB1A6]"> Every Win Deserves a Card</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  From product launches to quarterly wins, recognise your team&apos;s achievements with a card everyone signs together. Free — no credit card needed.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=team-celebration">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create a Team Card 🎉</button>
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
              <TeamCelebrationHeroLottie />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Every team milestone worth celebrating</h2>
              <p className="text-xl text-[#5B6B75]">Recognition that feels as big as the achievement</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "🚀", title: "Product or project launch", description: "The team just shipped something. Acknowledge everyone&apos;s contribution with a card that names what they did and why it mattered." },
                { emoji: "🏆", title: "Hitting a big target", description: "Sales target smashed. Revenue record broken. Milestone reached. Celebrate the shared effort with a card signed by everyone who made it happen." },
                { emoji: "🎯", title: "End of quarter celebration", description: "Close out a great quarter with team recognition that goes beyond a Slack message. A card everyone signs turns the moment into a memory." },
                { emoji: "👏", title: "Recognising an individual win", description: "One person did something exceptional. Get the whole team to co-sign a card that says: we all saw it, and we&apos;re all proud." },
                { emoji: "🌍", title: "Remote team wins", description: "Distributed teams rarely get the office moment. A group card brings everyone together digitally — just as meaningful, with no timezone headaches." },
                { emoji: "🎊", title: "Company or team anniversary", description: "Celebrate a year, five years, or ten of building something together. A team celebration card captures the collective pride in how far you&apos;ve come." },
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Everything you need to celebrate the right way</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: "✍️", title: "Solo or group — your choice", description: "Write a personal recognition yourself or collect messages from the whole team. Both make a lasting impression." },
                { emoji: "📸", title: "Photos, GIFs & videos", description: "Add team photos, celebratory GIFs, or a congratulatory video. Make the win feel as big as it was." },
                { emoji: "⏰", title: "Schedule for the perfect moment", description: "Time the card to arrive right when the win is announced — amplifying the celebration at the exact right second." },
                { emoji: "🌍", title: "Works for remote teams", description: "One link, your whole distributed team contributes — no coordinating schedules, no chasing people down." },
                { emoji: "🎨", title: "Professional templates", description: "Choose from beautifully designed celebration templates and personalise fonts, colours, and layout." },
                { emoji: "🔒", title: "Private & secure", description: "Only the recipient sees the card. Recognition kept personal and meaningful." },
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
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Your team worked hard. Celebrate like it.</h2>
            <p className="text-xl text-white opacity-90 mb-8">Write it yourself or get everyone to share in the celebration. Either way, it makes the win feel real.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=team-celebration">
                <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create a Team Card 🎉</button>
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
