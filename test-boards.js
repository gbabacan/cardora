// Quick test script to check boards in database
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mcphhtoacpkwtgmdycho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcGhodG9hY3Brd3RnbWR5Y2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNjczMDYsImV4cCI6MjA5Mzk0MzMwNn0.1u6n_KN-qRtxEy7bW-FQVPgnM2FX1bITZWI7zmGNjm0'
);

async function checkBoards() {
  console.log('Fetching all boards...\n');

  const { data: boards, error } = await supabase
    .from('boards')
    .select('id, short_id, title, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (!boards || boards.length === 0) {
    console.log('No boards found in database.');
    return;
  }

  console.log(`Found ${boards.length} board(s):\n`);

  boards.forEach((board, index) => {
    console.log(`${index + 1}. Board: "${board.title}"`);
    console.log(`   ID: ${board.id}`);
    console.log(`   Short ID: ${board.short_id}`);
    console.log(`   Status: ${board.status}`);
    console.log(`   URL: http://localhost:3000/boards/${board.short_id}`);
    console.log('');
  });
}

checkBoards();