import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gift = await prisma.gift.findUnique({
      where: { id: params.id },
      include: {
        guest: true,
        event: true,
        reciprocity: true,
      },
    });

    if (!gift) {
      return NextResponse.json({ success: false, error: 'Gift not found' }, { status: 404 });
    }

    const parsedGift = {
      ...gift,
      cashBreakdown:
        typeof gift.cashBreakdown === 'string'
          ? JSON.parse(gift.cashBreakdown)
          : gift.cashBreakdown,
    };

    return NextResponse.json({ success: true, data: parsedGift });
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
    const gift = await prisma.gift.update({
      where: { id: params.id },
      data: body,
      include: {
        guest: true,
        event: true,
      },
    });
    return NextResponse.json({ success: true, data: gift });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.gift.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Gift deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
