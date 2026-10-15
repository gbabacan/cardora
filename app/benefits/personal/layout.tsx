import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Personal Group Cards",
      item: `${SITE_URL}/benefits/personal`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Personal Group Cards for Every Occasion",
  description:
    "Send heartfelt group greeting cards for birthdays, Valentine's Day, weddings, new babies, Christmas, and more. Collect messages and photos from everyone — free with Cardora.",
  openGraph: {
    title: "Personal Group Cards for Every Occasion | Cardora",
    description:
      "Send heartfelt group greeting cards for birthdays, Valentine's Day, weddings, new babies, and more. Collect messages and photos from everyone.",
    url: `${SITE_URL}/benefits/personal`,
    images: [
      {
        url: "/cardoraMainDemo.png",
        width: 1200,
        height: 630,
        alt: "Personal group greeting cards with Cardora",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Group Cards for Every Occasion | Cardora",
    description:
      "Send heartfelt group greeting cards for birthdays, weddings, new babies, and more. Free with Cardora.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/benefits/personal`,
  },
};

export default function PersonalBenefitsLayout({ children }: { children: React.ReactNode }) {
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
