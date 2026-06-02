import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Section({ title, action, href, children, className }: {
  title: string;
  action?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('mt-10', className)}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-txt">{title}</h2>
        {action && href && (
          <Link href={href} className="text-sm font-medium text-brand-orange hover:underline">{action} →</Link>
        )}
      </div>
      {children}
    </section>
  );
}
