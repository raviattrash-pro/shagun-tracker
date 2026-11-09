'use client';

import React, { useState } from 'react';
import { EnvelopeFlap } from './EnvelopeFlap';
import { EnvelopeBody } from './EnvelopeBody';
import { CashReveal } from './CashReveal';
import { GiftReveal } from './GiftReveal';
import { AmplifyWoodEnvelope } from './AmplifyWoodEnvelope';
import { GiftData, GuestData, EnvelopeStyle } from '@/types';
import { ENVELOPE_STYLES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle2, IndianRupee, Sparkles, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnvelopeProps {
  gift: GiftData;
  guest?: GuestData;
  initialOpen?: boolean;
  onOpen?: () => void;
  className?: string;
  forceStyle?: 'amplify' | 'classic';
}

export const Envelope: React.FC<EnvelopeProps> = ({
  gift: initialGift,
  guest: propGuest,
  initialOpen = false,
  onOpen,
  className,
  forceStyle,
}) => {
  const [gift, setGift] = useState<GiftData>(initialGift);
  const [activeSkin, setActiveSkin] = useState<'amplify' | 'classic'>(
    forceStyle || (initialGift.envelopeStyle === 'CLASSIC_RED' ? 'classic' : 'amplify')
  );
  const [isOpen, setIsOpen] = useState(initialOpen || initialGift.isOpened);
  const guest = propGuest || gift.guest;
  const styleConfig = ENVELOPE_STYLES[gift.envelopeStyle] || ENVELOPE_STYLES.AMPLIFY_WOOD;

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      onOpen?.();

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#D97706', '#C41E3A', '#D4AF37'],
        });
      } catch (e) {}
    }
  };

  const handleReseal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleQuickAddAmount = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const input = prompt('Enter shagun cash amount (₹):', '5000');
    if (!input) return;
    const amount = Number(input.replace(/[^0-9]/g, ''));
    if (!amount || isNaN(amount)) return;

    try {
      const breakdown = { '500': Math.floor(amount / 500) };
      const res = await fetch(`/api/gifts/${gift.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cashAmount: amount,
          cashBreakdown: breakdown,
          giftType: 'CASH',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGift(data.data);
      }
    } catch (err) {
      alert('Failed to update amount');
    }
  };

  const guestName = guest?.name || 'Beloved Guest';
  const initials = guestName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const hasCash = (gift.giftType === 'CASH' || gift.giftType === 'BOTH') && gift.cashAmount;
  const hasItem = (gift.giftType === 'GIFT_ITEM' || gift.giftType === 'BOTH') && gift.giftDescription;
  const isEmpty = !hasCash && !hasItem;

  return (
    <div className="relative">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. AMPLIFY TEAK WOOD & GOLDEN LIGHT (Matching Reference SS)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSkin === 'amplify' ? (
        <AmplifyWoodEnvelope
          gift={gift}
          guest={guest}
          initialOpen={isOpen}
          onOpen={onOpen}
          className={className}
          headline="AMPLIFY"
        />
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* 2. CLASSIC VELVET & GOLD WAX SEAL ENVELOPE                   */
        /* ───────────────────────────────────────────────────────────── */
        <div
          onClick={handleToggle}
          className={cn(
            'group relative w-full max-w-[380px] mx-auto cursor-pointer select-none transition-all duration-300',
            !isOpen && 'hover:-translate-y-2 hover:shadow-2xl active:scale-[0.99]',
            className
          )}
        >
          {/* Guest Name Pill on Sealed Envelope */}
          {!isOpen && (
            <div className="absolute top-3 left-3 z-40 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md p-1 pr-3.5 shadow-lg border border-amber-300/40 text-white animate-in fade-in duration-300">
              <Avatar className="h-7 w-7 rounded-full border border-amber-300">
                {guest?.photoUrl && <AvatarImage src={guest.photoUrl} alt={guestName} />}
                <AvatarFallback className="bg-amber-600 text-white font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="leading-none">
                <p className="text-[11px] font-bold text-amber-100 truncate max-w-[130px]">{guestName}</p>
              </div>
            </div>
          )}

          {/* Sealed Flap with Dried Floral Sprig & Gold Wax Seal */}
          <EnvelopeFlap
            isOpen={isOpen}
            styleConfig={styleConfig}
            onClick={handleToggle}
          />

          {/* Envelope Body with revealed content */}
          <EnvelopeBody
            styleConfig={styleConfig}
            guestName={guestName}
            relation={guest?.relation}
            isOpen={isOpen}
          >
            <div className="rounded-3xl bg-[#FAF8F5] dark:bg-[#111726] text-slate-800 dark:text-white p-6 shadow-2xl border-2 border-amber-400/80 space-y-4">
              {/* Letterhead Header */}
              <div className="text-center pb-2 border-b border-amber-200 dark:border-amber-900/40">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300 font-serif font-black text-sm mb-1">
                  ॐ
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400">
                  Auspicious Shagun Blessing
                </p>
                <h3 className="text-lg font-serif font-black text-slate-900 dark:text-amber-100 truncate">
                  {guestName}
                </h3>
                {guest?.relation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    ({guest.relation.replace('_', ' ')})
                  </p>
                )}
              </div>

              {/* If Cash Shagun */}
              {hasCash && (
                <CashReveal
                  amount={Number(gift.cashAmount)}
                  breakdown={gift.cashBreakdown}
                  isActive={isOpen}
                />
              )}

              {/* If Gift Item */}
              {hasItem && (
                <GiftReveal
                  description={gift.giftDescription}
                  imageUrl={gift.giftImageUrl}
                  isActive={isOpen}
                />
              )}

              {/* If empty */}
              {isEmpty && (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    No amount or gift item was recorded for this envelope yet.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleQuickAddAmount}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold rounded-xl shadow-md"
                  >
                    <IndianRupee className="h-3.5 w-3.5" />
                    <span>Enter Amount (e.g. ₹5,000)</span>
                  </Button>
                </div>
              )}

              {/* Action buttons inside revealed card */}
              <div className="mt-4 flex items-center justify-between border-t border-amber-200 dark:border-amber-900/40 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReseal}
                  className="text-xs flex items-center gap-1.5 border-amber-300 dark:border-amber-800 rounded-xl"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reseal (दोबारा सील करें)</span>
                </Button>

                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Recorded in ledger
                </span>
              </div>
            </div>
          </EnvelopeBody>
        </div>
      )}

      {/* Quick Style Switcher Pill */}
      <div className="flex justify-center mt-2.5">
        <div className="inline-flex rounded-full bg-black/40 backdrop-blur-md p-1 border border-white/10 text-[10px] font-semibold text-slate-300">
          <button
            type="button"
            onClick={() => setActiveSkin('amplify')}
            className={cn(
              'px-2.5 py-0.5 rounded-full transition flex items-center gap-1 font-bold',
              activeSkin === 'amplify'
                ? 'bg-amber-500 text-amber-950 shadow-xs'
                : 'hover:text-white'
            )}
          >
            <span>🌲</span>
            <span>Amplify Wood (Ref SS)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSkin('classic')}
            className={cn(
              'px-2.5 py-0.5 rounded-full transition flex items-center gap-1 font-bold',
              activeSkin === 'classic'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'hover:text-white'
            )}
          >
            <span>💌</span>
            <span>Classic Wax Seal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
