'use client';

import React from 'react';
import { GiftData } from '@/types';
import { Envelope } from './Envelope';

interface EnvelopeGridProps {
  gifts: GiftData[];
  onOpenGift?: (gift: GiftData) => void;
  className?: string;
}

export const EnvelopeGrid: React.FC<EnvelopeGridProps> = ({
  gifts,
  onOpenGift,
  className,
}) => {
  if (gifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-2xl bg-muted/20">
        <p className="text-lg font-serif font-semibold text-muted-foreground">
          No shagun envelopes yet
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first gift with voice or manual entry
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        className ||
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 sm:px-4 pt-6 pb-6'
      }
    >
      {gifts.map((gift) => (
        <Envelope
          key={gift.id}
          gift={gift}
          onOpen={() => onOpenGift?.(gift)}
        />
      ))}
    </div>
  );
};
