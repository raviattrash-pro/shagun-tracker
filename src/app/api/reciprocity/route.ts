import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@shagun.app' },
    });

    const isDemoAccount = !authUser || authUser.email === 'demo@shagun.app';
    const targetUserId = isDemoAccount ? demoUser?.id : authUser.id;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const items = await prisma.reciprocity.findMany({
      where: {
        ...(targetUserId ? { guest: { userId: targetUserId } } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        guest: true,
        originalGift: {
          include: { event: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, isDemo: isDemoAccount, data: items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, actualAmount, returnEventName, notes } = body;

    const updated = await prisma.reciprocity.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(actualAmount !== undefined ? { actualAmount: Number(actualAmount) } : {}),
        ...(returnEventName ? { returnEventName } : {}),
        ...(notes ? { notes } : {}),
      },
      include: { guest: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
