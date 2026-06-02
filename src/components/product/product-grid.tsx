import { ProductCard } from './product-card';
import type { Product } from '@/types';

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 }) {
  const gridCols = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
