import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a graduation card by myself, without inviting others?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Cardora works perfectly for solo graduation cards — write your own proud message, customise the design, and send it. No need to involve anyone else.",
      },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for graduation cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Cardora is completely free. Create a graduation card, invite unlimited contributors, and send it with no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can a whole class or team send a graduation card together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Share one link and everyone — classmates, teachers, colleagues, family — can add their own message, photo, or GIF without signing up.",
      },
    },
    {
      "@type": "Question",
      name: "Can I schedule the graduation card delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Set a specific date and time and Cardora will automatically deliver the card — perfect for sending it on graduation day itself or as a surprise the night before.",
      },
    },
    {
      "@type": "Question",
      name: "Can contributors add photos and GIFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Each contributor can add text messages, photos, GIFs, and videos — turning the graduation card into a rich keepsake full of shared memories.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for online or remote groups?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Perfectly. Whether classmates are spread across the country or colleagues are remote, one link lets everyone contribute at their own pace from anywhere.",
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
  title: "Free Online Graduation Card — From You or the Whole Class | Cardora",
  description:
    "Create a beautiful graduation card online. Write a proud message yourself or invite classmates, teachers, and family to sign together. Add photos & GIFs. Free, no credit card needed.",
  openGraph: {
    title: "Free Online Graduation Card — From You or the Whole Class | Cardora",
    description:
      "Celebrate graduation with a beautiful card. Write it yourself or invite everyone to sign. Add photos & GIFs. Free with no credit card required.",
    url: "https://cardora.cards/graduation-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora graduation card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Graduation Card — From You or the Whole Class | Cardora",
    description: "Celebrate graduation with a beautiful card from the whole class. Free, instant, no sign-up needed.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.cards/graduation-cards",
  },
};

export default function GraduationCardsLayout({ children }: { children: React.ReactNode }) {
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
