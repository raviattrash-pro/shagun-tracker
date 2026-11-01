import { describe, it, expect } from 'vitest';
import { parseVoiceInput } from '@/lib/voice-parser';

describe('Voice Parser (Hindi & English Voice Input)', () => {
  it('parses Hindi speech with name and thousands', () => {
    const result = parseVoiceInput('शर्मा जी ने पाँच हज़ार रुपये दिए', 'hi-IN');
    expect(result.cashAmount).toBe(5000);
    expect(result.giftType).toBe('CASH');
    expect(result.guestName.toLowerCase()).toContain('शर्मा');
  });

  it('parses Hindi speech with lakhs', () => {
    const result = parseVoiceInput('रमेश चाचाजी ने दो लाख रुपये दिए', 'hi-IN');
    expect(result.cashAmount).toBe(200000);
  });

  it('parses English speech with name and amount', () => {
    const result = parseVoiceInput('Ramesh uncle gave 10000 rupees', 'en-IN');
    expect(result.cashAmount).toBe(10000);
    expect(result.guestName.toLowerCase()).toContain('ramesh');
  });

  it('detects gift item description when mentioned', () => {
    const result = parseVoiceInput('Priya aunty gave gold chain and saree', 'en-IN');
    expect(result.giftType).toBe('GIFT_ITEM');
    expect(result.giftDescription?.toLowerCase()).toContain('gold chain');
  });
});
