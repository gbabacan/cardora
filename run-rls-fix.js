// Run the RLS fix migration
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://mcphhtoacpkwtgmdycho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcGhodG9hY3Brd3RnbWR5Y2hvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM2NzMwNiwiZXhwIjoyMDkzOTQzMzA2fQ.3r-NYfvx8O4-ouvdLmc_m_CW9O2fNBSqzS7boDt6DNs',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function runMigration() {
  console.log('Reading SQL file...\n');

  const sql = fs.readFileSync('./supabase/fix_rls_policies.sql', 'utf8');

  // Split by semicolon and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Executing ${statements.length} SQL statements...\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comments
    if (statement.startsWith('--')) continue;

    console.log(`${i + 1}. Executing: ${statement.substring(0, 60)}...`);

    const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

    if (error) {
      console.error(`   ❌ Error:`, error.message);
    } else {
      console.log(`   ✅ Success`);
    }
  }

  console.log('\n✅ Migration completed!');
  console.log('\nTesting access with anon key...\n');

  // Test with anon key
  const anonSupabase = createClient(
    'https://mcphhtoacpkwtgmdycho.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcGhodG9hY3Brd3RnbWR5Y2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNjczMDYsImV4cCI6MjA5Mzk0MzMwNn0.1u6n_KN-qRtxEy7bW-FQVPgnM2FX1bITZWI7zmGNjm0'
  );

  const { data: boards, error: boardError } = await anonSupabase
    .from('boards')
    .select('short_id, title, status')
    .neq('status', 'DELETED');

  if (boardError) {
    console.error('Error:', boardError);
  } else {
    console.log(`✅ Can now access ${boards.length} boards with anon key:\n`);
    boards.forEach(b => {
      console.log(`   • ${b.title} (${b.short_id})`);
      console.log(`     URL: http://localhost:3000/boards/${b.short_id}`);
    });
  }
}

runMigration().catch(console.error);