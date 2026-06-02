import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { hashPassword, verifyPassword, signToken } from '@/lib/auth';

export interface GraphQLContext {
  userId: number | null;
}

/** Returns the authenticated user id or throws an UNAUTHENTICATED error. */
function requireAuth(context: GraphQLContext): number {
  if (!context.userId) {
    throw new GraphQLError('You must be signed in to do that', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.userId;
}

const productIncludes = {
  category: true,
  ingredients: true,
  recipe: { include: { steps: { orderBy: { stepNumber: 'asc' as const } } } },
};

function serializeDecimals(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Prisma.Decimal) return obj.toNumber();
  if (Array.isArray(obj)) return obj.map(serializeDecimals);
  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, serializeDecimals(v)]));
  }
  return obj;
}

export const resolvers = {
  Product: {
    badges: (parent: any) => {
      if (!parent.badges) return null;
      if (Array.isArray(parent.badges)) return parent.badges;
      return parent.badges.split(',').map((b: string) => b.trim()).filter(Boolean);
    },
  },

  Recipe: {
    tips: (parent: any) => {
      if (!parent.chefTip) return null;
      return parent.chefTip.split('\n').map((t: string) => t.trim()).filter(Boolean);
    },
  },

  Order: {
    deliveryAddress: (parent: any) => parent.address,
  },

  User: {
    joinDate: (parent: any) =>
      parent.joinDate instanceof Date ? parent.joinDate.toISOString() : parent.joinDate,
  },

  Query: {
    products: async (_: any, args: { type?: string; categorySlug?: string; featured?: boolean; limit?: number }) => {
      const where: any = {};
      if (args.type) where.type = args.type;
      if (args.categorySlug) where.category = { slug: args.categorySlug };
      if (args.featured !== undefined) where.featured = args.featured;

      const products = await prisma.product.findMany({
        where,
        include: productIncludes,
        take: args.limit ?? 50,
        orderBy: { rating: 'desc' },
      });
      return products.map(serializeDecimals);
    },

    product: async (_: any, args: { slug: string }) => {
      const product = await prisma.product.findUnique({
        where: { slug: args.slug },
        include: productIncludes,
      });
      return product ? serializeDecimals(product) : null;
    },

    categories: async (_: any, args: { type?: string }) => {
      const where: any = {};
      if (args.type) where.type = args.type;
      return prisma.category.findMany({ where, orderBy: { name: 'asc' } })
        .then(cats => cats.map(serializeDecimals));
    },

    cart: async (_: any, __: any, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const items = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: { include: productIncludes } },
      });
      return items.map(serializeDecimals);
    },

    orders: async (_: any, __: any, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const orders = await prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: { include: productIncludes } } } },
        orderBy: { createdAt: 'desc' },
      });
      return orders.map(serializeDecimals);
    },

    order: async (_: any, args: { id: number }, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const order = await prisma.order.findUnique({
        where: { id: args.id },
        include: { items: { include: { product: { include: productIncludes } } } },
      });
      // Only the owner may view an order.
      if (!order || order.userId !== userId) return null;
      return serializeDecimals(order);
    },

    me: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.userId) return null;
      return prisma.user.findUnique({ where: { id: context.userId } });
    },
  },

  Mutation: {
    register: async (_: any, args: { input: { name: string; email: string; password: string } }) => {
      const name = args.input.name.trim();
      const email = args.input.email.trim().toLowerCase();
      const { password } = args.input;

      if (!name || !email) throw new Error('Name and email are required');
      if (password.length < 6) throw new Error('Password must be at least 6 characters');

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error('An account with this email already exists');

      const user = await prisma.user.create({
        data: { name, email, password: hashPassword(password) },
      });
      return { token: signToken({ userId: user.id, email: user.email }), user };
    },

    login: async (_: any, args: { input: { email: string; password: string } }) => {
      const email = args.input.email.trim().toLowerCase();
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !user.password || !verifyPassword(args.input.password, user.password)) {
        throw new Error('Invalid email or password');
      }
      return { token: signToken({ userId: user.id, email: user.email }), user };
    },

    addToCart: async (_: any, args: { productId: number; quantity?: number }, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const item = await prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId: args.productId } },
        update: { quantity: { increment: args.quantity ?? 1 } },
        create: { userId, productId: args.productId, quantity: args.quantity ?? 1 },
        include: { product: { include: productIncludes } },
      });
      return serializeDecimals(item);
    },

    updateCartItem: async (_: any, args: { productId: number; quantity: number }, context: GraphQLContext) => {
      const userId = requireAuth(context);
      if (args.quantity <= 0) {
        await prisma.cartItem.delete({
          where: { userId_productId: { userId, productId: args.productId } },
        });
        return null;
      }
      const item = await prisma.cartItem.update({
        where: { userId_productId: { userId, productId: args.productId } },
        data: { quantity: args.quantity },
        include: { product: { include: productIncludes } },
      });
      return serializeDecimals(item);
    },

    removeFromCart: async (_: any, args: { productId: number }, context: GraphQLContext) => {
      const userId = requireAuth(context);
      await prisma.cartItem.delete({
        where: { userId_productId: { userId, productId: args.productId } },
      }).catch(() => null);
      return true;
    },

    clearCart: async (_: any, __: any, context: GraphQLContext) => {
      const userId = requireAuth(context);
      await prisma.cartItem.deleteMany({ where: { userId } });
      return true;
    },

    createOrder: async (_: any, args: { input: { deliveryAddress: string; deliveryPhone?: string } }, context: GraphQLContext) => {
      const userId = requireAuth(context);
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) throw new Error('Cart is empty');

      const subtotal = cartItems.reduce((sum, item) => sum + item.product.price.toNumber() * item.quantity, 0);
      const deliveryFee = subtotal >= 25 ? 0 : 4.99;
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
      const orderNumber = `SB-${Date.now().toString(36).toUpperCase()}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          subtotal,
          deliveryFee,
          tax,
          total,
          address: args.input.deliveryAddress,
          deliverySlot: args.input.deliveryPhone || 'Standard',
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: { items: { include: { product: { include: productIncludes } } } },
      });

      await prisma.cartItem.deleteMany({ where: { userId } });

      return serializeDecimals(order);
    },
  },
};
