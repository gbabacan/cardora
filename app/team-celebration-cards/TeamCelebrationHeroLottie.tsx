"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";

export default function TeamCelebrationHeroLottie() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/lotties/teamcelebration/teamCelebration1.json")
      .then((r) => r.json())
      .then(setAnimationData)
      .catch(() => {});
  }, []);

  if (!animationData) return null;

  return (
    <div className="w-full max-w-xs sm:max-w-sm lg:max-w-none mx-auto h-64 sm:h-80 lg:h-[500px]">
      <Lottie animationData={animationData} loop={true} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
