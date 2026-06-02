import { ApolloServer } from '@apollo/server';
import type { DocumentNode } from 'graphql';
import { typeDefs } from './schema';
import { resolvers, type GraphQLContext } from './resolvers';

/**
 * A single Apollo Server instance shared by the HTTP route handler and by
 * Server Components. Server Components call `executeServerQuery` to run a query
 * IN-PROCESS (resolvers -> Prisma) instead of making an HTTP round-trip to our
 * own /api/graphql endpoint. That round-trip was the main source of slow page
 * loads and also broke whenever the dev server fell back to a non-3000 port.
 */
export const apolloServer = new ApolloServer<GraphQLContext>({ typeDefs, resolvers });

export async function executeServerQuery<T = any>(
  query: DocumentNode,
  variables?: Record<string, unknown>,
  context: GraphQLContext = { userId: null },
): Promise<T> {
  const response = await apolloServer.executeOperation(
    { query, variables },
    { contextValue: context },
  );

  if (response.body.kind !== 'single') {
    throw new Error('Unexpected incremental GraphQL response');
  }
  const { data, errors } = response.body.singleResult;
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
  // graphql-js builds response objects with a null prototype. Server Components
  // can only pass *plain* objects to Client Components, so normalize via a JSON
  // round-trip (the same normalization the previous HTTP fetch path provided).
  return JSON.parse(JSON.stringify(data)) as T;
}
