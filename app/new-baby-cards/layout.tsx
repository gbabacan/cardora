import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a new baby card by myself, without inviting others?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Cardora works perfectly for solo new baby cards — write your own warm message, customise the design, and send it. No need to involve anyone else.",
      },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for new baby cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Cardora is completely free. Create a new baby card, invite unlimited contributors, and send it with no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can a whole team send a new baby card together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Share one link and everyone can add their own message, photo, or GIF — without signing up. A beautiful way for a whole office or friend group to welcome the new arrival.",
      },
    },
    {
      "@type": "Question",
      name: "Can I schedule the new baby card delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Set a specific date and time and Cardora will automatically deliver the card — perfect for sending it the day of the birth, or once mum and baby are home.",
      },
    },
    {
      "@type": "Question",
      name: "Can contributors add photos and GIFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Each contributor can add text messages, photos, GIFs, and videos — creating a warm, personal welcome card the new parents will treasure forever.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for remote teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no chasing people down or coordinating schedules.",
      },
    },
    {
      "@type": "Question",
      name: "Do contributors need to create an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Free Online New Baby Card — From You or Your Whole Team | Cardora",
  description:
    "Create a beautiful new baby card online. Write a warm welcome message yourself or invite the whole team to sign. Add photos & GIFs. Free, no credit card needed.",
  openGraph: {
    title: "Free Online New Baby Card — From You or Your Whole Team | Cardora",
    description:
      "Welcome the new arrival with a beautiful card. Write it yourself or invite everyone to sign. Add photos & GIFs. Free with no credit card required.",
    url: "https://cardora.cards/new-baby-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora new baby card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online New Baby Card — From You or Your Whole Team | Cardora",
    description: "Welcome the new arrival with a beautiful card. Write it yourself or get the whole team to sign. Free, instant, no sign-up needed.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.cards/new-baby-cards",
  },
};

export default function NewBabyCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
