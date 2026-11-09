'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { GiftData } from '@/types';
import { EnvelopeGrid } from '@/components/envelope/EnvelopeGrid';
import { GiftCard } from '@/components/gift/GiftCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Grid, List, Download, Users, BookOpen } from 'lucide-react';
import { VoiceSearchBar } from '@/components/voice/VoiceSearchBar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';

export default function GiftsPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [gifts, setGifts] = useState<GiftData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const isTraditional = theme === 'traditional';

  useEffect(() => {
    async function loadGifts() {
      try {
        const res = await fetch('/api/gifts');
        const data = await res.json();
        if (data.success) {
          setGifts(data.data || []);
        }
      } catch (err) {
        console.error(err);
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
            <span>🏠 बही-खाता (Dashboard)</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-stone-900 dark:text-white">शगुन व लिफाफे (Envelopes)</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200 dark:border-[#1E2638]">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#8B1D2C] dark:text-white">
              शगुन लिफाफे व उपहार रजिस्टर <span className="font-sans text-base text-stone-500 font-normal">({filteredGifts.length})</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-600 dark:text-slate-400 mt-0.5">
              मेहमानों द्वारा भेंट किए गए 3D लिफाफे (Amplify Wood / Classic Wax Seal) व उपहार
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs rounded-xl">
                बही-खाता
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
                <span>+ नया शगुन</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Relative Audio & Text Search Bar */}
        <VoiceSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="बोलकर खोजें या नाम/रिश्ता लिखें (उदा. मामाजी, चाचाजी, प्रिया मौसी)..."
          resultCount={filteredGifts.length}
          resultLabel="लिफाफे"
        />

        {/* Tabs View */}
        <Tabs defaultValue="envelopes" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-stone-100 p-1 border">
              <TabsTrigger value="envelopes" className="gap-2 text-xs font-bold">
                <Grid className="h-4 w-4" />
                <span>3D लिफाफे (Interactive Envelopes)</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2 text-xs font-bold">
                <List className="h-4 w-4" />
                <span>सूची (List View)</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="envelopes">
            {loading ? (
              <div className="text-center py-16 text-stone-400">लिफाफे लोड हो रहे हैं...</div>
            ) : filteredGifts.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-stone-200 rounded-3xl bg-white text-stone-500 space-y-3">
                <p className="text-base font-serif font-bold text-stone-800">कोई लिफाफा नहीं मिला</p>
                <p className="text-xs">रिश्तेदार का नाम खोजें या नया शगुन दर्ज करें</p>
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                  खोज साफ़ करें
                </Button>
              </div>
            ) : (
              <EnvelopeGrid gifts={filteredGifts} />
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-3">
            {loading ? (
              <div className="text-center py-16 text-stone-400">सूची लोड हो रही है...</div>
            ) : filteredGifts.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-white text-stone-500">
                कोई प्रविष्टि नहीं मिली।
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
