import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I send a team celebration card by myself?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. Write your own celebratory message yourself, customise the design, and send it to the whole team or one person." } },
    { "@type": "Question", name: "Is Cardora free for team celebration cards?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. Create a team celebration card, invite unlimited contributors, and send it with no credit card required." } },
    { "@type": "Question", name: "Can the whole team sign a celebration card together?", acceptedAnswer: { "@type": "Answer", text: "Yes. Share one link and everyone adds their own message, photo, or GIF — without signing up. Perfect for celebrating a team win, milestone, or achievement." } },
    { "@type": "Question", name: "Can I schedule the team celebration card delivery?", acceptedAnswer: { "@type": "Answer", text: "Yes. Schedule it to arrive right when the win is announced, after a project launch, or at any moment that amplifies the celebration." } },
    { "@type": "Question", name: "Does it work for remote teams?", acceptedAnswer: { "@type": "Answer", text: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules." } },
    { "@type": "Question", name: "Do contributors need to create an account?", acceptedAnswer: { "@type": "Answer", text: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." } },
  ],
};

export const metadata: Metadata = {
  title: "Free Team Celebration Card — Celebrate Every Win Together | Cardora",
  description: "Create a beautiful team celebration card for a project win, milestone, or achievement. Invite everyone to sign — add messages, photos & GIFs. Free, no credit card needed.",
  openGraph: { title: "Free Team Celebration Card — Celebrate Every Win Together | Cardora", description: "Celebrate a team win with a beautiful group card everyone signs. Free, no credit card required.", url: "https://cardora.cards/team-celebration-cards", images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora team celebration card" }] },
  twitter: { card: "summary_large_image", title: "Free Team Celebration Card — Celebrate Every Win Together | Cardora", description: "Celebrate a team win with a beautiful group card. Free, instant, no sign-up needed.", images: ["/cardoraMainDemo.png"] },
  alternates: { canonical: "https://cardora.cards/team-celebration-cards" },
};

export default function TeamCelebrationCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
