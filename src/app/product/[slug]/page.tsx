import { getClient } from '@/lib/apollo-client';
import { GET_PRODUCT } from '@/lib/graphql/queries';
import { PageContainer } from '@/components/layout/page-container';
import { IngredientList } from '@/components/product/ingredient-list';
import { BowlIllustration } from '@/components/ui/bowl-illustration';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { AddToCartButton } from './add-to-cart-button';
import { formatPrice, getTypeTheme } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { data } = await getClient().query({ query: GET_PRODUCT, variables: { slug: params.slug } });
  const product: Product | null = data?.product;

  if (!product) notFound();

  const baseTheme = getTypeTheme(product.type);
  const theme = { ...baseTheme, accent: baseTheme.primary };

  return (
    <PageContainer className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="rounded-card overflow-hidden flex items-center justify-center p-10" style={{ backgroundColor: product.imageColor }}>
          <BowlIllustration color={product.imageColor} size={280} type={product.type} />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={product.type === 'SALAD' ? 'green' : 'orange'}>{product.type}</Badge>
            {product.badges?.map((b) => (
              <Badge key={b} variant="muted">{b}</Badge>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold text-txt">{product.name}</h1>
          <p className="text-txt-secondary mt-2 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mt-4">
            <Rating value={product.rating} count={product.reviewCount} />
            <span className="text-sm text-txt-muted">·</span>
            <span className="text-sm text-txt-muted">{product.ingredients?.length ?? 0} ingredients</span>
            <span className="text-sm text-txt-muted">·</span>
            <span className="text-sm text-txt-muted">Serves {product.servings}</span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-txt-muted">Prep: {product.prepTime}</span>
            <span className="text-sm text-txt-muted">·</span>
            <span className="text-sm text-txt-muted">Calories: {product.calories} kcal</span>
          </div>

          <div className="mt-6 flex items-end gap-4">
            <span className="text-3xl font-extrabold" style={{ color: theme.primary }}>{formatPrice(product.price)}</span>
            <span className="text-sm text-txt-muted mb-1">per box</span>
          </div>

          <AddToCartButton productId={product.id} theme={theme} />

          <Link href={`/recipe/${product.slug}`} className="inline-block mt-3 text-sm link-green font-semibold">
            View Full Recipe &rarr;
          </Link>
        </div>
      </div>

      {/* Ingredients */}
      <div className="mt-12">
        <h2 className="text-xl font-extrabold text-txt mb-4">What's in the Box</h2>
        <IngredientList ingredients={product.ingredients ?? []} />
      </div>

      {/* Nutrition Summary */}
      <div className="mt-12">
        <h2 className="text-xl font-extrabold text-txt mb-4">Nutrition Facts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Calories', value: `${product.calories}` },
            { label: 'Prep Time', value: `${product.prepTime} min` },
            { label: 'Servings', value: `${product.servings}` },
            { label: 'Rating', value: `${product.rating}/5` },
          ].map((item) => (
            <div key={item.label} className="card p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: theme.accent }}>{item.value}</p>
              <p className="text-xs text-txt-muted mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
