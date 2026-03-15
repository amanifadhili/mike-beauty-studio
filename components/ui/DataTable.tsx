/**
 * DataTable (Generic)
 * Reusable wrapper for all system data tables.
 * Automatically handles the dual-layout responsive architecture:
 * 1. Desktop: Full-width horizontally scrollable traditional table (`md:block`)
 * 2. Mobile: Spaced vertical card stack (`md:hidden` with `gap-4`)
 */

interface DataTableProps<T> {
  data: T[];
  columns: string[];
  renderRow: (item: T, index: number) => React.ReactNode;
  renderCard: (item: T, index: number) => React.ReactNode;
  emptyStateMessage?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  renderRow, 
  renderCard, 
  emptyStateMessage = "No records found." 
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="admin-card overflow-hidden p-12 text-center font-sans text-sm" style={{ color: 'var(--admin-text-muted)' }}>
        {emptyStateMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table (md+) */}
      <div className="admin-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full min-w-max font-sans text-sm text-left whitespace-nowrap">
            <thead className="text-[10px] uppercase tracking-[0.15em] border-b" style={{ color: 'var(--admin-text-muted)', borderColor: 'var(--admin-border-subtle)' }}>
              <tr>
                {columns.map((col, i) => (
                  <th key={col || i} className="px-6 py-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--admin-border-subtle)' }}>
              {data.map((item, i) => renderRow(item, i))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout (below md breakpoint) */}
      <div className="md:hidden flex flex-col gap-4">
        {data.map((item, i) => (
          <div key={i} className="admin-card">
            {renderCard(item, i)}
          </div>
        ))}
      </div>
    </>
  );
}
