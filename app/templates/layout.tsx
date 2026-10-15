import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Group Card Templates – Birthdays, Farewells & More",
  description:
    "Browse beautiful group greeting card templates for birthdays, farewells, weddings, baby showers, thank-yous, Christmas, and every celebration. Free to use with Cardora.",
  openGraph: {
    title: "Group Card Templates – Birthdays, Farewells & More | Cardora",
    description:
      "Browse beautiful group greeting card templates for birthdays, farewells, weddings, baby showers, thank-yous, and every celebration.",
    url: `${SITE_URL}/templates`,
    images: [
      {
        url: "/cardoraMainDemo.png",
        width: 1200,
        height: 630,
        alt: "Cardora group card templates for every occasion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Group Card Templates – Birthdays, Farewells & More | Cardora",
    description:
      "Browse beautiful group card templates for birthdays, farewells, weddings, and every occasion.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/templates`,
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
