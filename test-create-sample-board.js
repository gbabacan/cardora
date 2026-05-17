// Create a sample board for testing
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mcphhtoacpkwtgmdycho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcGhodG9hY3Brd3RnbWR5Y2hvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM2NzMwNiwiZXhwIjoyMDkzOTQzMzA2fQ.3r-NYfvx8O4-ouvdLmc_m_CW9O2fNBSqzS7boDt6DNs'
);

async function createSampleBoard() {
  console.log('Creating sample board...\n');

  // First, get the first user from auth.users
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();

  if (userError || !users || users.users.length === 0) {
    console.error('No users found. Please sign in first at http://localhost:3000/login');
    return;
  }

  const userId = users.users[0].id;
  console.log(`Using user: ${users.users[0].email}\n`);

  // Generate UUID
  const boardId = crypto.randomUUID();
  const shortId = boardId.replace(/-/g, '').slice(-8).toLowerCase();

  // Create board
  const { data: board, error: boardError } = await supabase
    .from('boards')
    .insert({
      id: boardId,
      short_id: shortId,
      user_id: userId,
      title: 'Happy Birthday Sarah! 🎂',
      occasion_type: 'birthday',
      format_type: 'board',
      status: 'CREATED',
      notify_contributors: true,
      delivery_type: null,
      header_color: false,
      title_font: 'Inter',
      body_font: 'Inter',
      intro_animation: true,
      effects: null
    })
    .select()
    .single();

  if (boardError) {
    console.error('Error creating board:', boardError);
    return;
  }

  // Create recipient
  await supabase
    .from('recipients')
    .insert({
      board_id: boardId,
      name: 'Sarah'
    });

  console.log('✅ Sample board created successfully!\n');
  console.log('Board Details:');
  console.log(`  Title: ${board.title}`);
  console.log(`  ID: ${board.id}`);
  console.log(`  Short ID: ${board.short_id}`);
  console.log(`\n📋 Contributor View URL:`);
  console.log(`  http://localhost:3000/boards/${board.short_id}`);
  console.log(`\n✏️ Editor URL:`);
  console.log(`  http://localhost:3000/boards/editor?id=${board.id}`);
}

createSampleBoard();