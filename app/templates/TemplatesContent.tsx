"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isLottieFile } from "@/lib/lotties";
import LottieAnimation from "@/components/LottieAnimation";
import type { Board } from "@/lib/boards";

interface TemplateWithLottie extends Board {
  lottieData?: any;
}

const OCCASION_LABELS: Record<string, string> = {
  birthday: "Birthday",
  wedding: "Wedding",
  newbaby: "New Baby",
  congratulations: "Congratulations",
  farewell: "Farewell",
  teamcelebration: "Team Celebration",
};

const formatOccasionLabel = (type: string) =>
  OCCASION_LABELS[type] ?? type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function TemplatesContent() {
  const [templates, setTemplates] = useState<TemplateWithLottie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFormat, setFilterFormat] = useState<"all" | "board" | "card">("all");
  const [filterOccasion, setFilterOccasion] = useState<string>("all");

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("boards")
        .select(`*, card_background_data:card_background_id(id, type, lottie_animation:lottie_animation_id(id, name, file_path))`)
        .eq("is_template", true)
        .order("occasion_type");

      if (error || !data) {
        setLoading(false);
        return;
      }

      const lottieCache: Record<string, any> = {};
      const templatesWithLottie = await Promise.all(
        data.map(async (template) => {
          const lottieAnim = template.card_background_data?.lottie_animation;
          if (!lottieAnim?.file_path) return { ...template, lottieData: null };
          const cacheKey = lottieAnim.id;
          if (!lottieCache[cacheKey]) {
            try {
              if (isLottieFile(lottieAnim.file_path)) {
                // .lottie binary — store sentinel so LottieAnimation uses DotLottieReact
                lottieCache[cacheKey] = { __lottieFileSrc: lottieAnim.file_path };
              } else {
                const res = await fetch(lottieAnim.file_path);
                if (res.ok) lottieCache[cacheKey] = await res.json();
              }
            } catch {}
          }
          return { ...template, lottieData: lottieCache[cacheKey] || null };
        })
      );

      setTemplates(templatesWithLottie as TemplateWithLottie[]);
      setLoading(false);
    };

    loadTemplates();
  }, []);

  const allOccasionTypes = Array.from(new Set(templates.map((t) => t.occasion_type)));

  const filteredTemplates = templates.filter((t) => {
    const matchesFormat = filterFormat === "all" || t.format_type === filterFormat;
    const matchesOccasion = filterOccasion === "all" || t.occasion_type === filterOccasion;
    return matchesFormat && matchesOccasion;
  });

  const occasionTypes = Array.from(new Set(filteredTemplates.map((t) => t.occasion_type)));

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8 md:mb-10">
        <div className="flex items-center bg-white border-2 border-[#E5EAF0] rounded-lg overflow-hidden">
          {(["all", "board", "card"] as const).map((format) => (
            <button
              key={format}
              onClick={() => setFilterFormat(format)}
              className={`px-3 md:px-4 py-2 text-sm font-semibold transition-colors ${
                filterFormat === format ? "bg-[#2CB1A6] text-white" : "text-[#5B6B75] hover:bg-[#F7FAFC]"
              }`}
            >
              {format === "all" ? "All" : format === "board" ? "Boards" : "Cards"}
            </button>
          ))}
        </div>

        <select
          value={filterOccasion}
          onChange={(e) => setFilterOccasion(e.target.value)}
          className="px-3 md:px-4 py-2 bg-white border-2 border-[#E5EAF0] rounded-lg text-sm font-semibold text-[#0B1F2A] focus:border-[#2CB1A6] focus:outline-none transition-colors"
        >
          <option value="all">All Occasions</option>
          {allOccasionTypes.map((type) => (
            <option key={type} value={type}>{formatOccasionLabel(type)}</option>
          ))}
        </select>
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
          {occasionTypes.map((occasionType) => {
            const occasionTemplates = filteredTemplates.filter((t) => t.occasion_type === occasionType);
            return (
              <div key={occasionType}>
                <div className="flex items-center gap-4 mb-5">
                  <h2 className="text-xl font-bold text-[#0B1F2A]">{formatOccasionLabel(occasionType)}</h2>
                  <div className="flex-1 h-px bg-[#E5EAF0]"></div>
                  <span className="text-sm text-[#5B6B75]">
                    {occasionTemplates.length} template{occasionTemplates.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {occasionTemplates.map((template) => (
                    <Link
                      key={template.id}
                      href={`/${template.format_type === "card" ? "cards" : "boards"}/${template.short_id}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white rounded-xl border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-lg transition-all overflow-hidden"
                    >
                      <div className="aspect-square bg-gradient-to-br from-[#E8F5F4] to-[#F7FAFC] flex items-center justify-center p-2">
                        {template.lottieData ? (
                          <LottieAnimation animationData={template.lottieData} loop={true} style={{ width: "100%", height: "100%" }} />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#A7E8E2] flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1 ${
                          template.format_type === "card" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {template.format_type === "card" ? "Card" : "Board"}
                        </span>
                        <p className="text-xs text-[#5B6B75] group-hover:text-[#2CB1A6] transition-colors font-medium">View Template →</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
