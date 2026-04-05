import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      where: { category: { not: null } },
      select: { category: true },
      orderBy: { category: 'asc' },
    });

    const categoryCounts = media.reduce<Record<string, number>>((acc, item) => {
      const category = item.category?.trim();
      if (!category) return acc;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.entries(categoryCounts).map(([name, count], index) => ({
      id: `media-category-${index}`,
      name,
      order: index,
      _count: { services: count },
    }));

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { name } = await req.json();
    if (!name) return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });

    return NextResponse.json(
      { success: false, error: 'Category creation is not supported with current schema.' },
      { status: 501 }
    );
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

    return NextResponse.json(
      { success: false, error: 'Category update is not supported with current schema.' },
      { status: 501 }
    );
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

    return NextResponse.json(
      { success: false, error: 'Category deletion is not supported with current schema.' },
      { status: 501 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
