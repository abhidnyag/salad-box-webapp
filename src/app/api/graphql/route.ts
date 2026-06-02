import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { apolloServer } from '@/lib/graphql/server';
import { type GraphQLContext } from '@/lib/graphql/resolvers';
import { verifyToken } from '@/lib/auth';

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(apolloServer, {
  // Verify the bearer token on every request and expose the authenticated
  // user id to resolvers. Resolvers must never trust a client-supplied userId.
  context: async (req) => {
    const header = req.headers.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const payload = token ? verifyToken(token) : null;
    return { userId: payload?.userId ?? null };
  },
});

export { handler as GET, handler as POST };
