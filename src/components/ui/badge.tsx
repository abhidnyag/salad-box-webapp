import { cn } from '@/lib/utils';

type Variant = 'green' | 'orange' | 'red' | 'blue' | 'purple' | 'yellow' | 'muted';

const styles: Record<Variant, string> = {
  green: 'bg-brand-green-light text-brand-green',
  orange: 'bg-brand-orange-bg text-brand-orange-deep',
  red: 'bg-red-50 text-accent-red',
  blue: 'bg-blue-50 text-accent-blue',
  purple: 'bg-purple-50 text-accent-purple',
  yellow: 'bg-yellow-50 text-yellow-700',
  muted: 'bg-surface-muted text-txt-secondary',
};

export function Badge({ variant = 'green', children, className }: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', styles[variant], className)}>
      {children}
    </span>
  );
}
