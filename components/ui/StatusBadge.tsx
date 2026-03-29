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

import { STATUS_CLASS_MAP } from '@/lib/constants';

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
