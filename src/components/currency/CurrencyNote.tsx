'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

interface CurrencyNoteProps {
  denomination: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

const NOTE_DIMENSIONS = {
  sm: { width: 140, height: 70 },
  md: { width: 220, height: 110 },
  lg: { width: 320, height: 160 },
};

const NOTE_IMAGES: Record<number, string> = {
  2000: '/assets/currency/inr-2000.png',
  500: '/assets/currency/inr-500.png',
  200: '/assets/currency/inr-200.png',
  100: '/assets/currency/inr-100.png',
  50: '/assets/currency/inr-50.png',
  20: '/assets/currency/inr-20.png',
  10: '/assets/currency/inr-10.png',
};

export const CurrencyNote: React.FC<CurrencyNoteProps> = ({
  denomination,
  count,
  size = 'md',
  rotation = 0,
  className,
  onClick,
}) => {
  const dims = NOTE_DIMENSIONS[size];
  const imgSrc = NOTE_IMAGES[denomination] || '/assets/currency/inr-500.png';

  return (
    <div
      onClick={onClick}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={cn(
        'relative inline-block select-none rounded shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group',
        className
      )}
    >
      <div
        className="relative overflow-hidden rounded border border-amber-900/20 bg-amber-50"
        style={{ width: dims.width, height: dims.height }}
      >
        <Image
          src={imgSrc}
          alt={`₹${denomination} note`}
          fill
          className="object-cover object-center filter saturate-105 contrast-105"
          sizes={`${dims.width}px`}
          priority={denomination === 500}
        />
        {/* Subtle security watermark shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
      </div>

      {count !== undefined && count > 1 && (
        <span className="absolute -top-2 -right-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white shadow-md border border-white">
          ×{count}
        </span>
      )}
      
      <div className="absolute bottom-1 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white tracking-wider backdrop-blur-sm">
        {formatCurrency(denomination)}
      </div>
    </div>
  );
};
