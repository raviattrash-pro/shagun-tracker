'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { GiftData, GuestData } from '@/types';
import { soundEngine } from '@/utils/audio';
import { CashReveal } from './CashReveal';
import { GiftReveal } from './GiftReveal';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle2, IndianRupee, Volume2, VolumeX, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';

interface AmplifyWoodEnvelopeProps {
  gift: GiftData;
  guest?: GuestData;
  initialOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  headline?: string;
}

export const AmplifyWoodEnvelope: React.FC<AmplifyWoodEnvelopeProps> = ({
  gift: initialGift,
  guest: propGuest,
  initialOpen = false,
  onOpen,
  onClose,
  className,
  headline = 'AMPLIFY',
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [gift, setGift] = useState<GiftData>(initialGift);
  const [isOpen, setIsOpen] = useState(initialOpen || initialGift.isOpened);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const guest = propGuest || gift.guest;
  const guestName = guest?.name || (isHi ? 'अतिथि / रिश्तेदार' : 'Honored Guest');

  const hasCash = (gift.giftType === 'CASH' || gift.giftType === 'BOTH') && gift.cashAmount;
  const hasItem = (gift.giftType === 'GIFT_ITEM' || gift.giftType === 'BOTH') && gift.giftDescription;
  const isEmpty = !hasCash && !hasItem;

  // Drag physics motion values
  const dragY = useMotionValue(0);
  const springY = useSpring(dragY, { stiffness: 280, damping: 26 });

  // Dynamic light bloom intensity based on drag distance
  const lightOpacity = useTransform(dragY, [0, 140], [0.55, 1.0]);
  const lightScale = useTransform(dragY, [0, 140], [1.0, 1.4]);
  const sealGlow = useTransform(dragY, [0, 140], [1.0, 1.6]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#F59E0B', '#D97706', '#FEF08A', '#FA837F', '#FFFFFF'],
      });
    } catch (e) {}
  };

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    if (!isMuted) soundEngine.playUnsealChime();
    triggerConfetti();
    onOpen?.();
  };

  const handleReseal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMuted) soundEngine.playReseal();
    setIsOpen(false);
    dragY.set(0);
  };

  const handleQuickAddAmount = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const promptMsg = isHi ? 'शगुन नकद राशि (₹) दर्ज करें:' : 'Enter shagun cash amount (₹):';
    const input = prompt(promptMsg, '5000');
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
      console.error('Failed to update cash amount', err);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-[480px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#3D1D0D]/60 select-none group',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Envelope Wrapper with Wood Framing */}
      <div className="relative bg-[#200F06] overflow-hidden">
        {/* Floating Controls: Sound Toggle and Close Button */}
        <div className="absolute top-3.5 right-3.5 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white hover:text-amber-300 flex items-center justify-center transition hover:scale-105 shadow-md cursor-pointer"
            title={isMuted ? (isHi ? 'आवाज़ चालू करें' : 'Unmute') : (isHi ? 'आवाज़ बंद करें' : 'Mute')}
            aria-label="Toggle envelope sound"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/40 text-white hover:text-rose-400 flex items-center justify-center transition hover:scale-105 shadow-md cursor-pointer"
              title={isHi ? 'बंद करें (Close)' : 'Close'}
              aria-label="Close envelope"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* UPPER ZONE: MISTY GREY/WHITE SKY & ORGANIC FOLIAGE CANOPY     */}
        {/* (Matching exact reference media_1793809559758_f138cbc1.jpg)   */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-b from-[#8C9891] via-[#BAC5BE] to-[#DEE4E0]">
          {/* Subtle Atmospheric Mist Radial Light */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.92)_0%,rgba(220,230,225,0.65)_50%,rgba(170,185,178,0.3)_100%)] pointer-events-none" />

          {/* Lush Tree Foliage along the top & corners (Soft Bokeh framing matching SS) */}
          <div className="absolute -top-12 -left-10 w-72 h-44 pointer-events-none opacity-95 filter blur-[1.5px] transition-transform duration-700 group-hover:scale-105">
            <svg viewBox="0 0 240 160" className="w-full h-full">
              <ellipse cx="40" cy="20" rx="45" ry="32" fill="#1C301E" />
              <ellipse cx="90" cy="25" rx="38" ry="28" fill="#28442B" />
              <ellipse cx="145" cy="20" rx="32" ry="22" fill="#1E3521" />
              <ellipse cx="60" cy="55" rx="40" ry="26" fill="#325435" />
              <ellipse cx="115" cy="50" rx="34" ry="24" fill="#3C643F" />
              <ellipse cx="30" cy="80" rx="28" ry="20" fill="#254228" />
              <ellipse cx="85" cy="85" rx="30" ry="18" fill="#4B774E" opacity="0.8" />
              <circle cx="70" cy="40" r="14" fill="#6B996E" opacity="0.45" />
              <circle cx="120" cy="35" r="12" fill="#88B88C" opacity="0.35" />
            </svg>
          </div>

          <div className="absolute -top-10 -right-8 w-64 h-44 pointer-events-none opacity-95 filter blur-[2px] transition-transform duration-700 group-hover:scale-105">
            <svg viewBox="0 0 220 160" className="w-full h-full">
              <ellipse cx="180" cy="18" rx="44" ry="30" fill="#1A2E1C" />
              <ellipse cx="130" cy="22" rx="36" ry="26" fill="#254128" />
              <ellipse cx="80" cy="18" rx="30" ry="20" fill="#1D3420" />
              <ellipse cx="160" cy="52" rx="38" ry="24" fill="#335636" />
              <ellipse cx="110" cy="50" rx="32" ry="22" fill="#3E6843" />
              <ellipse cx="185" cy="78" rx="26" ry="18" fill="#243F27" />
              <ellipse cx="140" cy="80" rx="26" ry="16" fill="#4C7850" opacity="0.75" />
              <circle cx="145" cy="35" r="14" fill="#78A57B" opacity="0.4" />
            </svg>
          </div>

          {/* Vignette depth gradient */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

          {/* ───────────────────────────────────────────────────────── */}
          {/* CENTER DEBOSSED TEXT: "AMPLIFY" (Exact typography in SS) */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full px-4">
            <h2
              className="text-xl sm:text-2xl font-black tracking-[0.35em] uppercase font-serif"
              style={{
                color: 'rgba(50, 62, 56, 0.85)',
                textShadow:
                  '0 1.5px 1px rgba(255, 255, 255, 0.95), 0 -1.5px 1px rgba(15, 25, 20, 0.45)',
              }}
            >
              {headline}
            </h2>
            <p
              className="text-[11px] font-bold tracking-[0.2em] uppercase mt-1 text-slate-700/80 font-sans"
              style={{ textShadow: '0 1px 1px rgba(255,255,255,0.85)' }}
            >
              <span>{guestName}</span>
              {gift.cashAmount && (
                <span className="tabular-nums font-mono font-semibold ml-1.5">
                  • ₹{Number(gift.cashAmount).toLocaleString('en-IN')}
                </span>
              )}
            </p>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* VOLUMETRIC RADIANT LIGHT BEAM (Behind the curved crest)   */}
          {/* ───────────────────────────────────────────────────────── */}
          <motion.div
            style={{
              opacity: lightOpacity,
              scale: lightScale,
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-88 h-28 pointer-events-none z-10 flex items-end justify-center"
          >
            {/* Soft Ambient Radiance Bloom */}
            <div className="w-80 h-20 rounded-full bg-[radial-gradient(ellipse_at_bottom,rgba(255,248,220,1)_0%,rgba(251,191,36,0.85)_35%,rgba(245,158,11,0.35)_60%,transparent_80%)] blur-xl" />
            {/* Sharp Core Hotspot */}
            <div className="absolute bottom-0 w-36 h-8 rounded-full bg-white/95 blur-md" />
          </motion.div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* LOWER ZONE: LUXURY POLISHED TEAK/WALNUT WOOD BARRIER          */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative min-h-[260px] sm:min-h-[280px] bg-[#2E1609]">
          {/* Behind the Flap: The Revealed Inner Shagun Blessing Card */}
          <div className="p-4 sm:p-5 text-slate-800 dark:text-white">
            <div className="rounded-3xl bg-[#FAF8F5] dark:bg-[#111726] p-5 shadow-2xl border-2 border-amber-400/80 space-y-4">
              {/* Auspicious Letterhead Header */}
              <div className="text-center pb-2 border-b border-amber-200 dark:border-amber-900/40 relative">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 font-serif font-black text-sm mb-1 shadow-md">
                  ॐ
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400">
                  {isHi ? 'शुभ शगुन आशीर्वाद' : 'Auspicious Shagun Blessing'}
                </p>
                <h3 className="text-lg font-serif font-black text-slate-900 dark:text-amber-100 truncate mt-0.5">
                  {guestName}
                </h3>
                {guest?.relation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    ({guest.relation.replace('_', ' ')}) {guest.city ? `• ${guest.city}` : ''}
                  </p>
                )}
              </div>

              {/* Cash Shagun Breakout */}
              {hasCash && (
                <CashReveal
                  amount={Number(gift.cashAmount)}
                  breakdown={gift.cashBreakdown}
                  isActive={isOpen}
                />
              )}

              {/* Gift Item */}
              {hasItem && (
                <GiftReveal
                  description={gift.giftDescription}
                  imageUrl={gift.giftImageUrl}
                  isActive={isOpen}
                />
              )}

              {/* If Empty */}
              {isEmpty && (
                <div className="flex flex-col items-center justify-center py-5 text-center space-y-2.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isHi
                      ? 'इस लिफ़ाफ़े के लिए अभी कोई राशि या उपहार दर्ज नहीं है।'
                      : 'No amount or gift item was recorded for this envelope yet.'}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleQuickAddAmount}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold rounded-xl shadow-md"
                  >
                    <IndianRupee className="h-3.5 w-3.5" />
                    <span>{isHi ? 'राशि दर्ज करें (उदा. ₹5,000)' : 'Enter Amount (e.g. ₹5,000)'}</span>
                  </Button>
                </div>
              )}

              {/* Action Buttons inside revealed card */}
              <div className="mt-3 flex items-center justify-between border-t border-amber-200 dark:border-amber-900/40 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReseal}
                  className="text-xs flex items-center gap-1.5 border-amber-300 dark:border-amber-800 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                  <span>{isHi ? 'दोबारा सील करें (Reseal)' : 'Reseal Envelope'}</span>
                </Button>

                {onClose ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={onClose}
                    className="text-xs bg-[#8B1D2C] hover:bg-[#731522] text-white rounded-xl shadow-xs"
                  >
                    <span>{isHi ? 'बंद करें' : 'Close'}</span>
                  </Button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isHi ? 'बही-खाते में दर्ज' : 'Recorded in ledger'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* INTERACTIVE WOODEN SLIDING FLAP PANEL                      */}
          {/* ───────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 240 }}
                dragElastic={0.15}
                onDragStart={() => {
                  setIsDragging(true);
                  if (!isMuted) soundEngine.playWoodSlide();
                }}
                onDrag={(_, info) => {
                  dragY.set(Math.max(0, info.offset.y));
                }}
                onDragEnd={(_, info) => {
                  setIsDragging(false);
                  if (info.offset.y > 50 || info.velocity.y > 250) {
                    handleOpen();
                  } else {
                    dragY.set(0);
                    if (!isMuted) soundEngine.playWoodSlide();
                  }
                }}
                onClick={handleOpen}
                style={{ y: springY }}
                initial={{ y: 0 }}
                exit={{
                  y: 340,
                  opacity: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                }}
                className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing select-none"
              >
                {/* Procedural Realistic Teak Wood + Luminous Curved Crest */}
                <div className="relative w-full h-full">
                  <svg
                    viewBox="0 0 400 320"
                    preserveAspectRatio="none"
                    className="w-full h-full drop-shadow-[0_-12px_24px_rgba(0,0,0,0.45)] overflow-visible"
                  >
                    <defs>
                      {/* Teak/Walnut Wood Plank Gradient */}
                      <linearGradient id="wood-base-fine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5B2E15" />
                        <stop offset="10%" stopColor="#7E431D" />
                        <stop offset="22%" stopColor="#9C5627" />
                        <stop offset="35%" stopColor="#6D3718" />
                        <stop offset="50%" stopColor="#8C4D22" />
                        <stop offset="65%" stopColor="#A55D2B" />
                        <stop offset="78%" stopColor="#6A3617" />
                        <stop offset="90%" stopColor="#86471E" />
                        <stop offset="100%" stopColor="#522711" />
                      </linearGradient>

                      {/* Satin Lacquer Specular Sheen */}
                      <linearGradient id="wood-sheen-fine" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
                        <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.06" />
                        <stop offset="70%" stopColor="#000000" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
                      </linearGradient>

                      {/* Illuminated Rim Highlight Filter */}
                      <filter id="rim-glow-fine" x="-20%" y="-100%" width="140%" height="300%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#FEF08A" floodOpacity="0.95" />
                        <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#F59E0B" floodOpacity="0.6" />
                      </filter>

                      {/* Subtle fine vertical wood grain pattern */}
                      <pattern id="wood-grain-subtle" width="20" height="320" patternUnits="userSpaceOnUse">
                        <line x1="3" y1="0" x2="3" y2="320" stroke="#3D1C0B" strokeWidth="0.8" opacity="0.35" />
                        <line x1="8" y1="0" x2="7.5" y2="320" stroke="#B86E35" strokeWidth="0.6" opacity="0.25" />
                        <line x1="14" y1="0" x2="14.5" y2="320" stroke="#48220E" strokeWidth="0.9" opacity="0.4" />
                        <line x1="18" y1="0" x2="18" y2="320" stroke="#D48B4C" strokeWidth="0.5" opacity="0.2" />
                      </pattern>
                    </defs>

                    {/* The Wood Flap Body with Smooth Curved Crest */}
                    {/* Curve: (0, 20) -> (200, 4) -> (400, 20) */}
                    <path
                      d="M 0 20 Q 200 4 400 20 L 400 320 L 0 320 Z"
                      fill="url(#wood-base-fine)"
                    />
                    <path
                      d="M 0 20 Q 200 4 400 20 L 400 320 L 0 320 Z"
                      fill="url(#wood-grain-subtle)"
                    />
                    <path
                      d="M 0 20 Q 200 4 400 20 L 400 320 L 0 320 Z"
                      fill="url(#wood-sheen-fine)"
                    />

                    {/* Subtle Organic Wood Knots */}
                    <g opacity="0.35">
                      <ellipse cx="70" cy="110" rx="3.5" ry="9" fill="#200E05" />
                      <ellipse cx="160" cy="200" rx="3" ry="6" fill="#1A0C04" />
                      <ellipse cx="310" cy="100" rx="4" ry="10" fill="#241006" />
                      <ellipse cx="335" cy="170" rx="2" ry="5" fill="#1C0D05" />
                    </g>

                    {/* The Luminous Rim Highlight along curved top */}
                    <path
                      d="M 0 20 Q 200 4 400 20"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      fill="none"
                      filter="url(#rim-glow-fine)"
                    />
                    <path
                      d="M 0 20 Q 200 4 400 20"
                      stroke="#FFFBEB"
                      strokeWidth="1.2"
                      fill="none"
                    />
                  </svg>

                  {/* ───────────────────────────────────────────────── */}
                  {/* TACTILE GRAB HANDLE: WHITE HAND SYMBOL            */}
                  {/* Mounted right at the crest apex of the wooden wall*/}
                  {/* ───────────────────────────────────────────────── */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center">
                    {/* White Stylized Hand with 3 vertical lines (matching reference) */}
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.35),0_0_10px_rgba(255,255,255,0.9)] flex items-center justify-center transition-transform duration-200',
                        isHovered && !isDragging && 'scale-110 -translate-y-0.5'
                      )}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-800">
                        <path d="M 9 3 C 8.4 3 8 3.4 8 4 L 8 9 C 8 9.2 8.1 9.4 8.2 9.6 C 7.6 9.8 7 10.4 7 11.2 L 7 14 C 7 17.3 9.7 20 13 20 C 16.3 20 19 17.3 19 14 L 19 9 C 19 8.4 18.6 8 18 8 C 17.4 8 17 8.4 17 9 L 17 9.5 C 16.7 9.2 16.4 9 16 9 C 15.4 9 15 9.4 15 10 L 15 10.5 C 14.7 10.2 14.4 10 14 10 C 13.4 10 13 10.4 13 11 L 13 4 C 13 3.4 12.6 3 12 3 C 11.4 3 11 3.4 11 4 L 11 8 C 10.7 7.7 10.4 7.5 10 7.5 C 9.4 7.5 9 7.9 9 8.5 Z" />
                        <line x1="11" y1="12" x2="11" y2="15" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                        <line x1="13" y1="12" x2="13" y2="15" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                        <line x1="15" y1="12" x2="15" y2="15" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Glowing Amber Energy Spark (⚡) right under the hand */}
                    <motion.div
                      style={{ scale: sealGlow }}
                      className="mt-2 relative flex items-center justify-center"
                    >
                      {/* Diffuse Amber Radiant Halo */}
                      <div className="absolute w-9 h-9 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] blur-md opacity-90 animate-pulse" />

                      {/* Glowing Golden Lightning Bolt Glyph */}
                      <div className="relative z-10 w-4 h-4 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-amber-300 stroke-amber-500">
                          <path d="M 13 2 L 4 14 L 12 14 L 11 22 L 20 10 L 12 10 Z" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>

                  {/* Lower Dedication Plaque & Pull-Down Hint */}
                  <div className="absolute bottom-4 left-0 right-0 px-6 text-center pointer-events-none">
                    <div className="inline-block rounded-2xl bg-black/60 backdrop-blur-md px-3.5 py-2 border border-amber-300/30 text-amber-100 shadow-xl max-w-[280px]">
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <span className="text-amber-400 text-xs">↓</span>
                        <p className="text-[11px] font-bold tracking-wide uppercase">
                          {isHi ? 'नीचे खींचें या क्लिक करें' : 'Slide down or click to open'}
                        </p>
                      </div>
                      <p className="text-[10px] text-amber-200/80">
                        {isHi ? 'शगुन लिफ़ाफ़ा खोलें' : 'Unseal Shagun Envelope'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
