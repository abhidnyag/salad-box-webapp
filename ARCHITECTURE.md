# SaladBox — Architecture & Application Working

This document describes the architecture, data flow, and how each part of the SaladBox application works in detail.

---

## 1. High-Level Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Browser    │────▶│  Next.js Server  │────▶│   MySQL DB    │
│  (React UI)  │◀────│  (App Router)    │◀────│  (via Prisma) │
└─────────────┘     └──────────────────┘     └───────────────┘
       │                     │
       │  Apollo Client      │  Apollo Server
       │  (GraphQL queries)  │  (GraphQL API)
       └─────────────────────┘
```

The app follows a **3-tier architecture**:
1. **Presentation** — React components rendered by Next.js
2. **API** — GraphQL endpoint at `/api/graphql` powered by Apollo Server
3. **Data** — MySQL database accessed through Prisma ORM

---

## 2. Database Layer

### Schema Design

The database has **9 models** organized around two core entities: Products and Orders.

```
Category (1) ──▶ (N) Product (1) ──▶ (N) Ingredient
                       │ (1) ──▶ (1) Recipe (1) ──▶ (N) RecipeStep
                       │
User (1) ──▶ (N) CartItem ──▶ Product
User (1) ──▶ (N) Order (1) ──▶ (N) OrderItem ──▶ Product
```

**Key design decisions:**
- **ProductType enum** (`SALAD | SANDWICH`) enables type-aware theming throughout the UI
- **Cart is database-backed** via `CartItem` (unique on `userId + productId`) — not ephemeral client state
- **Recipe is 1:1 with Product** — every ingredient box has exactly one recipe
- **Decimal fields** for all monetary values to avoid floating-point issues

### Prisma ORM (`src/lib/prisma.ts`)

Uses the singleton pattern to prevent connection pool exhaustion during Next.js hot reloads:

```typescript
// Reuses a single PrismaClient instance across hot reloads
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

---

## 3. GraphQL API Layer

### Endpoint: `src/app/api/graphql/route.ts`

A single Next.js Route Handler exposes the GraphQL API at `POST /api/graphql`. It integrates Apollo Server with Next.js using `@as-integrations/next`.

### Schema: `src/lib/graphql/schema.ts`

Defines the full type system:

| Type         | Description                                    |
|--------------|------------------------------------------------|
| `Product`    | Core entity with price, rating, badges, type   |
| `Category`   | Groups products (has color + icon for UI)      |
| `Ingredient` | Individual ingredient with quantity and color   |
| `Recipe`     | Title, description, difficulty, chef tips       |
| `RecipeStep` | Numbered instruction with title + duration      |
| `CartItem`   | Links a user to a product with quantity          |
| `Order`      | Completed purchase with address and items        |
| `OrderItem`  | Line item with captured price at time of order   |

**Queries:** `products`, `product`, `categories`, `cart`, `orders`, `order`
**Mutations:** `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart`, `createOrder`

### Resolvers: `src/lib/graphql/resolvers.ts`

Key resolver behaviors:

- **Decimal serialization** — Prisma returns `Decimal` objects; a recursive helper converts them to `number` for GraphQL
- **Badges parsing** — Stored as comma-separated string in DB, resolved as `[String]` array for the client
- **Recipe tips** — Derived from `chefTip` field by splitting on newlines
- **Order creation** — Calculates subtotal, tax (8%), delivery fee ($4.99, free over $25), creates order items from cart, then clears the cart

### Client Queries: `src/lib/graphql/queries.ts`

Uses a `PRODUCT_FRAGMENT` for field reuse across queries. Hardcodes `userId: 1` for the demo user in cart/order mutations.

---

## 4. Client-Side State

### Apollo Provider (`src/context/apollo-provider.tsx`)

Wraps the app with `ApolloProvider` using `cache-and-network` fetch policy — shows cached data instantly while revalidating from the server.

### Cart Context (`src/context/cart-context.tsx`)

Provides a `useCart()` hook that exposes:

| Property/Method | Type                    | Description                              |
|-----------------|-------------------------|------------------------------------------|
| `items`         | `CartItem[]`            | Current cart items with product data      |
| `loading`       | `boolean`               | Whether cart is being fetched             |
| `count`         | `number`                | Total number of items                     |
| `subtotal`      | `number`                | Sum of price × quantity for all items     |
| `addItem()`     | `(id, qty?) => void`    | Add product to cart (upserts)             |
| `updateItem()`  | `(id, qty) => void`     | Update quantity (removes if ≤ 0)          |
| `removeItem()`  | `(id) => void`          | Remove item from cart                     |
| `clear()`       | `() => void`            | Empty the entire cart                     |

Each action fires a GraphQL mutation, then refetches the cart to keep UI in sync.

---

## 5. Page Routes & Data Flow

### Home Page (`/`)
**Type:** Server Component
**Data:** Fetches featured salads, featured sandwiches, and categories via `getClient()` (server-side Apollo).
**Sections:** Hero banner → Category grid → Salad products → Sandwich promo → Sandwich products → How It Works.

### Explore Page (`/explore`)
**Type:** Client Component (needs `useSearchParams` + interactive filters)
**Data:** `useQuery(GET_PRODUCTS)` with dynamic variables based on active filters.
**Features:** Type filter (All/Salad/Sandwich), category pills, sort dropdown (featured/price/rating).
**URL Params:** `?type=SALAD`, `?category=mediterranean` for deep-linkable filters.

### Product Detail (`/product/[slug]`)
**Type:** Server Component (with client `AddToCartButton` child)
**Data:** `getClient().query(GET_PRODUCT)` by slug.
**Sections:** Product image → badges/type/name/description → rating & stats → price → add to cart → ingredients grid → nutrition summary.

### Recipe Page (`/recipe/[slug]`)
**Type:** Server Component
**Data:** Same `GET_PRODUCT` query — recipe data is nested under product.
**Sections:** Recipe header with product image → ingredient list → numbered step-by-step timeline → chef tips.

### Cart Page (`/cart`)
**Type:** Client Component
**Data:** `useCart()` context — already loaded and cached.
**Layout:** Cart item rows (left, 2/3 width) + order summary sidebar (right, 1/3 width, sticky).
**Actions:** Quantity adjustment, remove items, clear all, proceed to checkout.

### Checkout Page (`/checkout`)
**Type:** Client Component
**Data:** `useCart()` for items/subtotal + `useMutation(CREATE_ORDER)`.
**Flow:** Fill delivery form → click "Place Order" → mutation creates order + clears cart → redirect to `/confirmation?orderId=X`.
**Note:** Payment is simulated (demo app).

### Order Confirmation (`/confirmation`)
**Type:** Client Component
**Data:** `useQuery(GET_ORDER)` by `orderId` from URL search params.
**Displays:** Success checkmark, order number, itemized receipt, delivery address, navigation links.

### Profile Page (`/profile`)
**Type:** Client Component
**Data:** `useQuery(GET_ORDERS)` for order history.
**Displays:** User card with stats (order count, total spent) → order history list with status badges.

---

## 6. Component Architecture

### Layered Component Structure

```
src/components/
├── ui/          ← Atomic, reusable primitives (Button, Badge, Rating, Loading)
├── layout/      ← Page structure (Navbar, Footer, Section, PageContainer)
├── product/     ← Product-specific (ProductCard, ProductGrid, IngredientList)
├── recipe/      ← Recipe-specific (RecipeSteps)
└── cart/        ← Cart-specific (CartItemRow)
```

### Type-Aware Theming

The `getTypeTheme()` utility returns CSS classes based on `ProductType`:

| Property  | SALAD                  | SANDWICH                    |
|-----------|------------------------|-----------------------------|
| `primary` | `bg-brand-green`       | `bg-brand-orange-deep`      |
| `text`    | `text-brand-green`     | `text-brand-orange-deep`    |
| `light`   | `bg-brand-green-light` | `bg-brand-orange-bg`        |

This flows through ProductCard, product detail page, recipe page, and badges — ensuring consistent visual language per product type.

### Design Tokens (Tailwind)

| Token            | Value     | Usage                        |
|------------------|-----------|------------------------------|
| `brand-green`    | `#2E7D32` | Primary salad accent         |
| `brand-orange`   | `#FF6D00` | Primary sandwich accent      |
| `surface`        | `#FAFAFA` | Page background              |
| `surface-card`   | `#FFFFFF` | Card backgrounds             |
| `txt`            | `#212121` | Primary text                 |
| `txt-muted`      | `#9E9E9E` | Secondary/hint text          |
| `rounded-card`   | `16px`    | Card border radius           |
| `rounded-btn`    | `12px`    | Button/input border radius   |

---

## 7. Data Seeding

The seed file (`prisma/seed.ts`) populates the database with:

- **1 demo user** (id: 1)
- **6 categories** (3 salad, 3 sandwich)
- **12 products** (6 salads, 6 sandwiches)
- **~75 ingredients** across all products
- **12 recipes** with **~50 recipe steps**

Each product includes realistic descriptions, pricing, ratings, chef tips, and complete step-by-step recipes with timing information.

---

## 8. Request Lifecycle Example

**User adds a product to cart:**

1. User clicks "+" on a `ProductCard`
2. `ProductCard` calls `addItem(productId)` from `useCart()` hook
3. `CartProvider` fires `ADD_TO_CART` GraphQL mutation with `userId: 1`
4. Apollo Client sends `POST /api/graphql` with the mutation
5. Apollo Server routes to `Mutation.addToCart` resolver
6. Resolver calls `prisma.cartItem.upsert()` — creates or increments quantity
7. Response returns the updated `CartItem`
8. `CartProvider` calls `refetch()` on the cart query
9. Apollo Client re-fetches `GET_CART`, updates the cache
10. Navbar cart badge and cart page re-render with new count

---

## 9. Security & Production Notes

- **Demo mode:** The app uses a hardcoded `userId: 1`. In production, replace with proper authentication (NextAuth.js, Clerk, etc.)
- **Input validation:** GraphQL types enforce basic validation. Add Zod or similar for production input validation.
- **CORS:** The GraphQL endpoint runs on the same origin as the frontend (Next.js API route), so no CORS configuration is needed.
- **Environment variables:** Keep `DATABASE_URL` out of version control. The `.env` file is gitignored.
- **Rate limiting:** Consider adding rate limiting to the GraphQL endpoint for production use.
