import type { Metadata } from "next";

// Admin area. It is linked from nowhere and left out of the sitemap and
// robots.txt (listing it there would reveal the path); noindex keeps it out
// of search results if the URL ever leaks. Access is enforced by the
// admin API routes, not by the URL staying secret.
export const metadata: Metadata = {
  title: { absolute: "Cardora" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
