import { supabase } from './supabase';

// Helper function to get or create contributor for board owner
async function getOrCreateBoardOwnerContributor(boardId: string, userId: string, userName: string, userEmail?: string) {
  try {
    // First, check if contributor already exists for this board and user email
    let query = supabase
      .from('contributors')
      .select('id')
      .eq('board_id', boardId);

    if (userEmail) {
      query = query.eq('email', userEmail);
    } else {
      query = query.is('email', null);
    }

    const { data: existingContributor } = await query.maybeSingle();

    if (existingContributor) {
      return { contributorId: existingContributor.id, error: null };
    }

    // Create new contributor for board owner
    const { data: newContributor, error: contributorError } = await supabase
      .from('contributors')
      .insert({
        board_id: boardId,
        name: userName,
        email: userEmail || null,
        is_anonymous: false
      })
      .select('id')
      .single();

    if (contributorError) throw contributorError;

    return { contributorId: newContributor.id, error: null };
  } catch (error: any) {
    console.error('Error getting/creating contributor:', error);
    return { contributorId: null, error: error.message };
  }
}

// Upload media for a card
export async function uploadCardMedia(data: {
  board_id: string;
  user_id: string;
  user_name: string;
  user_email?: string;
  file: File;
  file_type: 'image' | 'gif' | 'video' | 'audio';
}) {
  try {
    // Get or create contributor for board owner
    const { contributorId, error: contributorError } = await getOrCreateBoardOwnerContributor(
      data.board_id,
      data.user_id,
      data.user_name,
      data.user_email
    );

    if (contributorError || !contributorId) {
      throw new Error(contributorError || 'Failed to create contributor');
    }

    // Generate unique filename
    const fileExt = data.file.name.split('.').pop();
    const fileName = `${data.board_id}/card-media/${Date.now()}.${fileExt}`;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('board-media')
      .upload(fileName, data.file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('board-media')
      .getPublicUrl(fileName);

    // Save media record to database
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .insert({
        board_id: data.board_id,
        message_id: null, // Cards don't have message_id
        contributor_id: contributorId,
        file_url: publicUrl,
        file_type: data.file_type,
        file_size: data.file.size
      })
      .select()
      .single();

    if (mediaError) throw mediaError;

    return { media, error: null };
  } catch (error: any) {
    console.error('Error uploading card media:', error);
    return { media: null, error: error.message };
  }
}

// Add external media URL (from Giphy or Unsplash) to a card
export async function addExternalMediaToCard(data: {
  board_id: string;
  user_id: string;
  user_name: string;
  user_email?: string;
  media_url: string;
  file_type: 'image' | 'gif' | 'video' | 'audio';
  thumbnail_url?: string;
}) {
  try {
    // Get or create contributor for board owner
    const { contributorId, error: contributorError } = await getOrCreateBoardOwnerContributor(
      data.board_id,
      data.user_id,
      data.user_name,
      data.user_email
    );

    if (contributorError || !contributorId) {
      throw new Error(contributorError || 'Failed to create contributor');
    }

    // Save media record to database with external URL
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .insert({
        board_id: data.board_id,
        message_id: null, // Cards don't have message_id
        contributor_id: contributorId,
        file_url: data.media_url,
        file_type: data.file_type,
        file_size: 0, // External media doesn't have size info
        thumbnail_url: data.thumbnail_url
      })
      .select()
      .single();

    if (mediaError) throw mediaError;

    return { media, error: null };
  } catch (error: any) {
    console.error('Error adding external media to card:', error);
    return { media: null, error: error.message };
  }
}

// Get card media for a board
export async function getCardMedia(boardId: string) {
  try {
    const { data: media, error } = await supabase
      .from('media')
      .select('*')
      .eq('board_id', boardId)
      .is('message_id', null) // Only get card media (not message media)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { media: media || [], error: null };
  } catch (error: any) {
    console.error('Error fetching card media:', error);
    return { media: [], error: error.message };
  }
}

// Delete card media
export async function deleteCardMedia(mediaId: string, fileUrl?: string) {
  try {
    // If it's an uploaded file (not external), delete from storage
    if (fileUrl && fileUrl.includes('board-media')) {
      const fileName = fileUrl.split('board-media/')[1];
      if (fileName) {
        await supabase.storage
          .from('board-media')
          .remove([fileName]);
      }
    }

    // Delete media record from database
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', mediaId);

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error('Error deleting card media:', error);
    return { error: error.message };
  }
}