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
 * Load Lottie animation data (handles both local and remote)
 */
export async function loadLottieAnimationData(animation: LottieAnimation) {
  try {
    if (animation.source_type === 'local') {
      // For local files, we'll import them dynamically
      // This requires the JSON file to exist in the public folder
      const response = await fetch(animation.file_path || '');
      if (!response.ok) throw new Error('Failed to load local Lottie file');
      return await response.json();
    } else {
      // For remote URLs, fetch from the CDN
      const response = await fetch(animation.remote_url || '');
      if (!response.ok) throw new Error('Failed to load remote Lottie file');
      return await response.json();
    }
  } catch (error: any) {
    console.error('Error loading Lottie animation data:', error);
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