import { supabase } from './supabase';

export type BackgroundType = 'SOLID' | 'PATTERN' | 'ANIMATION';

export interface Pattern {
  id: string;
  name: string;
  file_path: string;
  thumbnail_url?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Background {
  id: string;
  type: BackgroundType;
  color?: string;
  pattern_id?: string;
  lottie_animation_id?: string;
  created_at: string;
  updated_at: string;

  // Joined data
  pattern?: Pattern;
  lottie_animation?: {
    id: string;
    name: string;
    occasion_type: string;
    source_type: 'local' | 'remote';
    file_path?: string;
    remote_url?: string;
    helper_color?: string;
  };
}

/**
 * Get all backgrounds grouped by type
 */
export async function getAllBackgrounds() {
  const { data, error } = await supabase
    .from('backgrounds')
    .select(`
      *,
      pattern:patterns(*),
      lottie_animation:lottie_animations(*)
    `)
    .order('type', { ascending: true });

  return { data: data as Background[] | null, error: error?.message };
}

/**
 * Get backgrounds by type
 */
export async function getBackgroundsByType(type: BackgroundType) {
  const { data, error } = await supabase
    .from('backgrounds')
    .select(`
      *,
      pattern:patterns(*),
      lottie_animation:lottie_animations(*)
    `)
    .eq('type', type);

  return { data: data as Background[] | null, error: error?.message };
}

/**
 * Get a specific background by ID
 */
export async function getBackgroundById(id: string) {
  const { data, error } = await supabase
    .from('backgrounds')
    .select(`
      *,
      pattern:patterns(*),
      lottie_animation:lottie_animations(*)
    `)
    .eq('id', id)
    .single();

  return { data: data as Background | null, error: error?.message };
}

/**
 * Create a solid color background
 */
export async function createSolidBackground(color: string) {
  const { data, error } = await supabase
    .from('backgrounds')
    .insert({
      type: 'SOLID',
      color: color
    })
    .select()
    .single();

  return { data: data as Background | null, error: error?.message };
}

/**
 * Create a pattern background
 */
export async function createPatternBackground(patternId: string) {
  const { data, error } = await supabase
    .from('backgrounds')
    .insert({
      type: 'PATTERN',
      pattern_id: patternId
    })
    .select(`
      *,
      pattern:patterns(*)
    `)
    .single();

  return { data: data as Background | null, error: error?.message };
}

/**
 * Create an animation background
 */
export async function createAnimationBackground(lottieAnimationId: string) {
  const { data, error } = await supabase
    .from('backgrounds')
    .insert({
      type: 'ANIMATION',
      lottie_animation_id: lottieAnimationId
    })
    .select(`
      *,
      lottie_animation:lottie_animations(*)
    `)
    .single();

  return { data: data as Background | null, error: error?.message };
}

/**
 * Get all active patterns
 */
export async function getAllPatterns() {
  const { data, error } = await supabase
    .from('patterns')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return { data: data as Pattern[] | null, error: error?.message };
}

/**
 * Get patterns by category
 */
export async function getPatternsByCategory(category: string) {
  const { data, error } = await supabase
    .from('patterns')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('name');

  return { data: data as Pattern[] | null, error: error?.message };
}

/**
 * Get the CSS value for a background
 * Returns appropriate CSS property value based on background type
 */
export function getBackgroundCssValue(background: Background): string {
  if (background.type === 'SOLID' && background.color) {
    return background.color;
  }

  if (background.type === 'PATTERN' && background.pattern?.file_path) {
    return `url(${background.pattern.file_path})`;
  }

  // For ANIMATION type, we return empty string as Lottie needs special handling
  return '';
}

/**
 * Group backgrounds by type
 */
export function groupBackgroundsByType(backgrounds: Background[]) {
  return backgrounds.reduce((acc, bg) => {
    if (!acc[bg.type]) {
      acc[bg.type] = [];
    }
    acc[bg.type].push(bg);
    return acc;
  }, {} as Record<BackgroundType, Background[]>);
}
