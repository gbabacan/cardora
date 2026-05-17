You are Claude Code acting as a senior full-stack engineer.

Goal: Implement MVP of Cardora app based on the PRD below.
Cardora is a collaborative group cards and recognition boards application.

Constraints / choices:
- Web app: Next.js (App Router) + TypeScript
- Backend: Next.js API routes (integrated in same codebase for MVP simplicity)
- DB: MySQL
- Auth: organizers must log in (email magic link); contributors are anonymous
- Storage: S3-compatible (use local MinIO for dev)
- Email: Resend or SendGrid (pick one)
- Payments: Stripe (one-time purchase per board; gate exports + custom themes)
- Queue for scheduled delivery/export jobs: BullMQ + Redis (use docker-compose)

Deliverables (in this order):
1) Repo scaffold + docker-compose + env example + Prisma schema + migrations
2) Minimal UI: landing, create-board, board view, add-post modal
3) API endpoints for boards/posts/invites
4) File upload pipeline for images + GIF support via Tenor/GIPHY
5) Scheduled delivery job (stores schedule; sends email at time; idempotent)
6) PDF export job (basic layout)
7) Tests: API smoke tests + one e2e flow
8) README with setup and run commands

Rules:
- Keep it production-grade but MVP-simple.
- Use feature flags for payment-gated features.
- Add logging + error handling for jobs and email.
- Don’t invent new product features beyond the PRD.

PRD:
located in ./PRD.MD