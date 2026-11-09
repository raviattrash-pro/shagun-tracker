'use client';

import React from 'react';
import { CashBreakdown } from '@/types';
import { formatCurrency } from '@/utils/format';
import { CurrencyNote } from './CurrencyNote';
import { CoinDisplay } from './CoinDisplay';

interface CashBreakdownDisplayProps {
  breakdown: CashBreakdown;
  className?: string;
}

export const CashBreakdownDisplay: React.FC<CashBreakdownDisplayProps> = ({
  breakdown,
  className,
}) => {
  const entries = Object.entries(breakdown)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => Number(b[0]) - Number(a[0]));

  const grandTotal = entries.reduce(
    (sum, [denom, count]) => sum + Number(denom) * count,
    0
  );

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground italic">No cash breakdown recorded</p>;
  }

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="bg-amber-500/10 px-4 py-2 border-b">
          <h4 className="font-semibold text-sm flex items-center justify-between">
            <span>Denomination Breakdown (नोट विवरण)</span>
            <span className="text-emerald-600 font-bold">{formatCurrency(grandTotal)}</span>
          </h4>
        </div>
        <div className="divide-y">
          {entries.map(([denomStr, count]) => {
            const val = Number(denomStr);
            const subtotal = val * count;
            const isCoin = val <= 10;

            return (
              <div key={denomStr} className="flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  {isCoin ? (
                    <CoinDisplay denomination={val as 1 | 2 | 5 | 10} size="sm" />
                  ) : (
                    <CurrencyNote denomination={val} size="sm" />
                  )}
                  <span className="font-medium text-sm">
                    {formatCurrency(val)} × {count}
                  </span>
                </div>
                <span className="font-semibold text-sm text-muted-foreground">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
