import { supabase } from './supabase';

export interface Effect {
  id: string;
  name: string;
  type: 'board_overlay' | 'intro_animation';
  occasion_type: string;
  file_path: string;
  file_type: 'lottie' | 'video' | 'gif';
  number_of_loops: number;
  thumbnail_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Get all active effects
export async function getActiveEffects() {
  try {
    const { data: effects, error } = await supabase
      .from('effects')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;

    return { effects: effects || [], error: null };
  } catch (error: any) {
    console.error('Error fetching effects:', error);
    return { effects: [], error: error.message };
  }
}

// Get effect by ID
export async function getEffectById(effectId: string) {
  try {
    const { data: effect, error } = await supabase
      .from('effects')
      .select('*')
      .eq('id', effectId)
      .single();

    if (error) throw error;

    return { effect, error: null };
  } catch (error: any) {
    console.error('Error fetching effect:', error);
    return { effect: null, error: error.message };
  }
}

// Load Lottie effect animation data from public folder
export async function loadEffectAnimationData(effect: Effect): Promise<any> {
  try {
    if (effect.file_type !== 'lottie') {
      throw new Error('Only Lottie animations are supported');
    }

    const response = await fetch(effect.file_path);
    if (!response.ok) {
      throw new Error(`Failed to load effect animation: ${response.statusText}`);
    }

    const animationData = await response.json();
    return animationData;
  } catch (error) {
    console.error('Error loading effect animation data:', error);
    return null;
  }
}