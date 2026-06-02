# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

SaladBox is a full-stack Next.js 14 (App Router) web app for ordering fresh salad/sandwich ingredient boxes with step-by-step recipes. Stack: React 18 + Tailwind, a single GraphQL endpoint (Apollo Server + Client), and MySQL via Prisma. TypeScript throughout, with the `@/*` import alias mapped to `src/*`.

See `README.md` for setup and `ARCHITECTURE.md` for a detailed walkthrough of data flow, schema design, and the request lifecycle.

## Commands

```bash
npm run dev          # Dev server on :3000
npm run build        # Production build
npm run lint         # ESLint (next lint)

npm run db:generate  # Regenerate Prisma client (run after editing schema.prisma)
npm run db:migrate   # prisma migrate dev
npm run db:seed      # Seed sample data (tsx prisma/seed.ts)
npm run db:setup     # migrate + seed in one step
npm run db:studio    # Prisma Studio DB browser
```

There is **no test framework configured** — no `test` script exists. Verify changes via `npm run lint`, `npm run build`, and running the app.

## Architecture essentials

- **Single GraphQL API.** All data flows through `POST /api/graphql` (`src/app/api/graphql/route.ts`, Apollo Server bridged to Next via `@as-integrations/next`). Schema, resolvers, and client queries live in `src/lib/graphql/`. There are no REST routes.
- **Server vs. client data fetching.** Server Components (home, product detail, recipe) fetch with server-side Apollo via `getClient()` (`src/lib/apollo-client.ts`). Interactive pages (explore, cart, checkout, confirmation, profile) are Client Components using `useQuery`/`useMutation` or the cart context.
- **Cart is database-backed**, not client state. `CartProvider` (`src/context/cart-context.tsx`) exposes `useCart()`; every action fires a GraphQL mutation then refetches `GET_CART` to resync. `CartItem` is unique on `userId + productId`.
- **Type-aware theming.** Products are `SALAD | SANDWICH` (Prisma enum). `getTypeTheme()` in `src/lib/utils.ts` returns green vs. orange Tailwind classes that propagate through cards, detail pages, and badges.

## Conventions & gotchas

- **Authentication & authorization.** Email/password auth lives in `src/lib/auth.ts` (scrypt password hashing + HMAC-SHA256 signed tokens, all via Node's built-in `crypto` — no external deps). GraphQL exposes `register`/`login` (return `{ token, user }`) and `me`. The client stores the token in `localStorage` and the Apollo client (`src/lib/apollo-client.ts`) attaches it as an `Authorization: Bearer` header on every request via a `setContext` link. The GraphQL route (`src/app/api/graphql/route.ts`) verifies that token and puts `{ userId }` in the Apollo Server context (`GraphQLContext`). **All user-scoped resolvers derive `userId` from the context, never from arguments** — `requireAuth(context)` throws `UNAUTHENTICATED` when absent, and `order(id)` additionally checks ownership. Client-side, `AuthProvider`/`useAuth()` (`src/context/auth-context.tsx`) expose `user`/`login`/`register`/`logout` and gate UI. Seeded demo user: `demo@saladbox.com` / `demo1234`. `AUTH_SECRET` env var signs tokens.
- **Prisma `Decimal` must be serialized.** All money fields are `Decimal`; resolvers recursively convert them to `number` for GraphQL. Preserve this when adding fields/resolvers.
- **`badges` is a comma-separated string** in the DB, resolved to `[String]`. **Recipe `tips`** are derived by splitting the `chefTip` field on newlines.
- **Order totals** are computed server-side in the `createOrder` resolver: 8% tax, $4.99 delivery (free over $25), then the cart is cleared.
- **Prisma client is a singleton** (`src/lib/prisma.ts`) to survive hot reloads — reuse the exported `prisma`, don't `new PrismaClient()`.
- **Dev uses an in-memory webpack cache** (`next.config.js`) to work around Windows file-lock corruption of `.next/cache`. Keep this for dev builds on Windows.
- After changing `prisma/schema.prisma`, run `npm run db:generate` (and a migration) before relying on new types.
