import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Role, CommissionType, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// POST: Create a brand-new Staff User directly (WORKER role)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let adminUserId = (session.user as any).id;
    if (!adminUserId) {
      const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!dbUser) return NextResponse.json({ success: false, error: 'Admin user not found in DB' }, { status: 401 });
      adminUserId = dbUser.id;
    }

    const body = await req.json();
    const { name, email, password, phone, roleTitle, commissionType, commissionRate } = body;

    // Validate required fields
    if (!name || !email || !password || !roleTitle || !commissionType || commissionRate === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name, email, password, roleTitle, commissionType, commissionRate' }, { status: 400 });
    }

    // Check for duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'A user with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: Role.WORKER,
        roleTitle,
        commissionType: commissionType as CommissionType,
        commissionRate: Math.round(Number(commissionRate)),
        status: UserStatus.ACTIVE,
        balance: 0,
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'CREATE_STAFF',
        targetId: newStaff.id,
        targetType: 'User',
        details: JSON.stringify({ name, email, role: 'WORKER', roleTitle }),
      }
    });

    return NextResponse.json({ success: true, staff: newStaff });

  } catch (error: any) {
    console.error('Create staff error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update existing Staff profile (role title, commission, status)
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, phone, roleTitle, commissionType, commissionRate, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID (User ID) is required' }, { status: 400 });
    }

    const updatedStaff = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(roleTitle !== undefined ? { roleTitle } : {}),
        commissionType: commissionType as CommissionType,
        commissionRate: commissionRate !== undefined ? Math.round(Number(commissionRate)) : undefined,
        status: status as UserStatus,
      }
    });

    return NextResponse.json({ success: true, staff: updatedStaff });

  } catch (error: any) {
    console.error('Update staff error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
