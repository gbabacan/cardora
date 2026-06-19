import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a Christmas card by myself, without inviting others?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely. Write your own warm Christmas message, customise the design, and send it. No need to involve anyone else." },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for Christmas cards?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. Create a Christmas card, invite unlimited contributors, and send it with no credit card required." },
    },
    {
      "@type": "Question",
      name: "Can a whole team send a Christmas card together?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Share one link and everyone adds their own message, photo, or GIF — without signing up. Perfect for a team Christmas card to a manager, client, or colleague." },
    },
    {
      "@type": "Question",
      name: "Can I schedule the Christmas card delivery?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Schedule it to arrive on Christmas morning, Christmas Eve, or any date that feels right — even if you create it weeks in advance." },
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
  title: "Free Online Group Christmas Card Everyone Can Sign | Cardora",
  description: "Create a beautiful online Christmas card for your team, family, or friends. Everyone signs one card — add messages, photos & GIFs. Schedule delivery for Christmas Day. Free.",
  openGraph: {
    title: "Free Online Group Christmas Card Everyone Can Sign | Cardora",
    description: "Create a beautiful online Christmas card everyone can sign. Add messages, photos & GIFs. Free with no credit card required.",
    url: "https://cardora.cards/christmas-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora group Christmas card" }],
  },
  twitter: { card: "summary_large_image", title: "Free Online Group Christmas Card Everyone Can Sign | Cardora", description: "Create a beautiful Christmas card everyone can sign. Free, instant, no sign-up needed.", images: ["/cardoraMainDemo.png"] },
  alternates: { canonical: "https://cardora.cards/christmas-cards" },
};

export default function ChristmasCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
