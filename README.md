# Cardora

A collaborative group cards and recognition boards application built with Next.js.

## Tech Stack

- **Frontend/Backend:** Next.js 14+ (App Router) + TypeScript
- **Database:** MySQL with Prisma ORM
- **Authentication:** Magic link (email-based) for organizers, anonymous for contributors
- **Storage:** S3-compatible (MinIO for local development)
- **Email:** Resend
- **Payments:** Stripe (one-time purchases)
- **Queue:** BullMQ + Redis for scheduled jobs
- **Infrastructure:** Docker Compose for local services

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Docker Services

Start MySQL, Redis, and MinIO:

```bash
docker compose up -d
```

Check services are running:

```bash
docker compose ps
```

### 3. Configure Environment

Copy the example env file and update with your API keys:

```bash
cp .env.example .env.local
```

Required for development:
- `DATABASE_URL` - already configured for local MySQL
- `REDIS_URL` - already configured for local Redis
- `S3_*` - already configured for local MinIO
- `NEXTAUTH_SECRET` - generate with `openssl rand -base64 32`

Optional (for full functionality):
- `RESEND_API_KEY` - get from [resend.com](https://resend.com)
- `STRIPE_SECRET_KEY` - get from [stripe.com](https://stripe.com)
- `TENOR_API_KEY` - get from [tenor.com](https://tenor.com/gifapi)

### 4. Initialize Database

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   ├── boards/            # Board pages
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utilities and shared code
│   ├── prisma.ts         # Prisma client singleton
│   └── ...
├── prisma/                # Database schema and migrations
│   └── schema.prisma     # Prisma schema
├── public/                # Static assets
├── docker-compose.yml    # Local services configuration
├── BUILD.MD              # Implementation guide
└── PRD.MD                # Product requirements document
```

## Development Workflow

### Database Management

View data in Prisma Studio:
```bash
npx prisma studio
```

Create a new migration after schema changes:
```bash
npx prisma migrate dev --name <migration-name>
```

Reset database (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

### Docker Services

Access MinIO console: http://localhost:9001 (minioadmin / minioadmin)

View logs:
```bash
docker compose logs -f
```

Stop services:
```bash
docker compose down
```

Stop and remove volumes (⚠️ deletes all data):
```bash
docker compose down -v
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Run database migrations

## Testing

```bash
npm run test        # Run tests
npm run test:e2e    # Run end-to-end tests
```

## Environment Variables

See `.env.example` for all available environment variables and their descriptions.

## Features (MVP Phase 1)

- ✅ Board creation with templates
- ✅ Text + image + GIF posts
- ✅ Email invitations
- ✅ Scheduled delivery
- ✅ Privacy controls (public/unlisted/password)
- ✅ PDF/PNG export
- ✅ Slideshow mode
- ✅ One-time Stripe checkout

## Documentation

- [Product Requirements](./PRD.MD) - Detailed product specifications
- [Build Guide](./BUILD.MD) - Technical implementation approach

## License

MIT
