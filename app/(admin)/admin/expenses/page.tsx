import { prisma } from '@/lib/prisma';
import ExpensesClient from './ExpensesClient';
import { PageHeader } from '@/components/ui';

export const metadata = { title: 'Expenses | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({ orderBy: { date: 'desc' } });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Expenses"
        subtitle="Log and track all operational costs."
        right={
          <div className="admin-card px-5 py-3 text-right">
            <p className="text-xs font-sans uppercase tracking-widest" style={{ color: 'var(--admin-text-muted)' }}>Total</p>
            <p className="font-playfair text-xl" style={{ color: 'var(--status-cancelled-text)' }}>RWF {totalExpenses.toLocaleString()}</p>
          </div>
        }
      />
      <ExpensesClient initialExpenses={expenses} />
    </div>
  );
}
