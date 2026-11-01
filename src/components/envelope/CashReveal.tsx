'use client';

import React, { useEffect, useState } from 'react';
import { CashBreakdown } from '@/types';
import { formatCurrency } from '@/utils/format';
import { CashStack } from '@/components/currency/CashStack';
import { Sparkles } from 'lucide-react';

interface CashRevealProps {
  amount: number;
  breakdown?: CashBreakdown | null;
  isActive: boolean;
}

export const CashReveal: React.FC<CashRevealProps> = ({
  amount,
  breakdown,
  isActive,
}) => {
  const [displayedAmount, setDisplayedAmount] = useState(0);

  // Animated counter
  useEffect(() => {
    if (!isActive) {
      setDisplayedAmount(0);
      return;
    }

    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = amount / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= amount) {
        setDisplayedAmount(amount);
        clearInterval(timer);
      } else {
        setDisplayedAmount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isActive, amount]);

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-emerald-800 dark:text-emerald-300 font-semibold text-xs mb-3 border border-emerald-400/30 backdrop-blur-md">
        <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
        <span>Cash Shagun (नकद राशि)</span>
      </div>

      <div className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight drop-shadow-sm mb-4">
        {formatCurrency(displayedAmount)}
      </div>

      {/* Realistic Banknote / Coin Visual Stack */}
      <div className="w-full max-w-sm py-2">
        <CashStack amount={amount} breakdown={breakdown} size="md" />
      </div>
    </div>
  );
};
