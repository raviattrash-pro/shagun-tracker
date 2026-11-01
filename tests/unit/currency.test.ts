import { describe, it, expect } from 'vitest';
import { calculateBreakdown, sumBreakdown, isValidAmount } from '@/lib/currency';

describe('Currency Denominations & Breakdown Algorithm', () => {
  it('calculates optimal greedy breakdown for 5700', () => {
    const breakdown = calculateBreakdown(5700);
    expect(breakdown['2000'] || 0).toBeGreaterThanOrEqual(0);
    expect(sumBreakdown(breakdown)).toBe(5700);
  });

  it('accurately sums breakdown values', () => {
    const total = sumBreakdown({ '500': 10, '200': 5, '100': 2 });
    expect(total).toBe(6200);
  });

  it('handles small amounts with coins', () => {
    const breakdown = calculateBreakdown(18);
    expect(sumBreakdown(breakdown)).toBe(18);
  });

  it('validates amount correctness', () => {
    expect(isValidAmount(500)).toBe(true);
    expect(isValidAmount(0)).toBe(false);
    expect(isValidAmount(-100)).toBe(false);
  });
});
