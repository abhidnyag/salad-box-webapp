'use client';

import { cn } from '@/lib/utils';
import type { Category } from '@/types';

export function CategoryPills({ categories, active, onChange, type = 'SALAD' }: {
  categories: Category[];
  active: string | null;
  onChange: (slug: string | null) => void;
  type?: 'SALAD' | 'SANDWICH';
}) {
  const activeColor = type === 'SANDWICH' ? 'bg-brand-orange-deep text-white' : 'bg-brand-green text-white';
  const inactiveColor = type === 'SANDWICH' ? 'bg-brand-orange-bg text-brand-orange-deep' : 'bg-brand-green-light text-brand-green';

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange(null)}
        className={cn('px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors', active === null ? activeColor : 'bg-surface-muted text-txt-secondary')}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={cn('px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors', active === cat.slug ? activeColor : inactiveColor)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
