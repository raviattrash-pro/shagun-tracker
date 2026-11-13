import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// Default initial items for Indian Wedding Gift Registry
const INITIAL_REGISTRY_ITEMS = [
  {
    title: 'Philips Digital Air Fryer 4.1L (एयर फ्रायर)',
    category: 'Kitchen',
    suggestedStore: 'Amazon / Croma',
    storeUrl: 'https://www.amazon.in',
    approxCost: 7499,
    claimedBy: 'Ramesh Chacha (चाचाजी)',
    claimedByPhone: '+91 98765 11111',
    status: 'CLAIMED',
    notes: 'Black color, 4.1 Litre capacity with baking tray',
  },
  {
    title: 'Prestige Iris Plus 750W Mixer Grinder (मिक्सर ग्राइंडर)',
    category: 'Kitchen',
    suggestedStore: 'Amazon / Flipkart',
    storeUrl: 'https://www.amazon.in',
    approxCost: 3399,
    claimedBy: 'Sunita Bua (बुआजी)',
    claimedByPhone: '+91 98765 44444',
    status: 'CLAIMED',
    notes: 'Stainless steel 4 jars including juicer jar',
  },
  {
    title: 'Tanishq 22K Gold Coin 5g (सोने का सिक्का)',
    category: 'Gold & Silver',
    suggestedStore: 'Tanishq Official',
    storeUrl: 'https://www.tanishq.co.in',
    approxCost: 39500,
    claimedBy: 'Mukesh Mama (मामाजी)',
    claimedByPhone: '+91 98765 33333',
    status: 'CLAIMED',
    notes: 'Lakshmi-Ganesh engraved with tamper-proof packaging',
  },
  {
    title: 'Samsung 43-inch Crystal 4K Smart TV',
    category: 'Electronics',
    suggestedStore: 'Reliance Digital / Croma',
    storeUrl: 'https://www.reliancedigital.in',
    approxCost: 28990,
    claimedBy: null,
    claimedByPhone: null,
    status: 'AVAILABLE',
    notes: 'For master bedroom wall mount (UHD 4K Series)',
  },
  {
    title: 'Corelle Kyoto Leaves Dinner Set (33 Pieces)',
    category: 'Home & Dining',
    suggestedStore: 'Home Centre / Amazon',
    storeUrl: 'https://www.homecentre.in',
    approxCost: 9199,
    claimedBy: null,
    claimedByPhone: null,
    status: 'AVAILABLE',
    notes: 'Break and chip resistant, microwave safe',
  },
  {
    title: 'Bajaj Majesty 16L Oven Toaster Griller (OTG)',
    category: 'Kitchen',
    suggestedStore: 'Amazon',
    storeUrl: 'https://www.amazon.in',
    approxCost: 4799,
    claimedBy: null,
    claimedByPhone: null,
    status: 'AVAILABLE',
    notes: 'Includes stainless steel grill tray & skewers',
  },
  {
    title: 'Pure Silver Pooja Thali Set 250g (चाँदी की पूजा थाली)',
    category: 'Gold & Silver',
    suggestedStore: 'Tanishq / Kalyan Jewellers',
    storeUrl: 'https://www.kalyanjewellers.net',
    approxCost: 22500,
    claimedBy: null,
    claimedByPhone: null,
    status: 'AVAILABLE',
    notes: 'Includes silver diya, bell, agarbatti stand and roli katori',
  },
  {
    title: 'Dyson V8 Cordless Vacuum Cleaner',
    category: 'Home Appliances',
    suggestedStore: 'Dyson Official / Croma',
    storeUrl: 'https://www.dyson.in',
    approxCost: 29900,
    claimedBy: null,
    claimedByPhone: null,
    status: 'AVAILABLE',
    notes: 'Powerful suction with de-tangling technology',
  },
];

// GET: Fetch wedding gift wishlist items for the target user or current session
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('userId');

    // Find demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@shagun.app' },
    });

    // Priority for which user's registry to display:
    // 1. Explicit query param ?userId=... (used by public shareable links)
    // 2. Currently logged-in user
    // 3. Fallback to demo user if not logged in
    let targetUserId: string | null = null;
    let targetUserName: string = 'Wedding Host';

    if (queryUserId) {
      const user = await prisma.user.findUnique({
        where: { id: queryUserId },
        select: { id: true, name: true },
      });
      if (user) {
        targetUserId = user.id;
        targetUserName = user.name;
      }
    } else if (authUser?.id) {
      targetUserId = authUser.id;
      targetUserName = authUser.name || 'Your Wedding';
    } else if (demoUser) {
      targetUserId = demoUser.id;
      targetUserName = demoUser.name;
    }

    // Query items for this specific user
    let items = await prisma.weddingGiftItem.findMany({
      where: targetUserId ? { userId: targetUserId } : {},
      orderBy: { createdAt: 'asc' },
    });

    // If target is demo user and has 0 items, seed demo items
    if (items.length === 0 && targetUserId === demoUser?.id) {
      for (const item of INITIAL_REGISTRY_ITEMS) {
        await prisma.weddingGiftItem.create({
          data: { ...item, userId: targetUserId },
        });
      }
      items = await prisma.weddingGiftItem.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: 'asc' },
      });
    }

    const totalCount = items.length;
    const claimedCount = items.filter((i) => i.status === 'CLAIMED').length;
    const availableCount = totalCount - claimedCount;
    const totalValue = items.reduce((sum, i) => sum + (i.approxCost || 0), 0);
    const claimedValue = items
      .filter((i) => i.status === 'CLAIMED')
      .reduce((sum, i) => sum + (i.approxCost || 0), 0);

    return NextResponse.json({
      success: true,
      userId: targetUserId,
      hostName: targetUserName,
      data: items,
      summary: {
        totalCount,
        claimedCount,
        availableCount,
        totalValue,
        claimedValue,
      },
    });
  } catch (error: any) {
    console.error('Error fetching wedding gift items:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch gift items' },
      { status: 500 }
    );
  }
}

// POST: Add a new gift to the registry wishlist
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@shagun.app' },
    });

    // Determine owner of new gift item
    const targetUserId = authUser?.id || demoUser?.id || null;

    const body = await req.json();
    const { action, itemId, title, category, suggestedStore, storeUrl, approxCost, notes, claimedBy, claimedByPhone } = body;

    // Handle CLAIM action from modal
    if (action === 'CLAIM') {
      const { itemId, claimedBy, claimedByPhone, claimedByEmail, claimedMessage } = body;
      if (!itemId || !claimedBy?.trim()) {
        return NextResponse.json(
          { success: false, error: 'Item ID and your name are required' },
          { status: 400 }
        );
      }
      const email = authUser?.email || claimedByEmail?.trim() || null;
      const isVerified = Boolean(authUser?.email);

      const updated = await prisma.weddingGiftItem.update({
        where: { id: itemId },
        data: {
          status: 'CLAIMED',
          claimedBy: authUser?.name || claimedBy.trim(),
          claimedByPhone: claimedByPhone?.trim() || null,
          claimedByEmail: email,
          claimedMessage: claimedMessage?.trim() || null,
          claimedAt: new Date(),
          isVerified: isVerified,
          claimantUserId: authUser?.id || null,
        },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // Handle CREATE action
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Gift item title is required' },
        { status: 400 }
      );
    }

    const newItem = await prisma.weddingGiftItem.create({
      data: {
        userId: targetUserId,
        title: title.trim(),
        category: category?.trim() || 'Home',
        suggestedStore: suggestedStore?.trim() || null,
        storeUrl: storeUrl?.trim() || null,
        approxCost: approxCost ? Number(approxCost) : null,
        claimedBy: claimedBy?.trim() || null,
        claimedByPhone: claimedByPhone?.trim() || null,
        status: claimedBy?.trim() ? 'CLAIMED' : 'AVAILABLE',
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating wedding gift item:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create gift item' },
      { status: 500 }
    );
  }
}

// PATCH: Claim, Unclaim, or Edit an item in the live registry
export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const body = await req.json();
    const { id, action, claimedBy, claimedByPhone, claimedByEmail, claimedMessage } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    let updated;
    if (action === 'claim') {
      if (!claimedBy || !claimedBy.trim()) {
        return NextResponse.json(
          { success: false, error: 'Your name is required to claim this gift' },
          { status: 400 }
        );
      }
      const email = authUser?.email || claimedByEmail?.trim() || null;
      const isVerified = Boolean(authUser?.email);

      updated = await prisma.weddingGiftItem.update({
        where: { id },
        data: {
          status: 'CLAIMED',
          claimedBy: authUser?.name || claimedBy.trim(),
          claimedByPhone: claimedByPhone?.trim() || null,
          claimedByEmail: email,
          claimedMessage: claimedMessage?.trim() || null,
          claimedAt: new Date(),
          isVerified: isVerified,
          claimantUserId: authUser?.id || null,
        },
      });
    } else if (action === 'unclaim') {
      updated = await prisma.weddingGiftItem.update({
        where: { id },
        data: {
          status: 'AVAILABLE',
          claimedBy: null,
          claimedByPhone: null,
          claimedByEmail: null,
          claimedAt: null,
          claimedMessage: null,
          isVerified: false,
          claimantUserId: null,
        },
      });
    } else {
      // General field update (e.g. from Edit modal)
      const { title, category, suggestedStore, storeUrl, approxCost, notes, status, claimedBy, claimedByPhone, claimedByEmail, claimedMessage } = body;
      const updateData: any = {};
      if (title !== undefined) updateData.title = title?.trim();
      if (category !== undefined) updateData.category = category?.trim();
      if (suggestedStore !== undefined) updateData.suggestedStore = suggestedStore?.trim() || null;
      if (storeUrl !== undefined) updateData.storeUrl = storeUrl?.trim() || null;
      if (approxCost !== undefined) updateData.approxCost = approxCost ? Number(approxCost) : null;
      if (notes !== undefined) updateData.notes = notes?.trim() || null;
      if (status !== undefined) updateData.status = status;
      if (claimedBy !== undefined) updateData.claimedBy = claimedBy?.trim() || null;
      if (claimedByPhone !== undefined) updateData.claimedByPhone = claimedByPhone?.trim() || null;
      if (claimedByEmail !== undefined) updateData.claimedByEmail = claimedByEmail?.trim() || null;
      if (claimedMessage !== undefined) updateData.claimedMessage = claimedMessage?.trim() || null;

      updated = await prisma.weddingGiftItem.update({
        where: { id },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating wedding gift item:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update gift item' },
      { status: 500 }
    );
  }
}

// DELETE: Remove an item from the registry
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await prisma.weddingGiftItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting wedding gift item:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete gift item' },
      { status: 500 }
    );
  }
}
