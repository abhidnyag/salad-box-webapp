'use client';

import { useCart } from '@/context/cart-context';
import { PageContainer } from '@/components/layout/page-container';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

const DELIVERY_FEE = 4.99;
const TAX_RATE = 0.08;

export default function CartPage() {
  const { items, loading, subtotal, clear } = useCart();

  if (loading) return <PageContainer className="py-8"><Loading /></PageContainer>;

  if (items.length === 0) {
    return (
      <PageContainer className="py-8">
        <EmptyState
          title="Your cart is empty"
          description="Browse our delicious salad and sandwich boxes to get started."
          actionLabel="Start Shopping"
          actionHref="/explore"
        />
      </PageContainer>
    );
  }

  const tax = subtotal * TAX_RATE;
  const total = subtotal + DELIVERY_FEE + tax;

  return (
    <PageContainer className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-txt">Your Cart</h1>
        <button onClick={clear} className="text-sm text-accent-red hover:underline">Clear All</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-bold text-txt mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-txt-muted">Subtotal ({items.length} items)</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-txt-muted">Delivery</span>
              <span className="font-semibold">{formatPrice(DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-txt-muted">Tax</span>
              <span className="font-semibold">{formatPrice(tax)}</span>
            </div>
            <hr className="border-surface-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-brand-green">{formatPrice(total)}</span>
            </div>
          </div>
          <Link href="/checkout" className="block mt-6">
            <Button size="lg" className="w-full">Proceed to Checkout</Button>
          </Link>
          <Link href="/explore" className="block mt-3 text-center text-sm link-green">
            Continue Shopping
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
