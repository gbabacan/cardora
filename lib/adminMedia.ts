// Server-only helpers for the admin media library. Uses the service-role
// client, so never import this from client components.
import { supabaseAdmin } from '@/lib/serverAuth';
import { InputError } from '@/lib/adminTemplates';

export const MEDIA_BUCKET = 'media-library';
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export type MediaKind = 'lottie' | 'image';

export const MEDIA_TABLE: Record<MediaKind, 'lottie_animations' | 'images'> = {
  lottie: 'lottie_animations',
  image: 'images',
};

// Allowed uploads by extension, with the content type stored in the bucket.
export const UPLOAD_TYPES: Record<string, { kind: MediaKind; contentType: string }> = {
  json: { kind: 'lottie', contentType: 'application/json' },
  lottie: { kind: 'lottie', contentType: 'application/zip' },
  png: { kind: 'image', contentType: 'image/png' },
  jpg: { kind: 'image', contentType: 'image/jpeg' },
  jpeg: { kind: 'image', contentType: 'image/jpeg' },
  webp: { kind: 'image', contentType: 'image/webp' },
};

const SLUG = /^[a-z0-9][a-z0-9-]{0,49}$/;
const HEX = /^#[0-9a-f]{6}$/i;

export const isMediaKind = (value: unknown): value is MediaKind => value === 'lottie' || value === 'image';

export const extensionOf = (name: string) => name.toLowerCase().split('.').pop() ?? '';

export interface MediaFields {
  name?: string;
  occasion_type?: string;
  helper_color?: string;
  is_active?: boolean;
}

// Only fields present in the input are returned, for create and update.
export function cleanMediaFields(input: Record<string, unknown>): MediaFields {
  const out: MediaFields = {};
  if ('name' in input) {
    if (typeof input.name !== 'string' || !input.name.trim()) throw new InputError('Name is required');
    if (input.name.trim().length > 100) throw new InputError('Name is too long');
    out.name = input.name.trim();
  }
  if ('occasion_type' in input) {
    if (typeof input.occasion_type !== 'string' || !SLUG.test(input.occasion_type)) {
      throw new InputError('Occasion must be a lowercase slug');
    }
    out.occasion_type = input.occasion_type;
  }
  if ('helper_color' in input) {
    if (typeof input.helper_color !== 'string' || !HEX.test(input.helper_color)) {
      throw new InputError('Colour must be #RRGGBB');
    }
    out.helper_color = input.helper_color;
  }
  if ('is_active' in input) {
    if (typeof input.is_active !== 'boolean') throw new InputError('Active must be true or false');
    out.is_active = input.is_active;
  }
  return out;
}

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((b, i) => bytes[offset + i] === b);

// Checks the uploaded object really is what its extension claims, so the
// public bucket only ever serves animations and raster images.
export async function verifyUpload(path: string): Promise<void> {
  const ext = extensionOf(path);
  const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).download(path);
  if (error || !data) throw new InputError('Upload not found; try again');
  if (data.size === 0 || data.size > MAX_UPLOAD_BYTES) throw new InputError('File is empty or larger than 20 MB');
  const bytes = new Uint8Array(await data.arrayBuffer());

  let valid = false;
  if (ext === 'json') {
    try {
      const json = JSON.parse(new TextDecoder().decode(bytes));
      valid = typeof json === 'object' && json !== null && Array.isArray(json.layers) && typeof json.fr === 'number';
    } catch {
      valid = false;
    }
  } else if (ext === 'lottie') {
    valid = startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]); // zip
  } else if (ext === 'png') {
    valid = startsWith(bytes, [0x89, 0x50, 0x4e, 0x47]);
  } else if (ext === 'jpg' || ext === 'jpeg') {
    valid = startsWith(bytes, [0xff, 0xd8, 0xff]);
  } else if (ext === 'webp') {
    valid = startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8);
  }

  if (!valid) {
    await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([path]);
    throw new InputError(
      ext === 'json' ? 'That JSON file is not a Lottie animation' : `That file is not a valid .${ext} file`
    );
  }
}

// The bucket path of a file uploaded through the library, or null for files
// that live in /public or elsewhere.
export function bucketPathOf(url: string | null): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const at = url.indexOf(marker);
  return at === -1 ? null : decodeURIComponent(url.slice(at + marker.length));
}
