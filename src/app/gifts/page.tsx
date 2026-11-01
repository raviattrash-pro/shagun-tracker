'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { GiftData } from '@/types';
import { EnvelopeGrid } from '@/components/envelope/EnvelopeGrid';
import { GiftCard } from '@/components/gift/GiftCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Grid, List, Download, Users } from 'lucide-react';
import { VoiceSearchBar } from '@/components/voice/VoiceSearchBar';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function GiftsPage() {
  const { t, language } = useLanguage();
  const [gifts, setGifts] = useState<GiftData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        {/* Top breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-white font-semibold flex items-center gap-1 text-[#2563EB]">
            <span>🏠 Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-white font-medium">Shagun Registry</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1E2638]">
          <div>
            <h1 className="text-2xl md:text-3xl font-sans font-bold text-white">
              {t('giftRegistryTitle')} <span className="text-[#4EECD3] font-sans text-xl">{t('giftRegistryHindiSubtitle')}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              {t('giftRegistrySubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs rounded-xl bg-[#0F1523] border-[#1E2638] text-slate-300 hover:text-white">
                {t('dashboard')}
              </Button>
            </Link>
            <a href="/api/export?format=excel" download>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 rounded-xl bg-[#0F1523] border-[#1E2638] text-slate-300 hover:text-white">
                <Download className="h-4 w-4 text-[#4EECD3]" />
                <span>{t('exportExcel')}</span>
              </Button>
            </a>
            <Link href="/gifts/new">
              <Button size="sm" className="bg-[#2563EB] hover:bg-blue-600 text-white text-xs gap-1.5 shadow-lg shadow-blue-600/30 font-bold rounded-xl">
                <Plus className="h-4 w-4" />
                <span>{t('addShagun')}</span>
              </Button>
            </Link>
          </div>
        </div>

      {/* Relative Audio & Text Search Bar */}
      <VoiceSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search relative by voice or text (बोलकर ढूँढें या नाम/रिश्ता लिखें)..."
        resultCount={filteredGifts.length}
        resultLabel="envelopes"
      />

      {/* Tabs View */}
      <Tabs defaultValue="envelopes" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="envelopes" className="gap-2">
              <Grid className="h-4 w-4" />
              <span>Interactive Envelopes ({filteredGifts.length})</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              <span>Table / List View</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="envelopes">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading envelopes...</div>
          ) : filteredGifts.length === 0 ? (
            <div className="text-center py-16 border rounded-2xl bg-card text-muted-foreground space-y-3">
              <p className="text-base font-semibold">No relative found matching "{searchQuery}"</p>
              <p className="text-xs">Try searching by first name, relationship, or city</p>
              <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <EnvelopeGrid gifts={filteredGifts} />
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-3">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading gifts...</div>
          ) : filteredGifts.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-card text-muted-foreground">
              No matching records found.
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
