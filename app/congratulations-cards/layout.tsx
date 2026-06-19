import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a congratulations card by myself, without inviting others?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Cardora works perfectly for solo congratulations cards — write your own message, customise the design, and send it. No need to involve anyone else.",
      },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for congratulations cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Cardora is completely free. Create a congratulations card, invite unlimited contributors, and send it with no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can a whole team send a congratulations card together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Share one link and everyone can add their own message, photo, or GIF — without signing up. Perfect for celebrating a colleague's promotion, graduation, or big achievement.",
      },
    },
    {
      "@type": "Question",
      name: "Can I schedule the congratulations card delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Set a specific date and time and Cardora will automatically deliver the card — perfect for sending it right when they get the news or on a special milestone date.",
      },
    },
    {
      "@type": "Question",
      name: "Can contributors add photos and GIFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Each contributor can add text messages, photos, GIFs, and videos — making the congratulations card a rich, memorable keepsake.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for remote teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Perfectly. Share one link and your whole distributed team can contribute from anywhere in the world — no coordinating schedules or chasing people down.",
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
  title: "Free Online Congratulations Card — Solo or Group | Cardora",
  description:
    "Create a beautiful congratulations card online for a promotion, graduation, new job, or any achievement. Write it yourself or invite the whole team to sign. Free, no credit card needed.",
  openGraph: {
    title: "Free Online Congratulations Card — Solo or Group | Cardora",
    description:
      "Create a beautiful congratulations card for any achievement. Write it yourself or invite everyone to sign. Add photos & GIFs. Free with no credit card required.",
    url: "https://cardora.cards/congratulations-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora congratulations card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Congratulations Card — Solo or Group | Cardora",
    description: "Create a beautiful congratulations card. Write it yourself or get the whole team to sign. Free, instant, no sign-up needed.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.cards/congratulations-cards",
  },
};

export default function CongratulationsCardsLayout({ children }: { children: React.ReactNode }) {
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
