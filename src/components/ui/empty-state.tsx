import { Button } from './button';
import Link from 'next/link';

export function EmptyState({ title, description, actionLabel, actionHref }: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-surface-muted rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-txt">{title}</h3>
      <p className="text-sm text-txt-muted mt-1">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="inline-block mt-4">
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
