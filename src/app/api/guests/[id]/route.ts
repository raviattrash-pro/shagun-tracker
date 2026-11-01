import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id: params.id },
      include: {
        gifts: {
          include: { event: true },
          orderBy: { receivedAt: 'desc' },
        },
        reciprocityFrom: true,
      },
    });

    if (!guest) {
      return NextResponse.json({ success: false, error: 'Guest not found' }, { status: 404 });
    }

    const totalGiven = guest.gifts.reduce(
      (sum, g) => sum + Number(g.cashAmount || 0),
      0
    );

    const formattedGifts = guest.gifts.map((g) => ({
      ...g,
      cashBreakdown: typeof g.cashBreakdown === 'string' ? JSON.parse(g.cashBreakdown) : g.cashBreakdown,
      guest: {
        id: guest.id,
        name: guest.name,
        photoUrl: guest.photoUrl,
        relation: guest.relation,
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...guest,
        gifts: formattedGifts,
        totalGiven,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const guest = await prisma.guest.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ success: true, data: guest });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cleanly delete child records first for SQLite safety
    await prisma.reciprocity.deleteMany({
      where: { guestId: params.id },
    });
    await prisma.gift.deleteMany({
      where: { guestId: params.id },
    });
    await prisma.guest.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Guest deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
