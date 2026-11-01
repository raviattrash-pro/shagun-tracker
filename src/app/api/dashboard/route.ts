import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    // Find demo user for fallback/demo preview
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@shagun.app' },
    });

    const isDemoAccount = !authUser || authUser.email === 'demo@shagun.app';
    const targetUserId = isDemoAccount ? demoUser?.id : authUser.id;

    // If an authenticated real user is logged in, ONLY query their records
    const whereEventUser = targetUserId ? { userId: targetUserId } : {};
    const whereGiftUser = targetUserId ? { event: { userId: targetUserId } } : {};
    const whereGuestUser = targetUserId ? { userId: targetUserId } : {};
    const whereReciprocityUser = targetUserId ? { guest: { userId: targetUserId } } : {};

    const [
      totalEvents,
      totalGuests,
      totalGifts,
      cashAgg,
      totalGiftItems,
      pendingReciprocity,
      recentGifts,
    ] = await Promise.all([
      prisma.event.count({ where: whereEventUser }),
      prisma.guest.count({ where: whereGuestUser }),
      prisma.gift.count({ where: whereGiftUser }),
      prisma.gift.aggregate({
        where: whereGiftUser,
        _sum: { cashAmount: true },
      }),
      prisma.gift.count({
        where: {
          ...whereGiftUser,
          giftType: { in: ['GIFT_ITEM', 'BOTH'] },
        },
      }),
      prisma.reciprocity.count({
        where: {
          ...whereReciprocityUser,
          status: 'PENDING',
        },
      }),
      prisma.gift.findMany({
        where: whereGiftUser,
        take: 8,
        orderBy: { receivedAt: 'desc' },
        include: { guest: true, event: true },
      }),
    ]);

    const parsedRecentGifts = recentGifts.map((g) => ({
      ...g,
      cashBreakdown:
        typeof g.cashBreakdown === 'string'
          ? JSON.parse(g.cashBreakdown)
          : g.cashBreakdown,
    }));

    return NextResponse.json({
      success: true,
      isDemo: isDemoAccount,
      user: authUser
        ? { id: authUser.id, name: authUser.name, email: authUser.email }
        : null,
      data: {
        totalEvents,
        totalGuests,
        totalGifts,
        totalCashReceived: Number(cashAgg._sum.cashAmount || 0),
        totalGiftItems,
        pendingReciprocity,
        recentGifts: parsedRecentGifts,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
