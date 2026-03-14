import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, amount, category } = await req.json();
    if (!title || !amount || !category) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const expense = await prisma.expense.create({
      data: { title, amount: Number(amount), category }
    });
    return NextResponse.json({ success: true, expense });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
