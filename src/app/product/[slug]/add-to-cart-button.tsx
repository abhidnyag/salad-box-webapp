'use client';

import { Button } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { useCart } from '@/context/cart-context';
import { useState } from 'react';

export function AddToCartButton({ productId, theme }: { productId: number; theme: { accent: string } }) {
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const inCart = items.some((i) => i.product.id === productId);

  return (
    <div className="flex items-center gap-4 mt-6">
      <QuantitySelector value={qty} onChange={setQty} />
      <Button
        size="lg"
        className="flex-1"
        style={{ backgroundColor: theme.accent }}
        onClick={() => addItem(productId, qty)}
      >
        {inCart ? 'Update Cart' : 'Add to Cart'}
      </Button>
    </div>
  );
}
