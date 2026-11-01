'use client';

import React from 'react';
import Link from 'next/link';
import { GiftData } from '@/types';
import { formatCurrency, formatDate, stringToColor } from '@/utils/format';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift as GiftIcon, Sparkles, ChevronRight, Mail } from 'lucide-react';

interface GiftCardProps {
  gift: GiftData;
}

export const GiftCard: React.FC<GiftCardProps> = ({ gift }) => {
  const guestName = gift.guest?.name || 'Guest';
  const initials = guestName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isCash = gift.giftType === 'CASH' || gift.giftType === 'BOTH';
  const isItem = gift.giftType === 'GIFT_ITEM' || gift.giftType === 'BOTH';

  return (
    <Link href={`/gifts/${gift.id}`}>
      <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-amber-400">
              {gift.guest?.photoUrl && (
                <AvatarImage src={gift.guest.photoUrl} alt={guestName} />
              )}
              <AvatarFallback
                style={{ backgroundColor: stringToColor(guestName) }}
                className="text-white font-bold"
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {guestName}
                </h4>
                {gift.guest?.relation && (
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {gift.guest.relation.replace('_', ' ')}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {gift.event?.title || 'Wedding Event'} • {formatDate(gift.receivedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              {isCash && gift.cashAmount && (
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(Number(gift.cashAmount))}
                </div>
              )}
              {isItem && gift.giftDescription && (
                <div className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center justify-end gap-1">
                  <GiftIcon className="h-3 w-3" />
                  <span>{gift.giftDescription}</span>
                </div>
              )}
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground capitalize">
                  {gift.envelopeStyle.toLowerCase().replace('_', ' ')}
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
