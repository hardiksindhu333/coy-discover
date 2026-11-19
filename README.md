# Coy Discover

A standalone, mobile-first discovery experience inspired by Coy. The app demonstrates swipe interactions, durable SQLite persistence, mutual matching, and privacy-first handling of incoming likes.

## Part A: Suggested Coy features

These suggestions build on Coy's anonymous, double-blind matching experience.

### 1. A private way to start the conversation after a match

After two people add each other, Coy could offer an optional set of short, editable conversation starters and a button to continue through the contact method already available in the match screen. For example, a person could choose a simple opener such as, “Would you like to get coffee sometime?”

**Why it would help:** A mutual match answers whether the feeling is shared, but starting the conversation can still feel awkward. Gentle prompts would help users take the next step and get more value from a match, while keeping Coy focused on making introductions rather than adding an in-app chat system.

### 2. An optional anonymous message with a crush request

When adding a crush, a user could optionally attach a short message. The recipient would see that someone sent a crush request and read the message, but the sender's name and contact details would remain hidden. The sender would be revealed only if the recipient adds them back and the request becomes a mutual match. The message should be clearly labeled anonymous, with a reminder not to include identifying details.

**Why it would help:** A recipient may be more willing to respond when the request includes a little context or a warm note, instead of accepting only to find out who sent it. Keeping the sender hidden until a mutual match preserves Coy's central privacy promise while giving users a more personal way to express interest.

## Features

- Home placeholder and bottom navigation
- 36 deterministic fictional adult profiles
- One profile at a time with photo, age, bio, city, college, and interests
- Mobile drag gestures and desktop Pass/Like controls
- Smooth Framer Motion card and match animations
- Persistent swipes and matches across reloads
- Mutual-only match creation
- Matches screen and polished empty/error/loading states
- Never exposes an incoming, non-mutual like

## Tech stack

- Next.js App Router
- React and strict TypeScript
- Tailwind CSS
- shadcn-style reusable UI components
- Framer Motion and Lucide
- SQLite, Prisma
- Zod
- Vitest

## Architecture

- `src/app`: pages and API route handlers
- `src/components`: reusable UI and profile experience
- `src/lib/prisma.ts`: shared server-side Prisma client
- `src/lib/swipe-service.ts`: feed, swipe, and matching business logic
- `src/lib/validation.ts`: Zod request schemas
- `src/lib/types.ts`: shared API response types
- `prisma/schema.prisma`: database schema
- `prisma/seed.ts`: deterministic seed data

API handlers remain thin: validation and HTTP status handling stay in the route, while database and matching rules stay in the service layer.

## Database model

`User` stores both the current mock user and fictional profiles. `Swipe` stores `LIKE` or `PASS` with an actor, target, timestamp, and a unique `[actorId, targetId]` constraint. `Match` stores mutual matches with canonical user ordering and a unique `[userAId, userBId]` constraint.

Swipes are transactionally recorded. A match is created only if the target has previously liked the current user. Passes never create matches. Non-mutual incoming likes are never included in feed, matches, notifications, or UI responses.

## Setup

Requirements: Node.js 20+ and npm.

```powershell
npm install
npm run db:generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

For a clean database:

```powershell
npm run db:reset
npm run db:seed
```

The development database is stored in `prisma/dev.db`.

## Tests

Vitest uses an isolated `prisma/test.db`, so tests do not mutate demo data.

```powershell
npx prisma db push --url "file:./test.db"
npm test
```

Coverage includes:

- One-sided likes do not match
- Passes do not match
- Mutual likes create matches
- Duplicate swipes are rejected
- Match uniqueness is preserved
- Self-swipes are rejected
- Swiped profiles leave the feed
- Incoming non-mutual likes remain private
- Matches persist across Prisma client reloads

## API

### `GET /api/feed`

Returns profiles the current mock user has not swiped. It never reveals incoming likes or already-swiped profiles.

### `POST /api/swipe`

```json
{
  "targetProfileId": "profile-1",
  "direction": "LIKE"
}
```

`direction` accepts `LIKE` or `PASS`. Returns:

```json
{
  "matched": true,
  "profile": {}
}
```

### `GET /api/matches`

Returns only mutual matches, with each matched profile and match timestamp.

## Production build

```powershell
npm test
npm run build
npm start
```

## Deployment

This implementation uses local SQLite persistence. Deploy only to a host with a persistent writable filesystem and durable database volume. Serverless or ephemeral deployments may lose `prisma/dev.db` between runs. For hosted SQLite at scale, use Litestream, a persistent volume, or migrate to a managed relational database.

## Assignment checklist

- [x] Home placeholder and Discover navigation
- [x] 36 seeded profiles
- [x] Existing incoming likes
- [x] Swipe gestures and buttons
- [x] Empty and error states
- [x] Mutual matching and Matches screen
- [x] Privacy for non-mutual likes
- [x] Persistent swipes and matches
- [x] Required APIs
- [x] Zod validation and service-layer rules
- [x] Unique database constraints
- [x] Tests for matching and persistence
- [ ] Part A: two Coy core feature suggestions (to be added by the author)

## Interview notes

The privacy boundary is intentional: `getFeed`, `recordSwipe`, and `getMatches` only expose profile data or mutual matches. Incoming likes are stored as ordinary swipe records, but no response or count tells the current user that an incoming like exists. The canonical match pair and unique constraints prevent duplicate or reversed match records.
