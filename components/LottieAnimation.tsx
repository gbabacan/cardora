"use client";

import Lottie from "lottie-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { isLottieFileSentinel } from "@/lib/lotties";

interface LottieAnimationProps {
  animationData?: any;
  /** Direct URL for .lottie binary files — alternative to animationData sentinel */
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export default function LottieAnimation({
  animationData,
  src,
  loop = true,
  autoplay = true,
  className = "",
  style,
  onComplete,
}: LottieAnimationProps) {
  const lottieFileSrc = src || (isLottieFileSentinel(animationData) ? animationData.__lottieFileSrc : null);

  if (lottieFileSrc) {
    return (
      <DotLottieReact
        src={lottieFileSrc}
        loop={loop}
        autoplay={autoplay}
        className={className}
        style={style}
      />
    );
  }

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
      onComplete={onComplete}
    />
  );
}