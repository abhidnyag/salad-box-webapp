import { getClient } from '@/lib/apollo-client';
import { GET_PRODUCT } from '@/lib/graphql/queries';
import { PageContainer } from '@/components/layout/page-container';
import { IngredientList } from '@/components/product/ingredient-list';
import { RecipeSteps } from '@/components/recipe/recipe-steps';
import { BowlIllustration } from '@/components/ui/bowl-illustration';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTypeTheme } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const { data } = await getClient().query({ query: GET_PRODUCT, variables: { slug: params.slug } });
  const product: Product | null = data?.product;

  if (!product || !product.recipe) notFound();

  const theme = getTypeTheme(product.type);
  const { recipe } = product;

  return (
    <PageContainer className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
        <div className="w-full md:w-48 h-48 rounded-card flex items-center justify-center shrink-0" style={{ backgroundColor: product.imageColor }}>
          <BowlIllustration color={product.imageColor} size={120} type={product.type} />
        </div>
        <div>
          <Badge variant={product.type === 'SALAD' ? 'green' : 'orange'} className="mb-2">{product.type} RECIPE</Badge>
          <h1 className="text-3xl font-extrabold text-txt">{recipe.title}</h1>
          <p className="text-txt-secondary mt-2 max-w-xl">{recipe.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-txt-muted">
            <span>Prep: {product.prepTime}</span>
            <span>·</span>
            <span>Serves {product.servings}</span>
            <span>·</span>
            <span>{recipe.difficulty}</span>
          </div>
          <Link href={`/product/${product.slug}`} className="inline-block mt-4">
            <Button variant={product.type === 'SALAD' ? 'primary' : 'orange'} size="sm">Order This Box</Button>
          </Link>
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold text-txt mb-4">Ingredients</h2>
        <IngredientList ingredients={product.ingredients ?? []} />
      </div>

      {/* Steps */}
      <div>
        <h2 className="text-xl font-extrabold text-txt mb-6">Step-by-Step Instructions</h2>
        <RecipeSteps steps={recipe.steps ?? []} accentColor={product.type === 'SALAD' ? 'bg-brand-green' : 'bg-brand-orange'} />
      </div>

      {/* Chef Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div className="mt-10 card p-6" style={{ borderColor: theme.primary + '40' }}>
          <h3 className="font-bold text-txt mb-3">Chef Tips</h3>
          <ul className="space-y-2">
            {recipe.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-txt-secondary">
                <span style={{ color: theme.primary }}>&#10003;</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
}
