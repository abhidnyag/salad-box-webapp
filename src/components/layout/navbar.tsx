'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';

const links = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/cart', label: 'Cart' },
  { href: '/profile', label: 'Profile' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-surface-border">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green-light rounded-full flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 80 80" fill="none">
                <ellipse cx="40" cy="50" rx="30" ry="15" fill="#C8E6C9" />
                <circle cx="32" cy="44" r="7" fill="#4CAF50" />
                <circle cx="45" cy="42" r="6" fill="#66BB6A" />
                <circle cx="38" cy="38" r="4" fill="#EF5350" />
              </svg>
            </div>
            <span className="text-xl font-bold text-brand-green">SaladBox</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'text-sm font-medium transition-colors relative pb-0.5',
                  pathname === l.href ? 'text-brand-green' : 'text-txt-secondary hover:text-txt',
                )}
              >
                {l.label}
                {pathname === l.href && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded" />}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 hover:bg-surface-muted rounded-btn transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-txt-secondary">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                title={user.name}
                className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center text-white text-sm font-bold uppercase"
              >
                {user.name.charAt(0)}
              </Link>
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="text-sm font-medium text-txt-secondary hover:text-txt transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-white bg-brand-green hover:bg-brand-green-dark px-4 py-2 rounded-btn transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
