'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { GiftData } from '@/types';
import { EnvelopeGrid } from '@/components/envelope/EnvelopeGrid';
import { CoverflowEnvelopeGallery } from '@/components/envelope/CoverflowEnvelopeGallery';
import { GiftCard } from '@/components/gift/GiftCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Grid, List, Download, Sparkles, Layers } from 'lucide-react';
import { VoiceSearchBar } from '@/components/voice/VoiceSearchBar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { saveOfflineCache, getOfflineCache, useOnlineStatus } from '@/lib/offline/offlineStorage';
import { cn } from '@/utils/cn';

export default function GiftsPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isOnline = useOnlineStatus();
  const [gifts, setGifts] = useState<GiftData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [envelopeView, setEnvelopeView] = useState<'coverflow' | 'grid'>('coverflow');

  const isTraditional = theme === 'traditional';
  const isHi = language === 'hi';

  useEffect(() => {
    async function loadGifts() {
      try {
        const res = await fetch('/api/gifts');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setGifts(data.data);
          saveOfflineCache('GIFTS', data.data);
        } else {
          // Fallback to offline cache
          const cached = getOfflineCache<GiftData[]>('GIFTS');
          if (cached && Array.isArray(cached)) {
            setGifts(cached);
          }
        }
      } catch (err) {
        console.warn('Network error fetching gifts, falling back to offline cache:', err);
        const cached = getOfflineCache<GiftData[]>('GIFTS');
        if (cached && Array.isArray(cached)) {
          setGifts(cached);
        }
      } finally {
        setLoading(false);
      }
    }
    loadGifts();
  }, []);

  // Filter gifts by relative name, relation, city, or gift description
  const filteredGifts = useMemo(() => {
    if (!searchQuery.trim()) return gifts;
    const query = searchQuery.toLowerCase().trim();

    return gifts.filter((gift) => {
      const guestName = gift.guest?.name?.toLowerCase() || '';
      const relation = gift.guest?.relation?.toLowerCase() || '';
      const city = gift.guest?.city?.toLowerCase() || '';
      const eventTitle = gift.event?.title?.toLowerCase() || '';
      const description = gift.giftDescription?.toLowerCase() || '';
      const amountStr = String(gift.cashAmount || '');

      return (
        guestName.includes(query) ||
        relation.includes(query) ||
        city.includes(query) ||
        eventTitle.includes(query) ||
        description.includes(query) ||
        amountStr.includes(query)
      );
    });
  }, [gifts, searchQuery]);

  const handleGiftUpdated = (updatedGift: GiftData) => {
    setGifts((prev) =>
      prev.map((g) => (g.id === updatedGift.id ? { ...g, ...updatedGift } : g))
    );
  };

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-300 font-sans',
        isTraditional
          ? 'bg-[#FDFCF7] text-stone-900'
          : theme === 'clay'
          ? 'bg-[#FBF0EE] text-slate-800'
          : theme === 'dark'
          ? 'bg-[#0B0F19] text-white'
          : 'bg-[#E8EDF5] text-slate-800'
      )}
    >
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        {/* Top breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
          <Link href="/dashboard" className="hover:underline font-semibold flex items-center gap-1 text-[#8B1D2C] dark:text-[#2563EB]">
            <span>{isHi ? '🏠 बही-खाता' : '🏠 Dashboard'}</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-stone-900 dark:text-white">
            {isHi ? 'शगुन व लिफाफे' : 'Shagun & Envelopes'}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200 dark:border-[#1E2638]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-serif font-black text-[#8B1D2C] dark:text-white">
                {isHi ? 'शगुन लिफाफे व उपहार रजिस्टर' : 'Shagun Envelopes & Gift Register'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1D2C]/10 text-[#8B1D2C] dark:bg-amber-400/20 dark:text-amber-300 border border-[#8B1D2C]/20">
                {filteredGifts.length} {isHi ? 'लिफाफे' : 'Envelopes'}
              </span>
            </div>
            <p className="text-xs md:text-sm text-stone-600 dark:text-slate-400 mt-1">
              {isHi
                ? 'मेहमानों द्वारा भेंट किए गए 3D लिफाफे (Motion 3D Odd-Lights Coverflow) व उपहार'
                : 'Interactive 3D cash envelopes & wedding gifts presented by guests'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs rounded-xl">
                {isHi ? 'बही-खाता' : 'Dashboard'}
              </Button>
            </Link>
            <a href="/api/export?format=excel" download>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 rounded-xl">
                <Download className="h-4 w-4 text-emerald-600" />
                <span>Excel</span>
              </Button>
            </a>
            <Link href="/gifts/new">
              <Button size="sm" className="bg-[#8B1D2C] hover:bg-[#731522] text-white text-xs gap-1.5 shadow-sm font-bold rounded-xl">
                <Plus className="h-4 w-4" />
                <span>{isHi ? '+ नया शगुन' : '+ Add Shagun'}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Relative Audio & Text Search Bar */}
        <VoiceSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={
            isHi
              ? 'बोलकर खोजें या नाम/रिश्ता लिखें (उदा. मामाजी, चाचाजी, प्रिया मौसी)...'
              : 'Search by voice or enter relative name/relation...'
          }
          resultCount={filteredGifts.length}
          resultLabel={isHi ? 'लिफाफे' : 'Envelopes'}
        />

        {/* Tabs View */}
        <Tabs defaultValue="envelopes" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TabsList className="bg-stone-100 dark:bg-stone-800 p-1 border">
              <TabsTrigger value="envelopes" className="gap-2 text-xs font-bold">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>{isHi ? '3D लिफाफे' : '3D Envelopes'}</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2 text-xs font-bold">
                <List className="h-4 w-4" />
                <span>{isHi ? 'सूची (List View)' : 'List View'}</span>
              </TabsTrigger>
            </TabsList>

            {/* Sub-view toggle for envelopes: 3D Coverflow vs Uniform Grid */}
            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setEnvelopeView('coverflow')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  envelopeView === 'coverflow'
                    ? 'bg-white dark:bg-[#1E334D] text-[#8B1D2C] dark:text-[#00E5FF] shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
                )}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>3D Coverflow</span>
              </button>
              <button
                type="button"
                onClick={() => setEnvelopeView('grid')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer',
                  envelopeView === 'grid'
                    ? 'bg-white dark:bg-[#1E334D] text-[#8B1D2C] dark:text-[#00E5FF] shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
                )}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>{isHi ? 'समान ग्रिड' : 'Uniform Grid'}</span>
              </button>
            </div>
          </div>

          <TabsContent value="envelopes">
            {loading ? (
              <div className="text-center py-20 text-stone-400">
                {isHi ? 'लिफाफे लोड हो रहे हैं...' : 'Loading envelopes...'}
              </div>
            ) : filteredGifts.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl bg-white dark:bg-stone-900 text-stone-500 space-y-3">
                <p className="text-base font-serif font-bold text-stone-800 dark:text-white">
                  {isHi ? 'कोई लिफाफा नहीं मिला' : 'No envelopes found'}
                </p>
                <p className="text-xs">
                  {isHi ? 'रिश्तेदार का नाम खोजें या नया शगुन दर्ज करें' : 'Search relative name or record a new shagun'}
                </p>
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                  {isHi ? 'खोज साफ़ करें' : 'Clear search'}
                </Button>
              </div>
            ) : envelopeView === 'coverflow' ? (
              <div className="rounded-3xl bg-gradient-to-b from-stone-100/60 to-white/40 dark:from-[#0F172A]/70 dark:to-[#0A0F1D]/80 border border-stone-200/80 dark:border-stone-800/80 p-2 sm:p-4 backdrop-blur-md">
                <CoverflowEnvelopeGallery
                  gifts={filteredGifts}
                  onGiftUpdated={handleGiftUpdated}
                />
              </div>
            ) : (
              <EnvelopeGrid gifts={filteredGifts} onOpenGift={handleGiftUpdated} />
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-3">
            {loading ? (
              <div className="text-center py-16 text-stone-400">
                {isHi ? 'सूची लोड हो रही है...' : 'Loading list...'}
              </div>
            ) : filteredGifts.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-white dark:bg-stone-900 text-stone-500">
                {isHi ? 'कोई प्रविष्टि नहीं मिली।' : 'No entries found.'}
              </div>
            ) : (
              filteredGifts.map((g) => <GiftCard key={g.id} gift={g} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
