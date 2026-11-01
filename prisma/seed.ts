import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Shagun Tracker database...');

  // Clean old records
  await prisma.reciprocity.deleteMany();
  await prisma.gift.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Sharma Family (शर्मा परिवार)',
      email: 'demo@shagun.app',
      passwordHash,
    },
  });

  console.log(`Created user: ${user.name}`);

  // Create Events
  const wedding = await prisma.event.create({
    data: {
      userId: user.id,
      title: 'Aarav & Diya Wedding Ceremony (शुभ विवाह)',
      eventType: 'WEDDING',
      eventDate: new Date('2026-12-10'),
      venue: 'The Leela Palace',
      city: 'Jaipur, Rajasthan',
      notes: 'Grand wedding celebration with close family and relatives',
    },
  });

  const reception = await prisma.event.create({
    data: {
      userId: user.id,
      title: 'Wedding Reception (आशीर्वाद समारोह)',
      eventType: 'RECEPTION',
      eventDate: new Date('2026-12-12'),
      venue: 'ITC Maurya',
      city: 'New Delhi',
    },
  });

  // Create Guests
  const guestsData = [
    {
      name: 'Ramesh Kumar Sharma (रमेश चाचाजी)',
      relation: 'paternal_uncle',
      side: 'GROOM' as const,
      phone: '+91 98765 11111',
      city: 'Jaipur',
      notes: 'Chachaji from Jaipur',
    },
    {
      name: 'Priya Aunty (प्रिया मौसी)',
      relation: 'maternal_aunt',
      side: 'GROOM' as const,
      phone: '+91 98765 22222',
      city: 'Delhi',
      notes: 'Mausiji',
    },
    {
      name: 'Mukesh Gupta (मामाजी)',
      relation: 'maternal_uncle',
      side: 'GROOM' as const,
      phone: '+91 98765 33333',
      city: 'Mumbai',
    },
    {
      name: 'Sunita Verma (बुआजी)',
      relation: 'paternal_aunt',
      side: 'GROOM' as const,
      phone: '+91 98765 44444',
      city: 'Lucknow',
    },
    {
      name: 'Vikram & Ananya Malhotra',
      relation: 'family_friend',
      side: 'MUTUAL' as const,
      phone: '+91 98765 55555',
      city: 'Chandigarh',
    },
  ];

  const createdGuests = [];
  for (const g of guestsData) {
    const guest = await prisma.guest.create({
      data: {
        userId: user.id,
        ...g,
      },
    });
    createdGuests.push(guest);
  }

  // Create Gifts with Envelopes & Reciprocity
  const giftsData = [
    {
      eventId: wedding.id,
      guestId: createdGuests[0].id,
      giftType: 'CASH' as const,
      cashAmount: 11000,
      cashBreakdown: { '500': 20, '200': 5 },
      envelopeStyle: 'CLASSIC_RED' as const,
      voiceTranscript: 'रमेश चाचाजी ने ग्यारह हज़ार रुपये दिए',
    },
    {
      eventId: wedding.id,
      guestId: createdGuests[1].id,
      giftType: 'CASH' as const,
      cashAmount: 5100,
      cashBreakdown: { '500': 10, '100': 1 },
      envelopeStyle: 'ROYAL_GOLD' as const,
      voiceTranscript: 'प्रिया मौसी ने पाँच हज़ार एक सौ रुपये दिए',
    },
    {
      eventId: wedding.id,
      guestId: createdGuests[2].id,
      giftType: 'BOTH' as const,
      cashAmount: 21000,
      cashBreakdown: { '500': 40, '200': 5 },
      giftDescription: 'Pure Gold Coin & Silk Shawl',
      envelopeStyle: 'EMERALD_GREEN' as const,
    },
    {
      eventId: reception.id,
      guestId: createdGuests[3].id,
      giftType: 'CASH' as const,
      cashAmount: 5001,
      cashBreakdown: { '500': 10, '1': 1 },
      envelopeStyle: 'FLORAL_PINK' as const,
    },
    {
      eventId: reception.id,
      guestId: createdGuests[4].id,
      giftType: 'GIFT_ITEM' as const,
      giftDescription: 'Silver Dinner Set (चाँदी का डिनर सेट)',
      envelopeStyle: 'PURPLE_SILK' as const,
    },
  ];

  for (const giftItem of giftsData) {
    await prisma.gift.create({
      data: {
        ...giftItem,
        cashBreakdown: giftItem.cashBreakdown ? JSON.stringify(giftItem.cashBreakdown) : undefined,
        isOpened: false,
        reciprocity: giftItem.cashAmount
          ? {
              create: {
                guestId: giftItem.guestId,
                suggestedAmount: giftItem.cashAmount,
                status: 'PENDING',
              },
            }
          : undefined,
      },
    });
  }

  console.log('Seeding finished successfully! ✨');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
