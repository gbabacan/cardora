import { supabase } from './supabase';

export interface LottieAnimation {
  id: string;
  name: string;
  occasion_type: string;
  source_type: 'local' | 'remote';
  file_path?: string;
  remote_url?: string;
  helper_color: string;
  thumbnail_url?: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Get all active Lottie animations for a specific occasion type
 */
export async function getLottieAnimationsByOccasion(occasionType: string) {
  try {
    const { data: animations, error } = await supabase
      .from('lottie_animations')
      .select('*')
      .eq('occasion_type', occasionType)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return { animations: animations || [], error: null };
  } catch (error: any) {
    console.error('Error fetching Lottie animations:', error);
    return { animations: [], error: error.message };
  }
}

/**
 * Get all active Lottie animations (for admin/selection UI)
 */
export async function getAllLottieAnimations() {
  try {
    const { data: animations, error } = await supabase
      .from('lottie_animations')
      .select('*')
      .eq('is_active', true)
      .order('occasion_type, name');

    if (error) throw error;

    return { animations: animations || [], error: null };
  } catch (error: any) {
    console.error('Error fetching all Lottie animations:', error);
    return { animations: [], error: error.message };
  }
}

/**
 * Get a specific Lottie animation by ID
 */
export async function getLottieAnimationById(id: string) {
  try {
    const { data: animation, error } = await supabase
      .from('lottie_animations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { animation, error: null };
  } catch (error: any) {
    console.error('Error fetching Lottie animation:', error);
    return { animation: null, error: error.message };
  }
}

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

/**
 * Get the animation data URL (local or remote)
 */
export function getLottieAnimationUrl(animation: LottieAnimation): string {
  if (animation.source_type === 'local') {
    return animation.file_path || '';
  } else {
    return animation.remote_url || '';
  }
}

/**
 * Load Lottie animation data (handles both local and remote, both .json and .lottie).
 * For .lottie binary files returns a LottieFileSentinel — pass it directly to
 * <LottieAnimation animationData={...} /> which will route to DotLottieReact.
 */
export async function loadLottieAnimationData(animation: LottieAnimation) {
  try {
    const url = animation.source_type === 'local'
      ? (animation.file_path || '')
      : (animation.remote_url || '');

    if (!url) return null;

    // .lottie files are binary (zip) — cannot be parsed as JSON
    if (isLottieFile(url)) {
      return { __lottieFileSrc: url } satisfies LottieFileSentinel;
    }

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to load Lottie file: ${url} (${response.status} ${response.statusText})`);
      return null;
    }
    return await response.json();
  } catch (error: any) {
    console.error('Error loading Lottie animation data:', error.message || error);
    return null;
  }
}

/**
 * Group animations by occasion type
 */
export function groupAnimationsByOccasion(animations: LottieAnimation[]) {
  return animations.reduce((acc, animation) => {
    const occasion = animation.occasion_type;
    if (!acc[occasion]) {
      acc[occasion] = [];
    }
    acc[occasion].push(animation);
    return acc;
  }, {} as Record<string, LottieAnimation[]>);
}