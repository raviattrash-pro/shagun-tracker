import { describe, it, expect } from 'vitest';
import { createEventSchema, createGuestSchema, createGiftSchema } from '@/lib/validators';

describe('Validation Schemas', () => {
  it('validates correct event input', () => {
    const res = createEventSchema.safeParse({
      title: 'Rohan Wedding',
      eventType: 'WEDDING',
      eventDate: '2026-11-20',
    });
    expect(res.success).toBe(true);
  });

  it('rejects event with missing required title', () => {
    const res = createEventSchema.safeParse({
      eventType: 'WEDDING',
      eventDate: '2026-11-20',
    });
    expect(res.success).toBe(false);
  });

  it('validates guest input', () => {
    const res = createGuestSchema.safeParse({
      name: 'Sunita Sharma',
      relation: 'aunt',
      phone: '+91 98765 43210',
    });
    expect(res.success).toBe(true);
  });

  it('validates gift input', () => {
    const res = createGiftSchema.safeParse({
      eventId: 'evt-1',
      guestId: 'gst-1',
      giftType: 'CASH',
      cashAmount: 5100,
    });
    expect(res.success).toBe(true);
  });
});
