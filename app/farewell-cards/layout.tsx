import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a farewell card by myself, without inviting others?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Cardora works perfectly for solo farewell cards too — write your own heartfelt message, customise the design, and send it. No need to involve anyone else.",
      },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for farewell cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Cardora is completely free. Create a farewell card, invite unlimited contributors, and send it with no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can multiple people sign the farewell card?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Share one link and the whole team can add their own message, photo, or GIF — without signing up. Perfect for offices, remote teams, and friend groups.",
      },
    },
    {
      "@type": "Question",
      name: "Can I schedule the farewell card delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Set a specific date and time and Cardora will automatically deliver the card — perfect for sending it on their last day or as a surprise before they leave.",
      },
    },
    {
      "@type": "Question",
      name: "Can contributors add photos and GIFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Each contributor can add text messages, photos, GIFs, and videos — creating a rich keepsake the recipient will treasure long after they've moved on.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for remote teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Perfectly. Just share a link and your whole team can contribute from anywhere in the world — no coordinating schedules or chasing people down.",
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
  title: "Free Online Group Farewell Card Everyone Can Sign | Cardora",
  description:
    "Create a beautiful farewell card for a coworker or colleague. Invite your whole team to sign — add messages, photos & GIFs. Schedule delivery for their last day. Free, no credit card needed.",
  openGraph: {
    title: "Free Online Group Farewell Card Everyone Can Sign | Cardora",
    description:
      "Create a beautiful farewell card for a coworker or colleague. Invite your whole team to sign — add messages, photos & GIFs. Free with no credit card required.",
    url: "https://cardora.cards/farewell-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora group farewell card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Group Farewell Card Everyone Can Sign | Cardora",
    description: "Create a beautiful farewell card for a coworker. Invite everyone to sign. Free, instant, no sign-up needed.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.cards/farewell-cards",
  },
};

export default function FarewellCardsLayout({ children }: { children: React.ReactNode }) {
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
