"use client";

import LazyLottie from "@/components/LazyLottie";
import type { ImageOption } from "./templateTypes";

export const imageSrc = (image: Pick<ImageOption, "source_type" | "file_path" | "remote_url">) =>
  (image.source_type === "local" ? image.file_path : image.remote_url) || "";

// 3:4 preview of a template's animation or image, matching the templates page.
export default function TemplateThumb({
  lottiePath,
  image,
  className = "w-12",
}: {
  lottiePath?: string | null;
  image?: Pick<ImageOption, "source_type" | "file_path" | "remote_url" | "name"> | null;
  className?: string;
}) {
  return (
    <div
      className={`${className} aspect-[3/4] flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-[#E8F5F4] to-[#F7FAFC] flex items-center justify-center`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnails from mixed local/remote sources
        <img src={imageSrc(image)} alt={image.name ?? ""} loading="lazy" className="w-full h-full object-cover" />
      ) : lottiePath ? (
        <LazyLottie filePath={lottiePath} className="w-full h-full" />
      ) : (
        <span className="text-xs text-[#5B6B75]">None</span>
      )}
    </div>
  );
}
