import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { createEventSchema } from '@/lib/validators';

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
    const eventType = searchParams.get('eventType');

    const events = await prisma.event.findMany({
      where: {
        ...(targetUserId ? { userId: targetUserId } : {}),
        ...(search ? { title: { contains: search } } : {}),
        ...(eventType ? { eventType: eventType as any } : {}),
      },
      include: {
        _count: { select: { gifts: true } },
        gifts: { select: { cashAmount: true } },
      },
      orderBy: { eventDate: 'desc' },
    });

    const formatted = events.map((e) => {
      const totalCash = e.gifts.reduce(
        (sum, g) => sum + Number(g.cashAmount || 0),
        0
      );
      return {
        ...e,
        totalCash,
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
    const parsed = createEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        userId,
        title: parsed.data.title,
        eventType: parsed.data.eventType as any,
        eventDate: new Date(parsed.data.eventDate),
        venue: parsed.data.venue,
        city: parsed.data.city,
        notes: parsed.data.notes,
        coverImage: body.coverImage,
      },
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
