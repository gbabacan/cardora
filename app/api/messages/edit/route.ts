import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let message_id: string, edit_token: string, content: string;
    let removeMedia = false;
    let gifUrl: string | null = null;
    let unsplashUrl: string | null = null;
    let unsplashAuthor: string | null = null;
    let unsplashAuthorUrl: string | null = null;
    let mediaFile: File | null = null;
    let mediaType: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      message_id = formData.get('message_id') as string;
      edit_token = formData.get('edit_token') as string;
      content = formData.get('content') as string;
      removeMedia = formData.get('remove_media') === 'true';
      gifUrl = formData.get('gif_url') as string | null;
      unsplashUrl = formData.get('unsplash_url') as string | null;
      unsplashAuthor = formData.get('unsplash_author') as string | null;
      unsplashAuthorUrl = formData.get('unsplash_author_url') as string | null;
      const file = formData.get('media_file');
      if (file instanceof File) mediaFile = file;
      mediaType = formData.get('media_type') as string | null;
    } else {
      const body = await request.json();
      message_id = body.message_id;
      edit_token = body.edit_token;
      content = body.content;
    }

    if (!message_id || !edit_token || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the edit token
    const { data: message, error: fetchError } = await supabaseAdmin
      .from('messages')
      .select('id, edit_token, board_id, contributor_id')
      .eq('id', message_id)
      .single();

    if (fetchError || !message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    if (message.edit_token !== edit_token) {
      return NextResponse.json({ error: 'Invalid edit token' }, { status: 403 });
    }

    // Update the message content
    const { error: updateError } = await supabaseAdmin
      .from('messages')
      .update({ content: content.trim() })
      .eq('id', message_id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }

    // Handle media changes
    if (removeMedia || gifUrl || unsplashUrl || mediaFile) {
      // Delete existing media first
      await supabaseAdmin.from('media').delete().eq('message_id', message_id);
    }

    // Add new media if provided
    if (gifUrl && mediaType === 'gif') {
      await supabaseAdmin.from('media').insert({
        board_id: message.board_id,
        message_id,
        contributor_id: message.contributor_id,
        file_url: gifUrl,
        file_type: 'gif',
        file_size: 0
      });
    } else if (unsplashUrl && mediaType === 'image') {
      await supabaseAdmin.from('media').insert({
        board_id: message.board_id,
        message_id,
        contributor_id: message.contributor_id,
        file_url: unsplashUrl,
        file_type: 'image',
        file_size: 0,
        unsplash_author: unsplashAuthor,
        unsplash_author_url: unsplashAuthorUrl
      });
    } else if (mediaFile && mediaType) {
      // Upload file to storage
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `${message.board_id}/${message_id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('board-media')
        .upload(fileName, mediaFile, { cacheControl: '3600', upsert: false });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabaseAdmin.storage.from('board-media').getPublicUrl(fileName);
        await supabaseAdmin.from('media').insert({
          board_id: message.board_id,
          message_id,
          contributor_id: message.contributor_id,
          file_url: urlData.publicUrl,
          file_type: mediaType,
          file_size: mediaFile.size
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
