/**
 * Script to fetch actual Lottie JSON URLs from LottieFiles pages
 * Reads lotties.MD and outputs SQL UPDATE statements with real CDN URLs
 */

const fs = require('fs');
const https = require('https');

// Read lotties.MD file
const lottiesData = fs.readFileSync('../lotties.MD', 'utf8');
const lines = lottiesData.trim().split('\n');

const animations = lines.map(line => {
  const [occasion, url] = line.split(' | ');
  const slug = url.split('/').pop();
  return { occasion, url, slug };
});

console.log(`Found ${animations.length} animations to process...\n`);

// Function to fetch page and extract JSON URL
async function fetchJsonUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Look for the JSON variant path in the page source
          // Pattern: "path":"a/UUID/FILENAME.json"
          const jsonMatch = data.match(/"path":"(a\/[^"]+\.json)"/);

          if (jsonMatch) {
            const jsonPath = jsonMatch[1];
            const fullUrl = `https://assets-v2.lottiefiles.com/${jsonPath}`;
            resolve(fullUrl);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Process all animations
async function processAnimations() {
  const results = [];

  for (let i = 0; i < animations.length; i++) {
    const { occasion, url, slug } = animations[i];

    try {
      console.log(`[${i + 1}/${animations.length}] Processing: ${slug}...`);
      const jsonUrl = await fetchJsonUrl(url);

      if (jsonUrl) {
        results.push({ occasion, slug, jsonUrl });
        console.log(`  ✓ Found: ${jsonUrl}`);
      } else {
        console.log(`  ✗ Could not find JSON URL`);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }

  // Generate SQL UPDATE statements
  console.log('\n\n--- SQL UPDATE STATEMENTS ---\n');

  results.forEach(({ occasion, jsonUrl }) => {
    console.log(`UPDATE lottie_animations SET remote_url = '${jsonUrl}' WHERE occasion_type = '${occasion}' AND source_type = 'remote';`);
  });

  // Save to file
  const sqlStatements = results.map(({ occasion, jsonUrl }) =>
    `UPDATE lottie_animations SET remote_url = '${jsonUrl}' WHERE occasion_type = '${occasion}' AND source_type = 'remote';`
  ).join('\n');

  fs.writeFileSync('../supabase/update_lottie_urls.sql', sqlStatements);
  console.log(`\n✓ SQL updates saved to: supabase/update_lottie_urls.sql`);
}

// Run the script
processAnimations().catch(console.error);