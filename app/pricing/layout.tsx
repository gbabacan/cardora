import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long will Cardora be free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cardora is completely free for a limited time. We'll give plenty of advance notice before introducing any pricing plans, and early users will receive special benefits.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a credit card to sign up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Sign up is completely free with no credit card required. Just create an account and start celebrating.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limits on the free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, there are no limits. Create unlimited cards, invite unlimited contributors, and use all features without restrictions.",
      },
    },
    {
      "@type": "Question",
      name: "What happens when pricing is introduced?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We'll notify all users well in advance before any changes. Your existing cards will remain accessible, and we'll ensure a smooth transition for everyone.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Pricing – Free Group Cards",
  description:
    "Cardora is free for a limited time. Create unlimited group greeting cards, invite unlimited contributors, and celebrate every occasion with zero plan limits and no credit card required.",
  openGraph: {
    title: "Pricing – Free Group Cards | Cardora",
    description:
      "Cardora is free for a limited time. Create unlimited group cards, invite unlimited contributors, and celebrate every occasion with no credit card required.",
    url: "https://cardora.cards/pricing",
    images: [
      {
        url: "/cardoraMainDemo.png",
        width: 1200,
        height: 630,
        alt: "Cardora group greeting card platform — free pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing – Free Group Cards | Cardora",
    description:
      "Cardora is free for a limited time. Create unlimited group cards with no credit card required.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.cards/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
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
