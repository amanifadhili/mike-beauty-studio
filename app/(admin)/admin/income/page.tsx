import { prisma } from '@/lib/prisma';
import IncomeClient from './IncomeClient';
import { PageHeader } from '@/components/ui';

export const metadata = { title: 'External Income | Mike Beauty Studio Admin' };
export const dynamic = 'force-dynamic';

export default async function IncomePage() {
  const incomes = await prisma.externalIncome.findMany({ orderBy: { date: 'desc' } });

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="animate-fade-in-up">
      <IncomeClient initialIncomes={incomes} totalAmount={totalIncome} />
    </div>
  );
}
