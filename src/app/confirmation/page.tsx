'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ORDER } from '@/lib/graphql/queries';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const orderId = orderIdParam ? parseInt(orderIdParam, 10) : null;
  const { data, loading } = useQuery(GET_ORDER, { variables: { id: orderId }, skip: !orderId });

  if (loading) return <Loading />;

  const order = data?.order;
  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-txt-muted">Order not found.</p>
        <Link href="/explore" className="link-green text-sm mt-2 inline-block">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="w-20 h-20 bg-brand-green/10 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1 className="text-2xl font-extrabold text-txt">Order Confirmed!</h1>
      <p className="text-txt-muted mt-2">
        Your order <span className="font-semibold text-txt">#{order.orderNumber}</span> has been placed.
      </p>

      <div className="card p-6 mt-8 text-left">
        <h2 className="font-bold text-txt mb-3">Order Details</h2>
        <div className="space-y-2 text-sm">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-txt-muted">{item.product.name} x{item.quantity}</span>
              <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <hr className="border-surface-border my-2" />
          <div className="flex justify-between"><span className="text-txt-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-txt-muted">Delivery</span><span>{formatPrice(order.deliveryFee)}</span></div>
          <div className="flex justify-between"><span className="text-txt-muted">Tax</span><span>{formatPrice(order.tax)}</span></div>
          <div className="flex justify-between text-lg font-bold mt-2">
            <span>Total</span>
            <span className="text-brand-green">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="card p-6 mt-4 text-left">
        <h2 className="font-bold text-txt mb-2">Delivery Address</h2>
        <p className="text-sm text-txt-muted whitespace-pre-line">{order.deliveryAddress}</p>
      </div>

      <div className="flex gap-3 justify-center mt-8">
        <Link href="/explore">
          <Button>Continue Shopping</Button>
        </Link>
        <Link href="/profile">
          <Button variant="outline">View Orders</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <PageContainer className="py-12">
      <Suspense fallback={<Loading />}>
        <ConfirmationContent />
      </Suspense>
    </PageContainer>
  );
}
