"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";

export default function PricingHeroLottie() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/free.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {});
  }, []);

  if (!animationData) return null;

  return (
    <div className="w-full max-w-xs sm:max-w-sm lg:max-w-none mx-auto lg:mx-0 h-64 sm:h-80 lg:h-[500px] relative lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[600px] lg:-mr-16">
      <Lottie animationData={animationData} loop={true} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
