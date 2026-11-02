# Cardora – 30-Day Marketing & Promotion Plan

**Website:** https://cardora.cards

**Primary objective:** Attract early users, validate marketing channels, and grow
toward 100 monthly board creators.

## 1. Top Communities and Launch Platforms

Prioritize these platforms:

| Platform | Link | What to do |
|---|---|---|
| Reddit – r/SideProject | https://www.reddit.com/r/SideProject/ | Share Cardora's story and request feedback. |
| Reddit – r/sideprojects | https://www.reddit.com/r/sideprojects/ | Introduce the product and invite people to test it. |
| Indie Hackers | https://www.indiehackers.com/ | Publish a building-in-public story and share product milestones. |
| Uneed | https://www.uneed.best/ | Submit Cardora for product discovery. **Done:** free launch scheduled for 6 May 2027. |
| BetaList | https://betalist.com/ | ~~Submit Cardora.~~ **Skipped (29 Oct 2026):** no free option any more; cheapest is Lite at $39. |
| Reddit – r/SaaS | https://www.reddit.com/r/SaaS/ | Discuss product positioning, pricing, and early traction. |
| Hacker News – Show HN | https://news.ycombinator.com/show | Introduce the product and gather technical feedback. |
| Reddit – r/humanresources | https://www.reddit.com/r/humanresources/ | Research workplace celebration and employee recognition needs. Avoid promotional posts unless permitted. |

> Always follow each community's self-promotion rules.

## 2. Target People Already Looking for Solutions

Search Reddit for conversations containing:

- Kudoboard alternative
- Online group birthday card
- Farewell card for coworker
- Virtual team celebration
- Teacher appreciation group card

Provide helpful answers and transparently disclose your relationship with
Cardora when recommending it.

## 3. Weekly Execution Plan

### Week 1 — Launch Visibility

- [x] Prepare a short product description and screenshots.
- [ ] Introduce Cardora on r/SideProject. **Paused:** two posts from u/CardoraCards were removed by Reddit's spam filter (new brand account, several links). Build karma on a personal account for ~2 weeks, then repost with one site link and one imgur album.
- [ ] Publish a post on r/sideprojects. **Paused** for the same reason.
- [x] Submit Cardora to Uneed. Free launch scheduled for **6 May 2027**; be online that day to reply to comments.
- [x] Configure tracking for campaign referrals and board creation (2 Nov 2026): first-touch source saved with each board, shown in /gokhan → Analytics → "Where board creators come from"; GA4 events `board_created`, `board_published`, `delivery_scheduled`, `board_delivered`, `invite_sent`, `message_added`, `sign_up`. Needs `supabase/migrations/add_board_acquisition.sql` run in Supabase.

### Free listings to do instead (added 29 Oct 2026)

- [x] AlternativeTo (https://alternativeto.net/): submitted 29 Oct 2026. **2 Nov:** in the free review queue, which they say may take a very long time or never be reviewed; paid priority review declined.
  - [x] Suggested Cardora as an alternative to Kudoboard, GroupGreeting, Sendwishonline, Thankbox and related apps (30 Oct 2026).
- [x] SaaSHub (https://www.saashub.com/): submitted 2 Nov 2026, waiting for approval (https://www.saashub.com/cardora). Complete the listing (logo, pricing, extended description, Q&A) to move up the queue.

### Week 2 — Community Discovery

- [x] ~~Submit to BetaList if eligible.~~ Skipped: paid only (Lite $39, Standard $99, Premium $299). The saved draft (#198131) sends payment reminders; ignore or click "Disable" in the email.
- [ ] Find 10 relevant Reddit conversations.
- [ ] Join two HR or workplace communities.
- [ ] Contact potential users and offer free trials or pilot boards.

### Week 3 — Content and Feedback

- [ ] Publish a founder story on Indie Hackers.
- [ ] Share three real Cardora design examples where permitted.
- [ ] Collect feedback from at least five users.
- [ ] Improve onboarding based on reported problems.

### Week 4 — Optimization

- [ ] Review traffic by referral source.
- [ ] Measure board creation and sharing rates.
- [ ] Identify the two best-performing communities.
- [ ] Repeat successful content formats without spamming.
- [ ] Set priorities for the next month.

## 4. Measurement

Use Google Analytics 4 and UTM parameters to understand which channels bring
meaningful users.

Example:

```
https://cardora.cards/?utm_source=reddit&utm_medium=community&utm_campaign=launch
```

Track:

- Visitors by source
- Visitor-to-board-creation conversion
- Number of boards created
- Board sharing rate
- Number of contributors
- Paid conversions, if applicable

**Initial business target:** 100 monthly board creators.

*This is a target, not a forecast.*

## 5. Strategic Recommendation

Allocate approximately:

- **70%** of community marketing effort: relevant discussions, potential
  customers, HR professionals, team managers, and people searching for e-card
  solutions.
- **30%**: startup directories, launch websites, and founder communities.

The objective is not simply to generate website traffic. It is to attract
people who create and share cards.

**Priority:** Customer relevance and board creation over impressions, upvotes,
or directory listings.

— Cardora Marketing Plan
