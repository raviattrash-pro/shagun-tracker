import type { DenominationInfo, EnvelopeStyleConfig, EnvelopeStyle, EventType } from '@/types';

// ──────────────────────────────────────────
// Currency Denominations (Notes + Coins)
// ──────────────────────────────────────────

export const CURRENCY_NOTES: DenominationInfo[] = [
  {
    value: 2000,
    image: '/assets/currency/inr-2000.png',
    color: '#E91E63',
    label: '₹2,000',
    labelHindi: 'दो हज़ार',
    type: 'note',
  },
  {
    value: 500,
    image: '/assets/currency/inr-500.png',
    color: '#795548',
    label: '₹500',
    labelHindi: 'पाँच सौ',
    type: 'note',
  },
  {
    value: 200,
    image: '/assets/currency/inr-200.png',
    color: '#FF9800',
    label: '₹200',
    labelHindi: 'दो सौ',
    type: 'note',
  },
  {
    value: 100,
    image: '/assets/currency/inr-100.png',
    color: '#9C27B0',
    label: '₹100',
    labelHindi: 'एक सौ',
    type: 'note',
  },
  {
    value: 50,
    image: '/assets/currency/inr-50.png',
    color: '#4CAF50',
    label: '₹50',
    labelHindi: 'पचास',
    type: 'note',
  },
  {
    value: 20,
    image: '/assets/currency/inr-20.png',
    color: '#F44336',
    label: '₹20',
    labelHindi: 'बीस',
    type: 'note',
  },
  {
    value: 10,
    image: '/assets/currency/inr-10.png',
    color: '#FF5722',
    label: '₹10',
    labelHindi: 'दस',
    type: 'note',
  },
];

export const CURRENCY_COINS: DenominationInfo[] = [
  {
    value: 20,
    image: '/assets/coins/coin-20.png',
    color: '#D4AF37',
    label: '₹20',
    labelHindi: 'बीस',
    type: 'coin',
  },
  {
    value: 10,
    image: '/assets/coins/coin-10.png',
    color: '#B8860B',
    label: '₹10',
    labelHindi: 'दस',
    type: 'coin',
  },
  {
    value: 5,
    image: '/assets/coins/coin-5.png',
    color: '#C0C0C0',
    label: '₹5',
    labelHindi: 'पाँच',
    type: 'coin',
  },
  {
    value: 2,
    image: '/assets/coins/coin-2.png',
    color: '#CD7F32',
    label: '₹2',
    labelHindi: 'दो',
    type: 'coin',
  },
  {
    value: 1,
    image: '/assets/coins/coin-1.png',
    color: '#C0C0C0',
    label: '₹1',
    labelHindi: 'एक',
    type: 'coin',
  },
];

export const ALL_DENOMINATIONS = [...CURRENCY_NOTES, ...CURRENCY_COINS];

// ──────────────────────────────────────────
// Envelope Styles
// ──────────────────────────────────────────

export const ENVELOPE_STYLES: Record<EnvelopeStyle, EnvelopeStyleConfig> = {
  CLASSIC_RED: {
    name: 'Burgundy Velvet',
    bodyColor: '#75182A',
    flapColor: '#631423',
    sealColor: '#D4AF37',
    textColor: '#FFF8DC',
    borderColor: '#8B2134',
    gradient: 'linear-gradient(180deg, #7E1A2E 0%, #631423 100%)',
  },
  ROYAL_GOLD: {
    name: 'Royal Gold',
    bodyColor: '#B8860B',
    flapColor: '#9A6F07',
    sealColor: '#543603',
    textColor: '#FFF8DC',
    borderColor: '#D4AF37',
    gradient: 'linear-gradient(180deg, #C59B27 0%, #9A6F07 100%)',
  },
  FLORAL_PINK: {
    name: 'Floral Pink',
    bodyColor: '#FFB6C1',
    flapColor: '#FF69B4',
    sealColor: '#C41E3A',
    textColor: '#800020',
    borderColor: '#FF1493',
    gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
  },
  MODERN_MINIMAL: {
    name: 'Modern Minimal',
    bodyColor: '#F5F5F5',
    flapColor: '#E0E0E0',
    sealColor: '#333333',
    textColor: '#333333',
    borderColor: '#BDBDBD',
    gradient: 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)',
  },
  EMERALD_GREEN: {
    name: 'Emerald Green',
    bodyColor: '#046307',
    flapColor: '#034B05',
    sealColor: '#D4AF37',
    textColor: '#FFF8DC',
    borderColor: '#D4AF37',
    gradient: 'linear-gradient(135deg, #046307 0%, #013A03 100%)',
  },
  PURPLE_SILK: {
    name: 'Purple Silk',
    bodyColor: '#6A0DAD',
    flapColor: '#520A8A',
    sealColor: '#D4AF37',
    textColor: '#FFF8DC',
    borderColor: '#D4AF37',
    gradient: 'linear-gradient(135deg, #6A0DAD 0%, #3C0663 100%)',
  },
};

// ──────────────────────────────────────────
// Event Types
// ──────────────────────────────────────────

export const EVENT_TYPE_LABELS: Record<EventType, { label: string; labelHindi: string; emoji: string }> = {
  WEDDING: { label: 'Wedding', labelHindi: 'शादी', emoji: '💍' },
  ENGAGEMENT: { label: 'Engagement', labelHindi: 'सगाई', emoji: '💎' },
  RECEPTION: { label: 'Reception', labelHindi: 'रिसेप्शन', emoji: '🥂' },
  HALDI: { label: 'Haldi', labelHindi: 'हल्दी', emoji: '🌼' },
  MEHENDI: { label: 'Mehendi', labelHindi: 'मेहंदी', emoji: '🌿' },
  SANGEET: { label: 'Sangeet', labelHindi: 'संगीत', emoji: '🎵' },
  BIRTHDAY: { label: 'Birthday', labelHindi: 'जन्मदिन', emoji: '🎂' },
  ANNIVERSARY: { label: 'Anniversary', labelHindi: 'सालगिरह', emoji: '🎉' },
  OTHER: { label: 'Other', labelHindi: 'अन्य', emoji: '🎊' },
};

// ──────────────────────────────────────────
// Relation Types
// ──────────────────────────────────────────

export const RELATION_TYPES = [
  { value: 'father', label: 'Father', labelHindi: 'पिताजी' },
  { value: 'mother', label: 'Mother', labelHindi: 'माताजी' },
  { value: 'brother', label: 'Brother', labelHindi: 'भाई' },
  { value: 'sister', label: 'Sister', labelHindi: 'बहन' },
  { value: 'paternal_uncle', label: 'Paternal Uncle (Chacha/Tau)', labelHindi: 'चाचा/ताऊ' },
  { value: 'paternal_aunt', label: 'Paternal Aunt (Bua)', labelHindi: 'बुआ' },
  { value: 'maternal_uncle', label: 'Maternal Uncle (Mama)', labelHindi: 'मामा' },
  { value: 'maternal_aunt', label: 'Maternal Aunt (Mausi)', labelHindi: 'मौसी' },
  { value: 'father_in_law', label: 'Father-in-law (Sasur)', labelHindi: 'ससुर' },
  { value: 'mother_in_law', label: 'Mother-in-law (Saas)', labelHindi: 'सास' },
  { value: 'cousin', label: 'Cousin', labelHindi: 'चचेरे/ममेरे भाई-बहन' },
  { value: 'grandfather', label: 'Grandfather (Dada/Nana)', labelHindi: 'दादा/नाना' },
  { value: 'grandmother', label: 'Grandmother (Dadi/Nani)', labelHindi: 'दादी/नानी' },
  { value: 'nephew', label: 'Nephew', labelHindi: 'भतीजा/भांजा' },
  { value: 'niece', label: 'Niece', labelHindi: 'भतीजी/भांजी' },
  { value: 'friend', label: 'Friend', labelHindi: 'दोस्त' },
  { value: 'colleague', label: 'Colleague', labelHindi: 'सहकर्मी' },
  { value: 'neighbor', label: 'Neighbor', labelHindi: 'पड़ोसी' },
  { value: 'family_friend', label: 'Family Friend', labelHindi: 'पारिवारिक मित्र' },
  { value: 'other', label: 'Other', labelHindi: 'अन्य' },
] as const;

// ──────────────────────────────────────────
// App Constants
// ──────────────────────────────────────────

export const APP_NAME = 'Shagun Tracker';
export const APP_DESCRIPTION = 'Digital Wedding Gift & Cash Registry';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ITEMS_PER_PAGE = 20;
