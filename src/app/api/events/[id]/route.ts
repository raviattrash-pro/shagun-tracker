import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        gifts: {
          include: {
            guest: true,
          },
          orderBy: { receivedAt: 'desc' },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    const totalCash = event.gifts.reduce(
      (sum, g) => sum + Number(g.cashAmount || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: { ...event, totalCash },
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
    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...body,
        ...(body.eventDate ? { eventDate: new Date(body.eventDate) } : {}),
      },
    });
    return NextResponse.json({ success: true, data: event });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
