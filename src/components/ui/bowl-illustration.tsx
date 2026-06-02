export function BowlIllustration({ color = '#E8F5E9', size = 80, type = 'SALAD' }: {
  color?: string;
  size?: number;
  type?: 'SALAD' | 'SANDWICH';
}) {
  if (type === 'SANDWICH') {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <rect x="12" y="24" width="56" height="32" rx="12" fill={color} />
        <rect x="16" y="34" width="48" height="5" rx="2" fill="#4CAF50" />
        <rect x="16" y="39" width="48" height="4" rx="1" fill="#EF5350" />
        <rect x="16" y="43" width="48" height="3" rx="1" fill="#FFC107" />
        <rect x="12" y="46" width="56" height="10" rx="5" fill="#C69C6D" />
        <ellipse cx="40" cy="30" rx="24" ry="4" fill="#DEB887" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="50" rx="30" ry="15" fill={color} />
      <ellipse cx="40" cy="47" rx="30" ry="12" fill={color} opacity="0.7" />
      <circle cx="30" cy="43" r="8" fill="#4CAF50" />
      <circle cx="45" cy="41" r="7" fill="#66BB6A" />
      <circle cx="37" cy="38" r="5" fill="#EF5350" />
      <circle cx="52" cy="45" r="5" fill="#81C784" />
      <circle cx="25" cy="47" r="4" fill="#388E3C" />
      <rect x="42" y="36" width="8" height="3" rx="1.5" fill="#FF9800" transform="rotate(-15)" />
    </svg>
  );
}
