"use client";

import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  onComplete?: () => void;
}

export default function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  className = "",
  onComplete
}: LottieAnimationProps) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      onComplete={onComplete}
    />
  );
}