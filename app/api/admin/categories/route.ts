import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { services: true } }
      }
    });
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { name, order = 0 } = await req.json();
    if (!name) return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });

    const category = await prisma.serviceCategory.create({
      data: { name, order }
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ success: false, error: 'Category name already exists' }, { status: 400 });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id, name, order } = await req.json();
    if (!id || !name) return NextResponse.json({ success: false, error: 'ID and Name are required' }, { status: 400 });

    const category = await prisma.serviceCategory.update({
      where: { id },
      data: { name, order: order !== undefined ? order : undefined }
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ success: false, error: 'Category name already exists' }, { status: 400 });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    await prisma.serviceCategory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
