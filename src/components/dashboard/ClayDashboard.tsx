'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Gift,
  RefreshCw,
  Users,
  Calendar,
  Settings,
  Search,
  Bell,
  ArrowRight,
  Send,
  Check,
  ChevronRight,
  Clock,
  Sparkles,
  IndianRupee,
  Mic,
  Smile,
  Crown,
} from 'lucide-react';
import { GiftData, ReciprocityData } from '@/types';
import { formatCurrency, getInitials } from '@/utils/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import confetti from 'canvas-confetti';

interface ClayDashboardProps {
  stats: {
    totalEvents: number;
    totalGuests: number;
    totalGifts: number;
    totalCashReceived: number;
    totalGiftItems: number;
    pendingReciprocity: number;
    recentGifts: GiftData[];
  };
  reciprocityAlerts: ReciprocityData[];
  isDemo: boolean;
}

export const ClayDashboard: React.FC<ClayDashboardProps> = ({
  stats,
  reciprocityAlerts,
  isDemo,
}) => {
  const { data: session } = useSession();
  const { language } = useLanguage();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [quickInput, setQuickInput] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wishlist' | 'sleeptimes' | 'vaccines' | 'milestones' | 'settings'>('dashboard');

  const userName = session?.user?.name || (isDemo ? 'Sia Sharma' : 'Beloved Host');

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FA837F', '#F472B6', '#FBBF24', '#34D399'],
      });
    } catch (e) {}
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    triggerConfetti();
    router.push(`/gifts/new?search=${encodeURIComponent(quickInput.trim())}`);
  };

  return (
    <div className="w-full max-w-[1340px] mx-auto p-3 sm:p-5 lg:p-8 font-sans selection:bg-[#FA837F] selection:text-white">
      {/* Outer Claymorphism Application Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* LEFT COLUMN: CORAL CLAY SIDEBAR (Matching exact SS left bar) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <aside className="lg:col-span-3 clay-sidebar p-6 sm:p-7 flex flex-col justify-between min-h-[820px] text-white relative overflow-hidden">
          {/* Subtle Ambient Gloss Overlays */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Section: Avatar + Name + Navigation Items */}
          <div className="space-y-6 relative z-10">
            {/* 3D Illustrated Cute Avatar */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="relative">
                {/* Outer Puffy White Clay Ring */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1.5 shadow-[0_12px_24px_rgba(0,0,0,0.12),inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(220,100,95,0.25)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#FCEAE8] flex items-center justify-center relative">
                    {/* SVG 3D Cute Avatar matching Screenshot */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#FED7AA" />
                          <stop offset="100%" stopColor="#FDBA74" />
                        </linearGradient>
                        <linearGradient id="hair" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#78350F" />
                          <stop offset="100%" stopColor="#451A03" />
                        </linearGradient>
                        <linearGradient id="dress" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#34D399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      {/* Hair Back */}
                      <circle cx="50" cy="45" r="32" fill="url(#hair)" />
                      <circle cx="28" cy="50" r="14" fill="url(#hair)" />
                      <circle cx="72" cy="50" r="14" fill="url(#hair)" />
                      {/* Body & Green Dress */}
                      <path d="M 28 95 C 28 75, 72 75, 72 95 Z" fill="url(#dress)" />
                      {/* Neck */}
                      <rect x="44" y="65" width="12" height="10" rx="3" fill="#FDBA74" />
                      {/* Face */}
                      <circle cx="50" cy="48" r="23" fill="url(#skin)" />
                      {/* Hair Bangs */}
                      <path d="M 28 42 C 32 30, 48 30, 52 38 C 56 30, 68 30, 72 42 C 70 34, 30 34, 28 42 Z" fill="url(#hair)" />
                      {/* Cute Big Eyes */}
                      <ellipse cx="42" cy="48" rx="3.5" ry="4.5" fill="#1F2937" />
                      <circle cx="43" cy="46" r="1.5" fill="#FFFFFF" />
                      <ellipse cx="58" cy="48" rx="3.5" ry="4.5" fill="#1F2937" />
                      <circle cx="59" cy="46" r="1.5" fill="#FFFFFF" />
                      {/* Rosy Cheeks */}
                      <circle cx="36" cy="54" r="3" fill="#FB7185" opacity="0.6" />
                      <circle cx="64" cy="54" r="3" fill="#FB7185" opacity="0.6" />
                      {/* Smile */}
                      <path d="M 46 56 Q 50 60 54 56" stroke="#B45309" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Auspicious Bindi Badge */}
                <div className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-[#FA7C77] border-2 border-white flex items-center justify-center text-[10px] shadow-sm">
                  ✨
                </div>
              </div>

              <h3 className="text-xl font-black text-white tracking-tight drop-shadow-sm">
                Hi, {userName}!
              </h3>
            </div>

            {/* Navigation Item Pills (Matching Left Sidebar in SS) */}
            <nav className="space-y-2 text-sm font-semibold">
              {/* 1. Dashboard (Active White Clay Pill) */}
              <Link href="/dashboard" className="block">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl clay-nav-active transition font-bold text-left text-sm"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#FEECEB] flex items-center justify-center text-[#FA7C77]">
                    <LayoutDashboard className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <span>Dashboard</span>
                </button>
              </Link>

              {/* 2. Wishlist / Gifts */}
              <Link href="/gifts" className="block">
                <button
                  type="button"
                  className="w-full flex items-center gap-3.5 px-4 py-3 clay-nav-item font-medium text-left text-sm"
                >
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Gift className="h-4 w-4" />
                  </div>
                  <span>Wishlist & Gifts</span>
                </button>
              </Link>

              {/* 3. Sleep Times / Reciprocity */}
              <Link href="/reciprocity" className="block">
                <button
                  type="button"
                  className="w-full flex items-center gap-3.5 px-4 py-3 clay-nav-item font-medium text-left text-sm"
                >
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <span>Reciprocity (लेन-देन)</span>
                </button>
              </Link>

              {/* 4. My Vaccines / Guest Directory */}
              <Link href="/guests" className="block">
                <button
                  type="button"
                  className="w-full flex items-center gap-3.5 px-4 py-3 clay-nav-item font-medium text-left text-sm"
                >
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Users className="h-4 w-4" />
                  </div>
                  <span>Guest Directory</span>
                </button>
              </Link>

              {/* 5. Milestones / Wedding Events */}
              <Link href="/events" className="block">
                <button
                  type="button"
                  className="w-full flex items-center gap-3.5 px-4 py-3 clay-nav-item font-medium text-left text-sm"
                >
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span>Milestones & Events</span>
                </button>
              </Link>

              {/* 6. Settings */}
              <Link href="/settings" className="block">
                <button
                  type="button"
                  className="w-full flex items-center gap-3.5 px-4 py-3 clay-nav-item font-medium text-left text-sm"
                >
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Settings className="h-4 w-4" />
                  </div>
                  <span>Settings</span>
                </button>
              </Link>
            </nav>
          </div>

          {/* Bottom Section: Let's Upgrade Card (Exact SS bottom card) */}
          <div className="pt-6 relative z-10">
            <div className="bg-[#FFF5F3] text-slate-800 rounded-3xl p-5 text-center shadow-[0_12px_24px_rgba(0,0,0,0.1),inset_0_3px_5px_rgba(255,255,255,0.9)] space-y-2.5">
              {/* 3D Golden Crown Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F59E0B] to-[#FDE047] mx-auto flex items-center justify-center shadow-md text-amber-900">
                <Crown className="h-6 w-6 fill-amber-700 stroke-amber-800" />
              </div>
              <h4 className="font-black text-sm text-slate-800 tracking-tight">
                Let&apos;s Upgrade!
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Unlock all analytics, export reports, and cloud voice bahi-khata!
              </p>
              <button
                type="button"
                onClick={triggerConfetti}
                className="w-full py-2.5 px-4 clay-btn-coral text-xs font-bold mt-1"
              >
                Upgrade
              </button>
            </div>
          </div>
        </aside>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* RIGHT COLUMN: MAIN CLAYMORPHISM DASHBOARD CONTENT             */}
        {/* ───────────────────────────────────────────────────────────── */}
        <main className="lg:col-span-9 space-y-5 sm:space-y-6">
          {/* ───────────────────────────────────────────────────────── */}
          {/* 1. TOP HEADER: Title + Search Bar + Bell + Profile Avatar */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Dashboard
            </h1>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Puffy Inset Clay Search Bar */}
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for relative, gift, amount..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-medium text-slate-700 clay-inset outline-none focus:ring-2 focus:ring-[#FA837F]/50 transition"
                />
              </div>

              {/* Notification Bell with red badge (3) */}
              <button
                type="button"
                onClick={triggerConfetti}
                className="w-10 h-10 rounded-full bg-white clay-card p-0 flex items-center justify-center relative flex-shrink-0 cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-4 w-4 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FA7C77] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                  3
                </span>
              </button>

              {/* Clay Profile Avatar Circle */}
              <Link href="/profile">
                <div className="w-10 h-10 rounded-full bg-[#FA7C77] text-white font-black text-xs flex items-center justify-center shadow-[0_4px_10px_rgba(250,124,119,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)] cursor-pointer hover:scale-105 transition">
                  {getInitials(userName)}
                </div>
              </Link>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 2. HERO CLAY BANNER (Matching exact SS top peach banner)  */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="clay-card-peach p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Subtle light shimmer */}
            <div className="absolute top-0 right-1/4 w-48 h-48 bg-white/30 rounded-full blur-2xl pointer-events-none" />

            {/* Left 3D Sleeping/Relaxing Character Illustration */}
            <div className="flex items-center gap-5">
              <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 relative">
                {/* 3D Cute Relaxing Girl SVG matching Screenshot */}
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                  <ellipse cx="60" cy="95" rx="50" ry="12" fill="#F4B8B2" opacity="0.4" />
                  {/* Pillow */}
                  <rect x="25" y="75" width="70" height="20" rx="10" fill="#FFFFFF" />
                  {/* Arms resting */}
                  <ellipse cx="45" cy="78" rx="12" ry="6" fill="#FDBA74" />
                  <ellipse cx="75" cy="78" rx="12" ry="6" fill="#FDBA74" />
                  {/* Head tilted peacefully */}
                  <circle cx="60" cy="55" r="26" fill="#FED7AA" />
                  {/* Brown Hair */}
                  <path d="M 35 50 C 35 30, 85 30, 85 50 C 85 40, 75 32, 60 32 C 45 32, 35 40, 35 50 Z" fill="#78350F" />
                  <circle cx="36" cy="55" r="10" fill="#78350F" />
                  <circle cx="84" cy="55" r="10" fill="#78350F" />
                  {/* Peaceful Closed Eyes */}
                  <path d="M 48 55 Q 52 59 56 55" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 64 55 Q 68 59 72 55" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
                  {/* Rosy Cheeks */}
                  <circle cx="46" cy="61" r="3.5" fill="#FB7185" opacity="0.6" />
                  <circle cx="74" cy="61" r="3.5" fill="#FB7185" opacity="0.6" />
                  {/* Sweet Peaceful Smile */}
                  <path d="M 57 65 Q 60 68 63 65" stroke="#B45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              {/* Greeting & Subtitle */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Good morning, {userName.split(' ')[0]}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm leading-relaxed">
                  Let&apos;s start new celebrations with updated shagun registry and relative blessings!
                </p>

                {/* Sleep Duration / Record Shagun Clay Button */}
                <Link href="/gifts/new">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 clay-btn-coral text-xs font-black shadow-md cursor-pointer"
                  >
                    <div className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-white">
                      +
                    </div>
                    <span>Record Shagun (शगुन दर्ज करें)</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: 3D Cute Flower Pot with Red and Cyan Petals (Matching exact SS right art) */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 relative hidden sm:block">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                {/* Clay Flower Pot */}
                <path d="M 32 58 L 36 88 C 36 92, 64 92, 64 88 L 68 58 Z" fill="#D97706" />
                <rect x="30" y="54" width="40" height="7" rx="3.5" fill="#B45309" />
                {/* Auspicious Green Leaves */}
                <ellipse cx="40" cy="50" rx="8" ry="4" fill="#10B981" transform="rotate(-30 40 50)" />
                <ellipse cx="60" cy="50" rx="8" ry="4" fill="#10B981" transform="rotate(30 60 50)" />
                {/* 3D Cyan Flower on Left */}
                <circle cx="42" cy="38" r="8" fill="#38BDF8" />
                <circle cx="42" cy="38" r="3.5" fill="#FBBF24" />
                {/* 3D Red Flower on Right Top */}
                <circle cx="58" cy="32" r="9" fill="#EF4444" />
                <circle cx="58" cy="32" r="4" fill="#FDE047" />
                {/* 3D Orange Flower in Middle */}
                <circle cx="52" cy="42" r="7" fill="#F97316" />
                <circle cx="52" cy="42" r="3" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 3. FIRST ROW BENTO: Chat | Diet Chart | Height / Top Guests */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Chat / Talk to Voice Assistant */}
            <div className="clay-card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="clay-badge-yellow px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                    💬 Chat & Voice
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-800 leading-tight">
                  Talk to your <br /> voice assistant
                </h3>
              </div>

              {/* Chat Input Pill with Send Button */}
              <form onSubmit={handleQuickSubmit} className="relative w-full pt-2">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Type your message"
                  className="w-full pl-3.5 pr-9 py-2 text-xs text-slate-700 clay-inset outline-none font-medium"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 w-6 h-6 rounded-full bg-[#FA7C77] text-white flex items-center justify-center hover:scale-105 transition"
                >
                  <Send className="h-3 w-3 stroke-[2.5]" />
                </button>
              </form>
            </div>

            {/* Card 2: Diet Chart / Shagun Split (Donut Chart) */}
            <div className="clay-card p-5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="clay-badge-purple px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                  🍩 Shagun Split
                </span>
              </div>

              {/* 3D Multi-color Clay Donut Chart */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-md">
                  {/* Yellow Arc (Biscuit / Gifts 20%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="11"
                    strokeDasharray="226"
                    strokeDashoffset="60"
                    strokeLinecap="round"
                  />
                  {/* Purple Arc (Milk / Gold 25%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="#C084FC"
                    strokeWidth="11"
                    strokeDasharray="226"
                    strokeDashoffset="120"
                    strokeLinecap="round"
                  />
                  {/* Pink Arc (Cereal / Cash 55%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="#F472B6"
                    strokeWidth="11"
                    strokeDasharray="226"
                    strokeDashoffset="180"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-slate-800 leading-none">
                    {formatCurrency(stats.totalCashReceived || 148500)}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                    Total
                  </span>
                </div>
              </div>

              {/* Legend Labels matching SS */}
              <div className="flex items-center justify-around text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F472B6]" />
                  Cash
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
                  Gold
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                  Gifts
                </span>
              </div>
            </div>

            {/* Card 3: Height / Top Relatives (With standing 3D girl) */}
            <div className="clay-card p-5 space-y-3 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="clay-badge-green px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                  🏆 Top Blessings
                </span>
                <span className="text-xs font-black text-slate-700">₹21,000 —</span>
              </div>

              {/* Measurement lines & standing 3D character */}
              <div className="grid grid-cols-12 items-center gap-2 pt-2">
                {/* Left Measurement Lines */}
                <div className="col-span-8 space-y-2 text-[10px] font-bold text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right font-mono text-slate-600">₹21K</span>
                    <div className="h-0.5 flex-1 bg-slate-200 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right font-mono text-slate-600">₹11K</span>
                    <div className="h-0.5 flex-1 bg-slate-200 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right font-mono text-slate-600">₹5.1K</span>
                    <div className="h-0.5 flex-1 bg-slate-200 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right font-mono text-slate-600">₹2.1K</span>
                    <div className="h-0.5 flex-1 bg-slate-200 rounded-full" />
                  </div>
                </div>

                {/* Right Standing Cute Girl Character SVG */}
                <div className="col-span-4 flex justify-end">
                  <div className="w-16 h-28 relative">
                    <svg viewBox="0 0 60 110" className="w-full h-full drop-shadow-sm">
                      {/* Head */}
                      <circle cx="30" cy="22" r="14" fill="#FED7AA" />
                      {/* Hair */}
                      <circle cx="30" cy="18" r="15" fill="#78350F" />
                      <circle cx="18" cy="24" r="6" fill="#78350F" />
                      <circle cx="42" cy="24" r="6" fill="#78350F" />
                      <circle cx="26" cy="23" r="1.8" fill="#1F2937" />
                      <circle cx="34" cy="23" r="1.8" fill="#1F2937" />
                      {/* Green Dress matching SS */}
                      <path d="M 22 42 L 14 78 C 14 82, 46 82, 46 78 L 38 42 Z" fill="#10B981" />
                      {/* Arms */}
                      <path d="M 22 44 L 16 62" stroke="#FED7AA" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M 38 44 L 44 62" stroke="#FED7AA" strokeWidth="3.5" strokeLinecap="round" />
                      {/* Legs & Shoes */}
                      <rect x="23" y="78" width="4" height="22" rx="2" fill="#FED7AA" />
                      <rect x="33" y="78" width="4" height="22" rx="2" fill="#FED7AA" />
                      <ellipse cx="24" cy="102" rx="4" ry="2.5" fill="#FA7C77" />
                      <ellipse cx="36" cy="102" rx="4" ry="2.5" fill="#FA7C77" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-bold text-emerald-600 truncate">
                Mukesh Gupta (मामाजी)
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 4. SECOND ROW BENTO: Sleep Time Summary | Rocket Target  */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left Big Card: Sleep Time Summary / Total Shagun Progress Ring */}
            <div className="md:col-span-8 clay-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="clay-badge-yellow px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                  ✨ Shagun Time Summary
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {stats.totalGifts || 6} envelopes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
                {/* Left Circular Thick Clay Ring with Puffy Knob */}
                <div className="sm:col-span-6 flex justify-center">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {/* Base Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke="#FDF0ED"
                        strokeWidth="10"
                      />
                      {/* Active Yellow Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke="#FDE047"
                        strokeWidth="10"
                        strokeDasharray="238"
                        strokeDashoffset="60"
                        strokeLinecap="round"
                      />
                      {/* Pink Indicator Knob (matching SS) */}
                      <circle
                        cx="88"
                        cy="50"
                        r="6"
                        fill="#F472B6"
                        className="drop-shadow-md"
                      />
                      <circle
                        cx="22"
                        cy="74"
                        r="6"
                        fill="#F472B6"
                        className="drop-shadow-md"
                      />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-black text-slate-800 leading-tight">
                        08hr <br /> 30 min
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                        Recording Time
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Breakdown Horizontal Progress Bars (Deep Sleep / Restless / Awake) */}
                <div className="sm:col-span-6 space-y-3.5">
                  {/* Cash Shagun (Deep Sleep) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-[#FCEAE8] text-[#FA7C77] text-[10px] flex items-center justify-center">
                          💵
                        </span>
                        Cash Shagun
                      </span>
                      <span className="font-mono text-slate-700">72%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#F472B6] w-[72%]" />
                    </div>
                  </div>

                  {/* Physical Gifts (Restless Sleep) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-[#F3EBF9] text-[#8B5CF6] text-[10px] flex items-center justify-center">
                          🎁
                        </span>
                        Gift Items
                      </span>
                      <span className="font-mono text-slate-700">19%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#C084FC] w-[19%]" />
                    </div>
                  </div>

                  {/* Pending Reciprocity (Awake) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-[#E8F2FE] text-[#3B82F6] text-[10px] flex items-center justify-center">
                          🔄
                        </span>
                        Pending Return
                      </span>
                      <span className="font-mono text-slate-700">9%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#60A5FA] w-[9%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: 3D Rocket 85% Target (Matching exact SS rocket card) */}
            <div className="md:col-span-4 clay-card p-6 flex flex-col items-center justify-center text-center space-y-3">
              {/* 3D Illustrated Clay Rocket SVG */}
              <div className="w-24 h-24 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  {/* Rocket Flame */}
                  <path d="M 46 72 Q 50 92 50 92 Q 50 92 54 72 Z" fill="#F59E0B" />
                  <path d="M 48 72 Q 50 84 50 84 Q 50 84 52 72 Z" fill="#FBBF24" />
                  {/* Left & Right Fins */}
                  <path d="M 38 52 C 28 58, 26 70, 36 72 Z" fill="#EF4444" />
                  <path d="M 62 52 C 72 58, 74 70, 64 72 Z" fill="#EF4444" />
                  {/* Main Fuselage Body */}
                  <ellipse cx="50" cy="46" rx="14" ry="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                  {/* Nose Cone */}
                  <path d="M 39 32 Q 50 14 61 32 Z" fill="#EF4444" />
                  {/* Porthole Window with Inner Reflection */}
                  <circle cx="50" cy="42" r="6.5" fill="#3B82F6" stroke="#94A3B8" strokeWidth="1.5" />
                  <circle cx="48.5" cy="40.5" r="2" fill="#FFFFFF" />
                  {/* Bottom Thruster Ring */}
                  <rect x="42" y="68" width="16" height="4" rx="2" fill="#94A3B8" />
                </svg>
              </div>

              <div className="space-y-0.5">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                  85%
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  of your target achieved
                </p>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 5. THIRD ROW BENTO: Vaccine Tracker | Milestones Schedule */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 6: Vaccine Tracker / Recent Shagun Envelopes */}
            <div className="clay-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="clay-badge-pink px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                  ✉️ Vaccine Tracker
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>

              <div className="space-y-0.5">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  17 Days
                </h3>
                <p className="text-[11px] font-bold text-[#FA7C77] uppercase tracking-wider">
                  VAC 01 • Next Week • 24 Jun 2026
                </p>
              </div>

              {/* Checkbox item list matching SS */}
              <div className="space-y-2.5 pt-1 text-xs">
                {[
                  { name: 'Vac 1 - CoVine 1.5', time: '3 months', checked: false },
                  { name: 'CavVine 1.5', time: '3 months', checked: true },
                  { name: 'CavCine 0.5', time: '2 months', checked: true },
                  { name: 'Covvaci 1.0', time: '2 months', checked: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-700">
                    <label className="flex items-center gap-2.5 cursor-pointer font-semibold">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] transition ${
                          item.checked
                            ? 'bg-[#FA7C77] text-white shadow-xs'
                            : 'border-2 border-slate-300 bg-white'
                        }`}
                      >
                        {item.checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span>{item.name}</span>
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 7: Milestones / Late Bloomer */}
            <div className="clay-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="clay-badge-pink px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                  🏆 Milestones
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>

              <div className="space-y-0.5">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Late Bloomer
                </h3>
              </div>

              {/* Milestones list matching SS */}
              <div className="space-y-2 pt-1 text-xs text-slate-700 font-semibold">
                {[
                  { label: 'Hehe lol', time: '1 months' },
                  { label: 'Smiles', time: '2months' },
                  { label: 'Said "Momma"', time: '3 months' },
                  { label: 'Said "Uncle"', time: '6 months' },
                  { label: 'Walk', time: '11 months' },
                ].map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between py-0.5 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700">{m.label}</span>
                    <span className="text-[11px] font-medium text-slate-400">{m.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 6. BOTTOM RIBBON: Discover Features (Matching exact SS)   */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="clay-card-peach p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Cute 3D Smiling Clay Star SVG */}
              <div className="w-10 h-10 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <polygon
                    points="50,5 64,35 96,38 72,62 79,94 50,78 21,94 28,62 4,38 36,35"
                    fill="#FDE047"
                  />
                  {/* Cute Face */}
                  <circle cx="42" cy="48" r="3.5" fill="#1F2937" />
                  <circle cx="58" cy="48" r="3.5" fill="#1F2937" />
                  <circle cx="36" cy="54" r="2.5" fill="#FB7185" opacity="0.6" />
                  <circle cx="64" cy="54" r="2.5" fill="#FB7185" opacity="0.6" />
                  <path d="M 45 56 Q 50 62 55 56" stroke="#B45309" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-800">
                  Discover The New Features
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  See the full analytics view that we think you&apos;ll love.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={triggerConfetti}
              className="px-5 py-2.5 clay-btn-coral text-xs font-bold shadow-md cursor-pointer flex-shrink-0"
            >
              Upgrade
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
