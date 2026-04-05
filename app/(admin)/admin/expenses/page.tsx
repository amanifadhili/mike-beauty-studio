import { prisma } from '@/lib/prisma';
import ExpensesClient from './ExpensesClient';
import { PageHeader } from '@/components/ui';

export const metadata = { title: 'Expenses | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({ orderBy: { date: 'desc' } });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="animate-fade-in-up">
      <ExpensesClient initialExpenses={expenses} totalAmount={totalExpenses} />
    </div>
  );
}
