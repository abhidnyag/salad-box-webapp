import { executeServerQuery } from '@/lib/graphql/server';
import { GET_PRODUCTS, GET_CATEGORIES } from '@/lib/graphql/queries';
import { PageContainer } from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import { ProductGrid } from '@/components/product/product-grid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Product, Category } from '@/types';

// Rendered per request, but cheaply: the three queries below run in-process
// (resolvers -> Prisma) with no HTTP round-trip. Kept dynamic so `next build`
// never needs a live database to prerender this page.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [saladsData, sandwichesData, catData] = await Promise.all([
    executeServerQuery<{ products: Product[] }>(GET_PRODUCTS, { type: 'SALAD', featured: true }),
    executeServerQuery<{ products: Product[] }>(GET_PRODUCTS, { type: 'SANDWICH', featured: true }),
    executeServerQuery<{ categories: Category[] }>(GET_CATEGORIES),
  ]);

  const salads: Product[] = saladsData.products;
  const sandwiches: Product[] = sandwichesData.products;
  const categories: Category[] = catData.categories;

  return (
    <>
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-brand-green to-brand-green-dark text-white">
        <PageContainer className="py-16 md:py-24">
          <div className="max-w-2xl">
            <Badge variant="yellow" className="mb-4">Free delivery on first order</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Fresh Ingredients.<br />
              Easy Recipes.<br />
              <span className="text-brand-green-light">One Box.</span>
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-lg">
              Everything you need to make delicious salads and sandwiches at home — premium ingredients and step-by-step recipes delivered to your door.
            </p>
            <div className="flex gap-3 mt-8">
              <Link href="/explore?type=SALAD">
                <Button variant="ghost" size="lg" className="bg-white text-brand-green hover:bg-white/90">Shop Salads</Button>
              </Link>
              <Link href="/explore?type=SANDWICH">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">Shop Sandwiches</Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Categories */}
      <PageContainer className="py-12">
        <Section title="Browse by Category" href="/explore">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/explore?category=${cat.slug}`}
                className="card p-4 text-center hover:border-brand-green hover:shadow-md transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: cat.color + '20' }}
                >
                  {cat.icon}
                </div>
                <p className="text-sm font-semibold text-txt group-hover:text-brand-green transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </Section>
      </PageContainer>

      {/* Featured Salads */}
      <PageContainer className="pb-12">
        <Section title="Popular Salad Boxes" href="/explore?type=SALAD">
          <ProductGrid products={salads.slice(0, 4)} columns={4} />
        </Section>
      </PageContainer>

      {/* Promo Banner */}
      <div className="bg-brand-orange/5">
        <PageContainer className="py-12">
          <div className="card bg-gradient-to-r from-brand-orange to-[#FF8F00] text-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold">Try Our Sandwich Boxes!</h2>
              <p className="mt-2 text-white/80 max-w-md">
                Gourmet sandwich ingredient kits with chef-crafted recipes. Premium breads, fresh fillings, and signature sauces.
              </p>
              <Link href="/explore?type=SANDWICH" className="inline-block mt-4">
                <Button className="bg-white text-brand-orange hover:bg-white/90">Explore Sandwiches</Button>
              </Link>
            </div>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-6xl">
              🥪
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Featured Sandwiches */}
      <PageContainer className="py-12">
        <Section title="Popular Sandwich Boxes" href="/explore?type=SANDWICH">
          <ProductGrid products={sandwiches.slice(0, 4)} columns={4} />
        </Section>
      </PageContainer>

      {/* How It Works */}
      <div className="bg-white">
        <PageContainer className="py-16">
          <h2 className="text-2xl font-extrabold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: '1', title: 'Choose Your Box', desc: 'Browse salad and sandwich boxes with recipes you love.' },
              { step: '2', title: 'We Deliver Fresh', desc: 'All ingredients pre-portioned and delivered to your door.' },
              { step: '3', title: 'Cook & Enjoy', desc: 'Follow the easy recipe steps and enjoy a perfect meal.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-brand-green text-white rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold">
                  {s.step}
                </div>
                <h3 className="font-bold text-txt">{s.title}</h3>
                <p className="text-sm text-txt-muted mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>
    </>
  );
}
