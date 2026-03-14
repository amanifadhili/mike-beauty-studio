/**
 * DataTable
 * Reusable wrapper for admin data tables.
 * Provides consistent surface background, border, border-radius, and overflow handling.
 * Also renders a standardised column header row.
 *
 * Usage:
 *   <DataTable columns={['Date', 'Client', 'Amount']}>
 *     <tr>...</tr>
 *   </DataTable>
 */

interface DataTableProps {
  columns: string[];
  children: React.ReactNode;
  /** Render a right-aligned column header for the last column */
  lastColumnRight?: boolean;
}

export function DataTable({ columns, children, lastColumnRight = false }: DataTableProps) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full font-sans text-sm text-left whitespace-nowrap">
          <thead
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{
              color: 'var(--admin-text-muted)',
              borderBottom: '1px solid var(--admin-border-subtle)',
            }}
          >
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`px-5 py-3 ${lastColumnRight && i === columns.length - 1 ? 'text-right' : ''}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            style={{ borderTop: '0' }}
            className="divide-y"
            /* divider uses CSS var */
          >
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
