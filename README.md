# SaladBox - Fresh Ingredients & Recipes Delivered

A full-stack web application for ordering fresh salad and sandwich ingredient boxes with step-by-step recipes. Built with Next.js, GraphQL, and MySQL.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 14 (App Router), React 18   |
| Styling     | Tailwind CSS                        |
| API         | GraphQL (Apollo Server + Client)    |
| Database    | MySQL with Prisma ORM               |
| Language    | TypeScript                          |

## Prerequisites

- **Node.js** 18+ and npm
- **MySQL** 8.0+ running locally (or a remote instance)

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd salad-box-webapp
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root (one may already exist):

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/saladbox"
NEXT_PUBLIC_GRAPHQL_URL="http://localhost:3000/api/graphql"
```

Replace `root:yourpassword` with your MySQL credentials.

### 3. Set Up the Database

```bash
# Create the database (if it doesn't exist)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS saladbox;"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed with sample data (6 salads, 6 sandwiches, categories, demo user)
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command              | Description                                    |
|----------------------|------------------------------------------------|
| `npm run dev`        | Start development server on port 3000          |
| `npm run build`      | Create production build                        |
| `npm start`          | Start production server                        |
| `npm run lint`       | Run ESLint                                     |
| `npm run db:generate`| Regenerate Prisma client                       |
| `npm run db:migrate` | Run pending database migrations                |
| `npm run db:seed`    | Seed the database with sample data             |
| `npm run db:studio`  | Open Prisma Studio (visual DB browser)         |
| `npm run db:setup`   | Run migrations + seed in one command           |

## Project Structure

```
salad-box-webapp/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data seeder
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/graphql/     # GraphQL API endpoint
│   │   ├── cart/            # Cart page
│   │   ├── checkout/        # Checkout page
│   │   ├── confirmation/    # Order confirmation
│   │   ├── explore/         # Browse & filter products
│   │   ├── product/[slug]/  # Product detail
│   │   ├── profile/         # User profile & orders
│   │   ├── recipe/[slug]/   # Recipe instructions
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── cart/            # Cart components
│   │   ├── layout/          # Navbar, Footer, Section, PageContainer
│   │   ├── product/         # ProductCard, ProductGrid, IngredientList
│   │   ├── recipe/          # RecipeSteps
│   │   └── ui/              # Button, Badge, Rating, Loading, etc.
│   ├── context/             # Apollo & Cart providers
│   ├── lib/
│   │   ├── graphql/         # Schema, resolvers, queries
│   │   ├── apollo-client.ts # Apollo client factory
│   │   ├── prisma.ts        # Prisma singleton
│   │   └── utils.ts         # Utility functions
│   └── types/               # TypeScript interfaces
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## Key Features

- **Dual Product Lines** — Salads and sandwiches with type-aware theming (green/orange)
- **Full Recipe System** — Step-by-step instructions with ingredient lists and chef tips
- **Shopping Cart** — Persistent cart backed by database via GraphQL mutations
- **Order Flow** — Cart → Checkout → Order confirmation with order history
- **Responsive Design** — Desktop-optimized layout with consistent UI
- **GraphQL API** — Single `/api/graphql` endpoint for all data operations

## Demo User

The app ships with a pre-configured demo user (id: 1). No login is required — the cart and orders are automatically associated with this user.

## Troubleshooting

**Database connection fails:**
Ensure MySQL is running and the `DATABASE_URL` in `.env` is correct. Test with `mysql -u root -p`.

**Prisma client not found:**
Run `npx prisma generate` to regenerate the client after schema changes.

**Port 3000 in use:**
Use `npm run dev -- -p 3001` to start on a different port. Update `NEXT_PUBLIC_GRAPHQL_URL` accordingly.
