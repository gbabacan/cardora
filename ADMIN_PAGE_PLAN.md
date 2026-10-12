# Admin Page Plan

Ideas for a Cardora admin area. Nothing here is built yet.

## Prerequisite: admin role

- Store an admin flag on the user (for example `is_admin` on the profile).
- Check it on the server for every admin route and API call. Never rely on
  a client-side check alone.
- Back it with Supabase RLS policies so the anon key can't reach admin data.
  The current RLS lets owners touch only their own boards, so admin access
  has to run server-side.

## Features, in priority order

### 1. Template manager

Today each new template needs a SQL seed, a run in Supabase, then follow-up
seeds for messages and recipients (see `supabase/oldSeeds/`). Replace that
with a UI to:

- create, edit and duplicate templates;
- pick the Lottie or image, envelope and page colours, title and occasion;
- edit the sample messages and recipient;
- drag tiles to set `template_order`, with a live preview of the tile;
- turn a template on or off without deleting it.

### 2. Media library (Lotties, images, backgrounds)

- Upload a Lottie or image and tag it with an occasion.
- Preview it, and see which templates use it.
- Deactivate assets that are no longer wanted.
- Add a "has no template yet" filter.
- Add a duplicate check. For example, `holidays4.json` / `holidays8.lottie`
  and `holidays16` / `holidays17` look like the same animations.

### 3. Board and message moderation

- Look up any board or card by short ID, owner email or recipient.
- Open it as the owner sees it.
- Hide or delete a message (the `messages.is_approved` column already exists).
- Remove reported content.
- Restore a deleted board, or move a board to another owner.

### 4. Delivery and email monitor

- List upcoming scheduled deliveries, plus sent and failed emails with the
  error.
- Resend or reschedule a delivery.
- Add a "send test email" button.
- Use it first when a customer says the recipient never got the card.

### 5. Analytics overview

- Boards and cards created per day.
- How many get published and how many get delivered.
- Most-used templates and occasions.
- Average contributors and messages per board.
- New users, and revenue once pricing is live.
- Use it to decide which occasions need more templates, and to check whether
  the Lottie templates get picked.

## Suggested starting point

Start with the template manager. It replaces the hand-written SQL seeds and
would be the most-used admin feature.
