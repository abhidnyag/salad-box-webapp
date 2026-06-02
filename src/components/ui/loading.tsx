export function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-muted rounded-btn ${className}`} />;
}
