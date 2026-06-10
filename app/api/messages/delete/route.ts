import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const { message_id, edit_token } = await request.json();

    if (!message_id || !edit_token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the edit token matches
    const { data: message, error: fetchError } = await supabaseAdmin
      .from('messages')
      .select('id, edit_token')
      .eq('id', message_id)
      .single();

    if (fetchError || !message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    if (message.edit_token !== edit_token) {
      return NextResponse.json({ error: 'Invalid edit token' }, { status: 403 });
    }

    // Delete the message
    const { error: deleteError } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', message_id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
