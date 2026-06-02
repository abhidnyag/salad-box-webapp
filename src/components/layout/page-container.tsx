import { cn } from '@/lib/utils';

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('max-w-[1400px] mx-auto px-6 py-8', className)}>{children}</div>;
}
