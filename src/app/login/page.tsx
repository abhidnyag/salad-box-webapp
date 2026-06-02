'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-semibold text-txt mb-1">{label}</label>
      <input
        {...props}
        className="w-full border border-surface-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      router.push('/explore');
    } catch (err: any) {
      setError(err?.message?.replace(/^.*Error: /, '') || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer className="py-12">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-2xl font-extrabold text-txt mb-1">Welcome back</h1>
        <p className="text-sm text-txt-muted mb-6">Sign in to your SaladBox account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email" type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" autoComplete="email" />
          <Field label="Password" type="password" value={form.password} onChange={set('password')} required placeholder="••••••••" autoComplete="current-password" />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-sm text-txt-muted mt-6 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="link-green font-semibold">Create one</Link>
        </p>
      </div>
    </PageContainer>
  );
}
