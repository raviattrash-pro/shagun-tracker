'use client';

import React from 'react';
import Link from 'next/link';
import { GiftData } from '@/types';
import { GiftCard } from '@/components/gift/GiftCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface RecentGiftsProps {
  gifts: GiftData[];
}

export const RecentGifts: React.FC<RecentGiftsProps> = ({ gifts }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Recent Shagun Received (हालिया उपहार)</h3>
        <Link href="/gifts">
          <Button variant="ghost" size="sm" className="text-xs gap-1">
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {gifts.length === 0 ? (
        <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground">
          No gifts recorded yet. Add your first gift above!
        </div>
      ) : (
        <div className="space-y-3">
          {gifts.slice(0, 5).map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      )}
    </div>
  );
};
