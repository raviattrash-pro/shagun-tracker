'use client';

import React from 'react';
import { GiftData } from '@/types';
import { GiftCard } from './GiftCard';

interface GiftTimelineProps {
  gifts: GiftData[];
}

export const GiftTimeline: React.FC<GiftTimelineProps> = ({ gifts }) => {
  if (gifts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No gifts recorded in timeline yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-amber-300 dark:border-amber-700 space-y-6">
      {gifts.map((gift) => (
        <div key={gift.id} className="relative">
          {/* Timeline node */}
          <span className="absolute -left-[31px] top-4 h-4 w-4 rounded-full border-2 border-white bg-amber-500 shadow" />
          <GiftCard gift={gift} />
        </div>
      ))}
    </div>
  );
};
