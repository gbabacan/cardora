# Google Search status

Where cardora.cards stands in Google Search, what has been fixed, and what is
still to do. Snapshot taken on **14 Oct 2026** from Search Console exports
(data up to 8 Oct) and PageSpeed Insights. See `SEO_PLAN.md` and
`SEO_LANDING_PAGES.md` for the content plan behind the landing pages.

## Snapshot — 14 Oct 2026

### Indexing (Search Console → Pages)

**3 pages indexed, 31 not indexed.** Indexed was 7 in July and slipped as the
www / non-www confusion (below) grew.

| Reason | Pages | What it is | Action |
|---|---|---|---|
| Page with redirect | 4 | `http://www.cardora.cards/`, `http://cardora.cards/`, `https://cardora.cards/`, `https://cardora.cards/contact` — all redirect to www | None. Expected. |
| Discovered – currently not indexed | 19 | Every one is a **non-www** URL from the old sitemap; Google never crawled any of them | None. They'll become "Page with redirect" once crawled |
| Crawled – currently not indexed | 8 | **www** pages crawled Jun–Aug, before the canonical fix: team-celebration, thank-you, new-baby, christmas, promotion, benefits/personal, benefits/corporate, plus `favicon.ico` (harmless) | Request indexing (see To do) |

Validation has been started for all three reasons (14 Oct). Validation of the
non-www groups may show "failed" — that's fine, those URLs are meant to redirect.

### Search performance (last 3 months, web)

- **191 impressions, 9 clicks.** Mostly brand searches.
- Clicks come from `/contact` (5 clicks, 104 impressions, avg position 9) and
  the homepage (4 clicks, 52 impressions, position 5.5).
- Demand we aren't reaching yet:

  | Query | Impressions | Position | Our page |
  |---|---|---|---|
  | congratulations card from team | 20 | 72 | team-celebration-cards (position 50) |
  | thank you card from team | 2 | 62 | thank-you-cards (position 45) |
  | group greeting cards free / online free | 2 | 3–6 | homepage |

- Mobile ranks much better than desktop: average position 7 vs 30.
- Top countries by impressions: United States 86, United Kingdom 25, India 12, Australia 10.

### PageSpeed Insights (homepage, mobile)

| Run | Performance | FCP | LCP | TBT | Accessibility | SEO |
|---|---|---|---|---|---|---|
| Before fixes (old deploy) | 30 | — | — | 11.7 s | — | — |
| After `c7109b0` | 43 | 3.4 s | 7.7 s | 920 ms | 88 | 92 |
| After `0ac9631` | _rerun and fill in_ | | | | | |

LCP element is the hero demo image (`cardoraDemo`). In the 43 run nearly all
of LCP was render delay — the main thread busy with JavaScript — not the
image download.

## Fixes made

| Date | Commit | Fix |
|---|---|---|
| 14 Oct | `a571365` | **www canonicals.** Vercel redirects cardora.cards → www, but every canonical, the sitemap, robots.txt and Open Graph links used the bare domain, so Google was told to index addresses that redirect. Now all use `SITE_URL` in `lib/site.ts` (`https://www.cardora.cards`). |
| 14 Oct | `a571365` | **Privacy page canonical.** It inherited the homepage's canonical and was treated as a duplicate; it now has its own. |
| 14 Oct | `a571365` | **Doubled titles.** 15 pages had "… \| Cardora \| Cardora" because the title template already adds the suffix. |
| 14 Oct | `c7109b0` | **Homepage speed, round 1.** Optimised images; Lottie animations load as they scroll into view. |
| 14 Oct | `c7109b0` | **Templates page server-rendered** (`lib/publicTemplates.ts`, revalidates every 5 min), so the templates are in the HTML Google reads. Tiles have accessible names; added a "Card ideas by occasion" section linking every occasion landing page. |
| 14 Oct | `0ac9631` | **Homepage speed, round 2.** lottie-web (~300 KB) loads only when an animation is about to play; how-it-works animations load only on md+ screens after the page `load` event; gtag uses `lazyOnload`; no prefetch of `/templates`; occasion animations fetched in one query instead of one per occasion. |
| 14 Oct | `9d1af5b` | **Literal `&apos;` on 8 occasion pages** (birthday, christmas, graduation, new-baby, promotion, retirement, team-celebration, wedding) — the entity was in plain JS strings, which React prints as text. |

## Search Console actions done

- 14 Oct: submitted `https://www.cardora.cards/sitemap.xml`, removed the old
  non-www sitemap.
- 14 Oct: started validation for "Page with redirect", "Discovered – currently
  not indexed" and "Crawled – currently not indexed".
- 14 Oct: requested indexing for the redirect-affected pages.

## To do

- [ ] Rerun PageSpeed 2–3 times after the `0ac9631` deploy and record the median above.
- [ ] Request indexing for the **www** URLs, ~10 per day (URL inspection → paste the full `https://www.cardora.cards/...` address):
  - Day 1: birthday-cards, thank-you-cards, farewell-cards, team-celebration-cards, congratulations-cards, work-anniversary-cards, retirement-cards, employee-appreciation-cards, templates, pricing
  - Day 2: wedding-cards, new-baby-cards, graduation-cards, christmas-cards, valentines-cards, promotion-cards, benefits/personal, benefits/corporate, privacy
- [ ] Recheck the Pages report in 2–3 weeks (around 4 Nov 2026). Expect the
  non-www URLs to move to "Page with redirect" and the www pages to start
  getting indexed.
- [ ] Get backlinks — the biggest remaining lever for a new site: Product Hunt,
  SaaS directories, "group card app" comparison and listicle posts.
- [ ] Target queries already showing up: work "card from the team" phrasing into
  the congratulations, team-celebration and thank-you pages' titles and H1s.
- [ ] PageSpeed accessibility (88): colour contrast, tap target sizes, add a
  `<main>` landmark on the homepage, heading order, redundant image alt text.
- [ ] PageSpeed SEO: two non-descriptive "See all" links on the homepage.
- [ ] Hero: all 5 rotating animations play at once though only one is visible —
  pause the hidden ones.
- [ ] Check Core Web Vitals (Search Console → Experience) once there's enough
  real-user data; that, not a single PageSpeed run, is what counts for ranking.

## How to pull the data again

- **Indexing:** Search Console → Pages → click each row in "Why pages aren't
  indexed" → **Export** (the summary export from the Pages report has no URLs).
- **Queries and pages:** Search Console → Performance → Search results → last
  3 months, all four metrics on → **Export**.
- **Speed:** https://pagespeed.web.dev/ on `https://www.cardora.cards/`, mobile.
