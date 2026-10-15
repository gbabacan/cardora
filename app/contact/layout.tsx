import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Cardora team. We're here to help with questions, feedback, and support for your group greeting cards.",
  openGraph: {
    title: "Contact Us | Cardora",
    description:
      "Get in touch with the Cardora team. We're here to help with questions, feedback, and support.",
    url: `${SITE_URL}/contact`,
    images: [
      {
        url: "/cardoraMainDemo.png",
        width: 1200,
        height: 630,
        alt: "Contact Cardora",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Cardora",
    description:
      "Get in touch with the Cardora team. We're here to help with questions, feedback, and support.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
