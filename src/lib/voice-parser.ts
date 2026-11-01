import type { VoiceParseResult, GiftType } from '@/types';

// ──────────────────────────────────────────
// Hindi & English voice transcript parser
// ──────────────────────────────────────────

const HINDI_NUMBERS: Record<string, number> = {
  'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पाँच': 5, 'पांच': 5,
  'छह': 6, 'छे': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
  'ग्यारह': 11, 'बारह': 12, 'तेरह': 13, 'चौदह': 14, 'पंद्रह': 15,
  'सोलह': 16, 'सत्रह': 17, 'अट्ठारह': 18, 'अठारह': 18, 'उन्नीस': 19, 'बीस': 20,
  'इक्कीस': 21, 'बाईस': 22, 'तेईस': 23, 'चौबीस': 24, 'पच्चीस': 25,
  'तीस': 30, 'पैंतीस': 35, 'चालीस': 40, 'پچاس': 50, 'पचास': 50,
  'साठ': 60, 'सत्तर': 70, 'अस्सी': 80, 'नब्बे': 90,
  'सौ': 100, 'हज़ार': 1000, 'हजार': 1000, 'लाख': 100000, 'करोड़': 10000000,
};

const ENGLISH_NUMBERS: Record<string, number> = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
  'twenty-one': 21, 'twenty-five': 25, 'thirty': 30, 'forty': 40, 'fifty': 50,
  'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
  'hundred': 100, 'thousand': 1000, 'lakh': 100000, 'crore': 10000000,
};

/**
 * Universal bilingual amount extractor:
 * Searches for currency symbols (₹, Rs), digits (5000, 5,000),
 * or Hindi/English spoken number words.
 */
function extractAmount(text: string): number | undefined {
  if (!text) return undefined;

  // 1. Direct regex for numbers like ₹5000, 5000, 5,000, ₹ 5000
  const digitsRegex = /(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/gi;
  let maxFound = 0;
  let match: RegExpExecArray | null;

  while ((match = digitsRegex.exec(text)) !== null) {
    if (match[1]) {
      const num = parseInt(match[1].replace(/,/g, ''), 10);
      if (!isNaN(num) && num > maxFound) {
        maxFound = num;
      }
    }
  }

  if (maxFound > 0) return maxFound;

  // 2. Hindi word-based numbers
  const words = text.toLowerCase().split(/[\s,]+/);
  let hindiTotal = 0;
  let hindiCurrent = 0;

  for (const word of words) {
    const cleanWord = word.replace(/[^\u0900-\u097F]/g, '');
    const val = HINDI_NUMBERS[cleanWord];
    if (val !== undefined) {
      if (val === 1000 || val === 100000 || val === 10000000) {
        hindiCurrent = hindiCurrent === 0 ? val : hindiCurrent * val;
        hindiTotal += hindiCurrent;
        hindiCurrent = 0;
      } else if (val === 100) {
        hindiCurrent = hindiCurrent === 0 ? 100 : hindiCurrent * 100;
      } else {
        hindiCurrent += val;
      }
    }
  }
  hindiTotal += hindiCurrent;
  if (hindiTotal > 0) return hindiTotal;

  // 3. English word-based numbers
  let engTotal = 0;
  let engCurrent = 0;

  for (const word of words) {
    const cleanWord = word.replace(/[^a-z-]/g, '');
    const val = ENGLISH_NUMBERS[cleanWord];
    if (val !== undefined) {
      if (val === 1000 || val === 100000 || val === 10000000) {
        engCurrent = engCurrent === 0 ? val : engCurrent * val;
        engTotal += engCurrent;
        engCurrent = 0;
      } else if (val === 100) {
        engCurrent = engCurrent === 0 ? 100 : engCurrent * 100;
      } else {
        engCurrent += val;
      }
    }
  }
  engTotal += engCurrent;
  if (engTotal > 0) return engTotal;

  return undefined;
}

/**
 * Extract guest name from transcript.
 * Removes generic pronouns ("he", "she", "they", "उसने", "उन्होंने")
 */
function extractGuestName(text: string): string {
  let clean = text.trim();

  // Pattern: "X gave...", "from X", "X ne..."
  const gaveMatch = clean.match(/(.+?)\s+(?:gave|brought|has given|gifted)/i);
  if (gaveMatch?.[1]) {
    const candidate = gaveMatch[1].trim();
    if (!/^(he|she|they|someone|who)$/i.test(candidate)) {
      return candidate;
    }
  }

  const fromMatch = clean.match(/(?:from|by)\s+([A-Za-z\s]+?)(?:\s+(?:gave|for|cash|₹|\d|$))/i);
  if (fromMatch?.[1]) {
    return fromMatch[1].trim();
  }

  // Hindi pattern: "रमेश चाचाजी ने...", "शर्मा जी से..."
  const hindiMatch = clean.match(/([\u0900-\u097F\s]+?)\s+(?:ने|से|का|की|के)\s+/);
  if (hindiMatch?.[1]) {
    const candidate = hindiMatch[1].trim();
    if (!/^(उसने|उन्होंने|किसी ने)$/.test(candidate)) {
      return candidate;
    }
  }

  return '';
}

/**
 * Determine gift type (CASH, GIFT_ITEM, or BOTH)
 */
function extractGiftType(text: string, hasCash: boolean): { type: GiftType; description?: string } {
  const lower = text.toLowerCase();
  const giftKeywords = [
    'gold necklace', 'gold chain', 'gold ring', 'gold coin', 'silver set', 'silver coin', 'silk saree',
    'gold', 'silver', 'saree', 'chain', 'watch', 'ring', 'necklace', 'set', 'utensil', 'item', 'box',
    'सोने की चेन', 'सोने का हार', 'सोने का सिक्का', 'चाँदी का सिक्का', 'चाँदी का सेट', 'सिल्क साड़ी',
    'सोना', 'चाँदी', 'चांदी', 'साड़ी', 'साडी', 'हार', 'चेन', 'घड़ी', 'उपहार', 'तोहफा', 'गिफ्ट'
  ];

  let detectedItem: string | undefined = undefined;
  for (const kw of giftKeywords) {
    if (lower.includes(kw)) {
      detectedItem = kw;
      break;
    }
  }

  if (hasCash && detectedItem) {
    return { type: 'BOTH', description: detectedItem };
  }
  if (detectedItem) {
    return { type: 'GIFT_ITEM', description: detectedItem };
  }
  return { type: 'CASH' };
}

/**
 * Universal voice parser exported as both parseVoiceInput and parseVoiceTranscript
 */
export function parseVoiceInput(
  transcript: string,
  language: 'hi-IN' | 'en-IN' = 'hi-IN'
): VoiceParseResult {
  const amount = extractAmount(transcript);
  const guestName = extractGuestName(transcript);
  const { type: giftType, description } = extractGiftType(transcript, amount !== undefined);

  let confidence = 0.5;
  if (amount) confidence += 0.3;
  if (guestName) confidence += 0.2;

  return {
    guestName,
    giftType,
    cashAmount: amount,
    giftDescription: description,
    confidence: Math.min(confidence, 1.0),
    rawTranscript: transcript,
    language,
  };
}

export const parseVoiceTranscript = parseVoiceInput;
