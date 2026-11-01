'use client';

import React from 'react';
import { CurrencyNote } from './CurrencyNote';
import { CoinDisplay } from './CoinDisplay';
import { CashBreakdown } from '@/types';
import { formatCurrency } from '@/utils/format';

interface CashStackProps {
  amount?: number;
  breakdown?: CashBreakdown | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CashStack: React.FC<CashStackProps> = ({
  amount = 0,
  breakdown,
  size = 'md',
  className,
}) => {
  let parsedBreakdown = breakdown;
  if (typeof breakdown === 'string') {
    try {
      parsedBreakdown = JSON.parse(breakdown);
    } catch {
      parsedBreakdown = null;
    }
  }

  const resolvedBreakdown =
    parsedBreakdown && typeof parsedBreakdown === 'object' && Object.keys(parsedBreakdown).length > 0
      ? parsedBreakdown
      : amount > 0
      ? { '500': Math.floor(amount / 500) }
      : {};

  const validDenominations = new Set([2000, 500, 200, 100, 50, 20, 10, 5, 2, 1]);

  const denoms = Object.entries(resolvedBreakdown)
    .filter(([valStr, count]) => {
      const val = Number(valStr);
      return validDenominations.has(val) && Number(count) > 0;
    })
    .sort((a, b) => Number(b[0]) - Number(a[0]));

  if (denoms.length === 0 && amount > 0) {
    return (
      <div className={className}>
        <CurrencyNote denomination={500} size={size} />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-4 py-2">
        {denoms.map(([valStr, count], idx) => {
          const val = Number(valStr);
          const isCoin = val === 1 || val === 2 || val === 5;

          if (isCoin) {
            return (
              <div key={valStr} className="flex flex-col items-center gap-1">
                <CoinDisplay denomination={val as 1 | 2 | 5} count={count} size={size} />
                <span className="text-xs font-medium text-muted-foreground">
                  {formatCurrency(val * count)}
                </span>
              </div>
            );
          }

          return (
            <div key={valStr} className="flex flex-col items-center gap-1">
              <CurrencyNote
                denomination={val}
                count={count}
                size={size}
                rotation={(idx % 2 === 0 ? -1 : 1) * (idx * 2)}
              />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {count} × {formatCurrency(val)} = {formatCurrency(val * count)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
