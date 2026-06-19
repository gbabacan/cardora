import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a promotion card by myself, without inviting others?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Cardora works perfectly for solo promotion cards — write a proud message from you, customise the design, and send it. No need to involve anyone else.",
      },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for employee promotion cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Cardora is completely free. Create a promotion card, invite unlimited contributors, and send it with no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can the whole team sign a promotion card together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Share one link and every team member can add their own message, photo, or GIF — without signing up. A powerful way to show a promoted colleague how proud everyone is.",
      },
    },
    {
      "@type": "Question",
      name: "Can I schedule the promotion card delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Set a specific date and time and Cardora will automatically deliver the card — perfect for sending it the moment the promotion is announced or on their first day in the new role.",
      },
    },
    {
      "@type": "Question",
      name: "Can contributors add photos and GIFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Each contributor can add text messages, photos, GIFs, and videos — making the promotion card a memorable keepsake that goes beyond a standard congratulations.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for remote teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules or chasing people down.",
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
  title: "Free Employee Promotion Card — From the Whole Team | Cardora",
  description:
    "Celebrate a colleague's promotion with a beautiful group card. Invite the whole team to sign — add messages, photos & GIFs. Write it yourself or collect everyone's congratulations. Free, no credit card needed.",
  openGraph: {
    title: "Free Employee Promotion Card — From the Whole Team | Cardora",
    description:
      "Celebrate a colleague's promotion with a beautiful card. Write it yourself or invite the whole team to sign. Free with no credit card required.",
    url: "https://cardora.cards/promotion-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora employee promotion card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Employee Promotion Card — From the Whole Team | Cardora",
    description: "Celebrate a promotion with a beautiful group card from the whole team. Free, instant, no sign-up needed.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.cards/promotion-cards",
  },
};

export default function PromotionCardsLayout({ children }: { children: React.ReactNode }) {
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
