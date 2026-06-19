"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Props {
  children: React.ReactNode;
}

export default function HorizontalScrollRow({ children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scrollBy = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <div className="relative group/scroll">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex flex-row gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </div>

      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white border-2 border-[#E5EAF0] rounded-full shadow-lg flex items-center justify-center hover:border-[#2CB1A6] hover:text-[#2CB1A6] text-[#5B6B75] transition-all"
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right arrow + fade */}
      {canScrollRight && (
        <>
          <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none rounded-r-xl" />
          <button
            onClick={() => scrollBy("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white border-2 border-[#2CB1A6] rounded-full shadow-lg flex items-center justify-center text-[#2CB1A6] hover:bg-[#2CB1A6] hover:text-white transition-all"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
