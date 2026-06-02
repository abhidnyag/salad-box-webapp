export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={i <= Math.round(value) ? 'text-accent-yellow' : 'text-gray-200'}>★</span>
        ))}
      </div>
      <span className="text-sm text-txt-secondary">{value}</span>
      {count !== undefined && <span className="text-sm text-txt-muted">({count})</span>}
    </div>
  );
}
