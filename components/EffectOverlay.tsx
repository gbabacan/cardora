"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import type { Effect } from "@/lib/effects";
import { loadEffectAnimationData } from "@/lib/effects";

interface EffectOverlayProps {
  effect: Effect;
}

export default function EffectOverlay({ effect }: EffectOverlayProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [loopCount, setLoopCount] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const loadAnimation = async () => {
      const data = await loadEffectAnimationData(effect);
      setAnimationData(data);
    };

    loadAnimation();
  }, [effect]);

  // Start fading out after 4 seconds, then remove completely after fade
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 4000);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 5500); // 4s delay + 1.5s fade duration

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleLoopComplete = () => {
    setLoopCount(prev => prev + 1);
  };

  // Stop animation after specified number of loops
  const shouldLoop = loopCount < effect.number_of_loops;

  if (!animationData || !shouldRender) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-1500 ease-out"
      style={{ opacity }}
    >
      <Lottie
        animationData={animationData}
        loop={shouldLoop}
        onLoopComplete={handleLoopComplete}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
