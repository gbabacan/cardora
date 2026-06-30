/**
 * Extracts the average dominant color from an image URL using canvas.
 * Returns a lightened version suitable for use as a background fill.
 */
export async function extractDominantColor(
  imageUrl: string,
  lighten = 0.45
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve('#F7FAFC'); return; }

        ctx.drawImage(img, 0, 0, 50, 50);
        const { data } = ctx.getImageData(0, 0, 50, 50);

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          // Skip near-transparent pixels
          if (data[i + 3] < 128) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        if (count === 0) { resolve('#F7FAFC'); return; }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // Lighten toward white so it works as a subtle background fill
        r = Math.round(r + (255 - r) * lighten);
        g = Math.round(g + (255 - g) * lighten);
        b = Math.round(b + (255 - b) * lighten);

        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch {
        resolve('#F7FAFC');
      }
    };
    img.onerror = () => resolve('#F7FAFC');
    img.src = imageUrl;
  });
}
