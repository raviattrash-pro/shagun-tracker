'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentGifts } from '@/components/dashboard/RecentGifts';
import { ReciprocityAlerts } from '@/components/dashboard/ReciprocityAlerts';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { EnvelopeGrid } from '@/components/envelope/EnvelopeGrid';
import { ClayDashboard } from '@/components/dashboard/ClayDashboard';
import { TraditionalBahiKhata } from '@/components/dashboard/TraditionalBahiKhata';
import { GiftData, ReciprocityData } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Mail, Palette, BookOpen } from 'lucide-react';
import { VoiceSearchBar } from '@/components/voice/VoiceSearchBar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalGuests: 0,
    totalGifts: 0,
    totalCashReceived: 0,
    totalGiftItems: 0,
    pendingReciprocity: 0,
    recentGifts: [] as GiftData[],
  });
  const [reciprocityAlerts, setReciprocityAlerts] = useState<ReciprocityData[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relativeSearch, setRelativeSearch] = useState('');

  const filteredEnvelopes = stats.recentGifts.filter((gift) => {
    if (!relativeSearch.trim()) return true;
    const q = relativeSearch.toLowerCase().trim();
    const name = gift.guest?.name?.toLowerCase() || '';
    const relation = gift.guest?.relation?.toLowerCase() || '';
    const city = gift.guest?.city?.toLowerCase() || '';
    return name.includes(q) || relation.includes(q) || city.includes(q);
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashRes, recRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/reciprocity?status=PENDING'),
        ]);

        const dashData = await dashRes.json();
        const recData = await recRes.json();

        if (dashData.success) {
          setStats(dashData.data);
          setIsDemo(dashData.isDemo ?? false);
        }
        if (recRes.ok && recData.success) {
          setReciprocityAlerts(recData.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-300 font-sans',
        theme === 'traditional'
          ? 'bg-[#FDFCF7] text-stone-900'
          : theme === 'clay'
          ? 'bg-[#FBF0EE] text-slate-800'
          : theme === 'dark'
          ? 'bg-[#0B0F19] text-white'
          : 'bg-[#E8EDF5] text-slate-800'
      )}
    >
      {/* Demo Mode Notice (if in demo session) */}
      {isDemo && (
        <div className="max-w-7xl mx-auto px-4 pt-2.5 pb-1 flex items-center justify-end">
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
            <span>✨ {language === 'hi' ? 'डेमो खाता (शर्मा परिवार)' : 'Demo Mode (Sharma Family)'} • </span>
            <Link href="/login" className="underline font-bold text-[#8B1D2C] dark:text-[#4EECD3]">
              {language === 'hi' ? 'लॉगिन करें' : 'Sign In'}
            </Link>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TRADITIONAL BAHI-KHATA (Primary & Default View)            */}
      {/* (Live Wedding Gift List + Cash Ledger + Offline Notebook feel) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {theme === 'traditional' ? (
        <div className="py-4 sm:py-6">
          <TraditionalBahiKhata
            stats={stats}
            reciprocityAlerts={reciprocityAlerts}
            isDemo={isDemo}
          />
        </div>
      ) : theme === 'clay' ? (
        /* ───────────────────────────────────────────────────────────── */
        /* 2. CLAYMORPHISM 3D DASHBOARD                                  */
        /* ───────────────────────────────────────────────────────────── */
        <ClayDashboard
          stats={stats}
          reciprocityAlerts={reciprocityAlerts}
          isDemo={isDemo}
        />
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* 3. FINTECH DARK / NEOMORPHIC DASHBOARD                        */
        /* ───────────────────────────────────────────────────────────── */
        <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-7xl">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#1E2638]">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
                  {t('dashboardTitle')} <span className="text-[#4EECD3] font-sans text-xl">{t('dashboardHindiSubtitle')}</span>
                </h1>
                <Sparkles className="h-5 w-5 text-[#E6CA65] animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t('dashboardSubtitle')}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards
            totalCash={stats.totalCashReceived}
            totalGifts={stats.totalGifts}
            totalGuests={stats.totalGuests}
            pendingReciprocity={stats.pendingReciprocity}
          />

          {/* Quick Actions */}
          <QuickActions />

          {/* Tabs for Recent Gifts & Reciprocity */}
          <Tabs defaultValue="gifts" className="space-y-4">
            <TabsList className="bg-muted/50 p-1 border">
              <TabsTrigger value="gifts" className="gap-2">
                <Mail className="h-4 w-4" />
                <span>{t('gifts')}</span>
              </TabsTrigger>
              <TabsTrigger value="reciprocity" className="gap-2">
                <span>{t('reciprocity')}</span>
                {reciprocityAlerts.length > 0 && (
                  <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-black font-bold">
                    {reciprocityAlerts.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gifts" className="space-y-4">
              <RecentGifts gifts={stats.recentGifts} />
            </TabsContent>

            <TabsContent value="reciprocity" className="space-y-4">
              <ReciprocityAlerts items={reciprocityAlerts} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
