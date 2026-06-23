"use client";

import { Component, ReactNode } from "react";
import Lottie from "lottie-react";

interface Props {
  animationData: any;
  loop?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

interface State {
  hasError: boolean;
}

export default class LottieSafe extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) return null;
    const { animationData, loop = true, style, className } = this.props;
    return (
      <Lottie
        animationData={animationData}
        loop={loop}
        style={style}
        className={className}
      />
    );
  }
}