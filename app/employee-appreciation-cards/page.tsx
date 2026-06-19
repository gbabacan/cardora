import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import LandingPageNav from "../LandingPageNav";
import EmployeeAppreciationHeroLottie from "./EmployeeAppreciationHeroLottie";

const FAQS = [
  { question: "Can I send an employee appreciation card by myself?", answer: "Absolutely. Write your own personal appreciation message, customise the design, and send it. No need to involve anyone else." },
  { question: "Is Cardora free for employee appreciation cards?", answer: "Yes, completely free. Create an appreciation card, invite unlimited contributors, and send it with no credit card required." },
  { question: "Can the whole team send an appreciation card together?", answer: "Yes. Share one link and everyone adds their own message, photo, or GIF — without signing up. Powerful for showing a colleague or employee how valued they truly are." },
  { question: "Can I schedule the appreciation card delivery?", answer: "Yes. Set a date and time — deliver it on Employee Appreciation Day, after a big project, or any moment you choose." },
  { question: "Does it work for remote teams?", answer: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules." },
  { question: "Do contributors need to create an account?", answer: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." },
];

export default function EmployeeAppreciationCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingPageNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-[#F7FAFC] to-[#E8F5F4] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
              <div className="relative z-10 py-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  🌟 Employee Appreciation Cards
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0B1F2A] mb-4 leading-tight">
                  Show Your Team They&apos;re Valued —
                  <span className="text-[#2CB1A6]"> Solo or From Everyone</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#5B6B75] mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  A heartfelt appreciation card changes how someone feels about their work. Write a personal message yourself or invite the whole team to share their gratitude. Free — no credit card needed.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <Link href="/boards/create?occasion=employee-appreciation">
                    <button className="px-8 py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-base lg:text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                      Create an Appreciation Card 🌟
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
              <EmployeeAppreciationHeroLottie />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Every team member deserves to feel this</h2>
              <p className="text-xl text-[#5B6B75]">Recognition is most powerful when it&apos;s specific, genuine, and shared</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "💌", title: "A personal thank you from you", description: "The most meaningful appreciation often comes from one person saying exactly the right thing. Write from the heart — specific, genuine, and personal." },
                { emoji: "👥", title: "From the whole team", description: "Collect appreciation from everyone. Each person adds what they know — a specific moment, a quality they admire. The card becomes a mosaic of gratitude." },
                { emoji: "📅", title: "Employee Appreciation Day", description: "March 7th comes once a year — make it count. Get the leadership team or the whole company to sign one card for a deserving employee." },
                { emoji: "🏆", title: "After a big project or win", description: "A team just delivered something major. Celebrate the effort with a card that names what each person contributed. Recognition tied to specifics hits hardest." },
                { emoji: "🌍", title: "For a remote employee", description: "Remote workers often feel invisible. A card from the whole team — with real names and real messages — closes that distance in a way nothing else can." },
                { emoji: "👔", title: "Manager-to-team appreciation", description: "Leaders who show genuine gratitude build the strongest teams. Send a card to each team member individually — or one to the whole team at once." },
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-4">Everything you need to make appreciation real</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: "✍️", title: "Solo or group — your choice", description: "Write a personal note yourself or collect messages from the whole team. Both feel genuine and create a lasting impression." },
                { emoji: "📸", title: "Photos, GIFs & videos", description: "Add team photos, a celebratory GIF, or a heartfelt video message. Make it more than words." },
                { emoji: "⏰", title: "Schedule for the right moment", description: "Deliver on Employee Appreciation Day, after a win, or any moment that feels right — even if you set it up weeks ahead." },
                { emoji: "🌍", title: "Works for remote teams", description: "One link reaches your whole distributed team — everyone contributes at their own pace." },
                { emoji: "🎨", title: "Beautiful templates", description: "Choose from professionally designed appreciation templates and personalise fonts, colours, and layout." },
                { emoji: "🔒", title: "Private & secure", description: "Only the recipient sees the card. Personal and meaningful, shared just with them." },
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
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Make someone feel truly seen today</h2>
            <p className="text-xl text-white opacity-90 mb-8">Write it yourself or get the whole team to share their gratitude. Either way, it&apos;ll mean the world.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boards/create?occasion=employee-appreciation">
                <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">Create an Appreciation Card 🌟</button>
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
