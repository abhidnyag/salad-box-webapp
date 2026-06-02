import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const TOKEN_STORAGE_KEY = 'saladbox.token';

export function createApolloClient() {
  // Always use a relative URL in the browser so requests hit whatever
  // origin/port the app was actually served from. Pinning this to an
  // absolute NEXT_PUBLIC_GRAPHQL_URL breaks if `next dev` falls back to a
  // different port (e.g. 3000 in use -> 3001).
  const httpLink = new HttpLink({ uri: '/api/graphql' });

  // Attach the stored session token (read fresh on every request) so the
  // server can authenticate the user. Resolvers derive userId from this.
  const authLink = setContext((_, { headers }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    return { headers: { ...headers, ...(token ? { authorization: `Bearer ${token}` } : {}) } };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  });
}

// NOTE: Server Components must NOT fetch over HTTP from our own API. They run
// GraphQL in-process via `executeServerQuery` in `src/lib/graphql/server.ts`.
