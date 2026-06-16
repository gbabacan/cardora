# Cardora SEO Plan

> Generated: 2026-06-12. Last updated: 2026-06-15.

---

## ✅ COMPLETED — What We've Done

### Technical SEO (Codebase)

| Task | Status | Details |
|---|---|---|
| Per-page metadata (title, description) | ✅ Done | Every public page has unique metadata via route-level `layout.tsx` |
| Open Graph tags | ✅ Done | `og:title`, `og:description`, `og:url`, `og:image` on all public pages |
| Twitter Card tags | ✅ Done | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` |
| Canonical URLs | ✅ Done | `alternates.canonical` on every public page |
| `robots.txt` | ✅ Done | `app/robots.ts` — allows public pages, disallows `/api/`, `/dashboard/`, `/boards/`, `/cards/` |
| `sitemap.xml` | ✅ Done | `app/sitemap.ts` — 6 public pages with priorities |
| JSON-LD Structured Data | ✅ Done | `Organization` + `WebSite` (site-wide), `FAQPage` (pricing), `BreadcrumbList` (benefits pages) |
| OG image | ✅ Done | `/cardoraMainDemo.png` used as social share image (1200×630 recommended for production) |
| Favicon | ✅ Done | `app/favicon.ico`, `app/icon.png` (512px), `app/apple-icon.png` (180px) — all from `cardoraLogo.png` |
| Google Analytics 4 | ✅ Done | `G-V4C48609B9` installed in `app/layout.tsx` via `next/script` |
| Dark mode text fix | ✅ Done | `globals.css` — `color-scheme: light` prevents iOS dark mode making text invisible |
| Input text color fix | ✅ Done | `globals.css` — `-webkit-text-fill-color` on all inputs/textareas |
| Dead footer links removed | ✅ Done | Blog and Help Center links removed from all page footers; Contact links fixed |
| H1 keyword hints | ✅ Done | `sr-only` spans added to H1s on all public pages with target keywords |
| Server Component conversion | ✅ Done | All 6 public pages converted (see below) |

---

### Server Component Conversion (Critical Issue #1)

All public marketing pages converted from `"use client"` to Server Components. Google now receives full HTML without JavaScript execution.

| Page | Server-rendered content | Client components |
|---|---|---|
| `/` (homepage) | H1, Features section, Benefits section, Footer | HomeNav, HomeHero, HomeTestimonials, HomeOccasions, HomeHowItWorks, HomeExamples |
| `/contact` | H1, subtitle, Footer | ContactNav, ContactFormSection |
| `/pricing` | H1, Features grid, FAQ text, CTA, Footer | PricingNav, PricingHeroLottie, PricingFeaturesLotties, PricingFaqLotties |
| `/templates` | H1, subtitle, Footer | TemplatesNav, TemplatesContent |
| `/benefits/personal` | H1, 6 benefit cards, 6 use cases, CTA, Footer | BenefitsNav, PersonalHeroLottie, PersonalBenefitsLotties |
| `/benefits/corporate` | H1, 6 benefit cards, recognition types, stats, CTA, Footer | BenefitsNav, CorporateHeroLottie, CorporateBenefitsLotties |

---

### Domain & Infrastructure

| Task | Status | Details |
|---|---|---|
| Custom domain | ✅ Live | `cardora.cards` purchased on Porkbun, configured in Vercel |
| BASE_URL updated | ✅ Done | All `cardora.com` and `cardora-livid.vercel.app` references replaced with `cardora.cards` |
| Google Search Console | ✅ Done | Domain verified, sitemap submitted at `https://cardora.cards/sitemap.xml` |
| Google Analytics | ✅ Done | GA4 property `G-V4C48609B9` live at `https://www.cardora.cards` |

---

### Off-Page SEO

| Task | Status | Details |
|---|---|---|
| Product Hunt listing | ✅ Created | https://www.producthunt.com/products/cardora-2 — launching 2026-06-16 |
| Product Hunt tagline | ✅ Ready | *"Send group cards without chasing anyone down for a signature"* |
| Product Hunt first comment | ✅ Written | Personal founder story + 2 engagement questions |

---

## 🔄 IN PROGRESS / NEXT STEPS

### Off-Page SEO (External — No Code)

| Task | Priority | Notes |
|---|---|---|
| Product Hunt launch | 🔴 Tomorrow | Launch 12:00 AM PST, post first comment immediately, personal outreach list ready |
| AlternativeTo listing | 🟠 High | List as alternative to Kudoboard, Groupgreeting.com — strong SEO value |
| G2 listing | 🟠 High | g2.com/products/new — free vendor account |
| Capterra listing | 🟠 High | capterra.com/vendors |
| AppSumo | 🟡 Medium | partners.appsumo.com — takes weeks to approve |
| There's An AI For That | 🟡 Medium | theresanaiforthat.com/submit — quick listing |
| Saasworthy | 🟡 Medium | saasworthy.com/list-your-saas |

---

## 📋 REMAINING TECHNICAL SEO (Low Priority)

| Task | Priority | Notes |
|---|---|---|
| H1/H2 full keyword optimization | 🟡 Medium | Done via `sr-only` hints; visible text unchanged |
| Core Web Vitals (Lottie CLS fixes) | 🟡 Medium | Lottie animations cause layout shift; reserve fixed-size containers |
| OG image (proper branded 1200×630) | 🟡 Medium | Currently using `cardoraMainDemo.png`; should create a proper branded image |
| Blog / content hub | 🔴 Long-term | #1 long-term SEO driver; target keywords like "birthday messages for coworkers" |

---

## 🔑 Key Details to Remember

| Item | Value |
|---|---|
| Domain | `https://cardora.cards` |
| Google Analytics ID | `G-V4C48609B9` |
| Google Search Console | Verified via DNS TXT record on Porkbun |
| Sitemap URL | `https://cardora.cards/sitemap.xml` |
| Product Hunt URL | `https://www.producthunt.com/products/cardora-2` |
| Product Hunt launch date | 2026-06-16 at 12:00 AM PST |
| Product Hunt tagline | Send group cards without chasing anyone down for a signature |
| Target keywords | digital greeting cards, group greeting cards, collaborative birthday card, online farewell card, team celebration card |
| OG image | `/cardoraMainDemo.png` (replace with proper 1200×630 branded image eventually) |
| Registrar | Porkbun |
| Hosting | Vercel (Hobby plan) |

---

## 📖 Page Metadata Reference

| Page | Title | sr-only keyword hint |
|---|---|---|
| `/` | Cardora – Free Online Group Greeting Cards | Digital Greeting Cards Online |
| `/pricing` | Pricing – Free Group Cards \| Cardora | Free Digital Greeting Cards Online |
| `/templates` | Group Card Templates – Birthdays, Farewells & More \| Cardora | Digital Greeting Card Templates for Every Occasion |
| `/benefits/personal` | Personal Group Cards for Every Occasion \| Cardora | Personal Digital Greeting Cards for Every Occasion |
| `/benefits/corporate` | Corporate Group Cards & Team Recognition \| Cardora | Corporate Digital Greeting Cards for Teams |
| `/contact` | Contact Us \| Cardora | Contact Cardora, Digital Greeting Cards |
