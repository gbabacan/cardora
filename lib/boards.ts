import { supabase } from './supabase';
import type { Background } from './backgrounds';
import { createSolidBackground } from './backgrounds';
import type { Effect } from './effects';

export interface Board {
  id: string;
  short_id: string;
  user_id: string;
  title: string;
  occasion_type: string;
  format_type: 'board' | 'card';
  status: 'CREATED' | 'DELETED' | 'PUBLISHED' | 'DELIVERED';
  recipient_message?: string;
  notify_contributors: boolean;
  delivery_type: 'ON_DEMAND' | 'SCHEDULED';
  scheduled_delivery?: string;
  background?: string;
  background_id?: string;
  header_color: boolean;
  header_color_code?: string;
  title_font: string;
  title_font_size?: number;
  title_font_color?: string;
  body_font: string;
  intro_animation: boolean;
  effects: string;
  effect_id?: string;
  created_at: string;
  updated_at: string;

  // Joined data
  background_data?: Background;
  effect_data?: Effect;
}

export interface Recipient {
  id: string;
  board_id: string;
  name: string;
  email?: string;
  created_at: string;
}

export interface Contributor {
  id: string;
  board_id: string;
  name: string;
  email?: string;
  is_anonymous: boolean;
  created_at: string;
}

// Create a new board
export async function createBoard(data: {
  title: string;
  occasion_type: string;
  format_type: 'board' | 'card';
  recipients: string[];
}) {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated');

    // Generate UUID
    const boardId = crypto.randomUUID();

    // Extract last 8 characters for short_id (removing hyphens)
    const shortId = boardId.replace(/-/g, '').slice(-8).toLowerCase();

    // Create default light teal solid background
    const defaultBackgroundColor = '#B2F5EA'; // Light teal from the color palette
    const { data: defaultBackground } = await createSolidBackground(defaultBackgroundColor);

    // Insert board
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .insert({
        id: boardId,
        short_id: shortId,
        user_id: user.id,
        title: data.title,
        occasion_type: data.occasion_type,
        format_type: data.format_type,
        status: 'CREATED',
        notify_contributors: true,
        delivery_type: null,
        header_color: false,
        header_color_code: null,
        title_font: 'Open Sans',
        title_font_size: 48,
        title_font_color: '#1F2937',
        body_font: 'Open Sans',
        intro_animation: true,
        effects: null,
        background_id: defaultBackground?.id || null
      })
      .select()
      .single();

    if (boardError) throw boardError;

    // Insert recipients
    const recipientsData = data.recipients
      .filter(r => r.trim())
      .map(name => ({
        board_id: boardId,
        name: name.trim()
      }));

    if (recipientsData.length > 0) {
      const { error: recipientsError } = await supabase
        .from('recipients')
        .insert(recipientsData);

      if (recipientsError) throw recipientsError;
    }

    return { board, error: null };
  } catch (error: any) {
    console.error('Error creating board:', error);
    return { board: null, error: error.message };
  }
}

// Get board by ID
export async function getBoardById(boardId: string) {
  try {
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select(`
        *,
        background_data:backgrounds(
          *,
          pattern:patterns(*),
          lottie_animation:lottie_animations(*)
        ),
        effect_data:effects(*)
      `)
      .eq('id', boardId)
      .single();

    if (boardError) throw boardError;

    // Get recipients
    const { data: recipients, error: recipientsError } = await supabase
      .from('recipients')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: true });

    if (recipientsError) throw recipientsError;

    return { board, recipients: recipients || [], error: null };
  } catch (error: any) {
    return { board: null, recipients: [], error: error.message };
  }
}

// Get board by short_id
export async function getBoardByShortId(shortId: string) {
  try {
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select(`
        *,
        background_data:backgrounds(
          *,
          pattern:patterns(*),
          lottie_animation:lottie_animations(*)
        ),
        effect_data:effects(*)
      `)
      .eq('short_id', shortId)
      .single();

    if (boardError) throw boardError;

    // Get recipients
    const { data: recipients, error: recipientsError } = await supabase
      .from('recipients')
      .select('*')
      .eq('board_id', board.id)
      .order('created_at', { ascending: true });

    if (recipientsError) throw recipientsError;

    return { board, recipients: recipients || [], error: null };
  } catch (error: any) {
    return { board: null, recipients: [], error: error.message };
  }
}

// Update board
export async function updateBoard(boardId: string, updates: Partial<Omit<Board, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'short_id'>>) {
  try {
    const { data: board, error } = await supabase
      .from('boards')
      .update(updates)
      .eq('id', boardId)
      .select()
      .single();

    if (error) throw error;
    return { board, error: null };
  } catch (error: any) {
    return { board: null, error: error.message };
  }
}

// Update recipients for a board
export async function updateBoardRecipients(
  boardId: string,
  recipients: { name: string; email?: string }[]
) {
  try {
    // Delete existing recipients
    await supabase
      .from('recipients')
      .delete()
      .eq('board_id', boardId);

    // Insert new recipients
    if (recipients.length > 0) {
      const recipientsData = recipients
        .filter(r => r.name.trim())
        .map(r => ({
          board_id: boardId,
          name: r.name.trim(),
          email: r.email || null
        }));

      const { error } = await supabase
        .from('recipients')
        .insert(recipientsData);

      if (error) throw error;
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Add contributors to a board (for invites)
export async function addContributors(
  boardId: string,
  emails: string[]
) {
  try {
    // Filter out empty emails and create contributor records
    const contributorsData = emails
      .filter(email => email.trim())
      .map(email => ({
        board_id: boardId,
        name: email.split('@')[0], // Use email prefix as name placeholder
        email: email.trim(),
        is_anonymous: false
      }));

    if (contributorsData.length === 0) {
      return { contributors: [], error: 'No valid emails provided' };
    }

    const { data: contributors, error } = await supabase
      .from('contributors')
      .insert(contributorsData)
      .select();

    if (error) throw error;

    return { contributors, error: null };
  } catch (error: any) {
    return { contributors: null, error: error.message };
  }
}

// Check if board has messages
export async function getBoardMessageCount(boardId: string) {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('board_id', boardId);

    if (error) throw error;

    return { count: count || 0, error: null };
  } catch (error: any) {
    return { count: 0, error: error.message };
  }
}

// Get contributors for a board
export async function getBoardContributors(boardId: string) {
  try {
    const { data: contributors, error } = await supabase
      .from('contributors')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { contributors: contributors || [], error: null };
  } catch (error: any) {
    return { contributors: [], error: error.message };
  }
}

// Get all boards for the current user
export async function getUserBoards() {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated');

    const { data: boards, error } = await supabase
      .from('boards')
      .select(`
        *,
        recipients(*)
      `)
      .eq('user_id', user.id)
      .neq('status', 'DELETED')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { boards: boards || [], error: null };
  } catch (error: any) {
    return { boards: [], error: error.message };
  }
}

// Delete a board (soft delete - sets status to DELETED)
export async function deleteBoard(boardId: string) {
  try {
    const { error } = await supabase
      .from('boards')
      .update({ status: 'DELETED' })
      .eq('id', boardId);

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}