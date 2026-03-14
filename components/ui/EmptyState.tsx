/**
 * EmptyState
 * Centred empty-state placeholder. Eliminates duplicate empty-state markup
 * in Workers, Transactions, and Expenses pages.
 *
 * Usage:
 *   <EmptyState message="No transactions yet." />
 *   <EmptyState icon={CalendarIcon} message="No bookings found." />
 */

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

const DEFAULT_ICON = (
  <svg className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--admin-text-faint)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="admin-card p-16 text-center">
      {icon ?? DEFAULT_ICON}
      <p className="font-sans text-sm" style={{ color: 'var(--admin-text-muted)' }}>{message}</p>
    </div>
  );
}
