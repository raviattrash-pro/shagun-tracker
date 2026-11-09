// ──────────────────────────────────────────
// Shagun Tracker — TypeScript Type Definitions
// ──────────────────────────────────────────

// Enums (mirroring Prisma)
export type EventType =
  | 'WEDDING'
  | 'ENGAGEMENT'
  | 'RECEPTION'
  | 'HALDI'
  | 'MEHENDI'
  | 'SANGEET'
  | 'BIRTHDAY'
  | 'ANNIVERSARY'
  | 'OTHER';

export type GiftType = 'CASH' | 'GIFT_ITEM' | 'BOTH';

export type GuestSide = 'GROOM' | 'BRIDE' | 'MUTUAL' | 'OTHER';

export type EnvelopeStyle =
  | 'AMPLIFY_WOOD'
  | 'CLASSIC_RED'
  | 'ROYAL_GOLD'
  | 'FLORAL_PINK'
  | 'MODERN_MINIMAL'
  | 'EMERALD_GREEN'
  | 'PURPLE_SILK';

export type ReciprocityStatus = 'PENDING' | 'COMPLETED' | 'SKIPPED' | 'OVERDUE';

// Currency denomination types
export type Denomination = 2000 | 500 | 200 | 100 | 50 | 20 | 10;
export type CoinDenomination = 10 | 5 | 2 | 1;

export interface CashBreakdown {
  [denomination: string]: number;
}

// ──────────────────────────────────────────
// Core Data Interfaces
// ──────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface EventData {
  id: string;
  userId: string;
  title: string;
  eventType: EventType;
  eventDate: string;
  venue?: string | null;
  city?: string | null;
  notes?: string | null;
  coverImage?: string | null;
  createdAt: string;
  updatedAt: string;
  gifts?: GiftData[];
  _count?: { gifts: number };
  totalCash?: number;
}

export interface GuestData {
  id: string;
  userId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  relation?: string | null;
  side: GuestSide;
  photoUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  gifts?: GiftData[];
  _count?: { gifts: number };
  totalGiven?: number;
}

export interface GiftData {
  id: string;
  eventId: string;
  guestId: string;
  giftType: GiftType;
  cashAmount?: number | null;
  currency: string;
  cashBreakdown?: CashBreakdown | null;
  giftDescription?: string | null;
  giftImageUrl?: string | null;
  envelopeStyle: EnvelopeStyle;
  isOpened: boolean;
  voiceTranscript?: string | null;
  receivedAt: string;
  createdAt: string;
  updatedAt: string;
  event?: EventData;
  guest?: GuestData;
  reciprocity?: ReciprocityData | null;
}

export interface ReciprocityData {
  id: string;
  originalGiftId: string;
  guestId: string;
  suggestedAmount?: number | null;
  actualAmount?: number | null;
  status: ReciprocityStatus;
  dueByDate?: string | null;
  returnEventName?: string | null;
  notes?: string | null;
  createdAt: string;
  originalGift?: GiftData;
  guest?: GuestData;
}

// ──────────────────────────────────────────
// Form / Input Types
// ──────────────────────────────────────────

export interface CreateEventInput {
  title: string;
  eventType: EventType;
  eventDate: string;
  venue?: string;
  city?: string;
  notes?: string;
}

export interface CreateGuestInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  relation?: string;
  side?: GuestSide;
  notes?: string;
}

export interface CreateGiftInput {
  eventId: string;
  guestId: string;
  giftType: GiftType;
  cashAmount?: number;
  cashBreakdown?: CashBreakdown;
  giftDescription?: string;
  envelopeStyle?: EnvelopeStyle;
  voiceTranscript?: string;
}

// ──────────────────────────────────────────
// Voice Command Types
// ──────────────────────────────────────────

export interface VoiceParseResult {
  guestName: string;
  giftType: GiftType;
  cashAmount?: number;
  giftDescription?: string;
  confidence: number;
  rawTranscript: string;
  language: 'hi-IN' | 'en-IN';
}

export interface VoiceCommandState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  language: 'hi-IN' | 'en-IN';
}

// ──────────────────────────────────────────
// Envelope Animation Types
// ──────────────────────────────────────────

export type EnvelopeAnimationPhase = 'sealed' | 'opening' | 'revealing' | 'settled';

export interface EnvelopeState {
  phase: EnvelopeAnimationPhase;
  isHovered: boolean;
}

export interface EnvelopeStyleConfig {
  name: string;
  bodyColor: string;
  flapColor: string;
  sealColor: string;
  textColor: string;
  borderColor: string;
  pattern?: string;
  gradient?: string;
}

// ──────────────────────────────────────────
// Dashboard / Stats Types
// ──────────────────────────────────────────

export interface DashboardStats {
  totalEvents: number;
  totalGuests: number;
  totalGifts: number;
  totalCashReceived: number;
  totalGiftItems: number;
  pendingReciprocity: number;
  recentGifts: GiftData[];
  topContributors: { guest: GuestData; total: number }[];
  eventBreakdown: { event: EventData; total: number }[];
}

// ──────────────────────────────────────────
// API Response Types
// ──────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ──────────────────────────────────────────
// Export Types
// ──────────────────────────────────────────

export type ExportFormat = 'pdf' | 'excel';

export interface ExportOptions {
  format: ExportFormat;
  eventId?: string;
  includePhotos: boolean;
  includeReciprocity: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

// ──────────────────────────────────────────
// Currency Display Types
// ──────────────────────────────────────────

export interface DenominationInfo {
  value: number;
  image: string;
  color: string;
  label: string;
  labelHindi: string;
  type: 'note' | 'coin';
}

export interface CashDisplayData {
  totalAmount: number;
  denominations: {
    info: DenominationInfo;
    count: number;
    subtotal: number;
  }[];
}


// ──────────────────────────────────────────
// Wedding Gift Registry Types
// ──────────────────────────────────────────

export interface WeddingGiftRegistryItem {
  id: string;
  userId?: string | null;
  title: string;
  category: string;
  suggestedStore?: string | null;
  storeUrl?: string | null;
  approxCost?: number | null;
  claimedBy?: string | null;
  claimedByPhone?: string | null;
  status: 'AVAILABLE' | 'CLAIMED';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingGiftRegistrySummary {
  totalCount: number;
  claimedCount: number;
  availableCount: number;
  totalValue: number;
  claimedValue: number;
}
