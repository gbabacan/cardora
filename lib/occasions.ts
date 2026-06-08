import { supabase } from './supabase';
import { loadLottieAnimationData } from './lotties';

export interface Occasion {
  id: string;
  short_id: string;
  name: string;
  default_lottie: {
    id: string;
    name: string;
    occasion_type: 'local' | 'remote';
    source_type: 'local' | 'remote';
    file_path?: string;
    remote_url?: string;
    helper_color: string;
  } | null;
  default_effect: {
    id: string;
    name: string;
    source_type: 'local' | 'remote';
    file_path?: string;
    remote_url?: string;
  } | null;
  type: 'personal' | 'corporate';
  order: number;
  is_active: boolean;
  default_header?: boolean;
  default_header_color?: string;
  default_title_size?: number;
  default_title_color?: string;
  default_title_font?: string;
  default_envelope_color?: string;
  default_envelope_font_size?: number;
  default_envelope_font?: string;
  default_card_texture?: string;
  default_card_background_id?: string;
}

export interface OccasionWithLottieData extends Occasion {
  lottieData: any;
}

/**
 * Get all active occasions with their default lottie animations
 * @param limit - Maximum number of occasions to fetch (default: all)
 */
export async function getOccasions(limit?: number) {
  try {
    let query = supabase
      .from('occasions')
      .select('*')
      .eq('is_active', true)
      .order('order');

    if (limit) {
      query = query.limit(limit);
    }

    const { data: occasions, error } = await query;

    if (error) {
      console.error('Supabase error fetching occasions:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error hint:', error.hint);
      throw error;
    }

    // Manually fetch default_lottie for each occasion
    const occasionsWithDefaults = await Promise.all(
      (occasions || []).map(async (occasion) => {
        let default_lottie = null;
        if (occasion.default_lottie) {
          const { data: lottie, error: lottieError } = await supabase
            .from('lottie_animations')
            .select('id, name, occasion_type, source_type, file_path, remote_url, helper_color')
            .eq('id', occasion.default_lottie)
            .single();

          if (lottieError) {
            console.error('Error fetching lottie for occasion', occasion.name, lottieError);
          } else {
            default_lottie = lottie;
          }
        }

        return {
          ...occasion,
          default_lottie
        };
      })
    );

    console.log('Occasions fetched successfully:', occasionsWithDefaults?.length);
    console.log('First occasion with lottie:', occasionsWithDefaults[0]);

    return { occasions: occasionsWithDefaults || [], error: null };
  } catch (error: any) {
    console.error('Error fetching occasions:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { occasions: [], error: error.message || 'Unknown error' };
  }
}

/**
 * Get occasions with their lottie animation data loaded
 */
export async function getOccasionsWithLottieData(limit?: number): Promise<{
  occasions: OccasionWithLottieData[];
  error: string | null;
}> {
  try {
    const { occasions, error } = await getOccasions(limit);

    if (error) {
      return { occasions: [], error };
    }

    // Load lottie animation data for each occasion
    const occasionsWithData = await Promise.all(
      occasions.map(async (occasion) => {
        let lottieData = null;

        if (occasion.default_lottie) {
          try {
            lottieData = await loadLottieAnimationData(occasion.default_lottie);
          } catch (err) {
            console.error(`Error loading lottie for ${occasion.name}:`, err);
          }
        }

        return {
          ...occasion,
          lottieData,
        };
      })
    );

    return { occasions: occasionsWithData, error: null };
  } catch (error: any) {
    console.error('Error fetching occasions with lottie data:', error);
    return { occasions: [], error: error.message };
  }
}

/**
 * Get a specific occasion by short_id
 */
export async function getOccasionByShortId(shortId: string) {
  try {
    const { data: occasion, error } = await supabase
      .from('occasions')
      .select('*')
      .eq('short_id', shortId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching occasion:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      throw error;
    }

    // Manually fetch default_lottie if ID exists
    let default_lottie = null;
    if (occasion?.default_lottie) {
      const { data: lottie, error: lottieError } = await supabase
        .from('lottie_animations')
        .select('id, name, occasion_type, source_type, file_path, remote_url, helper_color')
        .eq('id', occasion.default_lottie)
        .single();

      if (lottieError) {
        console.error('Error fetching lottie:', lottieError);
      } else {
        default_lottie = lottie;
      }
    }

    // Manually fetch default_effect if ID exists
    let default_effect = null;
    if (occasion?.default_effect) {
      console.log('Fetching effect with ID:', occasion.default_effect);
      const { data: effect, error: effectError } = await supabase
        .from('effects')
        .select('*')
        .eq('id', occasion.default_effect)
        .single();

      if (effectError) {
        console.error('Error fetching effect:', effectError);
        console.error('Effect error message:', effectError?.message);
        console.error('Effect error code:', effectError?.code);
        console.error('Effect error details:', effectError?.details);
      } else {
        console.log('Effect fetched successfully:', effect);
        default_effect = effect;
      }
    } else {
      console.log('No default_effect set for occasion:', occasion?.name);
    }

    // Combine the data
    const occasionWithDefaults = {
      ...occasion,
      default_lottie,
      default_effect
    };

    return { occasion: occasionWithDefaults, error: null };
  } catch (error: any) {
    console.error('Error fetching occasion:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { occasion: null, error: error.message || 'Unknown error' };
  }
}
