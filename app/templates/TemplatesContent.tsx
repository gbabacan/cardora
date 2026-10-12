"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getImageUrl } from "@/lib/images";
import LazyLottie from "@/components/LazyLottie";
import HorizontalScrollRow from "../HorizontalScrollRow";
import type { Board } from "@/lib/boards";
import { formatOccasionLabel } from "@/lib/occasionLabels";

/**
 * Within an occasion row: animation-backed templates first, then
 * image-backed ones, then anything else. Read from the background
 * relation rather than the fetched lottie, so a slow or failed
 * animation fetch cannot reorder the row. The sort is stable, so ties
 * keep the query order, which follows template_order.
 */
const backgroundRank = (template: Board) => {
  const background = template.card_background_data;
  if (background?.type === "ANIMATION" || background?.lottie_animation) return 0;
  if (background?.type === "IMAGE") return 1;
  return 2;
};

const placeholderIcon = (
  <div className="w-12 h-12 rounded-full bg-[#A7E8E2] flex items-center justify-center">
    <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
);

export default function TemplatesContent() {
  const [templates, setTemplates] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFormat, setFilterFormat] = useState<"all" | "board" | "card">("board");
  const [filterOccasion, setFilterOccasion] = useState<string>("all");

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("boards")
        .select(`*, card_background_data:card_background_id(id, type, lottie_animation:lottie_animation_id(id, name, file_path), image:image_id(id, name, file_path, source_type, remote_url))`)
        .eq("is_template", true)
        .order("occasion_type")
        .order("template_order", { ascending: true, nullsFirst: false });

      if (error || !data) {
        setLoading(false);
        return;
      }

      // Animations load per tile as they scroll into view (LazyLottie),
      // so the page can render as soon as the rows are known.
      setTemplates(data as Board[]);
      setLoading(false);
    };

    loadTemplates();
  }, []);

  // Occasion chips reflect the chosen format, so a chip never yields an empty page.
  // Filtering and grouping key off the label, not the raw occasion_type, so the
  // two spellings of an occasion collapse into a single chip and a single row.
  const formatMatches = templates.filter(
    (t) => filterFormat === "all" || t.format_type === filterFormat
  );
  const occasionLabels = Array.from(
    new Set(formatMatches.map((t) => formatOccasionLabel(t.occasion_type)))
  ).sort((a, b) => a.localeCompare(b));

  // Switching format can retire the selected occasion; fall back to All.
  const activeOccasion =
    filterOccasion !== "all" && !occasionLabels.includes(filterOccasion)
      ? "all"
      : filterOccasion;

  const filteredTemplates = formatMatches.filter(
    (t) => activeOccasion === "all" || formatOccasionLabel(t.occasion_type) === activeOccasion
  );

  const visibleOccasionLabels = Array.from(
    new Set(filteredTemplates.map((t) => formatOccasionLabel(t.occasion_type)))
  ).sort((a, b) => a.localeCompare(b));

  const isSingleOccasion = activeOccasion !== "all";

  return (
    <div>
      {/* Filters: format (left, vertical) + occasion (right, wrapping) */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-6 md:mb-8">
        <div
          role="group"
          aria-label="Filter by format"
          className="flex sm:flex-col gap-1 p-1.5 bg-white border-2 border-[#E5EAF0] rounded-2xl shrink-0"
        >
          {(["all", "board", "card"] as const).map((format) => (
            <button
              key={format}
              onClick={() => setFilterFormat(format)}
              aria-pressed={filterFormat === format}
              className={`px-5 py-2 sm:w-32 md:w-36 rounded-xl text-sm md:text-base font-bold transition-colors sm:text-left ${
                filterFormat === format
                  ? "bg-[#2CB1A6] text-white shadow-sm"
                  : "text-[#5B6B75] hover:bg-[#F7FAFC]"
              }`}
            >
              {format === "all" ? "All" : format === "board" ? "Boards" : "Cards"}
            </button>
          ))}
        </div>

        <div
          role="group"
          aria-label="Filter by occasion"
          className="flex flex-wrap content-start gap-2 flex-1"
        >
          {["all", ...occasionLabels].map((label) => {
            const active = activeOccasion === label;
            return (
              <button
                key={label}
                onClick={() => setFilterOccasion(label)}
                aria-pressed={active}
                className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#2CB1A6] border-[#2CB1A6] text-white"
                    : "bg-white border-[#E5EAF0] text-[#5B6B75] hover:border-[#2CB1A6] hover:text-[#2CB1A6]"
                }`}
              >
                {label === "all" ? "All" : label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-[#E5EAF0] text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#2CB1A6] mb-4"></div>
          <p className="text-[#2CB1A6] text-lg">Loading templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#E5EAF0] text-center">
          <p className="text-[#5B6B75]">No templates match your filters</p>
        </div>
      ) : (
        <div className="space-y-10">
          {visibleOccasionLabels.map((occasionLabel) => {
            const occasionTemplates = filteredTemplates
              .filter((t) => formatOccasionLabel(t.occasion_type) === occasionLabel)
              .sort((a, b) => backgroundRank(a) - backgroundRank(b));
            // With "All" occasions, each row scrolls horizontally so many rows
            // fit on screen. Narrowed to one occasion, there's only one row, so
            // showing every template in a wrapping grid uses the space better.
            const cards = occasionTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/${template.format_type === "card" ? "cards" : "boards"}/${template.short_id}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group bg-white rounded-xl border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-lg transition-all overflow-hidden ${
                  isSingleOccasion ? "w-full" : "flex-shrink-0 w-36 md:w-44"
                }`}
                style={isSingleOccasion ? undefined : { scrollSnapAlign: "start" }}
              >
                {/* 3/4 matches the 1200x1600 occasion images, so object-cover
                    crops nothing. Animations letterbox inside the same box. */}
                <div
                  className={`relative aspect-[3/4] bg-gradient-to-br from-[#E8F5F4] to-[#F7FAFC] flex items-center justify-center overflow-hidden ${
                    template.card_background_data?.type === "IMAGE" ? "" : "p-2"
                  }`}
                >
                  {template.card_background_data?.type === "IMAGE" &&
                  template.card_background_data.image &&
                  getImageUrl(template.card_background_data.image) ? (
                    <img
                      src={getImageUrl(template.card_background_data.image)}
                      alt={template.card_background_data.image.name || template.title || "Template"}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : template.card_background_data?.lottie_animation?.file_path ? (
                    <LazyLottie
                      filePath={template.card_background_data.lottie_animation.file_path}
                      className="w-full h-full flex items-center justify-center"
                      placeholder={placeholderIcon}
                    />
                  ) : (
                    placeholderIcon
                  )}

                  {/* Format sits on the thumbnail so the tile needs no footer. */}
                  <span
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ring-1 ring-black/5 ${
                      template.format_type === "card"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {template.format_type === "card" ? "Card" : "Board"}
                  </span>
                </div>
              </Link>
            ));
            return (
              <div key={occasionLabel}>
                <div className="flex items-center gap-4 mb-5">
                  <h2 className="text-xl font-bold text-[#0B1F2A]">{occasionLabel}</h2>
                  <div className="flex-1 h-px bg-[#E5EAF0]"></div>
                  <span className="text-sm text-[#5B6B75]">
                    {occasionTemplates.length} template{occasionTemplates.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {isSingleOccasion ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {cards}
                  </div>
                ) : (
                  <HorizontalScrollRow>{cards}</HorizontalScrollRow>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
