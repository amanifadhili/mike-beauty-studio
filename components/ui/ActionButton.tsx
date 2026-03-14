/**
 * ActionButton
 * Loading-aware, disabled-state-aware submit button.
 * Replaces duplicate button patterns in POSTerminal, ExpensesClient, and BookingTable.
 *
 * Usage:
 *   <ActionButton loading={isSubmitting} disabled={!formValid}>
 *     Confirm Transaction
 *   </ActionButton>
 *
 *   <ActionButton loading={loading} variant="danger">
 *     Delete Record
 *   </ActionButton>
 */

type ButtonVariant = 'primary' | 'gold' | 'danger' | 'ghost';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-white text-black hover:bg-white/90',
  gold:    'bg-gold text-black hover:bg-gold/90',
  danger:  'text-red-400 hover:bg-red-400/10 border border-red-500/20',
  ghost:   'border hover:bg-white/5',
};

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function ActionButton({
  loading = false,
  loadingText = 'Processing...',
  variant = 'primary',
  disabled,
  children,
  className = '',
  ...rest
}: ActionButtonProps) {
  const variantClass = VARIANT_CLASSES[variant];
  return (
    <button
      disabled={loading || disabled}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-sans font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
      {...rest}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {loading ? loadingText : children}
    </button>
  );
}
