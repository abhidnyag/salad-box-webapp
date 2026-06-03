import { cn } from '@/lib/utils';

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('max-w-[1400px] 2xl:max-w-[1680px] 3xl:max-w-[1840px] mx-auto px-6 lg:px-8 xl:px-12 2xl:px-16 py-8', className)}>{children}</div>;
}
