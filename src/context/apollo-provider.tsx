'use client';

import { ApolloProvider } from '@apollo/client';
import { useMemo, ReactNode } from 'react';
import { createApolloClient } from '@/lib/apollo-client';

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
