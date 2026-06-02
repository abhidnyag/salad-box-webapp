'use client';

import Link from 'next/link';
import { BowlIllustration } from '@/components/ui/bowl-illustration';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/cart-context';

export function CartItemRow({ item }: { item: any }) {
  const { updateItem, removeItem } = useCart();
  const { product } = item;

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-surface-border rounded-card">
      <div className="w-20 h-20 rounded-btn flex items-center justify-center shrink-0" style={{ backgroundColor: product.imageColor }}>
        <BowlIllustration color={product.imageColor} size={50} type={product.type} />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/product/${product.slug}`} className="font-bold text-txt hover:text-brand-green transition-colors">
          {product.name}
        </Link>
        <p className="text-xs text-txt-muted mt-0.5">
          {product.ingredients?.length ?? 0} ingredients · Serves {product.servings}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Link href={`/recipe/${product.slug}`} className="text-xs text-brand-green hover:underline">View Recipe</Link>
          <button onClick={() => removeItem(product.id)} className="text-xs text-accent-red hover:underline">Remove</button>
        </div>
      </div>
      <QuantitySelector value={item.quantity} onChange={q => updateItem(product.id, q)} />
      <span className="text-lg font-bold text-brand-green w-20 text-right">{formatPrice(product.price * item.quantity)}</span>
    </div>
  );
}
