'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_CATEGORIES } from '@/lib/graphql/queries';
import { PageContainer } from '@/components/layout/page-container';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductCard } from '@/components/product/product-card';
import { CategoryPills } from '@/components/ui/category-pills';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useState, useMemo, Suspense } from 'react';
import type { Product, Category } from '@/types';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as 'SALAD' | 'SANDWICH' | null;
  const initialCategory = searchParams.get('category');

  const [activeType, setActiveType] = useState<string>(initialType || 'ALL');
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const handleCategoryChange = (slug: string | null) => {
    setActiveCategory(slug ?? 'all');
  };

  const { data: catData } = useQuery(GET_CATEGORIES);
  const { data, loading } = useQuery(GET_PRODUCTS, {
    variables: {
      ...(activeType !== 'ALL' && { type: activeType }),
      ...(activeCategory !== 'all' && { categorySlug: activeCategory }),
    },
  });

  const categories: Category[] = catData?.categories ?? [];
  const products: Product[] = data?.products ?? [];

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sortBy) {
      case 'price-low': return list.sort((a, b) => a.price - b.price);
      case 'price-high': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      default: return list;
    }
  }, [products, sortBy]);

  return (
    <PageContainer className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-txt">Explore Boxes</h1>
          <p className="text-sm text-txt-muted mt-1">{products.length} boxes available</p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-surface-border rounded-btn px-3 py-2 text-sm bg-white"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-4">
        {['ALL', 'SALAD', 'SANDWICH'].map((t) => (
          <Button
            key={t}
            variant={activeType === t ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveType(t)}
          >
            {t === 'ALL' ? 'All' : t === 'SALAD' ? '🥗 Salads' : '🥪 Sandwiches'}
          </Button>
        ))}
      </div>

      {/* Category Filter */}
      <CategoryPills
        categories={categories}
        active={activeCategory === 'all' ? null : activeCategory}
        onChange={handleCategoryChange}
      />

      {/* Products */}
      <div className="mt-6">
        {loading ? (
          <Loading />
        ) : sorted.length === 0 ? (
          <EmptyState
            title="No boxes found"
            description="Try adjusting your filters to find what you're looking for."
            actionLabel="Clear Filters"
            actionHref="/explore"
          />
        ) : (
          <ProductGrid products={sorted} columns={3} />
        )}
      </div>
    </PageContainer>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExploreContent />
    </Suspense>
  );
}
