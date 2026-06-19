import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send a birthday card by myself, without inviting others?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Cardora works perfectly for solo cards too — write your own message, customise the design, and send it. No need to invite anyone else.",
      },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for birthday cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Cardora is completely free. You can create a group birthday card, invite unlimited contributors, and send it with no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can multiple people sign the birthday card?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Share one link and everyone can add their own message, photo, or GIF — without signing up. Perfect for teams and friend groups of any size.",
      },
    },
    {
      "@type": "Question",
      name: "Can I schedule the birthday card delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Set a specific date and time and Cardora will automatically deliver the card — perfect for surprising someone right at midnight on their birthday.",
      },
    },
    {
      "@type": "Question",
      name: "Can contributors add photos and GIFs to the birthday card?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Each contributor can add text messages, photos, GIFs, and videos. The result is a rich, multimedia birthday card everyone will love.",
      },
    },
    {
      "@type": "Question",
      name: "Does the birthday card work for remote teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Perfectly. Cardora was built for exactly this — just share a link and your whole team can contribute from anywhere in the world, no matter the timezone.",
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
  title: "Free Online Group Birthday Card Everyone Can Sign | Cardora",
  description:
    "Create a beautiful group birthday card online. Invite your whole team or friend group to sign — add messages, photos & GIFs. Schedule delivery for the perfect moment. Free, no credit card needed.",
  openGraph: {
    title: "Free Online Group Birthday Card Everyone Can Sign | Cardora",
    description:
      "Create a beautiful group birthday card online. Invite your whole team or friend group to sign — add messages, photos & GIFs. Free with no credit card required.",
    url: "https://cardora.cards/birthday-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora group birthday card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Group Birthday Card Everyone Can Sign | Cardora",
    description: "Create a beautiful group birthday card. Invite everyone to sign. Free, instant, no sign-up needed.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.cards/birthday-cards",
  },
};

export default function BirthdayCardsLayout({ children }: { children: React.ReactNode }) {
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
