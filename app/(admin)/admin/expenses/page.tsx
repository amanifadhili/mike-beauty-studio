import { prisma } from '@/lib/prisma';
import ExpensesClient from './ExpensesClient';

export const metadata = { title: 'Expenses | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({ orderBy: { date: 'desc' } });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Dashboard</p>
          <h1 className="font-playfair text-3xl text-white">Expenses</h1>
          <p className="text-gray-600 text-sm font-sans mt-1">Log and track all operational costs.</p>
        </div>
        <div className="bg-[#161616] border border-white/[0.06] px-5 py-3 rounded-xl text-right">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Total</p>
          <p className="text-red-400 font-playfair text-xl">RWF {totalExpenses.toLocaleString()}</p>
        </div>
      </div>
      <ExpensesClient initialExpenses={expenses} />
    </div>
  );
}
