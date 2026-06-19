import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I send an employee appreciation card by myself?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely. Write your own personal appreciation message, customise the design, and send it. No need to involve anyone else." },
    },
    {
      "@type": "Question",
      name: "Is Cardora free for employee appreciation cards?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. Create an appreciation card, invite unlimited contributors, and send it with no credit card required." },
    },
    {
      "@type": "Question",
      name: "Can the whole team send an appreciation card together?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Share one link and everyone adds their own message, photo, or GIF — without signing up. Powerful for showing a colleague or employee how valued they truly are." },
    },
    {
      "@type": "Question",
      name: "Can I schedule the appreciation card delivery?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Set a date and time — deliver it on Employee Appreciation Day, after a big project, or any moment you choose." },
    },
    {
      "@type": "Question",
      name: "Does it work for remote teams?",
      acceptedAnswer: { "@type": "Answer", text: "Perfectly. Share one link and your whole distributed team can contribute from anywhere — no coordinating schedules." },
    },
    {
      "@type": "Question",
      name: "Do contributors need to create an account?",
      acceptedAnswer: { "@type": "Answer", text: "No. Only the card creator needs an account. Contributors simply click the link and add their message — no sign-up required." },
    },
  ],
};

export const metadata: Metadata = {
  title: "Free Employee Appreciation Card — Solo or From the Team | Cardora",
  description: "Show your team how valued they are with a beautiful appreciation card. Write it yourself or invite everyone to sign. Perfect for Employee Appreciation Day or any time. Free.",
  openGraph: {
    title: "Free Employee Appreciation Card — Solo or From the Team | Cardora",
    description: "Show employees how valued they are with a beautiful card. Write it yourself or invite the whole team to sign. Free with no credit card required.",
    url: "https://cardora.cards/employee-appreciation-cards",
    images: [{ url: "/cardoraMainDemo.png", width: 1200, height: 630, alt: "Cardora employee appreciation card" }],
  },
  twitter: { card: "summary_large_image", title: "Free Employee Appreciation Card — Solo or From the Team | Cardora", description: "Show employees how valued they are. Beautiful appreciation cards, free, no sign-up needed.", images: ["/cardoraMainDemo.png"] },
  alternates: { canonical: "https://cardora.cards/employee-appreciation-cards" },
};

export default function EmployeeAppreciationCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
