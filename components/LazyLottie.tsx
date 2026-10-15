"use client";

import { useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { isLottieFile } from "@/lib/lotties";
import { ScrollRowContext } from "@/app/HorizontalScrollRow";

// The player (lottie-web and dotLottie) is only downloaded once a tile first
// comes into view, not with the page.
const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), { ssr: false });

// Shared across tiles, so several templates on one animation fetch it once.
const animationCache = new Map<string, Promise<unknown>>();

function loadAnimation(filePath: string) {
  let pending = animationCache.get(filePath);
  if (!pending) {
    pending = isLottieFile(filePath)
      // .lottie binaries are fetched by the dotLottie player itself.
      ? Promise.resolve({ __lottieFileSrc: filePath })
      : fetch(filePath)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null);
    animationCache.set(filePath, pending);
  }
  return pending;
}

interface Props {
  filePath: string;
  style?: React.CSSProperties;
  className?: string;
  /** Rendered until the animation is ready. */
  placeholder?: React.ReactNode;
}

/**
 * A Lottie that loads only once its tile comes near the screen and pauses
 * when it leaves. Inside a HorizontalScrollRow, "near" means the row is
 * near the viewport and the tile is within a row's width of the visible
 * part of the row, so tiles further right wait until scrolled toward.
 * Elsewhere it is measured against the viewport.
 */
export default function LazyLottie({ filePath, style, className, placeholder = null }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const row = useContext(ScrollRowContext);
  const rowRoot = row?.root ?? null;
  const [inView, setInView] = useState(false);
  const [animationData, setAnimationData] = useState<unknown>(null);

  // Inside a row, wait for the row to hand over its scroll container.
  const waitingForRow = row !== null && rowRoot === null;

  useEffect(() => {
    const el = ref.current;
    if (!el || waitingForRow) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      rowRoot ? { root: rowRoot, rootMargin: "0px 100%" } : { rootMargin: "300px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rowRoot, waitingForRow]);

  const active = inView && (row ? row.nearViewport : true);

  useEffect(() => {
    if (!active || animationData) return;
    let cancelled = false;
    loadAnimation(filePath).then((data) => {
      if (!cancelled && data) setAnimationData(data);
    });
    return () => {
      cancelled = true;
    };
  }, [active, animationData, filePath]);

  return (
    <div ref={ref} className={className} style={style}>
      {animationData ? (
        <LottieAnimation
          animationData={animationData}
          loop={true}
          paused={!active}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        placeholder
      )}
    </div>
  );
}
