// Helpers for telling .lottie files apart from JSON animations. Kept apart
// from lib/lotties.ts so components that only need these (the homepage's
// LazyLottie, LottieAnimation) don't pull in the Supabase client.

/** Sentinel shape returned for .lottie binary files so renderers can use DotLottieReact */
export interface LottieFileSentinel {
  __lottieFileSrc: string;
}

export function isLottieFileSentinel(data: any): data is LottieFileSentinel {
  return data !== null && typeof data === 'object' && '__lottieFileSrc' in data;
}

export function isLottieFile(path: string): boolean {
  return path.toLowerCase().endsWith('.lottie');
}
