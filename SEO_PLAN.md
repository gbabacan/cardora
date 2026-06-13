# Cardora SEO Plan

> Generated: 2026-06-12. Implement in the order listed — each section is ordered by impact.

---

## Audit Summary

**What Cardora is:** Collaborative group greeting card platform (birthdays, farewells, weddings, thank-yous, etc.) built with Next.js 14 App Router + Supabase.

**Core keyword targets:**
- `group greeting cards` / `group cards online`
- `collaborative birthday card`
- `online farewell card`
- `team celebration card`
- `virtual group card`

---

## Critical Issues

### 1. All Public Pages Are Client-Side Rendered

**This is the biggest SEO problem.** Every marketing page starts with `"use client"`:

| File | Problem |
|---|---|
| `app/page.tsx` | Client-side |
| `app/pricing/page.tsx` | Client-side |
| `app/contact/page.tsx` | Client-side |
| `app/templates/page.tsx` | Client-side |
| `app/benefits/personal/page.tsx` | Client-side |
| `app/benefits/corporate/page.tsx` | Client-side |

Google's crawler renders JavaScript inconsistently. Your hero text, feature descriptions, and all marketing copy may never be reliably indexed.

**Fix:** Split each page into a Server Component parent (for static content) and separate Client Components (for dropdowns, carousels, Lottie animations). The marketing copy and headings must be in server-rendered HTML.

---

### 2. No Per-Page Metadata

Only `app/layout.tsx` has metadata — every other page inherits the same title and description:

```
title: "Cardora - Celebrate Together"
description: "Create collaborative group cards for birthdays, farewells, thank yous, and celebrations."
```

Also completely missing:
- Open Graph tags (link previews in Slack, iMessage, LinkedIn)
- Twitter Card tags
- Canonical URLs
- Structured data (JSON-LD)

**Fix:** Add `export const metadata` to every public page with unique, keyword-optimized values.

---

### 3. No robots.txt or sitemap.xml

Neither file exists. Without them Google has no guidance on what to crawl or how to discover pages.

**Fix:** Create `app/robots.ts` and `app/sitemap.ts` (Next.js 13+ native approach).

---

## High Priority

### Per-Page Title & Description Strategy

| Page | Title | Description |
|---|---|---|
| `/` | `Cardora – Free Online Group Greeting Cards` | `Create collaborative greeting cards for birthdays, farewells, weddings & more. Invite your whole team or friend group. Free with no credit card required.` |
| `/pricing` | `Pricing – Free Group Cards \| Cardora` | `Cardora is free for a limited time. Create unlimited group cards, invite unlimited contributors, and celebrate every occasion with no plan limits.` |
| `/templates` | `Group Card Templates – Birthdays, Farewells & More \| Cardora` | `Browse beautiful group card templates for birthdays, farewells, weddings, baby showers, thank-yous, and every celebration.` |
| `/benefits/personal` | `Personal Group Cards for Every Occasion \| Cardora` | `Send heartfelt group cards for birthdays, Valentine's Day, weddings, new babies, and more. Collect messages and photos from everyone.` |
| `/benefits/corporate` | `Corporate Group Cards & Team Recognition \| Cardora` | `Celebrate your team with group cards for work anniversaries, employee appreciation, farewells, and team milestones. Built for remote and hybrid teams.` |
| `/contact` | `Contact Us \| Cardora` | `Get in touch with the Cardora team. We're here to help with questions, feedback, and support.` |

---

### Open Graph + Twitter Cards

Each page needs these for social sharing (Slack previews, LinkedIn shares, iMessage):

```
og:title, og:description, og:url, og:image, og:type
twitter:card, twitter:title, twitter:description, twitter:image
```

**Action needed:** Create `/public/og-image.png` at 1200×630px (Cardora logo + tagline on brand background). This is the image shown when someone shares a link.

Example metadata structure for each page:
```ts
export const metadata: Metadata = {
  title: "...",
  description: "...",
  openGraph: {
    title: "...",
    description: "...",
    url: "https://cardora.com/pricing",
    siteName: "Cardora",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "...",
    description: "...",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://cardora.com/pricing",
  },
};
```

---

### JSON-LD Structured Data

Google uses structured data for rich results (FAQ dropdowns in search, sitelinks, etc.).

| Schema | Where | Benefit |
|---|---|---|
| `WebSite` | Homepage | Enables Google sitelinks search box |
| `Organization` | Homepage | Business name, logo, social links in Knowledge Panel |
| `SoftwareApplication` | Homepage | App category, pricing, rating in rich results |
| `FAQPage` | Homepage + `/pricing` | FAQ dropdowns appear directly in search results |
| `BreadcrumbList` | `/benefits/personal`, `/benefits/corporate` | Breadcrumb trail in search snippets |

The FAQ sections already exist in the UI — they just need JSON-LD markup added as a `<script type="application/ld+json">` tag.

---

### Heading (H1/H2) Keyword Optimization

Current H1 tags are keyword-weak:

- **Pricing page H1:** "Cardora is Free for a Short Time" — targets "free" but not "group cards"
- Each page needs exactly **one H1** containing the primary keyword for that page
- H2s should expand on related terms

**Target H1s:**
- Homepage: `Free Online Group Greeting Cards | Cardora`
- Pricing: `Simple, Free Pricing for Group Cards`
- Templates: `Group Card Templates for Every Occasion`
- Benefits/Personal: `Personal Group Cards — Celebrate Life's Moments Together`
- Benefits/Corporate: `Corporate Group Cards for Team Recognition`

---

## Medium Priority

### Fix Dead Footer Links

The footer has `href="#"` on three links that should be real pages:

```
Blog       → #   (dead)
Help Center → #  (dead)
Contact    → #   (dead — /contact exists but footer links to #)
```

- Fix Contact to link to `/contact`
- Either create `/blog` and `/help` pages or remove those links entirely
- A blog is the #1 long-term SEO investment (see Backlink Strategy below)

---

### Image Alt Text Audit

| Image | Current Alt | Better Alt |
|---|---|---|
| `cardoraLogo.png` (header) | `"Cardora"` | `"Cardora logo"` (acceptable as-is) |
| `cardoraDemo.png` | unknown | `"Example Cardora group birthday card with contributor messages"` |
| `cardoraMainDemo.png` | unknown | `"Cardora group card editor showing messages and photos from multiple contributors"` |

---

### Core Web Vitals (Performance)

Google uses page speed (CWV) as a ranking signal. Current issues:

- **Lottie animations** fetched via `useEffect` after render → causes Cumulative Layout Shift (CLS) because the space is empty then fills
- **Pricing page** fetches 9 separate Lottie JSON files in one `useEffect`
- Decorative background Lotties (20% opacity) are loaded eagerly

**Fix strategy:**
1. Reserve fixed-size containers for every Lottie slot so layout doesn't shift
2. Lazy-load decorative (background) Lotties — they don't need to load first
3. Prioritize only the hero Lottie with `priority` loading
4. Consider merging small Lottie files to reduce HTTP requests

---

## Lower Priority

### Google Search Console + Analytics (External Setup)

1. **Submit site to Google Search Console** — verify ownership, submit sitemap, monitor indexing errors
2. **Add Google Analytics 4** — track organic traffic, conversions, bounce rates
3. **Request indexing** of key pages after on-page fixes are deployed

---

### Backlink Strategy (Off-Page SEO)

No on-page changes help without domain authority. Build it through:

- **Directories:** List on Product Hunt, Capterra, G2, AlternativeTo, AppSumo, Trustpilot
- **Guest posts:** Target HR blogs, team culture newsletters, remote work communities
- **Linkable content:** Write articles that people cite, e.g.:
  - "50 Best Birthday Messages for Coworkers"
  - "How to Organize a Group Card for a Remote Team"
  - "Farewell Card Ideas: What to Write When a Colleague Leaves"
- **PR:** Pitch to "best group card tools" / "alternatives to Kudoboard" roundups

---

## Implementation Order

| Priority | File | Change |
|---|---|---|
| 1 | `app/robots.ts` | Create — define crawl rules |
| 1 | `app/sitemap.ts` | Create — list all indexable URLs |
| 2 | `app/layout.tsx` | Enhanced base metadata with OG defaults + canonical base URL |
| 2 | `app/page.tsx` | Per-page metadata + OG tags + JSON-LD |
| 2 | `app/pricing/page.tsx` | Per-page metadata + OG tags + FAQ JSON-LD |
| 2 | `app/contact/page.tsx` | Per-page metadata + OG tags |
| 2 | `app/templates/page.tsx` | Per-page metadata + OG tags |
| 2 | `app/benefits/personal/page.tsx` | Per-page metadata + OG tags + breadcrumb schema |
| 2 | `app/benefits/corporate/page.tsx` | Per-page metadata + OG tags + breadcrumb schema |
| 3 | `public/og-image.png` | Create — 1200×630px social sharing image |
| 4 | All public pages | Convert to server components (extract client logic to child components) |
| 5 | All public pages | H1/H2 keyword optimization |
| 6 | Footer | Fix dead links (`#` → real URLs) |
| 7 | All public pages | Lottie CLS fixes (fixed-size containers, lazy decorative) |
| 8 | External | Google Search Console setup + sitemap submission |
| 9 | External | Backlink / directory listing campaign |

---

## Notes

- Steps 1–3 (robots, sitemap, metadata) can be done without touching the component architecture
- Step 4 (server component conversion) is the biggest structural change — plan carefully so interactive features (nav dropdowns, carousels, auth state) still work
- The `/boards/[id]` dynamic route should NOT be in the sitemap — those are private boards
- Pages behind auth (`/dashboard`, `/account`, `/create`, `/cards/editor`, `/boards/editor`) should be `noindex` via metadata or robots rules
