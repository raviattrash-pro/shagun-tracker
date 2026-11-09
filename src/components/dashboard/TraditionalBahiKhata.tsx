'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Gift,
  IndianRupee,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  UserCheck,
  User,
  Phone,
  FileText,
  Printer,
  Download,
  Filter,
  Sparkles,
  Store,
  Tag,
  Check,
  X,
  Mic,
} from 'lucide-react';
import { GiftData, ReciprocityData, WeddingGiftRegistryItem, WeddingGiftRegistrySummary } from '@/types';
import { formatCurrency, getInitials } from '@/utils/format';
import { AmplifyWoodEnvelope } from '@/components/envelope/AmplifyWoodEnvelope';
import confetti from 'canvas-confetti';
import { cn } from '@/utils/cn';

interface TraditionalBahiKhataProps {
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

export const TraditionalBahiKhata: React.FC<TraditionalBahiKhataProps> = ({
  stats,
  reciprocityAlerts,
  isDemo,
}) => {
  const router = useRouter();

  // Active Ledger Tab:
  // 'shagun' = Cash Shagun Ledger
  // 'registry' = Live Wedding Gift List (Wishlist)
  // 'physicalGifts' = Physical Gifts Received
  // 'reciprocity' = Return Shagun Ledger
  const [activeTab, setActiveTab] = useState<'shagun' | 'registry' | 'physicalGifts' | 'reciprocity'>('shagun');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [registryFilter, setRegistryFilter] = useState<'all' | 'available' | 'claimed'>('all');

  // Live Wedding Gift Registry State
  const [registryItems, setRegistryItems] = useState<WeddingGiftRegistryItem[]>([]);
  const [registrySummary, setRegistrySummary] = useState<WeddingGiftRegistrySummary>({
    totalCount: 0,
    claimedCount: 0,
    availableCount: 0,
    totalValue: 0,
    claimedValue: 0,
  });
  const [loadingRegistry, setLoadingRegistry] = useState(false);

  // Claim Gift Modal State
  const [claimingItem, setClaimingItem] = useState<WeddingGiftRegistryItem | null>(null);
  const [claimantName, setClaimantName] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // Add Item to Registry Modal State
  const [showAddRegistryModal, setShowAddRegistryModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Home');
  const [newItemStore, setNewItemStore] = useState('');
  const [newItemStoreUrl, setNewItemStoreUrl] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [submittingNewItem, setSubmittingNewItem] = useState(false);

  // Envelope Inspection Modal
  const [inspectingGift, setInspectingGift] = useState<GiftData | null>(null);

  // Fetch Live Wedding Gift Registry Items
  const loadRegistry = async () => {
    setLoadingRegistry(true);
    try {
      const res = await fetch('/api/wedding-gifts');
      const data = await res.json();
      if (data.success) {
        setRegistryItems(data.data || []);
        if (data.summary) {
          setRegistrySummary(data.summary);
        }
      }
    } catch (err) {
      console.error('Error loading registry:', err);
    } finally {
      setLoadingRegistry(false);
    }
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  // Filtered Cash Shagun gifts
  const cashGifts = useMemo(() => {
    return (stats.recentGifts || []).filter((g) => {
      const isCash = g.giftType === 'CASH' || g.giftType === 'BOTH';
      if (!isCash) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = g.guest?.name?.toLowerCase() || '';
      const rel = g.guest?.relation?.toLowerCase() || '';
      const city = g.guest?.city?.toLowerCase() || '';
      const amt = String(g.cashAmount || '');
      return name.includes(q) || rel.includes(q) || city.includes(q) || amt.includes(q);
    });
  }, [stats.recentGifts, searchQuery]);

  // Filtered Physical Gift Items received
  const physicalGifts = useMemo(() => {
    return (stats.recentGifts || []).filter((g) => {
      const isItem = g.giftType === 'GIFT_ITEM' || g.giftType === 'BOTH';
      if (!isItem) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = g.guest?.name?.toLowerCase() || '';
      const desc = g.giftDescription?.toLowerCase() || '';
      return name.includes(q) || desc.includes(q);
    });
  }, [stats.recentGifts, searchQuery]);

  // Filtered Registry Items
  const filteredRegistry = useMemo(() => {
    return registryItems.filter((item) => {
      if (registryFilter === 'available' && item.status !== 'AVAILABLE') return false;
      if (registryFilter === 'claimed' && item.status !== 'CLAIMED') return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const title = item.title.toLowerCase();
      const store = (item.suggestedStore || '').toLowerCase();
      const claimed = (item.claimedBy || '').toLowerCase();
      const category = (item.category || '').toLowerCase();
      return title.includes(q) || store.includes(q) || claimed.includes(q) || category.includes(q);
    });
  }, [registryItems, registryFilter, searchQuery]);

  // Handle Claiming a Gift Item
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingItem || !claimantName.trim()) return;

    setSubmittingClaim(true);
    try {
      const res = await fetch('/api/wedding-gifts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: claimingItem.id,
          action: 'claim',
          claimedBy: claimantName.trim(),
          claimedByPhone: claimantPhone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D4820A', '#8B1D2C', '#10B981', '#FFF8DC'],
          });
        } catch (e) {}

        setClaimingItem(null);
        setClaimantName('');
        setClaimantPhone('');
        await loadRegistry();
      } else {
        alert(data.error || 'Failed to claim gift');
      }
    } catch (err: any) {
      alert(err.message || 'Error claiming gift');
    } finally {
      setSubmittingClaim(false);
    }
  };

  // Handle Unclaiming a Gift Item
  const handleUnclaim = async (id: string, title: string) => {
    const confirmed = window.confirm(`क्या आप "${title}" से अपना नाम हटाना चाहते हैं ताकि कोई अन्य रिश्तेदार इसे उपहार में दे सके?`);
    if (!confirmed) return;

    try {
      const res = await fetch('/api/wedding-gifts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'unclaim' }),
      });
      const data = await res.json();
      if (data.success) {
        await loadRegistry();
      }
    } catch (e) {
      alert('Error updating item');
    }
  };

  // Handle Adding New Item to Registry
  const handleAddNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    setSubmittingNewItem(true);
    try {
      const res = await fetch('/api/wedding-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newItemTitle.trim(),
          category: newItemCategory.trim(),
          suggestedStore: newItemStore.trim() || undefined,
          storeUrl: newItemStoreUrl.trim() || undefined,
          approxCost: newItemCost ? Number(newItemCost) : undefined,
          notes: newItemNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddRegistryModal(false);
        setNewItemTitle('');
        setNewItemStore('');
        setNewItemStoreUrl('');
        setNewItemCost('');
        setNewItemNotes('');
        await loadRegistry();
      } else {
        alert(data.error || 'Failed to add gift item');
      }
    } catch (err: any) {
      alert(err.message || 'Error adding gift item');
    } finally {
      setSubmittingNewItem(false);
    }
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto p-3 sm:p-5 lg:p-7 font-sans text-stone-900 selection:bg-[#8B1D2C] selection:text-white">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TRADITIONAL BAHI-KHATA BOOK BINDER / REGISTER CARD            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-[28px] overflow-hidden border-2 border-[#8B1D2C]/30 bg-[#FDFCF7] shadow-[0_20px_45px_rgba(40,15,10,0.12),0_4px_12px_rgba(0,0,0,0.06)]">
        {/* Top Auspicious Red Cloth Spine Header (पारंपरिक लाल बही-खाता जिल्द) */}
        <header className="bg-gradient-to-r from-[#7A1522] via-[#8B1D2C] to-[#6A121E] text-amber-100 px-5 sm:px-8 py-5 border-b-2 border-amber-400/40 relative overflow-hidden">
          {/* Subtle Golden Zari Weave Watermark Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Traditional Invocation & Ledger Title */}
            <div className="text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 font-serif font-black text-xs sm:text-sm tracking-widest">
                <span>ॐ</span>
                <span>|| श्री गणेशाय नमः ||</span>
                <span>|| शुभ लाभ ||</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-50 tracking-wide drop-shadow-sm flex items-center justify-center md:justify-start gap-2">
                <span>शुभ विवाह बही-खाता (Shagun Register)</span>
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
                {isDemo ? 'शर्मा परिवार • आरव व दिया का शुभ विवाह (10-12 दिसंबर)' : 'पारंपरिक डिजिटल विवाह डायरी • शगुन, उपहार व लाइव विशलिस्ट'}
              </p>
            </div>

            {/* Right: Quick Ledger Actions */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <Link href="/gifts/new">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>+ नया शगुन दर्ज करें (Add Shagun)</span>
                </button>
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
                title="Print ledger register"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">प्रिंट बही-खाता (Print)</span>
              </button>

              <a
                href="/api/export?format=excel"
                download
                className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
                title="Download Excel register"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Excel</span>
              </a>
            </div>
          </div>

          {/* Quick Traditional Ledger Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 pt-4 border-t border-amber-300/20 text-center">
            <div className="p-2 sm:p-2.5 rounded-xl bg-black/20 border border-amber-300/20">
              <span className="text-[10px] uppercase font-bold text-amber-300/90 block">
                कुल नकद शगुन (Cash)
              </span>
              <span className="text-lg sm:text-xl font-serif font-black text-white">
                {formatCurrency(stats.totalCashReceived || 148500)}
              </span>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-black/20 border border-amber-300/20">
              <span className="text-[10px] uppercase font-bold text-amber-300/90 block">
                कुल लिफाफे (Envelopes)
              </span>
              <span className="text-lg sm:text-xl font-serif font-black text-white">
                {stats.totalGifts || cashGifts.length || 6}
              </span>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-black/20 border border-amber-300/20">
              <span className="text-[10px] uppercase font-bold text-amber-300/90 block">
                उपहार सूची बुक (Claimed)
              </span>
              <span className="text-lg sm:text-xl font-serif font-black text-amber-300">
                {registrySummary.claimedCount} / {registrySummary.totalCount}
              </span>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-black/20 border border-amber-300/20">
              <span className="text-[10px] uppercase font-bold text-amber-300/90 block">
                उपहार बाकी (Available)
              </span>
              <span className="text-lg sm:text-xl font-serif font-black text-emerald-300">
                {registrySummary.availableCount} बाकी हैं
              </span>
            </div>
          </div>
        </header>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* LEDGER TAB NAVIGATION (Authentic Traditional Register Tabs)  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="bg-[#F6F2E8] border-b border-[#8B1D2C]/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Tab 1: Cash Shagun */}
            <button
              type="button"
              onClick={() => setActiveTab('shagun')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 border',
                activeTab === 'shagun'
                  ? 'bg-[#8B1D2C] text-white border-[#8B1D2C] shadow-sm'
                  : 'bg-white/80 hover:bg-white text-stone-700 border-stone-300'
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span>1. नकद शगुन बही-खाता ({cashGifts.length})</span>
            </button>

            {/* Tab 2: Live Wedding Gift Registry */}
            <button
              type="button"
              onClick={() => setActiveTab('registry')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 border',
                activeTab === 'registry'
                  ? 'bg-[#8B1D2C] text-white border-[#8B1D2C] shadow-sm'
                  : 'bg-white/80 hover:bg-white text-stone-700 border-stone-300'
              )}
            >
              <Gift className="h-4 w-4" />
              <span>2. लाइव उपहार सूची (Gift Wishlist)</span>
              {registrySummary.availableCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-600 text-white font-black animate-pulse">
                  {registrySummary.availableCount} खुला है
                </span>
              )}
            </button>

            {/* Tab 3: Physical Gifts Received */}
            <button
              type="button"
              onClick={() => setActiveTab('physicalGifts')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 border',
                activeTab === 'physicalGifts'
                  ? 'bg-[#8B1D2C] text-white border-[#8B1D2C] shadow-sm'
                  : 'bg-white/80 hover:bg-white text-stone-700 border-stone-300'
              )}
            >
              <Tag className="h-4 w-4" />
              <span>3. प्राप्त उपहार सामान ({physicalGifts.length})</span>
            </button>

            {/* Tab 4: Reciprocity */}
            <button
              type="button"
              onClick={() => setActiveTab('reciprocity')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 border',
                activeTab === 'reciprocity'
                  ? 'bg-[#8B1D2C] text-white border-[#8B1D2C] shadow-sm'
                  : 'bg-white/80 hover:bg-white text-stone-700 border-stone-300'
              )}
            >
              <RefreshCw className="h-4 w-4" />
              <span>4. लेन-देन डायरी ({reciprocityAlerts.length})</span>
            </button>
          </div>

          {/* Search Box inside Register */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खोजें: नाम, रिश्ता, शहर..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#8B1D2C]"
            />
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MAIN NOTEBOOK PAPER CONTENT AREA (पारंपरिक सादा रजिस्टर)        */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="p-4 sm:p-6 lg:p-8 bg-[#FFFDF9] min-h-[520px]">
          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB 1: नकद शगुन बही-खाता (Traditional Cash Shagun Ledger) */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === 'shagun' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b-2 border-[#8B1D2C]/20">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#8B1D2C] flex items-center gap-2">
                    <span>📖 नकद शगुन प्रविष्टियां (Cash Shagun Entries)</span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    पारंपरिक बही-खाते के अनुसार रिश्तेदारों द्वारा दिए गए नकद लिफाफों का क्रमबद्ध विवरण
                  </p>
                </div>
                <div className="text-xs font-serif font-bold text-stone-600 bg-amber-100/70 px-3 py-1 rounded-lg border border-amber-300/50">
                  कुल योग: <span className="text-[#8B1D2C] text-sm">{formatCurrency(stats.totalCashReceived || 148500)}</span>
                </div>
              </div>

              {/* Ruled Notebook Ledger Table */}
              <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#F8F4EA] border-b border-stone-300 font-serif text-stone-800 text-[11px] sm:text-xs">
                      <th className="py-2.5 px-3 w-12 text-center">क्र.</th>
                      <th className="py-2.5 px-3">रिश्तेदार / मेहमान (Guest)</th>
                      <th className="py-2.5 px-3">रिश्ता / पक्ष</th>
                      <th className="py-2.5 px-3">शहर / निवास</th>
                      <th className="py-2.5 px-3 text-right">नकद शगुन (₹)</th>
                      <th className="py-2.5 px-3">नोटों का विवरण (Breakdown)</th>
                      <th className="py-2.5 px-3 text-center">लिफाफा</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-sans">
                    {cashGifts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          कोई नकद शगुन प्रविष्टि नहीं मिली। ऊपर "+ नया शगुन दर्ज करें" पर क्लिक करें।
                        </td>
                      </tr>
                    ) : (
                      cashGifts.map((gift, idx) => {
                        const guest = gift.guest;
                        const breakdown = gift.cashBreakdown as Record<string, number> | null;
                        return (
                          <tr
                            key={gift.id}
                            className="hover:bg-amber-50/50 transition-colors cursor-pointer"
                            onClick={() => setInspectingGift(gift)}
                          >
                            <td className="py-3 px-3 text-center font-serif text-stone-500">
                              {idx + 1}
                            </td>

                            {/* Guest Name */}
                            <td className="py-3 px-3 font-semibold text-stone-900">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#8B1D2C] text-white flex items-center justify-center font-serif text-xs font-bold flex-shrink-0">
                                  {getInitials(guest?.name || 'Guest')}
                                </div>
                                <span className="truncate">{guest?.name || 'अतिथि'}</span>
                              </div>
                            </td>

                            {/* Relation & Side */}
                            <td className="py-3 px-3 text-stone-600">
                              <span className="capitalize">{guest?.relation?.replace('_', ' ') || 'रिश्तेदार'}</span>
                              {guest?.side && (
                                <span className="text-[10px] text-stone-400 block">({guest.side.toLowerCase()})</span>
                              )}
                            </td>

                            {/* City */}
                            <td className="py-3 px-3 text-stone-600">
                              {guest?.city || '—'}
                            </td>

                            {/* Cash Amount */}
                            <td className="py-3 px-3 text-right font-serif font-black text-emerald-800 sm:text-base">
                              {formatCurrency(gift.cashAmount || 0)}
                            </td>

                            {/* Note Breakdown */}
                            <td className="py-3 px-3 text-[11px] text-stone-600">
                              {breakdown ? (
                                Object.entries(breakdown)
                                  .filter(([_, count]) => count > 0)
                                  .map(([denom, count]) => `${count}×₹${denom}`)
                                  .join(', ') || 'नकद राशि'
                              ) : (
                                <span className="text-stone-400">एकमुश्त नकद</span>
                              )}
                            </td>

                            {/* Envelope Peek Button */}
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectingGift(gift);
                                }}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition"
                              >
                                लिफाफा खोलें ✉️
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {cashGifts.length > 0 && (
                    <tfoot>
                      <tr className="bg-[#F8F4EA] font-serif font-black text-stone-900 border-t-2 border-stone-300">
                        <td colSpan={4} className="py-3 px-3 text-right">
                          कुल नकद शगुन योग (Grand Total):
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-900 text-base sm:text-lg">
                          {formatCurrency(
                            cashGifts.reduce((sum, g) => sum + (g.cashAmount || 0), 0)
                          )}
                        </td>
                        <td colSpan={2} className="py-3 px-3 text-stone-500 text-xs">
                          {cashGifts.length} लिफाफे दर्ज
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB 2: लाइव शादी उपहार सूची (Live Wedding Gift Registry)  */}
          {/* (POINT 3 REQUESTED BY USER)                              */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === 'registry' && (
            <div className="space-y-4">
              {/* Header & Description */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b-2 border-[#8B1D2C]/20">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#8B1D2C] flex items-center gap-2">
                    <span>🎁 लाइव शादी उपहार सूची (Live Wedding Gift Registry)</span>
                  </h2>
                  <p className="text-xs text-stone-600 max-w-2xl mt-0.5">
                    डिजिटल उपहार सूची ताकि हर मेहमान देख सके कि <strong>कौन क्या उपहार ला रहा है</strong> और <strong>कौन सा सामान अभी बाकी है</strong>।
                    इससे एक ही सामान (जैसे मिक्सर या आयरन) दोबारा नहीं आता!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddRegistryModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#8B1D2C] hover:bg-[#731522] text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 flex-shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ नया उपहार जोड़ें (Add Item)</span>
                </button>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-stone-600 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-[#8B1D2C]" />
                  फ़िल्टर:
                </span>
                <button
                  type="button"
                  onClick={() => setRegistryFilter('all')}
                  className={cn(
                    'px-3 py-1 rounded-full font-bold transition border',
                    registryFilter === 'all'
                      ? 'bg-[#8B1D2C] text-white border-[#8B1D2C]'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                  )}
                >
                  सभी उपहार ({registrySummary.totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setRegistryFilter('available')}
                  className={cn(
                    'px-3 py-1 rounded-full font-bold transition border flex items-center gap-1',
                    registryFilter === 'available'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  )}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>उपलब्ध हैं - कोई भी ला सकता है ({registrySummary.availableCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegistryFilter('claimed')}
                  className={cn(
                    'px-3 py-1 rounded-full font-bold transition border flex items-center gap-1',
                    registryFilter === 'claimed'
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  )}
                >
                  <Check className="h-3 w-3" />
                  <span>बुक हो चुके ({registrySummary.claimedCount})</span>
                </button>
              </div>

              {/* Live Registry Table (Exact columns requested by user) */}
              <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#F8F4EA] border-b border-stone-300 font-serif text-stone-800 text-[11px] sm:text-xs">
                      <th className="py-3 px-3 w-10 text-center">क्र.</th>
                      <th className="py-3 px-4">उपहार / वस्तु (Gift Item)</th>
                      <th className="py-3 px-3">कहाँ से खरीदें (Store)</th>
                      <th className="py-3 px-3 text-right">अनुमानित मूल्य (Approx Cost)</th>
                      <th className="py-3 px-3">कौन ला रहा है? (Who is bringing it?)</th>
                      <th className="py-3 px-3 text-center">स्थिति (Status)</th>
                      <th className="py-3 px-4">नोट्स / विवरण (Notes)</th>
                      <th className="py-3 px-3 text-center">कार्रवाई (Action)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-sans">
                    {loadingRegistry ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-stone-400">
                          उपहार सूची लोड हो रही है...
                        </td>
                      </tr>
                    ) : filteredRegistry.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-stone-400">
                          कोई उपहार नहीं मिला।
                        </td>
                      </tr>
                    ) : (
                      filteredRegistry.map((item, idx) => {
                        const isAvailable = item.status === 'AVAILABLE';
                        return (
                          <tr
                            key={item.id}
                            className={cn(
                              'transition-colors',
                              isAvailable ? 'hover:bg-emerald-50/40' : 'bg-stone-50/60'
                            )}
                          >
                            {/* Sr No */}
                            <td className="py-3.5 px-3 text-center font-serif text-stone-500">
                              {idx + 1}
                            </td>

                            {/* Gift Item Title & Category */}
                            <td className="py-3.5 px-4 font-bold text-stone-900">
                              <div className="space-y-0.5">
                                <span className="block text-sm sm:text-base text-stone-900">
                                  {item.title}
                                </span>
                                <span className="inline-block text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                                  {item.category}
                                </span>
                              </div>
                            </td>

                            {/* Suggested Store */}
                            <td className="py-3.5 px-3 text-stone-700">
                              {item.suggestedStore ? (
                                <div className="flex items-center gap-1.5">
                                  <Store className="h-3.5 w-3.5 text-stone-400 flex-shrink-0" />
                                  <span className="truncate max-w-[140px]">{item.suggestedStore}</span>
                                  {item.storeUrl && (
                                    <a
                                      href={item.storeUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-600 hover:text-blue-800"
                                      title="Open store link"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-stone-400">—</span>
                              )}
                            </td>

                            {/* Approx Cost */}
                            <td className="py-3.5 px-3 text-right font-serif font-black text-stone-900">
                              {item.approxCost ? formatCurrency(item.approxCost) : '—'}
                            </td>

                            {/* Who is bringing it? */}
                            <td className="py-3.5 px-3">
                              {item.claimedBy ? (
                                <div className="space-y-0.5">
                                  <span className="font-bold text-[#8B1D2C] flex items-center gap-1">
                                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>{item.claimedBy}</span>
                                  </span>
                                  {item.claimedByPhone && (
                                    <span className="text-[10px] text-stone-500 block">
                                      {item.claimedByPhone}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-md inline-flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  <span>अभी खुला है (Available)</span>
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-3 text-center">
                              {isAvailable ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  🟢 उपलब्ध (Open)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                  ✓ बुक हो चुका (Claimed)
                                </span>
                              )}
                            </td>

                            {/* Notes */}
                            <td className="py-3.5 px-4 text-xs text-stone-600 max-w-[200px]">
                              {item.notes || '—'}
                            </td>

                            {/* Live Action: Claim or Unclaim */}
                            <td className="py-3.5 px-3 text-center">
                              {isAvailable ? (
                                <button
                                  type="button"
                                  onClick={() => setClaimingItem(item)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1 mx-auto"
                                >
                                  <span>मैं लाऊँगा/गी</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleUnclaim(item.id, item.title)}
                                  className="text-[11px] font-semibold text-stone-400 hover:text-rose-600 underline"
                                  title="Release claim so others can bring"
                                >
                                  नाम हटाएं (Unclaim)
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB 3: प्राप्त उपहार (Physical Gifts Received)            */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === 'physicalGifts' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b-2 border-[#8B1D2C]/20">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#8B1D2C] flex items-center gap-2">
                    <span>🎁 प्राप्त सामान व वस्तुएं (Physical Gifts Received Log)</span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    विवाह में रिश्तेदारों द्वारा भेंट की गई वस्तुओं (चाँदी, इलेक्ट्रॉनिक्स, कपड़े आदि) का विवरण
                  </p>
                </div>
                <span className="text-xs font-serif font-bold text-stone-600 bg-amber-100/70 px-3 py-1 rounded-lg">
                  कुल वस्तुएं: {physicalGifts.length}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#F8F4EA] border-b border-stone-300 font-serif text-stone-800 text-[11px] sm:text-xs">
                      <th className="py-2.5 px-3 w-12 text-center">क्र.</th>
                      <th className="py-2.5 px-3">उपहार देने वाले (Given By)</th>
                      <th className="py-2.5 px-3">रिश्ता</th>
                      <th className="py-2.5 px-4">उपहार विवरण (Gift Description)</th>
                      <th className="py-2.5 px-3">समारोह (Event)</th>
                      <th className="py-2.5 px-3 text-center">दर्ज स्थिति</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-sans">
                    {physicalGifts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          कोई भौतिक उपहार दर्ज नहीं है।
                        </td>
                      </tr>
                    ) : (
                      physicalGifts.map((gift, idx) => (
                        <tr key={gift.id} className="hover:bg-amber-50/50 transition-colors">
                          <td className="py-3 px-3 text-center font-serif text-stone-500">{idx + 1}</td>
                          <td className="py-3 px-3 font-semibold text-stone-900">{gift.guest?.name || 'अतिथि'}</td>
                          <td className="py-3 px-3 text-stone-600 capitalize">{gift.guest?.relation?.replace('_', ' ') || 'रिश्तेदार'}</td>
                          <td className="py-3 px-4 font-bold text-[#8B1D2C]">{gift.giftDescription || 'उपहार सामग्री'}</td>
                          <td className="py-3 px-3 text-stone-600">{gift.event?.title || 'विवाह समारोह'}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="h-3 w-3" />
                              प्राप्त हुआ (Received)
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB 4: लेन-देन बही-खाता (Reciprocity Alerts)             */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === 'reciprocity' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b-2 border-[#8B1D2C]/20">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#8B1D2C] flex items-center gap-2">
                    <span>🔄 लेन-देन व वापसी शगुन रजिस्टर (Reciprocity Bahi-Khata)</span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    जब रिश्तेदारों के घर कोई समारोह हो, तो बही-खाते के अनुसार शुभ शगुन लौटाने की डायरी
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#F8F4EA] border-b border-stone-300 font-serif text-stone-800 text-[11px] sm:text-xs">
                      <th className="py-2.5 px-3 w-12 text-center">क्र.</th>
                      <th className="py-2.5 px-3">रिश्तेदार का नाम</th>
                      <th className="py-2.5 px-3">रिश्ता व शहर</th>
                      <th className="py-2.5 px-3 text-right">हमें प्राप्त शगुन (Received)</th>
                      <th className="py-2.5 px-3 text-right">सुझावित वापसी (Return +₹1)</th>
                      <th className="py-2.5 px-3 text-center">स्थिति (Status)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-sans">
                    {cashGifts.map((gift, idx) => {
                      const received = gift.cashAmount || 0;
                      const returnSuggested = received > 0 ? received + 1 : 0;
                      return (
                        <tr key={gift.id} className="hover:bg-amber-50/50 transition-colors">
                          <td className="py-3 px-3 text-center font-serif text-stone-500">{idx + 1}</td>
                          <td className="py-3 px-3 font-semibold text-stone-900">{gift.guest?.name || 'अतिथि'}</td>
                          <td className="py-3 px-3 text-stone-600">
                            {gift.guest?.relation?.replace('_', ' ')} {gift.guest?.city ? `(${gift.guest.city})` : ''}
                          </td>
                          <td className="py-3 px-3 text-right font-serif font-bold text-stone-800">
                            {formatCurrency(received)}
                          </td>
                          <td className="py-3 px-3 text-right font-serif font-black text-amber-900">
                            {formatCurrency(returnSuggested)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                              <Clock className="h-3 w-3" />
                              भविष्य में देय (Pending)
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: CLAIM A WEDDING GIFT (Guest claiming an item)        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {claimingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#8B1D2C] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-serif font-bold text-base text-[#8B1D2C] flex items-center gap-1.5">
                <span>🎁 यह उपहार बुक करें (Claim Gift)</span>
              </h3>
              <button
                type="button"
                onClick={() => setClaimingItem(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-stone-800 space-y-1">
              <span className="font-bold block text-sm text-[#8B1D2C]">{claimingItem.title}</span>
              <p className="text-stone-600">
                अनुमानित मूल्य: <strong>{claimingItem.approxCost ? formatCurrency(claimingItem.approxCost) : 'विवरण अनुसार'}</strong>
              </p>
              {claimingItem.suggestedStore && (
                <p className="text-stone-600">सुझावित स्टोर: {claimingItem.suggestedStore}</p>
              )}
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  आपका नाम व रिश्ता (Your Name & Relation) *
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="उदा. रमेश चाचाजी / प्रिया मौसी"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  मोबाइल नंबर (वैकल्पिक)
                </label>
                <input
                  type="tel"
                  value={claimantPhone}
                  onChange={(e) => setClaimantPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]"
                />
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                ✓ आपके द्वारा बुक करने के बाद यह उपहार सूची में &quot;बुक हो चुका&quot; दिखाई देगा ताकि कोई दूसरा मेहमान यही सामान न लाए।
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClaimingItem(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold hover:bg-stone-100"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md"
                >
                  {submittingClaim ? 'दर्ज हो रहा है...' : 'हाँ, मैं यह उपहार लाऊँगा/गी'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: ADD NEW ITEM TO LIVE WEDDING GIFT REGISTRY           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showAddRegistryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#8B1D2C] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-serif font-bold text-base text-[#8B1D2C] flex items-center gap-1.5">
                <span>+ उपहार सूची में नई वस्तु जोड़ें (Add to Wishlist)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRegistryModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  उपहार / वस्तु का नाम (Gift Title) *
                </label>
                <input
                  type="text"
                  required
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="उदा. Philips Air Fryer / Microwave / Silver Thali"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]"
                  >
                    <option value="Kitchen">Kitchen (रसोई)</option>
                    <option value="Electronics">Electronics (इलेक्ट्रॉनिक्स)</option>
                    <option value="Home">Home & Decor (घर व साज-सज्जा)</option>
                    <option value="Gold & Silver">Gold & Silver (सोना-चाँदी)</option>
                    <option value="Dining">Dining Set (डिनर सेट)</option>
                    <option value="Other">अन्य (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    अनुमानित मूल्य ₹ (Approx Cost)
                  </label>
                  <input
                    type="number"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    placeholder="उदा. 7500"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    सुझावित स्टोर (Suggested Store)
                  </label>
                  <input
                    type="text"
                    value={newItemStore}
                    onChange={(e) => setNewItemStore(e.target.value)}
                    placeholder="उदा. Amazon / Croma / Tanishq"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    स्टोर लिंक (Web URL)
                  </label>
                  <input
                    type="url"
                    value={newItemStoreUrl}
                    onChange={(e) => setNewItemStoreUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  विशेष विवरण / मॉडल / रंग (Notes)
                </label>
                <textarea
                  rows={2}
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="उदा. काला रंग, 4.1L क्षमता, मॉडल HD9252"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddRegistryModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold hover:bg-stone-100"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={submittingNewItem}
                  className="px-5 py-2 rounded-xl bg-[#8B1D2C] hover:bg-[#731522] text-white text-xs font-bold shadow-md"
                >
                  {submittingNewItem ? 'जोड़ा जा रहा है...' : 'सूची में जोड़ें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: ENVELOPE INSPECTION (Amplify Teak Wood Animation)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {inspectingGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="relative max-w-md w-full">
            <button
              type="button"
              onClick={() => setInspectingGift(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-300 p-1 font-bold text-sm flex items-center gap-1"
            >
              <span>बंद करें</span>
              <X className="h-5 w-5" />
            </button>
            <AmplifyWoodEnvelope gift={inspectingGift} headline="SHAGUN" />
          </div>
        </div>
      )}
    </div>
  );
};
