/**
 * Currency utilities — breakdown, validation, display helpers
 */

import type { CashBreakdown, CashDisplayData, DenominationInfo } from '@/types';
import { CURRENCY_NOTES, CURRENCY_COINS } from '@/utils/constants';

/** All denominations sorted descending (notes first, then coins). */
const ALL_SORTED: number[] = [
  2000, 500, 200, 100, 50, 20, 10, // notes
  5, 2, 1, // coins
];

// ──────────────────────────────────────────
// calculateBreakdown
// ──────────────────────────────────────────

/**
 * Greedy algorithm: break `amount` into the fewest denominations.
 *
 * @example
 * calculateBreakdown(5700)
 * // → { "2000": 2, "500": 3, "200": 1 }
 */
export function calculateBreakdown(amount: number): CashBreakdown {
  if (!isValidAmount(amount)) return {};

  let remaining = Math.round(amount); // avoid floating-point issues
  const breakdown: CashBreakdown = {};

  for (const denom of ALL_SORTED) {
    if (remaining <= 0) break;
    const count = Math.floor(remaining / denom);
    if (count > 0) {
      breakdown[String(denom)] = count;
      remaining -= count * denom;
    }
  }

  return breakdown;
}

// ──────────────────────────────────────────
// getCashDisplayData
// ──────────────────────────────────────────

/** Look up `DenominationInfo` by value. Notes are preferred over coins at ₹10. */
function findDenominationInfo(value: number, isCoin?: boolean): DenominationInfo | undefined {
  if (isCoin || value < 10) {
    return CURRENCY_COINS.find((c) => c.value === value);
  }
  return (
    CURRENCY_NOTES.find((n) => n.value === value) ??
    CURRENCY_COINS.find((c) => c.value === value)
  );
}

/**
 * Convert a breakdown into display-ready data with denomination images.
 *
 * If `customBreakdown` is omitted, the standard greedy breakdown is used.
 */
export function getCashDisplayData(
  amount: number,
  customBreakdown?: CashBreakdown,
): CashDisplayData {
  const breakdown = customBreakdown ?? calculateBreakdown(amount);

  const denominations = Object.entries(breakdown)
    .map(([denomStr, count]) => {
      const value = parseInt(denomStr, 10);
      // Treat ₹5, ₹2, ₹1 as coins; ₹10 note-first
      const isCoin = value < 10;
      const info = findDenominationInfo(value, isCoin);
      if (!info || count <= 0) return null;
      return { info, count, subtotal: value * count };
    })
    .filter(Boolean) as CashDisplayData['denominations'];

  // Sort descending by denomination value
  denominations.sort((a, b) => b.info.value - a.info.value);

  return {
    totalAmount: sumBreakdown(breakdown),
    denominations,
  };
}

// ──────────────────────────────────────────
// Validation & Helpers
// ──────────────────────────────────────────

/** Returns `true` when `amount` is a finite positive number. */
export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && Number.isFinite(amount) && amount > 0;
}

/** Sum all denominations × counts. */
export function sumBreakdown(breakdown: CashBreakdown): number {
  return Object.entries(breakdown).reduce((sum, [denom, count]) => {
    return sum + parseInt(denom, 10) * count;
  }, 0);
}
