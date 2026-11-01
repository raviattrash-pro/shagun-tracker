'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';

interface CoinDisplayProps {
  denomination: 1 | 2 | 5 | 10 | 20;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const COIN_PIXELS = {
  sm: 36,
  md: 52,
  lg: 72,
};

export const CoinDisplay: React.FC<CoinDisplayProps> = ({
  denomination,
  count = 1,
  size = 'md',
  className,
  onClick,
}) => {
  const px = COIN_PIXELS[size];
  const imgSrc = `/assets/coins/coin-${denomination}.png`;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center select-none cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 group',
        className
      )}
    >
      <div
        className="relative overflow-hidden rounded-full shadow-md border border-amber-900/20 bg-amber-50"
        style={{ width: px, height: px }}
      >
        <Image
          src={imgSrc}
          alt={`₹${denomination} Coin`}
          width={px}
          height={px}
          className="object-cover object-center rounded-full"
        />
        {/* Subtle metallic shine */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
      </div>

      {count > 1 && (
        <span className="absolute -top-1.5 -right-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-md border border-white">
          ×{count}
        </span>
      )}
    </div>
  );
};
