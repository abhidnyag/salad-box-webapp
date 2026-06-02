'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import { LOGIN, REGISTER, ME } from '@/lib/graphql/queries';
import { TOKEN_STORAGE_KEY as TOKEN_KEY } from '@/lib/apollo-client';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  joinDate?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from a previously stored token and validate it against the server.
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (!stored) {
      setLoading(false);
      return;
    }
    // The auth link reads the token from localStorage, so ME authenticates
    // via the Authorization header (no token argument needed).
    client
      .query({ query: ME, fetchPolicy: 'network-only' })
      .then(({ data }) => {
        if (data?.me) {
          setUser(data.me);
          setToken(stored);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, [client]);

  const applySession = useCallback(
    async (nextToken: string, nextUser: AuthUser) => {
      localStorage.setItem(TOKEN_KEY, nextToken);
      setToken(nextToken);
      setUser(nextUser);
      // Clear cached cart/orders so they refetch for the newly active user.
      await client.resetStore().catch(() => {});
    },
    [client],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await client.mutate({ mutation: LOGIN, variables: { input: { email, password } } });
      await applySession(data.login.token, data.login.user);
    },
    [client, applySession],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await client.mutate({ mutation: REGISTER, variables: { input: { name, email, password } } });
      await applySession(data.register.token, data.register.user);
    },
    [client, applySession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    client.resetStore().catch(() => {});
  }, [client]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
