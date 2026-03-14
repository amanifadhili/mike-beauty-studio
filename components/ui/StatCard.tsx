/**
 * StatCard
 * Reusable metric display card used in Transactions, Reports, and Worker Dashboard.
 * Accepts a label, a formatted value string, and an optional color variant.
 *
 * Usage:
 *   <StatCard label="Total Revenue" value="RWF 450,000" variant="gold" />
 *   <StatCard label="Net Profit"    value="RWF 120,000" variant="green" />
 *   <StatCard label="Expenses"      value="RWF 80,000"  variant="red" />
 */

type StatCardVariant = 'gold' | 'green' | 'red' | 'blue' | 'purple' | 'sky';

const VARIANT_COLORS: Record<StatCardVariant, string> = {
  gold:   'text-gold',
  green:  'text-green-400',
  red:    'text-red-400',
  blue:   'text-blue-400',
  purple: 'text-purple-400',
  sky:    'text-sky-400',
};

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: StatCardVariant;
  unit?: string;
}

export function StatCard({ label, value, variant = 'gold', unit }: StatCardProps) {
  const colorClass = VARIANT_COLORS[variant];
  const displayValue = unit ? `${unit} ${typeof value === 'number' ? value.toLocaleString() : value}` : (typeof value === 'number' ? value.toLocaleString() : value);

  return (
    <div className="admin-card p-5">
      <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--admin-text-muted)' }}>
        {label}
      </p>
      <p className={`font-playfair text-2xl ${colorClass}`}>{displayValue}</p>
    </div>
  );
}
