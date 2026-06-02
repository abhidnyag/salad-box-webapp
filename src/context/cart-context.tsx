'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_CART, ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART } from '@/lib/graphql/queries';
import { useAuth } from '@/context/auth-context';

interface CartContextType {
  items: any[];
  loading: boolean;
  count: number;
  subtotal: number;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id;

  // No user → no cart query; the cart is empty until they sign in.
  // The server derives the user from the auth token, so no userId is passed.
  const { data, loading, refetch } = useQuery(GET_CART, { skip: !userId });
  const [addToCart] = useMutation(ADD_TO_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [clearCart] = useMutation(CLEAR_CART);

  const items = userId ? data?.cart ?? [] : [];
  const count = items.reduce((sum: number, i: any) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum: number, i: any) => sum + i.product.price * i.quantity, 0);

  const addItem = useCallback(async (productId: number, quantity = 1) => {
    if (!userId) { router.push('/login'); return; }
    await addToCart({ variables: { productId, quantity } });
    refetch();
  }, [userId, addToCart, refetch, router]);

  const updateItem = useCallback(async (productId: number, quantity: number) => {
    if (!userId) return;
    await updateCartItem({ variables: { productId, quantity } });
    refetch();
  }, [userId, updateCartItem, refetch]);

  const removeItem = useCallback(async (productId: number) => {
    if (!userId) return;
    await removeFromCart({ variables: { productId } });
    refetch();
  }, [userId, removeFromCart, refetch]);

  const clear = useCallback(async () => {
    if (!userId) return;
    await clearCart();
    refetch();
  }, [userId, clearCart, refetch]);

  return (
    <CartContext.Provider value={{ items, loading, count, subtotal, addItem, updateItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
