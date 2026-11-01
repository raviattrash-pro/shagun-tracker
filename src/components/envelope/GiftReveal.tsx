'use client';

import React from 'react';
import Image from 'next/image';
import { Gift, Sparkles } from 'lucide-react';

interface GiftRevealProps {
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
}

export const GiftReveal: React.FC<GiftRevealProps> = ({
  description,
  imageUrl,
  isActive,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1 text-amber-900 dark:text-amber-300 font-semibold text-xs mb-3 border border-amber-400/30 backdrop-blur-md">
        <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
        <span>Gift Item (उपहार)</span>
      </div>

      {imageUrl ? (
        <div className="relative h-44 w-44 overflow-hidden rounded-2xl border-4 border-amber-300 shadow-xl bg-white mb-3">
          <Image
            src={imageUrl}
            alt={description || 'Gift item'}
            fill
            className="object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-300 shadow-inner mb-3">
          <Gift className="h-16 w-16 text-amber-900 drop-shadow" />
        </div>
      )}

      <h4 className="text-xl font-bold text-foreground capitalize tracking-wide">
        {description || 'Special Wedding Gift'}
      </h4>
    </div>
  );
};
