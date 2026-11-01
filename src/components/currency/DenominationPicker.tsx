'use client';

import React from 'react';
import { CashBreakdown } from '@/types';
import { CURRENCY_NOTES, CURRENCY_COINS } from '@/utils/constants';
import { CurrencyNote } from './CurrencyNote';
import { CoinDisplay } from './CoinDisplay';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface DenominationPickerProps {
  value: CashBreakdown;
  onChange: (value: CashBreakdown, total: number) => void;
}

export const DenominationPicker: React.FC<DenominationPickerProps> = ({
  value,
  onChange,
}) => {
  const updateCount = (denom: number, delta: number) => {
    const key = String(denom);
    const current = value[key] || 0;
    const next = Math.max(0, current + delta);
    const updated = { ...value, [key]: next };
    if (next === 0) {
      delete updated[key];
    }
    const total = Object.entries(updated).reduce(
      (sum, [d, c]) => sum + Number(d) * c,
      0
    );
    onChange(updated, total);
  };

  const handleReset = () => {
    onChange({}, 0);
  };

  const total = Object.entries(value).reduce(
    (sum, [d, c]) => sum + Number(d) * (c || 0),
    0
  );

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="font-semibold text-base">Select Denominations (नोट चुनें)</h3>
          <p className="text-xs text-muted-foreground">Tap + or - to set note and coin counts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Total Amount</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(total)}
            </span>
          </div>
          {total > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleReset}
              title="Reset All"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Currency Notes */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Banknotes (करेंसी नोट)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CURRENCY_NOTES.map((n) => {
            const count = value[String(n.value)] || 0;
            return (
              <div
                key={n.value}
                className="flex flex-col items-center p-2 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                <CurrencyNote denomination={n.value} size="sm" />
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 rounded-full"
                    disabled={count === 0}
                    onClick={() => updateCount(n.value, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="min-w-6 text-center text-sm font-bold">
                    {count}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="default"
                    className="h-7 w-7 rounded-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => updateCount(n.value, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coins */}
      <div className="pt-2 border-t">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Coins (सिक्के)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CURRENCY_COINS.map((c) => {
            const count = value[String(c.value)] || 0;
            return (
              <div
                key={c.value}
                className="flex flex-col items-center p-2 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                <CoinDisplay denomination={c.value as 1 | 2 | 5 | 10} size="sm" />
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 rounded-full"
                    disabled={count === 0}
                    onClick={() => updateCount(c.value, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="min-w-6 text-center text-sm font-bold">
                    {count}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="default"
                    className="h-7 w-7 rounded-full bg-amber-600 hover:bg-amber-700"
                    onClick={() => updateCount(c.value, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
