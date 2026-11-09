'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { GiftData, GuestData } from '@/types';
import { formatCurrency, stringToColor } from '@/utils/format';
import { soundEngine } from '@/utils/audio';
import { CashReveal } from './CashReveal';
import { GiftReveal } from './GiftReveal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle2, IndianRupee, Sparkles, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/utils/cn';

interface AmplifyWoodEnvelopeProps {
  gift: GiftData;
  guest?: GuestData;
  initialOpen?: boolean;
  onOpen?: () => void;
  className?: string;
  headline?: string; // Optional custom top text (defaults to "AMPLIFY")
}

export const AmplifyWoodEnvelope: React.FC<AmplifyWoodEnvelopeProps> = ({
  gift: initialGift,
  guest: propGuest,
  initialOpen = false,
  onOpen,
  className,
  headline = 'AMPLIFY',
}) => {
  const [gift, setGift] = useState<GiftData>(initialGift);
  const [isOpen, setIsOpen] = useState(initialOpen || initialGift.isOpened);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const guest = propGuest || gift.guest;
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

  // Drag physics motion values
  const dragY = useMotionValue(0);
  const springY = useSpring(dragY, { stiffness: 260, damping: 24 });

  // Dynamic light bloom intensity based on drag distance
  const lightOpacity = useTransform(dragY, [0, 160], [0.45, 1.0]);
  const lightScale = useTransform(dragY, [0, 160], [1.0, 1.6]);
  const sealGlow = useTransform(dragY, [0, 160], [1.0, 1.8]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 85,
        origin: { y: 0.55 },
        colors: ['#F59E0B', '#D97706', '#FEF08A', '#FA837F', '#FFFFFF'],
      });
    } catch (e) {}
  };

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundEngine.playUnsealChime();
    triggerConfetti();
    onOpen?.();
  };

  const handleReseal = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playReseal();
    setIsOpen(false);
    dragY.set(0);
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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  return (
    <div
      className={cn(
        'group relative w-full max-w-[420px] mx-auto select-none font-sans',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Luxury Frame */}
      <div className="relative rounded-[32px] overflow-hidden shadow-[0_24px_50px_rgba(20,10,5,0.45),0_4px_12px_rgba(0,0,0,0.2)] border-2 border-[#5C3317]/40 bg-[#161B18]">
        {/* Top Sound Toggle Pill */}
        <button
          type="button"
          onClick={toggleMute}
          className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 hover:text-white flex items-center justify-center transition hover:scale-105"
          title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* UPPER ZONE: MISTY SKY & ORGANIC FOLIAGE CANOPY               */}
        {/* (Matching exact screenshot media_1793809559758_f138cbc1.jpg) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-b from-[#B8C4BC] via-[#D5DED8] to-[#E9EEEB]">
          {/* Subtle Ambient Sky Mist Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.85)_0%,rgba(215,225,220,0.6)_60%,rgba(180,195,188,0.3)_100%)] pointer-events-none" />

          {/* Top-Left Blurred Leafy Tree Branches */}
          <div className="absolute -top-10 -left-12 w-64 h-44 pointer-events-none opacity-90 filter blur-[2px] transition-transform duration-700 group-hover:scale-105">
            <svg viewBox="0 0 200 150" className="w-full h-full">
              {/* Dark Forest Green Leaves */}
              <circle cx="20" cy="10" r="34" fill="#1C331E" />
              <circle cx="65" cy="15" r="28" fill="#264429" />
              <circle cx="110" cy="20" r="24" fill="#1D3620" />
              <circle cx="45" cy="45" r="30" fill="#325735" />
              <circle cx="85" cy="50" r="26" fill="#3C663F" />
              <circle cx="130" cy="35" r="22" fill="#2A4B2D" />
              <circle cx="30" cy="75" r="22" fill="#4B774E" />
              <circle cx="70" cy="80" r="20" fill="#355B38" />
              {/* Dappled Sunshine Highlights */}
              <circle cx="55" cy="35" r="14" fill="#6B996E" opacity="0.6" />
              <circle cx="95" cy="40" r="12" fill="#84B087" opacity="0.5" />
            </svg>
          </div>

          {/* Top-Right Blurred Leafy Tree Canopy */}
          <div className="absolute -top-8 -right-10 w-60 h-44 pointer-events-none opacity-90 filter blur-[3px] transition-transform duration-700 group-hover:scale-105">
            <svg viewBox="0 0 200 150" className="w-full h-full">
              <circle cx="170" cy="10" r="32" fill="#1B311D" />
              <circle cx="130" cy="18" r="28" fill="#27462B" />
              <circle cx="85" cy="15" r="22" fill="#1F3A22" />
              <circle cx="150" cy="45" r="28" fill="#335A36" />
              <circle cx="115" cy="50" r="24" fill="#3E6B43" />
              <circle cx="175" cy="65" r="22" fill="#4C7D52" />
              <circle cx="135" cy="75" r="18" fill="#375F3B" />
              <circle cx="140" cy="35" r="12" fill="#78A67B" opacity="0.55" />
            </svg>
          </div>

          {/* Secondary Gaussian Blur Depth-of-Field Overlay */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />

          {/* ───────────────────────────────────────────────────────── */}
          {/* CENTER DEBOSSED TEXT: "AMPLIFY" (Exact typography in SS) */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full px-4">
            <h2
              className="text-lg sm:text-xl font-black tracking-[0.28em] uppercase transition-all duration-300"
              style={{
                color: 'rgba(55, 68, 62, 0.72)',
                textShadow:
                  '0 1.5px 2px rgba(255, 255, 255, 0.95), 0 -1.5px 1.5px rgba(20, 30, 25, 0.35)',
              }}
            >
              {headline}
            </h2>
            <p
              className="text-[9px] font-bold tracking-[0.2em] uppercase mt-0.5 text-slate-500/70"
              style={{ textShadow: '0 1px 1px rgba(255,255,255,0.8)' }}
            >
              {guestName} • ₹{Number(gift.cashAmount || 0).toLocaleString('en-IN')}
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
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-32 pointer-events-none z-10 flex items-end justify-center"
          >
            {/* Soft Ambient Radiance Bloom */}
            <div className="w-72 h-24 rounded-full bg-[radial-gradient(ellipse_at_bottom,rgba(255,248,220,1)_0%,rgba(251,191,36,0.85)_30%,rgba(245,158,11,0.35)_55%,transparent_75%)] blur-xl" />
            {/* Sharp Core Hotspot */}
            <div className="absolute bottom-0 w-32 h-10 rounded-full bg-white/90 blur-md" />
          </motion.div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* LOWER ZONE: LUXURY POLISHED TEAK/WALNUT WOOD BARRIER          */}
        {/* Pull-down flap with curved crest, grab handle & glowing seal  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative min-h-[360px] bg-[#2E1609]">
          {/* Behind the Flap: The Revealed Inner Shagun Blessing Card */}
          <div className="p-5 sm:p-6 text-slate-800 dark:text-white">
            <div className="rounded-3xl bg-[#FAF8F5] dark:bg-[#111726] p-5 sm:p-6 shadow-2xl border-2 border-amber-400/80 space-y-4">
              {/* Auspicious Letterhead Header */}
              <div className="text-center pb-2 border-b border-amber-200 dark:border-amber-900/40 relative">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 font-serif font-black text-base mb-1 shadow-md">
                  ॐ
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400">
                  Auspicious Shagun Blessing
                </p>
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-amber-100 truncate mt-0.5">
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

              {/* Action Buttons inside revealed card */}
              <div className="mt-4 flex items-center justify-between border-t border-amber-200 dark:border-amber-900/40 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReseal}
                  className="text-xs flex items-center gap-1.5 border-amber-300 dark:border-amber-800 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                  <span>Reseal (दोबारा सील करें)</span>
                </Button>

                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Recorded in ledger
                </span>
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
                dragConstraints={{ top: 0, bottom: 280 }}
                dragElastic={0.25}
                onDragStart={() => {
                  setIsDragging(true);
                  soundEngine.playWoodSlide();
                }}
                onDrag={(_, info) => {
                  dragY.set(Math.max(0, info.offset.y));
                }}
                onDragEnd={(_, info) => {
                  setIsDragging(false);
                  if (info.offset.y > 75 || info.velocity.y > 350) {
                    handleOpen();
                  } else {
                    dragY.set(0);
                    soundEngine.playWoodSlide();
                  }
                }}
                onClick={handleOpen}
                style={{ y: springY }}
                initial={{ y: 0 }}
                exit={{
                  y: 420,
                  opacity: 0,
                  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                }}
                className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing select-none"
              >
                {/* ─────────────────────────────────────────────────── */}
                {/* SVG PROCEDURAL REALISTIC WOOD TEXTURE + CURVED CREST */}
                {/* ─────────────────────────────────────────────────── */}
                <div className="relative w-full h-full">
                  <svg
                    viewBox="0 0 400 480"
                    preserveAspectRatio="none"
                    className="w-full h-full drop-shadow-[0_-12px_24px_rgba(0,0,0,0.45)] overflow-visible"
                  >
                    <defs>
                      {/* Rich Teak & Walnut Vertical Wood Gradient */}
                      <linearGradient id="wood-base" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4A2511" />
                        <stop offset="12%" stopColor="#6C3919" />
                        <stop offset="25%" stopColor="#8C4D22" />
                        <stop offset="38%" stopColor="#5A2E14" />
                        <stop offset="50%" stopColor="#7E431D" />
                        <stop offset="62%" stopColor="#9C5627" />
                        <stop offset="75%" stopColor="#5C3015" />
                        <stop offset="88%" stopColor="#7A411C" />
                        <stop offset="100%" stopColor="#43210E" />
                      </linearGradient>

                      {/* Satin Lacquer Specular Sheen (Curved Top to Bottom) */}
                      <linearGradient id="wood-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
                        <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.08" />
                        <stop offset="60%" stopColor="#000000" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
                      </linearGradient>

                      {/* Illuminated Rim Highlight Filter */}
                      <filter id="rim-glow" x="-20%" y="-100%" width="140%" height="300%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FEF08A" floodOpacity="0.9" />
                        <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#F59E0B" floodOpacity="0.6" />
                      </filter>

                      {/* Wood Grain Pattern Lines */}
                      <pattern id="wood-fibers" width="40" height="480" patternUnits="userSpaceOnUse">
                        <line x1="4" y1="0" x2="4" y2="480" stroke="#2B1408" strokeWidth="1.2" opacity="0.45" />
                        <line x1="8" y1="0" x2="7" y2="480" stroke="#A75F2C" strokeWidth="0.8" opacity="0.35" />
                        <line x1="14" y1="0" x2="15" y2="480" stroke="#38190B" strokeWidth="1.5" opacity="0.5" />
                        <line x1="22" y1="0" x2="21" y2="480" stroke="#B86E35" strokeWidth="0.7" opacity="0.4" />
                        <line x1="28" y1="0" x2="29" y2="480" stroke="#261207" strokeWidth="1.8" opacity="0.55" />
                        <line x1="34" y1="0" x2="33" y2="480" stroke="#9E5728" strokeWidth="0.9" opacity="0.3" />
                      </pattern>
                    </defs>

                    {/* ─────────────────────────────────────────────── */}
                    {/* The Wood Flap Body with Smooth Curved Crest     */}
                    {/* Curve starts at (0, 22), peaks smoothly to       */}
                    {/* (200, 4) in the center, and ends at (400, 22)   */}
                    {/* ─────────────────────────────────────────────── */}
                    <path
                      d="M 0 22 
                         Q 200 2 400 22 
                         L 400 480 
                         L 0 480 
                         Z"
                      fill="url(#wood-base)"
                    />

                    {/* Overlay Wood Fiber Striations */}
                    <path
                      d="M 0 22 
                         Q 200 2 400 22 
                         L 400 480 
                         L 0 480 
                         Z"
                      fill="url(#wood-fibers)"
                    />

                    {/* Lacquer Specular Sheen & Vignette */}
                    <path
                      d="M 0 22 
                         Q 200 2 400 22 
                         L 400 480 
                         L 0 480 
                         Z"
                      fill="url(#wood-gloss)"
                    />

                    {/* Natural Wood Knots / Burls (Matching hyper-realism in SS) */}
                    <g opacity="0.45">
                      <ellipse cx="65" cy="180" rx="4" ry="12" fill="#200E05" />
                      <ellipse cx="145" cy="310" rx="3" ry="8" fill="#1A0C04" />
                      <ellipse cx="320" cy="160" rx="5" ry="14" fill="#241006" />
                      <ellipse cx="340" cy="240" rx="2.5" ry="6" fill="#1C0D05" />
                      <ellipse cx="260" cy="380" rx="4" ry="10" fill="#200E05" />
                    </g>

                    {/* ─────────────────────────────────────────────── */}
                    {/* THE LUMINOUS ILLUMINATED RIM HIGHLIGHT          */}
                    {/* Sharp radiant white edge along the curved peak  */}
                    {/* ─────────────────────────────────────────────── */}
                    <path
                      d="M 0 22 Q 200 2 400 22"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      fill="none"
                      filter="url(#rim-glow)"
                    />
                    <path
                      d="M 0 22 Q 200 2 400 22"
                      stroke="#FFFBEB"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>

                  {/* ───────────────────────────────────────────────── */}
                  {/* TACTILE GRAB HANDLE: WHITE GLOVE / HAND SYMBOL    */}
                  {/* (Exact hand symbol with 3 ribs centered on seam) */}
                  {/* ───────────────────────────────────────────────── */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.8)] border border-slate-200 flex items-center justify-center text-slate-800 transition-transform duration-200',
                        isHovered && !isDragging && 'scale-110 -translate-y-0.5'
                      )}
                    >
                      {/* Stylized Hand Grab Icon with 3 finger ribs matching screenshot */}
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-800">
                        <path d="M 9 3 C 8.4 3 8 3.4 8 4 L 8 9 C 8 9.2 8.1 9.4 8.2 9.6 C 7.6 9.8 7 10.4 7 11.2 L 7 14 C 7 17.3 9.7 20 13 20 C 16.3 20 19 17.3 19 14 L 19 9 C 19 8.4 18.6 8 18 8 C 17.4 8 17 8.4 17 9 L 17 9.5 C 16.7 9.2 16.4 9 16 9 C 15.4 9 15 9.4 15 10 L 15 10.5 C 14.7 10.2 14.4 10 14 10 C 13.4 10 13 10.4 13 11 L 13 4 C 13 3.4 12.6 3 12 3 C 11.4 3 11 3.4 11 4 L 11 8 C 10.7 7.7 10.4 7.5 10 7.5 C 9.4 7.5 9 7.9 9 8.5 Z" />
                        {/* Finger knuckle ribs */}
                        <line x1="11" y1="12" x2="11" y2="15" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                        <line x1="13" y1="12" x2="13" y2="15" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                        <line x1="15" y1="12" x2="15" y2="15" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* ─────────────────────────────────────────────── */}
                    {/* GLOWING AMBER ENERGY SPARK (⚡ Lightning glyph) */}
                    {/* (Directly beneath the hand on the wooden face)   */}
                    {/* ─────────────────────────────────────────────── */}
                    <motion.div
                      style={{ scale: sealGlow }}
                      className="mt-3 relative flex items-center justify-center"
                    >
                      {/* Diffuse Amber Radiant Halo */}
                      <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] blur-md opacity-85 animate-pulse" />

                      {/* Glowing Golden Lightning Bolt Glyph */}
                      <div className="relative z-10 w-6 h-6 flex items-center justify-center filter drop-shadow-[0_0_8px_#F59E0B] drop-shadow-[0_0_16px_#EA580C]">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FDE047] stroke-[#F59E0B] stroke-width-[0.5]">
                          <path d="M 13 2 L 4 14 L 12 14 L 11 22 L 20 10 L 12 10 Z" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>

                  {/* ───────────────────────────────────────────────── */}
                  {/* LOWER DEDICATION PLAQUE & INSTRUCTION HINT        */}
                  {/* ───────────────────────────────────────────────── */}
                  <div className="absolute bottom-6 left-0 right-0 px-6 text-center pointer-events-none">
                    <div className="inline-block rounded-2xl bg-black/55 backdrop-blur-md px-5 py-3 border border-amber-300/30 text-amber-100 shadow-xl max-w-[320px]">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="h-px w-5 bg-amber-400/50" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                          Shagun With Blessings
                        </span>
                        <span className="h-px w-5 bg-amber-400/50" />
                      </div>
                      <h4 className="font-serif font-black text-base sm:text-lg text-white truncate">
                        {guestName}
                      </h4>
                      {guest?.relation && (
                        <p className="text-[11px] text-amber-200/80 capitalize mt-0.5">
                          ({guest.relation.replace('_', ' ')})
                        </p>
                      )}
                    </div>

                    {/* Pull Down / Swipe to Unseal Hint */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-200/90 tracking-wide drop-shadow-md">
                      <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" />
                      <span>Pull down or tap to reveal shagun</span>
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
