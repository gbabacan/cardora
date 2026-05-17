# How to Extract Lottie JSON URLs from LottieFiles

Since LottieFiles pages are JavaScript-rendered, we need to use the browser DevTools.

## Method 1: Browser DevTools (Fastest for individual URLs)

1. Open the animation page (e.g., `https://lottiefiles.com/free-animation/thank-you-4779dnZ81h`)
2. Open DevTools (F12)
3. Go to Console tab
4. Paste this code and press Enter:

```javascript
// Find the JSON URL in the page's React state
const jsonVariant = window.__reactRouterContext?.state?.loaderData?.data?.data?.variants?.find(v => v.type === 'json');
if (jsonVariant) {
  const url = `https://assets-v2.lottiefiles.com/${jsonVariant.path}`;
  console.log(url);
  navigator.clipboard.writeText(url);
  alert('URL copied to clipboard: ' + url);
} else {
  alert('Could not find JSON URL');
}
```

The URL will be copied to your clipboard!

## Method 2: Network Tab

1. Open the animation page
2. Open DevTools (F12) → Network tab
3. Filter by "json"
4. Look for a request ending in `.json` from `assets-v2.lottiefiles.com`
5. Right-click → Copy → Copy URL

## Method 3: Inspect the Lottie Player

1. Right-click on the animation → Inspect
2. Look at the parent elements for a `<lottie-player>` or similar component
3. Check its attributes for a `src` or data attribute with the JSON URL

## Quick Test URLs (Already confirmed working):

```sql
-- Thank You (thankyou occasion - last one in the list)
UPDATE lottie_animations 
SET remote_url = 'https://assets-v2.lottiefiles.com/a/6a0cd638-48b9-11ef-b744-db583b43c862/KzeQAnBTz3.json', is_active = true
WHERE occasion_type = 'thankyou' 
  AND name = 'Thank You Celebration'
  AND source_type = 'remote';
```

## Batch Processing Steps

For each animation in `lotties.MD`:

1. Visit the URL
2. Run the DevTools script above  
3. The URL is copied to clipboard
4. Create UPDATE statement:

```sql
UPDATE lottie_animations 
SET remote_url = '<PASTE_URL_HERE>', is_active = true
WHERE occasion_type = '<occasion>' 
  AND source_type = 'remote'
  LIMIT 1;
```

## Alternative: Keep Using Local Files

Instead of fetching all 28 remote URLs, you could:
1. Download a few key animations as local files
2. Store them in `/public/lotties/<occasion>/`
3. Use `source_type='local'` and `file_path='/lotties/occasion/animation.json'`

This avoids dependency on external CDNs and is faster for users!