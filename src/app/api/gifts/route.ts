import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { createGiftSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@shagun.app' },
    });

    const isDemoAccount = !authUser || authUser.email === 'demo@shagun.app';
    const targetUserId = isDemoAccount ? demoUser?.id : authUser.id;

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const guestId = searchParams.get('guestId');
    const giftType = searchParams.get('giftType');

    const gifts = await prisma.gift.findMany({
      where: {
        ...(targetUserId ? { event: { userId: targetUserId } } : {}),
        ...(eventId ? { eventId } : {}),
        ...(guestId ? { guestId } : {}),
        ...(giftType ? { giftType: giftType as any } : {}),
      },
      include: {
        guest: true,
        event: true,
        reciprocity: true,
      },
      orderBy: { receivedAt: 'desc' },
    });

    const parsedGifts = gifts.map((g) => ({
      ...g,
      cashBreakdown:
        typeof g.cashBreakdown === 'string'
          ? JSON.parse(g.cashBreakdown)
          : g.cashBreakdown,
    }));

    return NextResponse.json({ success: true, isDemo: isDemoAccount, data: parsedGifts });
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
    const parsed = createGiftSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const {
      eventId,
      guestId,
      giftType,
      cashAmount,
      cashBreakdown,
      giftDescription,
      envelopeStyle,
      voiceTranscript,
    } = parsed.data;

    // Create Gift and auto-create Reciprocity record
    const gift = await prisma.gift.create({
      data: {
        eventId,
        guestId,
        giftType,
        cashAmount: cashAmount ? Number(cashAmount) : null,
        cashBreakdown: cashBreakdown ? JSON.stringify(cashBreakdown) : undefined,
        giftDescription,
        giftImageUrl: body.giftImageUrl,
        envelopeStyle: envelopeStyle || 'CLASSIC_RED',
        voiceTranscript,
        isOpened: false,
        reciprocity: cashAmount
          ? {
              create: {
                guestId,
                suggestedAmount: Number(cashAmount),
                status: 'PENDING',
              },
            }
          : undefined,
      },
      include: {
        guest: true,
        event: true,
        reciprocity: true,
      },
    });

    return NextResponse.json({ success: true, data: gift }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
