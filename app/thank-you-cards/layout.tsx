import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a thank you card by myself, without inviting others?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Cardora works perfectly for solo thank you cards — write your own message, customise the design, and send it. No need to involve anyone else.",
      },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for thank you cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Cardora is completely free. Create a thank you card, invite unlimited contributors, and send it with no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can a whole team send a thank you card together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Share one link and every team member can add their own message, photo, or GIF — without signing up. Perfect for thanking a manager, a colleague, or anyone who made a difference.",
      },
    },
    {
      "@type": "Question",
      name: "Can I schedule the thank you card delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Set a specific date and time and Cardora will automatically deliver the card — perfect for sending it right after an event, on a special date, or as a thoughtful surprise.",
      },
    },
    {
      "@type": "Question",
      name: "Can contributors add photos and GIFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Each contributor can add text messages, photos, GIFs, and videos — making the thank you card rich, personal, and truly memorable.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for remote teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no chasing people down, no coordinating schedules.",
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
  title: "Free Online Thank You Card — From You or Your Whole Team | Cardora",
  description:
    "Create a beautiful thank you card online. Write a personal message yourself or invite your whole team to sign. Add photos & GIFs. Schedule delivery. Free, no credit card needed.",
  openGraph: {
    title: "Free Online Thank You Card — From You or Your Whole Team | Cardora",
    description:
      "Create a beautiful thank you card online. Write a personal message yourself or invite your whole team to sign. Add photos & GIFs. Free with no credit card required.",
    url: "https://cardora.cards/thank-you-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora thank you card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Thank You Card — From You or Your Whole Team | Cardora",
    description: "Create a beautiful thank you card. Write it yourself or get the whole team to sign. Free, instant, no sign-up needed.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.cards/thank-you-cards",
  },
};

export default function ThankYouCardsLayout({ children }: { children: React.ReactNode }) {
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
