/**
 * Application-wide constants.
 * Single source of truth for UI mapping dictionaries.
 */

export const STATUS_CLASS_MAP: Record<string, string> = {
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
