"use client";

import { useEffect, useRef } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
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
  /**
   * Pause a JSON animation, e.g. while it is scrolled out of view.
   * .lottie files need no help: the dotLottie player already freezes
   * itself when its canvas is off screen.
   */
  paused?: boolean;
}

export default function LottieAnimation({
  animationData,
  src,
  loop = true,
  autoplay = true,
  className = "",
  style,
  onComplete,
  paused = false,
}: LottieAnimationProps) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    if (paused) lottieRef.current?.pause();
    else if (autoplay) lottieRef.current?.play();
  }, [paused, autoplay]);

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
      lottieRef={lottieRef}
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
      onComplete={onComplete}
    />
  );
}