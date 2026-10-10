// The board title sits in the white page header, so the board's title font
// and colour still apply but its size and header colour no longer do.

const DEFAULT_TITLE_COLOR = '#0B1F2A';

// Relative luminance check (WCAG) for title colours on the white header
function isReadableOnWhite(hex: string | undefined): hex is string {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return false;
  const [r, g, b] = [1, 3, 5].map(i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Slightly below the WCAG 3:1 large-text ratio so mid-tones like the brand
  // teal still pass, while white, yellows and pastels do not
  return 1.05 / (luminance + 0.05) >= 2.5;
}

// Colours picked for the old dark title band (white, pale yellow) would
// vanish on white, so those fall back to the default dark
export function headerTitleColor(color: string | undefined): string {
  return isReadableOnWhite(color) ? color : DEFAULT_TITLE_COLOR;
}
