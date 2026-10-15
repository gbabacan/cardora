import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF is roughly a third smaller than WebP for the hero image, which is
    // the homepage's Largest Contentful Paint. Browsers without AVIF get WebP.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Put the stylesheet (~18 KB gzipped) in the HTML instead of a separate,
    // render-blocking request, so first paint doesn't wait for it.
    inlineCss: true,
  },
};

export default nextConfig;
