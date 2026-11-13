'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftData } from '@/types';
import { AmplifyWoodEnvelope } from './AmplifyWoodEnvelope';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  IndianRupee,
  Gift,
  CheckCircle2,
  Lock,
  Eye,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import confetti from 'canvas-confetti';

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
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [selectedGift, setSelectedGift] = useState<GiftData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (gift: GiftData) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
    onOpenGift?.(gift);
    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C41E3A', '#F59E0B'],
      });
    } catch (e) {}
  };

  if (!gifts || gifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-3xl bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm p-8">
        <p className="text-lg font-serif font-bold text-stone-800 dark:text-white">
          {isHi ? 'कोई लिफाफा नहीं मिला' : 'No shagun envelopes yet'}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          {isHi
            ? 'बोलकर या फॉर्म से नया शगुन लिफाफा जोड़ें।'
            : 'Add your first gift with voice or manual entry'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          className ||
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-4 pt-4 pb-8'
        }
      >
        {gifts.map((gift) => {
          const hasCash =
            (gift.giftType === 'CASH' || gift.giftType === 'BOTH') &&
            gift.cashAmount;
          const hasItem =
            (gift.giftType === 'GIFT_ITEM' || gift.giftType === 'BOTH') &&
            gift.giftDescription;

          return (
            <motion.div
              key={gift.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              {/* ─────────────────────────────────────────────────── */}
              {/* UNIFORM ENVELOPE CARD - IDENTICAL PROPORTIONS       */}
              {/* ─────────────────────────────────────────────────── */}
              <div
                onClick={() => handleOpenModal(gift)}
                className="w-full max-w-[340px] h-[450px] rounded-[30px] overflow-hidden flex flex-col justify-between relative cursor-pointer shadow-[0_12px_36px_rgba(139,29,44,0.18)] hover:shadow-[0_20px_45px_rgba(139,29,44,0.28)] border-2 border-amber-400/40 transition-all select-none group"
                style={{
                  background:
                    gift.envelopeStyle === 'CLASSIC_RED'
                      ? 'linear-gradient(155deg, #7A1422 0%, #9B1C2E 50%, #540D17 100%)'
                      : 'linear-gradient(155deg, #2B1810 0%, #4A2B1D 50%, #1A0D07 100%)',
                }}
              >
                {/* Gold Inset Borders */}
                <div className="absolute inset-2.5 rounded-[22px] border border-amber-300/35 pointer-events-none" />
                <div className="absolute inset-3 rounded-[20px] border border-amber-400/20 pointer-events-none" />

                {/* Top Flap Area */}
                <div className="relative pt-6 px-5 pb-3 text-center border-b border-amber-400/20 bg-black/20">
                  <div className="flex items-center justify-between text-[10px] tracking-widest text-amber-200/80 font-serif uppercase mb-2">
                    <span>॥ शुभ विवाह ॥</span>
                    <span>#SK-{gift.id.slice(-4).toUpperCase()}</span>
                  </div>

                  {/* Wax Seal / Auspicious Coin */}
                  <div className="mx-auto w-13 h-13 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-0.5 shadow-md flex items-center justify-center my-1 group-hover:rotate-6 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#8B1D2C] border-2 border-amber-300 flex flex-col items-center justify-center text-amber-200">
                      <span className="text-[10px] font-serif font-black leading-none">₹१</span>
                      <span className="text-[7.5px] font-sans font-bold uppercase tracking-tight text-amber-300">
                        SHAGUN
                      </span>
                    </div>
                  </div>

                  {/* Giver Name (strictly clamped to 1 line) */}
                  <h3
                    className="text-base font-serif font-black text-amber-100 tracking-wide truncate mt-2 px-2"
                    title={gift.guest?.name || 'सम्मानित अतिथि'}
                  >
                    {gift.guest?.name || (isHi ? 'सम्मानित अतिथि' : 'Honored Guest')}
                  </h3>

                  {/* Relation Pill */}
                  <div className="inline-block mt-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                      {gift.guest?.relation || (isHi ? 'रिश्तेदार' : 'Relative')}
                    </span>
                  </div>
                </div>

                {/* Center Value Block - Identical Fixed Height */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 text-center">
                  {hasCash ? (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider">
                        {isHi ? 'शुभ नकद शगुन' : 'Auspicious Cash'}
                      </div>
                      <div className="text-3xl font-serif font-black text-white drop-shadow-[0_2px_8px_rgba(245,169,98,0.35)] flex items-center justify-center gap-1">
                        <IndianRupee className="w-6 h-6 text-amber-400" />
                        <span>{(gift.cashAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] text-amber-200/90 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-400/25">
                        <span>+ ₹1 सिक्का नियम सक्रिय</span>
                      </div>
                    </div>
                  ) : hasItem ? (
                    <div className="space-y-1 max-w-[220px]">
                      <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-1">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider">
                        {isHi ? 'उपहार भेंट' : 'Gift Presentation'}
                      </div>
                      <div className="text-sm font-bold text-white line-clamp-2">
                        {gift.giftDescription}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-xs text-amber-200/70">
                        {isHi ? 'आशीर्वाद लिफाफा' : 'Blessing Envelope'}
                      </div>
                      <div className="text-sm font-bold text-white">
                        {isHi ? 'शुभकामनाएं' : 'Best Wishes'}
                      </div>
                    </div>
                  )}

                  {/* Event Name */}
                  <div className="mt-3 text-[11px] text-stone-300/80 font-medium truncate max-w-[220px]">
                    💍 {gift.event?.title || 'शुभ विवाह उत्सव'}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="p-3.5 bg-black/30 border-t border-amber-400/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-amber-200">
                    {gift.isOpened ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-semibold text-emerald-300">
                          {isHi ? 'स्वीकृत' : 'Opened'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span className="text-[11px] font-semibold text-amber-200">
                          {isHi ? 'मुहरबंद' : 'Sealed'}
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(gift);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 shadow-md shadow-amber-500/20 flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isHi ? 'खोलें' : 'Inspect'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Inspection Modal Overlay                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && selectedGift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl my-auto"
            >
              <AmplifyWoodEnvelope
                gift={selectedGift}
                guest={selectedGift.guest}
                initialOpen={false}
                onClose={() => setIsModalOpen(false)}
                onOpen={() => {
                  const updated = { ...selectedGift, isOpened: true };
                  setSelectedGift(updated);
                  onOpenGift?.(updated);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
