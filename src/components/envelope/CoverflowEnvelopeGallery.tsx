'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { GiftData } from '@/types';
import { Button } from '@/components/ui/button';
import { AmplifyWoodEnvelope } from './AmplifyWoodEnvelope';
import { soundEngine } from '@/utils/audio';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  IndianRupee,
  Gift,
  CheckCircle2,
  Lock,
  Eye,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface CoverflowEnvelopeGalleryProps {
  gifts: GiftData[];
  onGiftUpdated?: (gift: GiftData) => void;
  className?: string;
}

export const CoverflowEnvelopeGallery: React.FC<CoverflowEnvelopeGalleryProps> = ({
  gifts,
  onGiftUpdated,
  className,
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedGift, setSelectedGift] = useState<GiftData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-clamp active index when gifts change
  useEffect(() => {
    if (activeIndex >= gifts.length && gifts.length > 0) {
      setActiveIndex(gifts.length - 1);
    }
  }, [gifts.length, activeIndex]);

  // Keyboard navigation (Arrow Left & Arrow Right)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(gifts.length - 1, prev + 1));
      }
    },
    [gifts.length, isModalOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 40;
    const velocityThreshold = 200;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      // Swiped Left -> Next
      if (activeIndex < gifts.length - 1) {
        setActiveIndex((prev) => prev + 1);
      }
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      // Swiped Right -> Prev
      if (activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    }
  };

  const handleOpenActiveGift = (gift: GiftData) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C41E3A', '#F59E0B', '#F5A962'],
      });
    } catch (e) {}
  };

  if (!gifts || gifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm p-8">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-3 text-2xl">
          ✉️
        </div>
        <p className="text-lg font-serif font-bold text-stone-800 dark:text-white">
          {isHi ? 'कोई लिफाफा नहीं मिला' : 'No Envelopes Found'}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-sm">
          {isHi
            ? 'पहला शगुन लिफाफा जोड़ने के लिए "+ नया शगुन" पर क्लिक करें।'
            : 'Add your first wedding shagun envelope using the "+ New Shagun" button.'}
        </p>
      </div>
    );
  }

  const activeGift = gifts[activeIndex] || gifts[0];

  return (
    <div className={cn('relative w-full overflow-hidden select-none py-6', className)}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Top Controls & Counter                                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between max-w-xl mx-auto px-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>3D Coverflow</span>
          </span>
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            {activeIndex + 1} / {gifts.length}
          </span>
        </div>

        {/* Prev / Next Chevrons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeIndex === 0}
            className="h-8 w-8 p-0 rounded-full border-stone-300 dark:border-stone-700 disabled:opacity-30 hover:bg-amber-50 dark:hover:bg-stone-800"
            aria-label="Previous envelope"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveIndex((prev) => Math.min(gifts.length - 1, prev + 1))}
            disabled={activeIndex === gifts.length - 1}
            className="h-8 w-8 p-0 rounded-full border-stone-300 dark:border-stone-700 disabled:opacity-30 hover:bg-amber-50 dark:hover:bg-stone-800"
            aria-label="Next envelope"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3D Coverflow Viewport (Motion.dev Odd Lights style)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative h-[490px] sm:h-[530px] w-full flex items-center justify-center"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient "Odd Lights" Candlelight Aura behind Active Envelope */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[380px] h-[460px] sm:h-[500px] rounded-[40px] bg-gradient-to-tr from-amber-500/25 via-rose-500/20 to-yellow-400/25 blur-3xl pointer-events-none transition-opacity duration-700 -z-10" />

        {/* Drag Gesture Area */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={handleDragEnd}
        >
          {gifts.map((gift, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);

            // Render at most 3 cards away on each side for optimal 60fps
            if (absOffset > 3) return null;

            const isCenter = offset === 0;

            // Coverflow positioning formulas matching motion.dev odd-lights
            const xOffset = isCenter ? 0 : offset > 0 ? offset * 95 + 60 : offset * 95 - 60;
            const zOffset = isCenter ? 0 : -absOffset * 110;
            const rotateY = isCenter ? 0 : offset > 0 ? -38 : 38;
            const scale = isCenter ? 1 : Math.max(0.72, 1 - absOffset * 0.12);
            const zIndex = 40 - absOffset;
            const opacity = Math.max(0.4, 1 - absOffset * 0.22);

            return (
              <motion.div
                key={gift.id}
                onClick={() => {
                  if (isCenter) {
                    handleOpenActiveGift(gift);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                animate={{
                  x: `calc(-50% + ${xOffset}px)`,
                  y: '-50%',
                  z: zOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 30,
                  mass: 0.8,
                }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* ─────────────────────────────────────────────────── */}
                {/* UNIFORM ENVELOPE CARD: STRICT WIDTH & HEIGHT       */}
                {/* ─────────────────────────────────────────────────── */}
                <div
                  className={cn(
                    'w-[280px] sm:w-[320px] md:w-[330px] h-[430px] sm:h-[460px] rounded-[30px] overflow-hidden flex flex-col justify-between transition-all duration-300 relative',
                    isCenter
                      ? 'shadow-[0_20px_50px_rgba(139,29,44,0.35)] ring-2 ring-amber-400/80'
                      : 'shadow-lg hover:brightness-105'
                  )}
                  style={{
                    background:
                      gift.envelopeStyle === 'CLASSIC_RED'
                        ? 'linear-gradient(155deg, #7A1422 0%, #9B1C2E 50%, #540D17 100%)'
                        : 'linear-gradient(155deg, #2B1810 0%, #4A2B1D 50%, #1A0D07 100%)',
                  }}
                >
                  {/* Gold Foil Border Inset */}
                  <div className="absolute inset-2.5 rounded-[22px] border border-amber-300/35 pointer-events-none" />
                  <div className="absolute inset-3 rounded-[20px] border border-amber-400/20 pointer-events-none" />

                  {/* Top Envelope Flap Texture */}
                  <div className="relative pt-6 px-5 pb-3 text-center border-b border-amber-400/20 bg-black/15">
                    {/* Auspicious Sacred Header */}
                    <div className="flex items-center justify-between text-[10px] tracking-widest text-amber-200/80 font-serif uppercase mb-2">
                      <span>॥ श्री गणेशाय नमः ॥</span>
                      <span>#SK-{gift.id.slice(-4).toUpperCase()}</span>
                    </div>

                    {/* Wax Seal / +₹1 Auspicious Coin Emblem */}
                    <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-0.5 shadow-lg flex items-center justify-center my-1 group-hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-full bg-[#8B1D2C] border-2 border-amber-300 flex flex-col items-center justify-center text-amber-200">
                        <span className="text-[10px] font-serif font-black leading-none">₹१</span>
                        <span className="text-[8px] font-sans font-bold uppercase tracking-tight text-amber-300">
                          SHAGUN
                        </span>
                      </div>
                    </div>

                    {/* Giver Name (Clamped single-line) */}
                    <h3
                      className="text-base sm:text-lg font-serif font-black text-amber-100 tracking-wide truncate mt-2"
                      title={gift.guest?.name || 'सम्मानित अतिथि'}
                    >
                      {gift.guest?.name || (isHi ? 'सम्मानित अतिथि' : 'Honored Guest')}
                    </h3>

                    {/* Relation Pill */}
                    <div className="inline-block mt-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                        {gift.guest?.relation || (isHi ? 'पारिवारिक स्नेही' : 'Family & Friend')}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Gift Value & Auspicious Blessing */}
                  <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 text-center">
                    {gift.giftType === 'CASH' || gift.giftType === 'BOTH' ? (
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider">
                          {isHi ? 'शुभ नकद शगुन' : 'Auspicious Cash'}
                        </div>
                        <div className="text-3xl sm:text-4xl font-serif font-black text-white drop-shadow-[0_2px_10px_rgba(245,169,98,0.4)] flex items-center justify-center gap-1">
                          <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                          <span>{(gift.cashAmount || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="inline-flex items-center gap-1 text-[10px] text-amber-200/90 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-400/25">
                          <span>+ ₹1 सिक्का नियम सक्रिय</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 max-w-[220px]">
                        <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-1">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider">
                          {isHi ? 'उपहार भेंट' : 'Gift Presentation'}
                        </div>
                        <div className="text-sm sm:text-base font-bold text-white line-clamp-2">
                          {gift.giftDescription || (isHi ? 'विशेष वैवाहिक उपहार' : 'Wedding Gift')}
                        </div>
                      </div>
                    )}

                    {/* Event Pill */}
                    <div className="mt-3 text-[11px] text-stone-300/80 font-medium truncate max-w-[200px]">
                      💍 {gift.event?.title || 'शुभ विवाह उत्सव'}
                    </div>
                  </div>

                  {/* Bottom: Action Bar with Unseal Status */}
                  <div className="p-3.5 bg-black/30 border-t border-amber-400/20 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-amber-200">
                      {gift.isOpened ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-[11px] font-semibold text-emerald-300">
                            {isHi ? 'दर्ज / खुला' : 'Opened'}
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
                        handleOpenActiveGift(gift);
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer',
                        isCenter
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 shadow-amber-500/20'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      )}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isHi ? 'खोलें' : 'Inspect'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Bottom Thumbnail Navigation Dots                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {gifts.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={cn(
              'h-2 rounded-full transition-all duration-300 cursor-pointer',
              idx === activeIndex
                ? 'w-6 bg-gradient-to-r from-[#C0392B] to-[#F39C12]'
                : 'w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
            )}
            aria-label={`Go to envelope ${idx + 1}`}
          />
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Full Amplify Wood / Inspection Modal Overlay                   */}
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
                  onGiftUpdated?.(updated);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
