import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login",
        "/reset-password",
        "/account",
        "/dashboard",
        "/create",
        "/boards/",
        "/cards/",
      ],
    },
    sitemap: "https://cardora.com/sitemap.xml",
  };
}
