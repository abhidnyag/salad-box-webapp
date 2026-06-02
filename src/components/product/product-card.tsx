'use client';

import Link from 'next/link';
import { BowlIllustration } from '@/components/ui/bowl-illustration';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { formatPrice, getTypeTheme } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const theme = getTypeTheme(product.type);

  return (
    <div className="bg-surface-card rounded-card border border-surface-border hover:shadow-lg transition-shadow group">
      <Link href={`/product/${product.slug}`}>
        <div className={`relative rounded-t-card p-6 flex items-center justify-center h-44`} style={{ backgroundColor: product.imageColor }}>
          <BowlIllustration color={product.imageColor} size={100} type={product.type} />
          {product.badges?.[0] && (
            <Badge variant={product.type === 'SANDWICH' ? 'orange' : 'green'} className="absolute top-3 left-3">
              {product.badges[0]}
            </Badge>
          )}
          <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
            <span className="text-accent-red text-sm">♥</span>
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-txt group-hover:text-brand-green transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-txt-secondary mt-1">
          {product.ingredients.length} ingredients · {product.prepTime} min · Serves {product.servings}
        </p>
        <div className="mt-2">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold ${theme.text}`}>{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-txt-muted line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product.id)}
            className={`${theme.primary} text-white w-9 h-9 rounded-btn flex items-center justify-center text-xl hover:opacity-90 transition-opacity`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
