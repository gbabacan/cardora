import { supabase } from './supabase';

export interface ImageItem {
  id: string;
  name: string | null;
  occasion_type: string | null;
  file_path: string | null;
  helper_color: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  source_type: string;
  remote_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAllImages() {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('is_active', true)
      .order('occasion_type, name');

    if (error) throw error;
    return { images: (data as ImageItem[]) || [], error: null };
  } catch (error: any) {
    return { images: [], error: error.message };
  }
}

export function groupImagesByOccasion(images: ImageItem[]): Record<string, ImageItem[]> {
  return images.reduce((acc, image) => {
    const key = image.occasion_type || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(image);
    return acc;
  }, {} as Record<string, ImageItem[]>);
}

export function getImageUrl(image: ImageItem): string {
  return image.source_type === 'local'
    ? (image.file_path || '')
    : (image.remote_url || '');
}
