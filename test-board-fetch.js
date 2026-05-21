// Test script to debug getBoardById issue
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testGetBoardById() {
  const boardId = '1449e52e-1218-42ee-bce7-d3c455fcb0e9';

  console.log('Testing getBoardById with board ID:', boardId);

  try {
    // First, check if the column exists
    const { data: simpleBoard, error: simpleError } = await supabase
      .from('boards')
      .select('id, card_background_id, background_id')
      .eq('id', boardId)
      .single();

    if (simpleError) {
      console.error('Error fetching basic board data:', simpleError);
      return;
    }

    console.log('Basic board data:');
    console.log('- card_background_id:', simpleBoard.card_background_id);
    console.log('- background_id:', simpleBoard.background_id);

  } catch (error) {
    console.error('Exception:', error);
  }
}

testGetBoardById();