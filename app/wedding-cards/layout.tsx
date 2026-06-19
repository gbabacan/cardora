import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I send a wedding card by myself, without inviting others?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. Write your own heartfelt wedding message, choose a beautiful design, and send it. No need to involve anyone else." } },
    { "@type": "Question", name: "Is Cardora free for wedding cards?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. Create a wedding card, invite unlimited contributors, and send it with no credit card required." } },
    { "@type": "Question", name: "Can multiple guests sign a wedding card together?", acceptedAnswer: { "@type": "Answer", text: "Yes. Share one link and all guests can add their own message, photo, or GIF — without signing up. A beautiful digital guestbook alternative." } },
    { "@type": "Question", name: "Can I schedule the wedding card delivery?", acceptedAnswer: { "@type": "Answer", text: "Yes. Schedule it to arrive on the wedding day, the night before, or any moment that feels just right." } },
    { "@type": "Question", name: "Can contributors add photos and GIFs?", acceptedAnswer: { "@type": "Answer", text: "Yes. Each contributor can add messages, photos, GIFs, and videos — creating a rich wedding keepsake the couple will treasure forever." } },
    { "@type": "Question", name: "Do contributors need to create an account?", acceptedAnswer: { "@type": "Answer", text: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." } },
  ],
};

export const metadata: Metadata = {
  title: "Free Online Wedding Card Everyone Can Sign | Cardora",
  description: "Create a beautiful online wedding card for the happy couple. Write it yourself or invite all guests to sign — add messages, photos & GIFs. A digital guestbook alternative. Free.",
  openGraph: { title: "Free Online Wedding Card Everyone Can Sign | Cardora", description: "Create a beautiful wedding card everyone can sign. Add messages, photos & GIFs. Free, no credit card required.", url: "https://cardora.cards/wedding-cards", images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora wedding card" }] },
  twitter: { card: "summary_large_image", title: "Free Online Wedding Card Everyone Can Sign | Cardora", description: "Create a beautiful wedding card all guests can sign. Free, instant, no sign-up needed.", images: ["/cardoraMainDemo.png"] },
  alternates: { canonical: "https://cardora.cards/wedding-cards" },
};

export default function WeddingCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
