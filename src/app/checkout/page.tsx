'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '@/lib/graphql/queries';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

const DELIVERY_FEE = 4.99;
const TAX_RATE = 0.08;

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-semibold text-txt mb-1">{label}</label>
      <input
        {...props}
        className="w-full border border-surface-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, loading: cartLoading, clear } = useCart();
  const [createOrder, { loading: orderLoading }] = useMutation(CREATE_ORDER);
  const [form, setForm] = useState({ name: '', address: '', city: '', zip: '', phone: '' });

  if (authLoading || cartLoading) return <PageContainer className="py-8"><Loading /></PageContainer>;

  if (!user) {
    return (
      <PageContainer className="py-8 text-center">
        <p className="text-txt-muted">Please sign in to check out.</p>
        <Link href="/login" className="link-green text-sm mt-2 inline-block">Sign in</Link>
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <PageContainer className="py-8 text-center">
        <p className="text-txt-muted">Your cart is empty.</p>
        <Link href="/explore" className="link-green text-sm mt-2 inline-block">Browse boxes</Link>
      </PageContainer>
    );
  }

  const tax = subtotal * TAX_RATE;
  const total = subtotal + DELIVERY_FEE + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createOrder({
        variables: {
          input: {
            deliveryAddress: `${form.name}\n${form.address}\n${form.city}, ${form.zip}`,
            deliveryPhone: form.phone,
          },
        },
      });
      await clear();
      router.push(`/confirmation?orderId=${data.createOrder.id}`);
    } catch (err) {
      console.error('Order failed:', err);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <PageContainer className="py-8">
      <h1 className="text-2xl font-extrabold text-txt mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Info */}
          <div className="card p-6">
            <h2 className="font-bold text-txt mb-4">Delivery Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={form.name} onChange={set('name')} required placeholder="John Doe" />
              <Input label="Phone" value={form.phone} onChange={set('phone')} required placeholder="+1 (555) 000-0000" type="tel" />
              <div className="sm:col-span-2">
                <Input label="Address" value={form.address} onChange={set('address')} required placeholder="123 Main St, Apt 4" />
              </div>
              <Input label="City" value={form.city} onChange={set('city')} required placeholder="San Francisco" />
              <Input label="ZIP Code" value={form.zip} onChange={set('zip')} required placeholder="94105" />
            </div>
          </div>

          {/* Payment (demo) */}
          <div className="card p-6">
            <h2 className="font-bold text-txt mb-4">Payment Method</h2>
            <div className="bg-brand-green-light/30 border border-brand-green/20 rounded-btn p-4 text-sm text-brand-green-dark">
              This is a demo app. No real payment is processed. Click "Place Order" to simulate.
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-bold text-txt mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span className="text-txt-muted truncate mr-2">{item.product.name} x{item.quantity}</span>
                <span className="font-semibold shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <hr className="border-surface-border mb-3" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-txt-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-txt-muted">Delivery</span><span>{formatPrice(DELIVERY_FEE)}</span></div>
            <div className="flex justify-between"><span className="text-txt-muted">Tax</span><span>{formatPrice(tax)}</span></div>
            <hr className="border-surface-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-brand-green">{formatPrice(total)}</span>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full mt-6" disabled={orderLoading}>
            {orderLoading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
