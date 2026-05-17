import { NextRequest, NextResponse } from 'next/server';
import { createMessage, uploadMessageMedia, addGifToMessage, addUnsplashToMessage } from '@/lib/messages';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const board_id = formData.get('board_id') as string;
    const contributor_name = formData.get('contributor_name') as string;
    const contributor_email = formData.get('contributor_email') as string | null;
    const content = formData.get('content') as string;
    const is_anonymous = formData.get('is_anonymous') === 'true';
    const mediaFile = formData.get('media_file') as File | null;
    const gif_url = formData.get('gif_url') as string | null;
    const unsplash_url = formData.get('unsplash_url') as string | null;
    const unsplash_author = formData.get('unsplash_author') as string | null;
    const unsplash_author_url = formData.get('unsplash_author_url') as string | null;
    const media_type = formData.get('media_type') as 'image' | 'gif' | 'video' | 'audio' | null;

    if (!board_id || !contributor_name || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the message
    const { message, contributorId, error: messageError } = await createMessage({
      board_id,
      contributor_name,
      contributor_email: contributor_email || undefined,
      content,
      is_anonymous
    });

    if (messageError || !message || !contributorId) {
      return NextResponse.json(
        { error: messageError || 'Failed to create message' },
        { status: 500 }
      );
    }

    // Handle media
    if (media_type === 'gif' && gif_url) {
      // Add GIF from Giphy URL
      const { error: gifError } = await addGifToMessage({
        board_id,
        message_id: message.id,
        contributor_id: contributorId,
        gif_url
      });

      if (gifError) {
        console.error('GIF add error:', gifError);
        // Don't fail the whole request if GIF add fails
      }
    } else if (media_type === 'image' && unsplash_url && unsplash_author && unsplash_author_url) {
      // Add photo from Unsplash URL
      const { error: unsplashError } = await addUnsplashToMessage({
        board_id,
        message_id: message.id,
        contributor_id: contributorId,
        unsplash_url,
        unsplash_author,
        unsplash_author_url
      });

      if (unsplashError) {
        console.error('Unsplash photo add error:', unsplashError);
        // Don't fail the whole request if photo add fails
      }
    } else if (mediaFile && media_type) {
      // Upload media file
      const { error: mediaError } = await uploadMessageMedia({
        board_id,
        message_id: message.id,
        contributor_id: contributorId,
        file: mediaFile,
        file_type: media_type
      });

      if (mediaError) {
        console.error('Media upload error:', mediaError);
        // Don't fail the whole request if media upload fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Message posted successfully',
      data: message
    });

  } catch (error: any) {
    console.error('Error in create message API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}