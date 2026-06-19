# Cardora — High-Intent Landing Page SEO Strategy

> Created: 2026-06-19
> Strategy: Instead of generic SEO (slow, competitive), create dedicated landing pages for each high-intent use case. Users search at the exact moment of need — these pages capture that intent directly.

---

## Why This Works

General SEO takes months. But Cardora has a goldmine of **long-tail keywords** where search intent is crystal clear — the user knows exactly what they want and is ready to act:

- `online group birthday card`
- `farewell card for coworker`
- `group ecard for colleague`
- `work anniversary card online`
- `thank you card from team`
- `remote team birthday card`
- `virtual farewell card`
- `free online group card`
- `online card everyone can sign`

These keywords are:
- **Low competition** — big players don't target them specifically
- **High conversion** — user intent is clear and immediate
- **Long-tail** — easier to rank for than broad terms

---

## Landing Pages to Create

Each page targets one specific use case with its own URL, title, and content.

| URL | Primary Keyword | Status |
|---|---|---|
| `/birthday-cards` | online group birthday card | ⬜ Pending |
| `/farewell-cards` | farewell card for coworker | ⬜ Pending |
| `/work-anniversary-cards` | work anniversary card online | ⬜ Pending |
| `/thank-you-cards` | thank you card from team | ⬜ Pending |
| `/congratulations-cards` | group congratulations card online | ⬜ Pending |
| `/teacher-thank-you-cards` | thank you card for teacher | ⬜ Pending |
| `/remote-team-cards` | remote team birthday card | ⬜ Pending |
| `/group-ecards` | group ecard for colleague | ⬜ Pending |
| `/employee-appreciation-cards` | employee appreciation card online | ⬜ Pending |

---

## Page Template Structure

Every landing page should follow this exact structure:

### 1. Hero Section
```
H1: Create a Group Farewell Card Everyone Can Sign
Subtitle: Invite your team, collect messages, photos, GIFs,
          and send a beautiful digital card.
CTA Button: "Create a Farewell Card — It's Free"
```

### 2. How It Works (3 Steps)
```
Step 1 → Create a card
Step 2 → Invite people
Step 3 → Send it to the recipient
```

### 3. Template Examples
- Show 3–6 real template previews relevant to the occasion
- Link directly to `/boards/create?occasion=farewell`

### 4. CTA Section
```
"Create a farewell card"
"Start free — no credit card required"
```

### 5. FAQ Section (essential for SEO — Google features these)
```
Q: Is it free?
A: Yes, Cardora is completely free. No credit card required.

Q: Can multiple people sign the card?
A: Yes — share one link and anyone can add their message,
   photo, or GIF without signing up.

Q: Can I schedule delivery?
A: Yes — choose a specific date and time for the card
   to be delivered automatically.

Q: Can I add photos and GIFs?
A: Absolutely. Each contributor can add text, photos,
   GIFs, and even videos.

Q: Can I use it for coworkers?
A: Yes — Cardora works perfectly for teams of any size,
   including remote and hybrid teams.
```

---

## SEO Metadata Per Page

Each page needs its own unique metadata:

### `/farewell-cards` example:
```
Title: Free Group Farewell Card Everyone Can Sign | Cardora
Description: Create a beautiful online farewell card for a coworker
             or colleague. Invite your whole team to add messages,
             photos and GIFs. Free, instant, no sign-up needed.
H1: Create a Group Farewell Card Everyone Can Sign
```

### `/birthday-cards` example:
```
Title: Free Online Group Birthday Card | Cardora
Description: Send a group birthday card your whole team signs online.
             Collect messages, photos and GIFs. Schedule delivery for
             the perfect moment. Free with no credit card required.
H1: Create a Group Birthday Card Everyone Can Sign
```

---

## Implementation Notes

- These are **Next.js static pages** — create under `app/birthday-cards/page.tsx` etc.
- Each page should be a **Server Component** (for SEO — no `"use client"`)
- Add each URL to `app/sitemap.ts` once created
- Add JSON-LD `FAQPage` schema to each page (already done on /pricing — use same pattern)
- Internal linking: link from homepage, templates page, and navigation to these pages
- Link between related pages (e.g. farewell → thank-you → work-anniversary)

---

## Priority Order to Build

Start with the highest search volume / most relevant to Cardora's current users:

1. `/birthday-cards` — highest search volume
2. `/farewell-cards` — strong coworker intent
3. `/work-anniversary-cards` — corporate audience
4. `/thank-you-cards` — broad, high volume
5. `/remote-team-cards` — modern, growing audience
6. `/employee-appreciation-cards` — HR/corporate buyer
7. `/congratulations-cards` — broad occasions
8. `/group-ecards` — targets the "ecard" searchers
9. `/teacher-thank-you-cards` — seasonal spikes (end of school year)

---

## Expected Results

- Pages can start ranking within **4–12 weeks** of publishing
- Long-tail keywords have **lower competition** than broad terms
- Users landing on these pages have **high purchase/signup intent**
- Each page also serves as a **conversion funnel** — straight to create
- FAQ sections can appear as **Google rich results** (featured snippets)

---

## Status Key

| Symbol | Meaning |
|---|---|
| ✅ | Done |
| 🔄 | In progress |
| ⬜ | Pending |
