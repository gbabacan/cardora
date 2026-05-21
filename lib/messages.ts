import { supabase } from './supabase';

export interface Message {
  id: string;
  board_id: string;
  contributor_id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  contributor?: {
    name: string;
    email?: string;
    is_anonymous: boolean;
  };
  media?: {
    id: string;
    file_url: string;
    file_type: 'image' | 'gif' | 'video' | 'audio';
    thumbnail_url?: string;
  }[];
}

// Get all messages for a board
export async function getBoardMessages(boardId: string) {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        contributor:contributors(name, email, is_anonymous),
        media(id, file_url, file_type, thumbnail_url)
      `)
      .eq('board_id', boardId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { messages: messages || [], error: null };
  } catch (error: any) {
    return { messages: [], error: error.message };
  }
}

// Create a new message
export async function createMessage(data: {
  board_id: string;
  contributor_name: string;
  contributor_email?: string;
  content: string;
  is_anonymous?: boolean;
}) {
  try {
    // First, create or find the contributor
    const { data: existingContributor, error: findError } = await supabase
      .from('contributors')
      .select('id')
      .eq('board_id', data.board_id)
      .eq('email', data.contributor_email || '')
      .single();

    let contributorId: string;

    if (existingContributor) {
      contributorId = existingContributor.id;
    } else {
      // Create new contributor
      const { data: newContributor, error: contributorError } = await supabase
        .from('contributors')
        .insert({
          board_id: data.board_id,
          name: data.contributor_name,
          email: data.contributor_email || null,
          is_anonymous: data.is_anonymous || false
        })
        .select()
        .single();

      if (contributorError) throw contributorError;
      contributorId = newContributor.id;
    }

    // Create the message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        board_id: data.board_id,
        contributor_id: contributorId,
        content: data.content,
        is_approved: true // Auto-approve for now
      })
      .select()
      .single();

    if (messageError) throw messageError;

    return { message, contributorId, error: null };
  } catch (error: any) {
    console.error('Error creating message:', error);
    return { message: null, contributorId: null, error: error.message };
  }
}

// Upload media for a message
export async function uploadMessageMedia(data: {
  board_id: string;
  message_id: string;
  contributor_id: string;
  file: File;
  file_type: 'image' | 'gif' | 'video' | 'audio';
}) {
  try {
    // Generate unique filename
    const fileExt = data.file.name.split('.').pop();
    const fileName = `${data.board_id}/${data.message_id}/${Date.now()}.${fileExt}`;

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
        message_id: data.message_id,
        contributor_id: data.contributor_id,
        file_url: publicUrl,
        file_type: data.file_type,
        file_size: data.file.size
      })
      .select()
      .single();

    if (mediaError) throw mediaError;

    return { media, error: null };
  } catch (error: any) {
    console.error('Error uploading media:', error);
    return { media: null, error: error.message };
  }
}

// Add GIF URL (from Giphy) to a message
export async function addGifToMessage(data: {
  board_id: string;
  message_id: string;
  contributor_id: string;
  gif_url: string;
}) {
  try {
    // Save media record to database with external GIF URL
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .insert({
        board_id: data.board_id,
        message_id: data.message_id,
        contributor_id: data.contributor_id,
        file_url: data.gif_url,
        file_type: 'gif',
        file_size: 0 // GIFs from Giphy don't have size info
      })
      .select()
      .single();

    if (mediaError) throw mediaError;

    return { media, error: null };
  } catch (error: any) {
    console.error('Error adding GIF to message:', error);
    return { media: null, error: error.message };
  }
}

// Add Unsplash photo to a message
export async function addUnsplashToMessage(data: {
  board_id: string;
  message_id: string;
  contributor_id: string;
  unsplash_url: string;
  unsplash_author: string;
  unsplash_author_url: string;
}) {
  try {
    // Save media record to database with Unsplash photo URL
    // Note: Store author info in thumbnail_url field as JSON for now
    // Format: {"author": "Name", "url": "link"}
    const authorInfo = JSON.stringify({
      author: data.unsplash_author,
      url: data.unsplash_author_url
    });

    const { data: media, error: mediaError } = await supabase
      .from('media')
      .insert({
        board_id: data.board_id,
        message_id: data.message_id,
        contributor_id: data.contributor_id,
        file_url: data.unsplash_url,
        file_type: 'image',
        file_size: 0, // External images don't have size info
        thumbnail_url: authorInfo // Store author attribution temporarily here
      })
      .select()
      .single();

    if (mediaError) throw mediaError;

    return { media, error: null };
  } catch (error: any) {
    console.error('Error adding Unsplash photo to message:', error);
    return { media: null, error: error.message };
  }
}

// Delete all media for a message
export async function deleteMessageMedia(messageId: string) {
  try {
    // First, get all media for this message to delete files from storage
    const { data: mediaList, error: fetchError } = await supabase
      .from('media')
      .select('id, file_url')
      .eq('message_id', messageId);

    if (fetchError) throw fetchError;

    // Delete files from storage (only for uploaded files, not external URLs)
    if (mediaList) {
      for (const media of mediaList) {
        if (media.file_url.includes('board-media')) {
          const fileName = media.file_url.split('board-media/')[1];
          if (fileName) {
            await supabase.storage
              .from('board-media')
              .remove([fileName]);
          }
        }
      }
    }

    // Delete media records from database
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('message_id', messageId);

    if (deleteError) throw deleteError;

    return { error: null };
  } catch (error: any) {
    console.error('Error deleting message media:', error);
    return { error: error.message };
  }
}