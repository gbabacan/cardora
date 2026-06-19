import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I send a retirement card by myself, without inviting others?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. Write your own heartfelt retirement message, customise the design, and send it. No need to involve anyone else." } },
    { "@type": "Question", name: "Is Cardora free for retirement cards?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. Create a retirement card, invite unlimited contributors, and send it with no credit card required." } },
    { "@type": "Question", name: "Can the whole team sign a retirement card together?", acceptedAnswer: { "@type": "Answer", text: "Yes. Share one link and everyone adds their own message, photo, or GIF — without signing up. A retirement card signed by the whole team is something they'll keep forever." } },
    { "@type": "Question", name: "Can I schedule the retirement card delivery?", acceptedAnswer: { "@type": "Answer", text: "Yes. Schedule it to arrive on their last day, the morning they retire, or any moment that feels perfect." } },
    { "@type": "Question", name: "Does it work for remote teams?", acceptedAnswer: { "@type": "Answer", text: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules." } },
    { "@type": "Question", name: "Do contributors need to create an account?", acceptedAnswer: { "@type": "Answer", text: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." } },
  ],
};

export const metadata: Metadata = {
  title: "Free Retirement Card — From You or the Whole Team | Cardora",
  description: "Create a beautiful retirement card for a colleague. Write it yourself or invite the whole team to sign — add messages, photos & GIFs. A keepsake they'll treasure forever. Free.",
  openGraph: { title: "Free Retirement Card — From You or the Whole Team | Cardora", description: "Create a beautiful retirement card. Write it yourself or invite the whole team to sign. Free, no credit card required.", url: "https://cardora.cards/retirement-cards", images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora retirement card" }] },
  twitter: { card: "summary_large_image", title: "Free Retirement Card — From You or the Whole Team | Cardora", description: "Create a beautiful retirement card. Free, instant, no sign-up needed.", images: ["/cardoraMainDemo.png"] },
  alternates: { canonical: "https://cardora.cards/retirement-cards" },
};

export default function RetirementCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
