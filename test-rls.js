// Test with service role key to bypass RLS
const { createClient } = require('@supabase/supabase-js');

// Test with service role (bypasses RLS)
const supabaseAdmin = createClient(
  'https://mcphhtoacpkwtgmdycho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcGhodG9hY3Brd3RnbWR5Y2hvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM2NzMwNiwiZXhwIjoyMDkzOTQzMzA2fQ.3r-NYfvx8O4-ouvdLmc_m_CW9O2fNBSqzS7boDt6DNs',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Test with anon key (uses RLS)
const supabaseAnon = createClient(
  'https://mcphhtoacpkwtgmdycho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcGhodG9hY3Brd3RnbWR5Y2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNjczMDYsImV4cCI6MjA5Mzk0MzMwNn0.1u6n_KN-qRtxEy7bW-FQVPgnM2FX1bITZWI7zmGNjm0'
);

async function testRLS() {
  console.log('=== Testing with SERVICE ROLE (bypasses RLS) ===\n');

  const { data: adminBoards, error: adminError } = await supabaseAdmin
    .from('boards')
    .select('id, short_id, title, status, user_id')
    .order('created_at', { ascending: false });

  if (adminError) {
    console.error('Admin Error:', adminError);
  } else {
    console.log(`Found ${adminBoards?.length || 0} boards with admin access:`);
    adminBoards?.forEach((board, i) => {
      console.log(`  ${i + 1}. ${board.title}`);
      console.log(`     Short ID: ${board.short_id}`);
      console.log(`     Status: ${board.status}`);
      console.log(`     User ID: ${board.user_id}`);
    });
  }

  console.log('\n=== Testing with ANON KEY (uses RLS) ===\n');

  const { data: anonBoards, error: anonError } = await supabaseAnon
    .from('boards')
    .select('id, short_id, title, status')
    .order('created_at', { ascending: false });

  if (anonError) {
    console.error('Anon Error:', anonError);
  } else {
    console.log(`Found ${anonBoards?.length || 0} boards with anon access:`);
    anonBoards?.forEach((board, i) => {
      console.log(`  ${i + 1}. ${board.title}`);
      console.log(`     Short ID: ${board.short_id}`);
    });
  }

  // Now test fetching by short_id specifically
  if (adminBoards && adminBoards.length > 0) {
    const testShortId = adminBoards[0].short_id;
    console.log(`\n=== Testing getBoardByShortId('${testShortId}') ===\n`);

    const { data: board, error } = await supabaseAnon
      .from('boards')
      .select('*')
      .eq('short_id', testShortId)
      .single();

    if (error) {
      console.error('Error fetching by short_id:', error);
    } else {
      console.log('✅ Successfully fetched board:', board?.title);
    }
  }
}

testRLS();