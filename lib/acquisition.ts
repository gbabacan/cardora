// First-touch acquisition: where a visitor first came from, kept in
// localStorage so a board they create on a later visit is still credited to
// it. A utm_source on the link wins; otherwise the referring site, mapped to a
// short name (google, linkedin, saashub…); otherwise "direct".
//
// Browser only. Everything is best effort: storage can be blocked, and then
// boards are simply saved without a source.

export interface Acquisition {
  source: string;
  medium: string | null;
  campaign: string | null;
  referrer: string | null;
  landing: string;
  first_seen: string;
}

const KEY = 'cardora_acquisition';
const MAX_AGE_DAYS = 90;

// Referring hosts mapped to a source name and medium. First match wins, so
// specific hosts (gemini.google.com) come before broad ones (google.).
const KNOWN_REFERRERS: [RegExp, string, string][] = [
  [/(^|\.)gemini\.google\./, 'gemini', 'ai'],
  [/(^|\.)google\./, 'google', 'organic'],
  [/(^|\.)bing\.com$/, 'bing', 'organic'],
  [/(^|\.)duckduckgo\.com$/, 'duckduckgo', 'organic'],
  [/(^|\.)yahoo\./, 'yahoo', 'organic'],
  [/(^|\.)yandex\./, 'yandex', 'organic'],
  [/(^|\.)ecosia\.org$/, 'ecosia', 'organic'],
  [/(^|\.)(chatgpt\.com|chat\.openai\.com)$/, 'chatgpt', 'ai'],
  [/(^|\.)perplexity\.ai$/, 'perplexity', 'ai'],
  [/(^|\.)claude\.ai$/, 'claude', 'ai'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin', 'social'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'facebook', 'social'],
  [/(^|\.)instagram\.com$/, 'instagram', 'social'],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, 'x', 'social'],
  [/(^|\.)reddit\.com$/, 'reddit', 'social'],
  [/(^|\.)news\.ycombinator\.com$/, 'hackernews', 'social'],
  [/(^|\.)indiehackers\.com$/, 'indiehackers', 'social'],
  [/(^|\.)alternativeto\.net$/, 'alternativeto', 'referral'],
  [/(^|\.)saashub\.com$/, 'saashub', 'referral'],
  [/(^|\.)uneed\.best$/, 'uneed', 'referral'],
  [/(^|\.)betalist\.com$/, 'betalist', 'referral'],
  [/(^|\.)producthunt\.com$/, 'producthunt', 'referral'],
];

// Hosts that send people back to us without being a source: our own pages,
// previews, and sign-in providers returning from OAuth.
const IGNORED_REFERRERS = [
  /(^|\.)cardora\.cards$/,
  /\.vercel\.app$/,
  /^localhost$/,
  /(^|\.)supabase\.co$/,
  /^accounts\.google\./,
];

// UTM values come from links anyone can write, so keep them short and plain.
const clean = (value: string | null) => {
  const v = (value ?? '').trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').slice(0, 60);
  return v || null;
};

export function sourceFromReferrer(referrer: string): { source: string; medium: string } | null {
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (!host || IGNORED_REFERRERS.some(re => re.test(host))) return null;
  const known = KNOWN_REFERRERS.find(([re]) => re.test(host));
  if (known) return { source: known[1], medium: known[2] };
  return { source: host.replace(/^www\./, '').slice(0, 60), medium: 'referral' };
}

// Works out this visit's source from the URL and referrer.
export function sourceOfVisit(href: string, referrer: string): Omit<Acquisition, 'first_seen'> {
  const url = new URL(href);
  const params = url.searchParams;
  const fromReferrer = referrer ? sourceFromReferrer(referrer) : null;
  const utmSource = clean(params.get('utm_source'));
  let referrerHost: string | null = null;
  try {
    referrerHost = referrer ? new URL(referrer).hostname : null;
  } catch {}

  return {
    source: utmSource ?? fromReferrer?.source ?? 'direct',
    medium: clean(params.get('utm_medium')) ?? (utmSource ? null : fromReferrer?.medium ?? null),
    campaign: clean(params.get('utm_campaign')),
    referrer: fromReferrer ? referrerHost : null,
    landing: url.pathname.slice(0, 200),
  };
}

export function getAcquisition(): Acquisition | null {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Acquisition | null;
    if (!stored?.source || !stored.first_seen) return null;
    const ageDays = (Date.now() - new Date(stored.first_seen).getTime()) / 86_400_000;
    return ageDays <= MAX_AGE_DAYS ? stored : null;
  } catch {
    return null;
  }
}

// Called once per page load. Keeps the first source seen, except that a
// later real source replaces "direct" (a lost referrer is the usual reason
// for "direct", so the later one is more informative).
export function captureAcquisition(): void {
  try {
    const visit = sourceOfVisit(window.location.href, document.referrer);
    const existing = getAcquisition();
    if (existing && !(existing.source === 'direct' && visit.source !== 'direct')) return;
    localStorage.setItem(KEY, JSON.stringify({ ...visit, first_seen: new Date().toISOString() }));
  } catch {}
}
