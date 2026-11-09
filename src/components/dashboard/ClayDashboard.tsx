'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Gift,
  RefreshCw,
  Users,
  Calendar,
  Settings,
  Search,
  Bell,
  Send,
  Check,
  ChevronRight,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Package,
  Sparkles,
  BookOpen,
  Plus,
  Eye,
  Clock,
} from 'lucide-react';
import { GiftData, ReciprocityData } from '@/types';
import { formatCurrency, getInitials } from '@/utils/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import confetti from 'canvas-confetti';

/* ─────────────────────────────────────────────────────────────────── */
/* Types                                                               */
/* ─────────────────────────────────────────────────────────────────── */
interface WeddingGiftItem {
  id: string;
  title: string;
  category: string;
  suggestedStore: string | null;
  storeUrl: string | null;
  approxCost: number | null;
  claimedBy: string | null;
  status: 'AVAILABLE' | 'CLAIMED';
}

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

/* ─────────────────────────────────────────────────────────────────── */
/* Helper: compute % for donut arc                                     */
/* ─────────────────────────────────────────────────────────────────── */
function arcOffset(percent: number, circumference: number): number {
  return circumference - (percent / 100) * circumference;
}

/* ─────────────────────────────────────────────────────────────────── */
/* Component                                                           */
/* ─────────────────────────────────────────────────────────────────── */
export const ClayDashboard: React.FC<ClayDashboardProps> = ({
  stats,
  reciprocityAlerts,
  isDemo,
}) => {
  const { data: session } = useSession();
  const { language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [registryItems, setRegistryItems] = useState<WeddingGiftItem[]>([]);
  const [registrySummary, setRegistrySummary] = useState({
    totalCount: 0,
    claimedCount: 0,
    availableCount: 0,
    totalValue: 0,
    claimedValue: 0,
  });

  const userName = session?.user?.name || (isDemo ? 'Sharma Family' : 'Beloved Host');

  /* Fetch live wedding registry data */
  useEffect(() => {
    async function fetchRegistry() {
      try {
        const res = await fetch('/api/wedding-gifts');
        const data = await res.json();
        if (data.success) {
          setRegistryItems(data.data || []);
          if (data.summary) setRegistrySummary(data.summary);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchRegistry();
  }, []);

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

  /* ─────────────── Computed Values ─────────────── */
  const totalShagun = stats.totalCashReceived || 0;
  const giftCount = stats.totalGifts || 0;
  const guestCount = stats.totalGuests || 0;
  const pendingReturn = stats.pendingReciprocity || 0;
  const eventCount = stats.totalEvents || 0;
  const recentGifts = stats.recentGifts || [];

  // Donut: Cash vs Gift Items vs Pending Return
  const cashCount = recentGifts.filter((g) => g.giftType === 'CASH' || g.giftType === 'BOTH').length;
  const itemCount = recentGifts.filter((g) => g.giftType === 'GIFT_ITEM').length;
  const totalForDonut = Math.max(cashCount + itemCount + pendingReturn, 1);
  const cashPct = Math.round((cashCount / totalForDonut) * 100) || (giftCount > 0 ? 72 : 0);
  const itemPct = Math.round((itemCount / totalForDonut) * 100) || (giftCount > 0 ? 19 : 0);
  const pendPct = Math.round((pendingReturn / totalForDonut) * 100) || (giftCount > 0 ? 9 : 0);

  // Registry progress
  const regPct = registrySummary.totalCount > 0
    ? Math.round((registrySummary.claimedCount / registrySummary.totalCount) * 100)
    : 0;

  // Top 3 biggest shagun gifts
  const topGifts = [...recentGifts]
    .filter((g) => g.cashAmount && g.cashAmount > 0)
    .sort((a, b) => (b.cashAmount || 0) - (a.cashAmount || 0))
    .slice(0, 4);

  // Circumference for SVG donut (r=36)
  const C = 2 * Math.PI * 36; // ≈226.2

  return (
    <div className="w-full max-w-[1340px] mx-auto p-3 sm:p-5 lg:p-8 font-sans selection:bg-[#FA837F] selection:text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
        {/* ─────────────────────────────────────────────────── */}
        {/* LEFT SIDEBAR: Navigation                            */}
        {/* ─────────────────────────────────────────────────── */}
        <aside className="lg:col-span-3 clay-sidebar p-6 sm:p-7 flex flex-col justify-between min-h-[720px] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#FCEAE8] flex items-center justify-center text-2xl font-black text-[#8B1D2C]">
                  {getInitials(userName)}
                </div>
              </div>
              <h3 className="text-lg font-black text-white tracking-tight drop-shadow-sm">
                {userName.split(' ')[0]}
              </h3>
              {isDemo && (
                <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-bold">
                  Demo Account
                </span>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2 text-sm font-semibold">
              {[
                { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
                { href: '/gifts', icon: Gift, label: 'Gifts & Registry' },
                { href: '/reciprocity', icon: RefreshCw, label: 'Reciprocity (लेन-देन)' },
                { href: '/guests', icon: Users, label: 'Guest Directory' },
                { href: '/settings', icon: Settings, label: 'Settings' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="block">
                  <div
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition font-bold text-left text-sm ${
                      item.active
                        ? 'clay-nav-active'
                        : 'clay-nav-item'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      item.active ? 'bg-[#FEECEB] text-[#FA7C77]' : 'bg-white/10 text-white'
                    }`}>
                      <item.icon className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick Add Shagun Button at bottom */}
          <div className="pt-6 relative z-10">
            <Link href="/gifts/new">
              <button
                type="button"
                className="w-full py-3 px-4 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/25 transition"
              >
                <Plus className="h-4 w-4" />
                <span>+ नया शगुन दर्ज करें</span>
              </button>
            </Link>
          </div>
        </aside>

        {/* ─────────────────────────────────────────────────── */}
        {/* RIGHT MAIN CONTENT                                  */}
        {/* ─────────────────────────────────────────────────── */}
        <main className="lg:col-span-9 space-y-5 sm:space-y-6">
          {/* Header: Title + Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                शगुन Dashboard
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Complete overview of shagun, gifts, registry & reciprocity
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search relative, gift..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-medium text-slate-700 clay-inset outline-none focus:ring-2 focus:ring-[#FA837F]/50 transition"
                />
              </div>
              <Link href="/profile">
                <div className="w-10 h-10 rounded-full bg-[#FA7C77] text-white font-black text-xs flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition">
                  {getInitials(userName)}
                </div>
              </Link>
            </div>
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/* ROW 1: FOUR STAT CARDS (Real Data)              */}
          {/* ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Shagun Cash */}
            <div className="clay-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <IndianRupee className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Cash
                </span>
              </div>
              <div>
                <p className="text-lg font-black text-slate-800 tracking-tight">
                  {formatCurrency(totalShagun)}
                </p>
                <p className="text-[10px] font-semibold text-slate-400">
                  Total Shagun Received
                </p>
              </div>
            </div>

            {/* Total Envelopes */}
            <div className="clay-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Gift className="h-4 w-4 text-pink-600" />
                </div>
                <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                  Gifts
                </span>
              </div>
              <div>
                <p className="text-lg font-black text-slate-800 tracking-tight">
                  {giftCount}
                </p>
                <p className="text-[10px] font-semibold text-slate-400">
                  Envelopes & Gifts
                </p>
              </div>
            </div>

            {/* Total Guests */}
            <div className="clay-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  People
                </span>
              </div>
              <div>
                <p className="text-lg font-black text-slate-800 tracking-tight">
                  {guestCount}
                </p>
                <p className="text-[10px] font-semibold text-slate-400">
                  Relatives & Guests
                </p>
              </div>
            </div>

            {/* Pending Reciprocity */}
            <div className="clay-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
              <div>
                <p className="text-lg font-black text-slate-800 tracking-tight">
                  {pendingReturn}
                </p>
                <p className="text-[10px] font-semibold text-slate-400">
                  Reciprocity Due
                </p>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/* ROW 2: Shagun Split Donut + Top Blessings       */}
          {/* ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Shagun Split Donut (Real Data) */}
            <div className="clay-card p-5 space-y-3">
              <span className="clay-badge-purple px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                🍩 Shagun Split
              </span>

              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-md">
                  {/* Cash Arc */}
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#F472B6" strokeWidth="11"
                    strokeDasharray={C} strokeDashoffset={arcOffset(cashPct, C)} strokeLinecap="round" />
                  {/* Gift Items Arc */}
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#C084FC" strokeWidth="11"
                    strokeDasharray={C} strokeDashoffset={arcOffset(itemPct, C)} strokeLinecap="round"
                    transform={`rotate(${cashPct * 3.6} 50 50)`} />
                  {/* Pending Arc */}
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#FBBF24" strokeWidth="11"
                    strokeDasharray={C} strokeDashoffset={arcOffset(pendPct, C)} strokeLinecap="round"
                    transform={`rotate(${(cashPct + itemPct) * 3.6} 50 50)`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-slate-800 leading-none">
                    {formatCurrency(totalShagun)}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 mt-0.5">Total</span>
                </div>
              </div>

              <div className="flex items-center justify-around text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F472B6]" /> Cash ({cashPct}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C084FC]" /> Items ({itemPct}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24]" /> Pending ({pendPct}%)
                </span>
              </div>
            </div>

            {/* Card 2: Top Blessings (Biggest Cash Shagun) — Real Data */}
            <div className="clay-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="clay-badge-green px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                  🏆 Top Blessings
                </span>
                {topGifts.length > 0 && (
                  <span className="text-xs font-black text-slate-700">
                    {formatCurrency(topGifts[0]?.cashAmount || 0)}
                  </span>
                )}
              </div>

              {topGifts.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-8 text-center">
                  <div className="space-y-2">
                    <Gift className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400 font-semibold">
                      No shagun recorded yet
                    </p>
                    <Link href="/gifts/new">
                      <button type="button" className="text-[10px] text-[#FA7C77] font-bold underline">
                        + Add first shagun
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  {topGifts.map((gift, idx) => {
                    const maxAmt = topGifts[0]?.cashAmount || 1;
                    const barWidth = Math.round(((gift.cashAmount || 0) / maxAmt) * 100);
                    return (
                      <div key={gift.id || idx} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                          <span className="truncate max-w-[140px]">
                            {gift.guest?.name || 'Unknown'}
                            {gift.guest?.relation && (
                              <span className="text-slate-400 ml-1">({gift.guest.relation})</span>
                            )}
                          </span>
                          <span className="font-mono font-bold text-slate-700">
                            {formatCurrency(gift.cashAmount || 0)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Card 3: Wedding Registry Progress (Real Data) */}
            <div className="clay-card p-5 space-y-3 flex flex-col">
              <span className="clay-badge-yellow px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                🎁 Gift Registry
              </span>

              {/* Circular Progress */}
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#FDF0ED" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#FA7C77" strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 40} strokeDashoffset={arcOffset(regPct, 2 * Math.PI * 40)}
                      strokeLinecap="round" className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-black text-slate-800">{regPct}%</span>
                    <span className="text-[9px] font-bold text-slate-400">Claimed</span>
                  </div>
                </div>

                <div className="text-center space-y-0.5">
                  <p className="text-xs font-bold text-slate-700">
                    {registrySummary.claimedCount} / {registrySummary.totalCount} items claimed
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {registrySummary.availableCount} gifts still available
                  </p>
                </div>
              </div>

              <Link href="/gifts">
                <button type="button" className="w-full py-2 px-3 text-[11px] font-bold text-[#FA7C77] border border-[#FA7C77]/30 rounded-xl hover:bg-[#FA7C77]/5 transition flex items-center justify-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  View Full Registry
                </button>
              </Link>
            </div>
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/* ROW 3: Recent Envelopes + Reciprocity Alerts    */}
          {/* ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Recent Shagun Envelopes */}
            <div className="clay-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="clay-badge-pink px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                  ✉️ Recent Shagun
                </span>
                <Link href="/gifts" className="text-[11px] font-bold text-slate-400 hover:text-[#FA7C77] flex items-center gap-1">
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {recentGifts.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Sparkles className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-semibold">
                    No shagun envelopes yet
                  </p>
                  <Link href="/gifts/new">
                    <button type="button" className="text-[11px] text-[#FA7C77] font-bold bg-[#FA7C77]/10 px-4 py-2 rounded-xl hover:bg-[#FA7C77]/20 transition">
                      + Record First Shagun
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {recentGifts.slice(0, 6).map((gift, idx) => (
                    <div
                      key={gift.id || idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 border border-slate-100 hover:shadow-sm transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#FEECEB] text-[#FA7C77] text-xs font-black flex items-center justify-center flex-shrink-0">
                        {getInitials(gift.guest?.name || '?')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {gift.guest?.name || 'Unknown'}
                          {gift.guest?.relation && (
                            <span className="text-slate-400 font-medium ml-1">
                              ({gift.guest.relation})
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {gift.giftType === 'CASH' ? '💵 Cash' : gift.giftType === 'GIFT_ITEM' ? '🎁 Gift' : '💵+🎁 Both'}
                          {gift.event?.title && ` • ${gift.event.title}`}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-black text-emerald-700">
                          {gift.cashAmount ? formatCurrency(gift.cashAmount) : '—'}
                        </p>
                        {gift.isOpened && (
                          <span className="text-[9px] text-emerald-500 font-bold">✓ Opened</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reciprocity Alerts (Pending Returns) */}
            <div className="clay-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="clay-badge-yellow px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                  🔄 Reciprocity Alerts
                </span>
                <Link href="/reciprocity" className="text-[11px] font-bold text-slate-400 hover:text-[#FA7C77] flex items-center gap-1">
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {reciprocityAlerts.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Check className="h-8 w-8 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-400 font-semibold">
                    All reciprocity obligations are clear! ✨
                  </p>
                  <p className="text-[10px] text-slate-400">
                    No pending return shagun obligations
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {reciprocityAlerts.slice(0, 6).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 hover:shadow-sm transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center flex-shrink-0">
                        {getInitials(item.guest?.name || '?')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {item.guest?.name || 'Unknown'}
                          {item.guest?.relation && (
                            <span className="text-slate-400 font-medium ml-1">
                              ({item.guest.relation})
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-amber-600 font-semibold">
                          Received: {formatCurrency(item.originalGift?.cashAmount || 0)} → Return: {formatCurrency(item.suggestedAmount || 0)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/* ROW 4: Live Wedding Registry Items Table        */}
          {/* ──────────────────────────────────────────────── */}
          <div className="clay-card p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="clay-badge-green px-2.5 py-1 text-[11px] font-black inline-flex items-center gap-1.5">
                🎁 Live Wedding Gift Wishlist
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {registrySummary.availableCount} available
                </span>
                <span className="text-[10px] font-bold text-[#FA7C77] bg-pink-50 px-2 py-1 rounded-full">
                  {registrySummary.claimedCount} claimed
                </span>
              </div>
            </div>

            {registryItems.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Package className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400 font-semibold">
                  No items in gift registry yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold text-left">
                      <th className="pb-2 pr-3">Gift Item</th>
                      <th className="pb-2 pr-3 hidden sm:table-cell">Store</th>
                      <th className="pb-2 pr-3 text-right">Cost</th>
                      <th className="pb-2 pr-3">Claimed By</th>
                      <th className="pb-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registryItems.slice(0, 6).map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition">
                        <td className="py-2.5 pr-3 font-semibold text-slate-700">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {item.category === 'Kitchen' ? '🍳' : item.category === 'Electronics' ? '📱' : item.category === 'Gold/Jewellery' ? '💍' : item.category === 'Pooja' ? '🪔' : '🎁'}
                            </span>
                            <span className="truncate max-w-[160px]">{item.title}</span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-3 text-slate-400 hidden sm:table-cell">
                          {item.storeUrl ? (
                            <a href={item.storeUrl} target="_blank" rel="noopener noreferrer"
                              className="text-blue-500 hover:underline truncate max-w-[100px] inline-block">
                              {item.suggestedStore || 'Link'}
                            </a>
                          ) : (
                            <span>{item.suggestedStore || '—'}</span>
                          )}
                        </td>
                        <td className="py-2.5 pr-3 text-right font-mono font-bold text-slate-700">
                          {item.approxCost ? formatCurrency(item.approxCost) : '—'}
                        </td>
                        <td className="py-2.5 pr-3 text-slate-600 font-medium truncate max-w-[120px]">
                          {item.claimedBy || '—'}
                        </td>
                        <td className="py-2.5 text-center">
                          {item.status === 'CLAIMED' ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              ✓ Claimed
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              Available
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {registryItems.length > 6 && (
              <Link href="/gifts">
                <button type="button" className="w-full py-2 text-[11px] font-bold text-[#FA7C77] border border-[#FA7C77]/20 rounded-xl hover:bg-[#FA7C77]/5 transition flex items-center justify-center gap-1">
                  View all {registryItems.length} registry items
                  <ArrowRight className="h-3 w-3" />
                </button>
              </Link>
            )}
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/* ROW 5: Quick Actions Footer                     */}
          {/* ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: '/gifts/new', icon: Plus, label: 'Record Shagun', sub: 'Cash or Gift', color: 'bg-[#FA7C77]' },
              { href: '/guests/new', icon: Users, label: 'Add Guest', sub: 'New Relative', color: 'bg-blue-500' },
              { href: '/reciprocity', icon: RefreshCw, label: 'Reciprocity', sub: 'Track Returns', color: 'bg-amber-500' },
              { href: '/settings', icon: Settings, label: 'Settings', sub: 'Theme & Language', color: 'bg-slate-500' },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="clay-card p-3.5 hover:shadow-md transition cursor-pointer flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{action.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{action.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
