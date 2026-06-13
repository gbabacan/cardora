import type { Metadata } from "next";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://cardora.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Corporate Group Cards",
      item: "https://cardora.com/benefits/corporate",
    },
  ],
};

export const metadata: Metadata = {
  title: "Corporate Group Cards & Team Recognition",
  description:
    "Celebrate your team with collaborative group cards for work anniversaries, employee appreciation, farewells, congratulations, and team milestones. Built for remote and hybrid teams. Free with Cardora.",
  openGraph: {
    title: "Corporate Group Cards & Team Recognition | Cardora",
    description:
      "Celebrate your team with group cards for work anniversaries, employee appreciation, farewells, and team milestones. Built for remote and hybrid teams.",
    url: "https://cardora.com/benefits/corporate",
    images: [
      {
        url: "/cardoraMainDemo.png",
        width: 1200,
        height: 630,
        alt: "Cardora corporate group cards for team recognition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Group Cards & Team Recognition | Cardora",
    description:
      "Celebrate your team with group cards for work anniversaries, farewells, and team milestones. Free with Cardora.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: "https://cardora.com/benefits/corporate",
  },
};

export default function CorporateBenefitsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
