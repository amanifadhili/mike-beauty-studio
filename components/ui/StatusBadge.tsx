/**
 * StatusBadge
 * Single source of truth for ALL status/type pill badges across the admin panel.
 * Eliminates the STATUS_STYLES record that was copy-pasted in BookingTable,
 * WorkersClient, and TransactionsPage.
 *
 * Usage:
 *   <StatusBadge status="NEW" />
 *   <StatusBadge status="CONVERTED" />
 *   <StatusBadge status="WALK_IN" />
 */

const STATUS_CLASS_MAP: Record<string, string> = {
  // Booking statuses
  NEW:       'badge badge-new',
  CONFIRMED: 'badge badge-confirmed',
  COMPLETED: 'badge badge-completed',
  CANCELLED: 'badge badge-cancelled',
  CONVERTED: 'badge badge-converted',
  // Worker/profile statuses
  ACTIVE:    'badge badge-active',
  INACTIVE:  'badge badge-inactive',
  // Transaction source
  WALK_IN:   'badge badge-walkin',
  BOOKING:   'badge badge-booking',
};

interface StatusBadgeProps {
  status: string;
  /** Override display label (defaults to status with _ replaced by space) */
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const className = STATUS_CLASS_MAP[status] ?? 'badge badge-inactive';
  const displayLabel = label ?? status.replace(/_/g, ' ');
  return <span className={className}>{displayLabel}</span>;
}
