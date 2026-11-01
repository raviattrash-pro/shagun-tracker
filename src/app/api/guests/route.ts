import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { createGuestSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@shagun.app' },
    });

    const isDemoAccount = !authUser || authUser.email === 'demo@shagun.app';
    const targetUserId = isDemoAccount ? demoUser?.id : authUser.id;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const relation = searchParams.get('relation');
    const side = searchParams.get('side');

    const guests = await prisma.guest.findMany({
      where: {
        ...(targetUserId ? { userId: targetUserId } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { relation: { contains: search } },
                { city: { contains: search } },
              ],
            }
          : {}),
        ...(relation ? { relation } : {}),
        ...(side ? { side: side as any } : {}),
      },
      include: {
        _count: { select: { gifts: true } },
        gifts: { select: { cashAmount: true } },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = guests.map((g) => {
      const totalGiven = g.gifts.reduce(
        (sum, gift) => sum + Number(gift.cashAmount || 0),
        0
      );
      return {
        ...g,
        totalGiven,
      };
    });

    return NextResponse.json({ success: true, isDemo: isDemoAccount, data: formatted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    let userId = authUser?.id;
    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: 'demo@shagun.app' } });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createGuestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const guest = await prisma.guest.create({
      data: {
        userId,
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        address: parsed.data.address,
        city: parsed.data.city,
        relation: parsed.data.relation,
        side: (parsed.data.side as any) || 'GROOM',
        photoUrl: body.photoUrl,
        notes: parsed.data.notes,
      },
    });

    return NextResponse.json({ success: true, data: guest }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
