'use client';

import { cn } from '@/lib/utils';

export function QuantitySelector({ value, onChange, min = 1, className }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-center bg-surface-muted rounded-btn', className)}>
      <button
        onClick={() => value > min && onChange(value - 1)}
        className="w-9 h-9 flex items-center justify-center text-lg text-txt-secondary hover:text-txt rounded-l-btn"
        disabled={value <= min}
      >
        −
      </button>
      <span className="w-8 text-center font-bold text-sm">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-9 h-9 flex items-center justify-center text-lg text-white bg-brand-green rounded-r-btn hover:bg-brand-green-dark"
      >
        +
      </button>
    </div>
  );
}
