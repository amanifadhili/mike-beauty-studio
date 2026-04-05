import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const incomes = await prisma.externalIncome.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json({ success: true, incomes });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, amount, source } = await req.json();
    if (!title || !amount) {
      return NextResponse.json({ success: false, error: 'Missing title or amount' }, { status: 400 });
    }
    const income = await prisma.externalIncome.create({
      data: { title, amount: Number(amount), source: source || 'MANUAL' }
    });
    return NextResponse.json({ success: true, income });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
