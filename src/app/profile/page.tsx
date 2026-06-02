'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ORDERS } from '@/lib/graphql/queries';
import { useAuth } from '@/context/auth-context';
import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import type { Order } from '@/types';

const STATUS_COLORS: Record<string, 'green' | 'orange' | 'blue' | 'muted'> = {
  PENDING: 'orange',
  CONFIRMED: 'blue',
  PREPARING: 'blue',
  DELIVERED: 'green',
  CANCELLED: 'muted',
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  // Redirect guests to login once auth state has settled.
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  const { data, loading } = useQuery(GET_ORDERS, { skip: !user });
  const orders: Order[] = data?.orders ?? [];

  if (authLoading || !user) {
    return <PageContainer className="py-8"><Loading /></PageContainer>;
  }

  return (
    <PageContainer className="py-8">
      {/* Profile Header */}
      <div className="card p-6 mb-8 flex items-center gap-6">
        <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 uppercase">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-txt">{user.name}</h1>
          <p className="text-sm text-txt-muted">{user.email}</p>
        </div>
        <div className="ml-auto flex items-center gap-8 text-center">
          <Button variant="outline" size="sm" onClick={() => { logout(); router.push('/'); }}>
            Logout
          </Button>
          <div>
            <p className="text-2xl font-bold text-brand-green">{orders.length}</p>
            <p className="text-xs text-txt-muted">Orders</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-green">
              {formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}
            </p>
            <p className="text-xs text-txt-muted">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <h2 className="text-xl font-extrabold text-txt mb-4">Order History</h2>
      {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Place your first order to see it here."
          actionLabel="Browse Boxes"
          actionHref="/explore"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-txt">#{order.id.toString().slice(-8).toUpperCase()}</span>
                  <Badge variant={STATUS_COLORS[order.status] || 'muted'}>{order.status}</Badge>
                </div>
                <span className="text-sm text-txt-muted">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-txt-muted">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-surface-border">
                <span className="font-bold text-brand-green">{formatPrice(order.total)}</span>
                <Link href={`/confirmation?orderId=${order.id}`} className="text-sm link-green">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
