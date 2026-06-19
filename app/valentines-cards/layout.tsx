import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a Valentine's Day card online for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Cardora is completely free. Create a beautiful Valentine's Day card, personalise it, and send it with no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can multiple people sign a Valentine's Day card?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Share one link and everyone can add their own message, photo, or GIF — without signing up. Perfect for a group card from friends, family, or a whole team.",
      },
    },
    {
      "@type": "Question",
      name: "Can I schedule the Valentine's Day card delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Set a specific date and time and Cardora will automatically deliver the card — perfect for surprising someone right at midnight on February 14th.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add photos and GIFs to the Valentine's card?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Add photos, romantic GIFs, or heartfelt videos to make the card truly personal and memorable.",
      },
    },
    {
      "@type": "Question",
      name: "Is a Valentine's card just for romantic partners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all. Valentine's Day is a celebration of love in all forms — send a card to a best friend, a parent, a sibling, or anyone who means the world to you.",
      },
    },
    {
      "@type": "Question",
      name: "Do recipients need to create an account to view the card?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The recipient simply clicks the link to open their card. No account, no app, no friction.",
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
  title: "Free Online Valentine's Day Card — Beautiful & Personal | Cardora",
  description:
    "Create a beautiful Valentine's Day card online. Write a heartfelt message for someone special or invite everyone to share their love. Add photos & GIFs. Schedule delivery for February 14th. Free.",
  openGraph: {
    title: "Free Online Valentine's Day Card — Beautiful & Personal | Cardora",
    description:
      "Create a beautiful Valentine's Day card. Write it yourself or invite everyone to share their love. Add photos & GIFs. Free with no credit card required.",
    url: "https://cardora.cards/valentines-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora Valentine's Day card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Valentine's Day Card — Beautiful & Personal | Cardora",
    description: "Create a beautiful Valentine's Day card. Personal, heartfelt, and free. Schedule delivery for February 14th.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.cards/valentines-cards",
  },
};

export default function ValentinesCardsLayout({ children }: { children: React.ReactNode }) {
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
