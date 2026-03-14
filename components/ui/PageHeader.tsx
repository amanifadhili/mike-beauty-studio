/**
 * PageHeader
 * Reusable admin page header. Eliminates the copy-pasted breadcrumb + title
 * pattern that was repeated on every single admin page.
 *
 * Usage:
 *   <PageHeader
 *     breadcrumb="Admin Dashboard"
 *     title="Workers"
 *     subtitle="Manage staff profiles and payouts."
 *     right={<span>{count} Staff</span>}
 *   />
 */

interface PageHeaderProps {
  breadcrumb?: string;
  title: string;
  subtitle?: string;
  /** Optional right-hand slot (e.g. a count badge or CTA button) */
  right?: React.ReactNode;
}

export function PageHeader({ breadcrumb = 'Admin Dashboard', title, subtitle, right }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        {breadcrumb && (
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">
            {breadcrumb}
          </p>
        )}
        <h1 className="font-playfair text-3xl" style={{ color: 'var(--admin-text-primary)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm font-sans mt-1" style={{ color: 'var(--admin-text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
