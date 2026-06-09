import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// The client is created lazily, on first property access, rather than at module
// import time. During `next build`, Next imports route modules to collect their
// page data; eagerly running `new PrismaClient()` there throws a
// PrismaClientInitializationError whenever DATABASE_URL is absent from the build
// environment (which surfaces as "Failed to collect page data for /api/graphql").
// Deferring construction means the client is only built when a request actually
// uses it — at runtime, where DATABASE_URL is present.
let client: PrismaClient | undefined;

function getClient(): PrismaClient {
  if (!client) {
    client = globalForPrisma.prisma ?? new PrismaClient();
    // Reuse a single instance across hot reloads in development.
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const value = Reflect.get(getClient(), prop, getClient());
    return typeof value === 'function' ? value.bind(getClient()) : value;
  },
});
