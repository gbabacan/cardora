import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  weight: ["300", "400", "600", "700", "800"],
  subsets: ["latin"],
});

const BASE_URL = "https://cardora.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cardora",
  url: BASE_URL,
  logo: `${BASE_URL}/cardoraLogo.png`,
  description:
    "Cardora is a collaborative group greeting card platform for birthdays, farewells, weddings, thank-yous, and every celebration.",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cardora",
  url: BASE_URL,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Cardora – Free Online Group Greeting Cards",
    template: "%s | Cardora",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/icon.png",
  },
  description:
    "Create collaborative group greeting cards for birthdays, farewells, weddings, thank-yous, and every celebration. Invite your whole team or friend group. Free with no credit card required.",
  openGraph: {
    type: "website",
    siteName: "Cardora",
    title: "Cardora – Free Online Group Greeting Cards",
    description:
      "Create collaborative group greeting cards for birthdays, farewells, weddings, thank-yous, and every celebration. Free with no credit card required.",
    url: BASE_URL,
    images: [
      {
        url: "/cardoraMainDemo.png",
        width: 1200,
        height: 630,
        alt: "Cardora group greeting card platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardora – Free Online Group Greeting Cards",
    description:
      "Create collaborative group greeting cards for birthdays, farewells, weddings, thank-yous, and every celebration.",
    images: ["/cardoraMainDemo.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className={`${openSans.className} min-h-full flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
