# Product Requirements Document (PRD)

**Product:** Cardora - Collaborative Group Cards & Recognition Boards  
**Doc Owner:** Product Management  
**Audience:** Engineering, Design, QA, Data, Support  
**Version:** 1.0  
**Status:** Draft for implementation

---

## 1. Executive Summary

We will build a web product that enables individuals and organizations to create collaborative digital boards (“cards”) for celebrations, recognition, and events. Contributors add messages and rich media. Boards can be delivered immediately or scheduled, exported/printed, and optionally include group gifting. The product supports both consumer one-off purchases and business subscriptions with admin controls, integrations, and automation.

---

## 2. Goals and Non-Goals

### Goals

- Enable creation and sharing of collaborative boards with rich media contributions
- Support delivery workflows (share link, invite contributors, schedule delivery, reminders)
- Monetize via one-time board purchases + business subscriptions
- Provide business-grade controls: admin, privacy, moderation, analytics, SSO (later phase)
- Optional group gifting (cash collection → recipient gift card redemption) in phased rollout

### Non-Goals (v1)

- Full HRIS ecosystem and complex rewards marketplace (scope creep)
- Native mobile apps (web responsive only)
- Advanced AI content generation (may come later)
- Physical gift logistics beyond print fulfillment integration

---

## 3. Target Users and Personas

- **Individual Organizer (Consumer):** creates a board for friend/family, wants simple flow and affordable price
- **Team Organizer (Workplace):** creates boards for colleagues; wants templates, scheduling, reminders, easy contributor access
- **Contributor:** adds a message quickly without account friction; expects mobile-friendly UX
- **Recipient:** views board, downloads/prints, redeems gift (if included)
- **Business Admin:** manages subscription, permissions, branding, integrations, compliance, analytics

---

## 4. Problem Statement

Existing team recognition often fails due to friction: collecting messages is hard, participation is low, and delivery timing is inconsistent—especially in distributed teams. Organizations also want repeatable, automated recognition tied to milestones, without managing ad hoc tools.

---

## 5. Success Metrics (KPIs)

### Acquisition & Activation

- Visitor → board created conversion rate
- Time to first board created
- % boards with ≥ 5 contributions

### Engagement

- Average contributions per board
- Contributor completion rate (invite → post)
- Board view rate (recipient views within 24h of delivery)

### Monetization

- Purchase conversion rate (free draft → paid board)
- ARPU (consumer) / ARPA (business)
- Subscription trial → paid conversion (if trials used)
- Gift attach rate and gift completion rate

### Retention

- 30/90-day repeat creation rate (organizers)
- Business churn / net revenue retention

### Reliability

- Board load time p95
- Media upload success rate
- Email deliverability metrics (bounce, spam)



---

## 6. Scope and Phasing

### Phase 1 (MVP)

- Board creation + templates
- Contributor posts: text + image + GIF (via provider)
- Shareable link + email invites
- Basic privacy: public/unlisted/password
- Delivery: immediate + scheduled
- Monetization: one-time purchase (unlock premium features)
- Export: PDF/PNG export; simple slideshow mode

### Phase 2

- Video posts
- Moderation tools (pre-approve, report)
- Business subscriptions: team workspace, unlimited boards, roles, analytics lite
- Integrations: Slack + Microsoft Teams (basic share/post reminders)

### Phase 3

- Group gifting: collect funds + gift card redemption partner
- SSO (SAML), SCIM provisioning (enterprise)
- Automation: birthdays/anniversaries recurring boards
- Print fulfillment partner integration (book/poster)



---

## 7. Use Cases

### Consumer

- Create birthday card for friend; invite 10 people; schedule for the party
- Create wedding congratulations board; share link in WhatsApp

### Workplace

- Farewell board for departing teammate; hide until reveal; deliver on last day
- Quarterly kudos board; team posts messages and photos
- Company event board where attendees post highlights

### Gift

- Collect $5–$20 per person to attach a gift card to the board



---

## 8. User Journeys and Flows (Detailed)

### Flow A: Organizer creates a board (MVP)

1. Landing page → “Create Board”
2. Select occasion template (Birthday, Thank You, Farewell, Congrats, etc.)
3. Configure board:
   - Title (required)
   - Recipient name (optional)
   - Message header/subtitle (optional)
   - Theme/background/font
   - Privacy setting (Public/Unlisted/Password)
4. Board created → Organizer dashboard (board URL)
5. Invite contributors:
   - Copy link
   - Send email invites (CSV / manual)
6. Optional: set delivery date/time (timezone-aware)
7. Preview board
8. Paywall gate (if premium features used) → checkout
9. Confirmation and “board live”

**Acceptance criteria:**

- Board is accessible via URL immediately (unless “locked until delivery” is enabled in later phases)
- Board renders correctly on mobile and desktop
- Organizer can edit board settings after creation

### Flow B: Contributor adds a post (MVP)

1. Contributor opens board link
2. Sees board + CTA “Add to Board”
3. Contribution form:
   - Name (required)
   - Message (required)
   - Add image upload OR GIF search
4. Submit post
5. Post appears immediately (MVP default)
6. Contributor sees confirmation

**Acceptance criteria:**

- No account required for contributors
- Media upload p95 < 5 seconds for 5MB image on typical broadband
- Basic anti-abuse: rate limiting, spam detection, profanity filter toggle

### Flow C: Scheduled delivery (MVP)

1. Organizer sets delivery date/time
2. System sends recipient email at scheduled time (if email provided)
3. Optionally also sends organizer confirmation
4. Board is marked “delivered”

**Acceptance criteria:**

- Scheduling respects organizer timezone
- Delivery job is idempotent (no duplicate sends)
- Delivery audit trail stored

### Flow D: Export & slideshow (MVP)

1. Organizer selects “Export”
2. Choose format: PDF/PNG
3. System generates export asynchronously and notifies organizer
4. Slideshow: full-screen mode cycles posts

**Acceptance criteria:**

- Export preserves media and layout
- Slideshow supports manual navigation + auto-play toggle

### Flow E: Business workspace (Phase 2)

1. Admin creates workspace and invites members
2. Roles: Admin, Manager, Member
3. Workspace boards visible based on permissions
4. Analytics: board created count, contributions, views



---

## 9. Business Entities and Data Model (Conceptual)

### Core Entities

**User** (organizer/admin; optional for contributor)
- id, email, name, auth_provider, created_at

**Workspace** (business)
- id, name, plan, billing_account_id, branding_settings

**Board**
- id, workspace_id (nullable), title, occasion_type, theme_id
- privacy_type (public/unlisted/password), password_hash (nullable)
- status (draft/active/delivered/archived)
- delivery_datetime (nullable), timezone
- recipient_name, recipient_email (nullable)
- created_by_user_id, created_at, updated_at

**Post**
- id, board_id, author_name, author_user_id (nullable)
- message_text, media_type (none/image/gif/video), media_url
- created_at, moderation_status (approved/pending/rejected)

**Invite**
- id, board_id, email, token, status (sent/opened/contributed)
- sent_at, opened_at, contributed_at

**Payment**
- id, board_id/workspace_id, provider, amount, currency, status, created_at

**Plan**
- id, name, features (flags), limits (boards/month, export, video, admins)

**AuditEvent**
- id, actor_user_id, entity_type, entity_id, action, timestamp, metadata

### Optional Phase 3 Entities (Gifting)

**GiftCampaign**
- id, board_id, funding_type (organizer-only/group), goal_amount (optional)

**ContributionPayment**
- id, gift_campaign_id, contributor_email, amount, status

**GiftRedemption**
- id, gift_campaign_id, recipient_email, redemption_status, provider_reference



---

## 10. Functional Requirements (MVP)

### 10.1 Board Management

- Create board from templates
- Edit board settings: title, theme, privacy, recipient details, delivery time
- Archive/delete board (soft delete)
- Board preview mode

### 10.2 Posting

- Create post with text + optional image upload
- GIF search integration (GIPHY/Tenor)
- Post ordering: newest-first (default), optionally “pinned” later
- Basic reactions (Phase 2): likes

### 10.3 Sharing & Invites

- Shareable board link
- Email invites to contributors (send via provider)
- Invite tracking status

### 10.4 Scheduling & Notifications

- Scheduled delivery to recipient email
- Reminder emails to contributors (manual “send reminder” button in MVP)
- System notifications: payment receipt, delivery confirmation

### 10.5 Monetization (MVP)

- Free board creation with limited features
- Paywall triggers:
  - Custom background/theme
  - Export
  - Ad-free
  - Higher media limits
- One-time checkout (Stripe) per board

### 10.6 Export & Slideshow

- PDF export
- PNG export
- Slideshow view

### 10.7 Privacy & Safety

- Public/unlisted/password-protected boards
- Basic abuse prevention: rate limits, CAPTCHA on suspicious activity
- Content guidelines + reporting link (Phase 2 moderation workflow)



---

## 11. Non-Functional Requirements

- **Performance:** Board load p95 < 2.5s on broadband; p95 < 5s on mobile LTE
- **Availability:** 99.9% monthly uptime target for MVP
- **Scalability:** Support bursts for large boards (e.g., 1,000 posts)
- **Security:** TLS everywhere; hashed passwords; secure token invites; OWASP baseline
- **Privacy/Compliance:** GDPR/CCPA readiness; data deletion requests; audit logs
- **Observability:** structured logs, metrics, tracing for delivery + uploads
- **Accessibility:** WCAG 2.1 AA for core flows



---

## 12. Roles and Permissions

### Consumer (no workspace)

- Organizer can edit board, manage invites, export (if paid)

### Business (Phase 2)

- **Admin:** manage billing, branding, integrations, user management
- **Manager:** create boards, manage contributors, view analytics
- **Member:** create boards, contribute



---

## 13. Feature Flags / Config

- Paywall rules
- GIF provider selection
- Video posting enablement (Phase 2)
- Export limits
- Password-protected boards toggle
- Email delivery provider fallback



---

## 14. UI/UX Requirements (Developer Hand-off Level)

### Pages

- Landing
- Template selection
- Board editor (settings panel + preview)
- Board view (recipient/contributor)
- Add post modal/page
- Organizer dashboard (boards list + status)
- Checkout
- Export page/status

### Key UI states

- Empty board (no posts)
- Board with posts (pagination or infinite scroll)
- Locked/password board
- Scheduled not delivered vs delivered
- Upload in-progress + retry
- Invite invalid/expired token



---

## 15. Analytics and Event Instrumentation

### Track events:

- `board_created`, `board_published`, `board_viewed`
- `invite_sent`, `invite_opened`, `contributor_started`, `post_submitted`
- `paywall_shown`, `checkout_started`, `checkout_completed`
- `export_requested`, `export_completed`, `slideshow_started`
- `delivery_scheduled`, `delivery_sent`, `delivery_opened`

### Include metadata:

- board_type, template_id, privacy, workspace_id, plan, device_type



---

## 16. Dependencies

- **Payment processor:** Stripe
- **Email:** SendGrid/Mailgun
- **Media storage:** S3-compatible + CDN
- **GIF provider:** GIPHY/Tenor
- **Optional print vendor** (later)



---

## 17. Risks and Mitigations

- **Spam/abuse on public boards:** rate limit + CAPTCHA + reporting
- **Email deliverability:** SPF/DKIM/DMARC + provider monitoring
- **Media storage costs:** compress images, size limits, CDN caching
- **Scheduling reliability:** durable job queue + idempotency keys



---

## 18. Open Questions (to finalize before build)

- Default board visibility: public vs unlisted?
- Should contributors be able to edit/delete their own post without login?
- Max media size and supported file types?
- Export formatting rules (A4 vs Letter; orientation)?
- Payment model: per-board purchases vs credit bundles?



---

## 19. Acceptance Criteria Checklist (MVP Release Gate)

- [ ] Organizer can create board, invite contributors, and view contributions
- [ ] Contributors can post without an account on mobile/desktop
- [ ] Scheduling works reliably and sends recipient email at correct time
- [ ] Paywall + Stripe checkout works end-to-end and unlocks features
- [ ] Export produces correct PDF/PNG
- [ ] Privacy settings (unlisted/password) enforced
- [ ] Logging + monitoring in place for email delivery and uploads



---

## 20. Appendix: Suggested API Surface (High-level)

- `POST /boards`, `GET /boards/{id}`, `PATCH /boards/{id}`
- `POST /boards/{id}/posts`, `GET /boards/{id}/posts`
- `POST /boards/{id}/invites`, `POST /boards/{id}/remind`
- `POST /boards/{id}/schedule`
- `POST /boards/{id}/export`, `GET /exports/{id}`
- `POST /checkout/board/{id}`
- (Phase 2) `/workspaces/*`, `/members/*`, `/analytics/*`

