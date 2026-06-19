import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a work anniversary card by myself, without inviting others?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely. Write your own personal message, customise the design, and send it. No need to involve anyone else." },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for work anniversary cards?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. Create a work anniversary card, invite unlimited contributors, and send it with no credit card required." },
    },
    {
      "@type": "Question",
      name: "Can the whole team sign a work anniversary card?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Share one link and everyone can add their own message, photo, or GIF — without signing up. Perfect for celebrating a colleague's milestone with the whole team." },
    },
    {
      "@type": "Question",
      name: "Can I schedule the work anniversary card delivery?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Schedule it to arrive on the exact anniversary date — even if you set it up weeks in advance." },
    },
    {
      "@type": "Question",
      name: "Does it work for remote teams?",
      acceptedAnswer: { "@type": "Answer", text: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules." },
    },
    {
      "@type": "Question",
      name: "Do contributors need to create an account?",
      acceptedAnswer: { "@type": "Answer", text: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." },
    },
  ],
};

export const metadata: Metadata = {
  title: "Free Work Anniversary Card — From the Whole Team | Cardora",
  description: "Celebrate a colleague's work anniversary with a beautiful group card. Invite the whole team to sign — add messages, photos & GIFs. Schedule delivery for their exact anniversary date. Free.",
  openGraph: {
    title: "Free Work Anniversary Card — From the Whole Team | Cardora",
    description: "Celebrate a work anniversary with a beautiful card from the whole team. Free with no credit card required.",
    url: "https://cardora.cards/work-anniversary-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora work anniversary card" }],
  },
  twitter: { card: "summary_large_image", title: "Free Work Anniversary Card — From the Whole Team | Cardora", description: "Celebrate a work anniversary with a beautiful group card. Free, instant, no sign-up needed.", images: ["/cardoraMainDemo.png"] },
  alternates: { canonical: "https://cardora.cards/work-anniversary-cards" },
};

export default function WorkAnniversaryCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
