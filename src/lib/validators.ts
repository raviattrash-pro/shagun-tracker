import { z } from 'zod';

// ──────────────────────────────────────────
// Auth Validators
// ──────────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

// ──────────────────────────────────────────
// Event Validators
// ──────────────────────────────────────────

const eventTypeEnum = z.enum([
  'WEDDING', 'ENGAGEMENT', 'RECEPTION', 'HALDI',
  'MEHENDI', 'SANGEET', 'BIRTHDAY', 'ANNIVERSARY', 'OTHER',
]);

export const createEventSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be at most 200 characters')
    .trim(),
  eventType: eventTypeEnum,
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Please provide a valid date',
  }),
  venue: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
});

export const updateEventSchema = createEventSchema.partial();

// ──────────────────────────────────────────
// Guest Validators
// ──────────────────────────────────────────

const guestSideEnum = z.enum(['GROOM', 'BRIDE', 'MUTUAL', 'OTHER']);

export const createGuestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be at most 200 characters')
    .trim(),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  relation: z.string().max(100).optional().nullable(),
  side: guestSideEnum.optional().default('GROOM'),
  photoUrl: z.string().url().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const updateGuestSchema = createGuestSchema.partial();

// ──────────────────────────────────────────
// Gift Validators
// ──────────────────────────────────────────

const giftTypeEnum = z.enum(['CASH', 'GIFT_ITEM', 'BOTH']);
const envelopeStyleEnum = z.enum([
  'CLASSIC_RED', 'ROYAL_GOLD', 'FLORAL_PINK',
  'MODERN_MINIMAL', 'EMERALD_GREEN', 'PURPLE_SILK',
]);

export const createGiftSchema = z.object({
  eventId: z.string().min(1, 'Invalid event ID'),
  guestId: z.string().min(1, 'Invalid guest ID'),
  giftType: giftTypeEnum,
  cashAmount: z.number().min(0).optional().nullable(),
  currency: z.string().max(10).optional().default('INR'),
  cashBreakdown: z.record(z.string(), z.number().int().min(0)).optional().nullable(),
  giftDescription: z.string().max(500).optional().nullable(),
  giftImageUrl: z.string().url().optional().nullable(),
  envelopeStyle: envelopeStyleEnum.optional().default('CLASSIC_RED'),
  voiceTranscript: z.string().max(5000).optional().nullable(),
  receivedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Please provide a valid date',
  }).optional(),
});

export const updateGiftSchema = createGiftSchema.partial();

// ──────────────────────────────────────────
// Reciprocity Validators
// ──────────────────────────────────────────

const reciprocityStatusEnum = z.enum(['PENDING', 'COMPLETED', 'SKIPPED', 'OVERDUE']);

export const updateReciprocitySchema = z.object({
  status: reciprocityStatusEnum,
  actualAmount: z.number().min(0).optional().nullable(),
  dueByDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Please provide a valid date',
  }).optional().nullable(),
  returnEventName: z.string().max(200).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

// ──────────────────────────────────────────
// Voice Validators
// ──────────────────────────────────────────

export const voiceTranscriptSchema = z.object({
  transcript: z.string().min(1, 'Transcript is required').max(5000),
  language: z.enum(['hi-IN', 'en-IN']),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
export type CreateGiftInput = z.infer<typeof createGiftSchema>;
export type UpdateGiftInput = z.infer<typeof updateGiftSchema>;
export type UpdateReciprocityInput = z.infer<typeof updateReciprocitySchema>;
export type VoiceTranscriptInput = z.infer<typeof voiceTranscriptSchema>;
