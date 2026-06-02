export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export function getTypeTheme(type: 'SALAD' | 'SANDWICH') {
  return type === 'SANDWICH'
    ? { primary: 'bg-brand-orange-deep', text: 'text-brand-orange-deep', light: 'bg-brand-orange-bg', border: 'border-brand-orange-deep' }
    : { primary: 'bg-brand-green', text: 'text-brand-green', light: 'bg-brand-green-light', border: 'border-brand-green' };
}
