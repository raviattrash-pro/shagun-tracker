'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentGifts } from '@/components/dashboard/RecentGifts';
import { ReciprocityAlerts } from '@/components/dashboard/ReciprocityAlerts';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { EnvelopeGrid } from '@/components/envelope/EnvelopeGrid';
import { GiftData, ReciprocityData } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Mail } from 'lucide-react';
import { VoiceSearchBar } from '@/components/voice/VoiceSearchBar';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DashboardPage() {
  const { t, language } = useLanguage();
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
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Ambient Glows (Wix Studio Fintech Style) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-7xl">
        {/* Demo Mode Notice if viewing demo data */}
        {isDemo && (
          <div className="flex items-center justify-between rounded-2xl bg-amber-500/10 border border-amber-400/40 p-3 px-4 text-xs font-semibold text-amber-200">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>Viewing Sample Demo Ledger (Sharma Family). Log in to access your personal blank ledger.</span>
            </span>
            <Link href="/login" className="text-[#4EECD3] hover:underline font-bold">
              Sign In →
            </Link>
          </div>
        )}

        {/* Top Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#1E2638]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-sans font-bold text-white">
                {t('dashboardTitle')} <span className="text-[#4EECD3] font-sans text-xl">{t('dashboardHindiSubtitle')}</span>
              </h1>
              <Sparkles className="h-5 w-5 text-[#E6CA65] animate-spin" />
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {t('dashboardSubtitle')}
            </p>
          </div>
        </div>

        {/* New User Clean Slate Onboarding (when user has 0 events and 0 guests) */}
        {!loading && !isDemo && stats.totalEvents === 0 && stats.totalGuests === 0 ? (
          <div className="rounded-3xl border border-[#1E2638] bg-[#0F1523] p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="max-w-xl mx-auto space-y-3">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4EECD3] text-white flex items-center justify-center mx-auto text-3xl shadow-xl shadow-blue-600/30">
                💍
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white">
                Welcome to Your Private Wedding Ledger!
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your account is ready with a clean slate. Sample demo data has been excluded so all records belong exclusively to your family wedding.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left pt-2">
              <div className="p-5 rounded-2xl bg-[#131B2E] border border-[#1E2638] space-y-2">
                <span className="text-xs font-bold text-[#4EECD3]">STEP 1</span>
                <h4 className="text-sm font-bold text-white">Create Wedding Event</h4>
                <p className="text-xs text-slate-400">Add ceremony (e.g. Wedding, Reception, Haldi)</p>
                <Link href="/events/new">
                  <button className="mt-2 text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>+ Add Ceremony</span>
                    <span>→</span>
                  </button>
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-[#131B2E] border border-[#1E2638] space-y-2">
                <span className="text-xs font-bold text-[#E6CA65]">STEP 2</span>
                <h4 className="text-sm font-bold text-white">Add Relatives</h4>
                <p className="text-xs text-slate-400">Log family guests & relations (चाचा, मामा, मौसी)</p>
                <Link href="/guests/new">
                  <button className="mt-2 text-xs font-bold text-[#E6CA65] hover:underline flex items-center gap-1">
                    <span>+ Add Relative</span>
                    <span>→</span>
                  </button>
                </Link>
              </div>

              <div className="p-5 rounded-2xl bg-[#131B2E] border border-[#1E2638] space-y-2">
                <span className="text-xs font-bold text-emerald-400">STEP 3</span>
                <h4 className="text-sm font-bold text-white">Record Shagun</h4>
                <p className="text-xs text-slate-400">Speak in Hindi or choose 3D wax-sealed envelopes</p>
                <Link href="/gifts/new">
                  <button className="mt-2 text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                    <span>+ Record Gift</span>
                    <span>→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Action Buttons (Add Gift with Voice, Add Guest, New Event, Export) */}
            <QuickActions />

            {/* Primary Key Metrics */}
            <StatsCards
              totalCash={stats.totalCashReceived}
              totalGifts={stats.totalGifts}
              totalGuests={stats.totalGuests}
              pendingReciprocity={stats.pendingReciprocity}
            />

            {/* Main Content Tabs: Interactive Envelope Wall vs List vs Reciprocity */}
            <Tabs defaultValue="envelopes" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2 rounded-2xl p-1 bg-muted/60">
                <TabsTrigger value="envelopes" className="gap-2 rounded-xl font-bold">
                  <Mail className="h-4 w-4" />
                  <span>{t('interactiveEnvelopesTab')} ({stats.recentGifts.length})</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-xl font-bold">
                  {t('recentActivityTab')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="envelopes" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground">
                    {t('unsealPrompt')}
                  </h3>
                </div>

                {/* Audio Search for Relative */}
                <VoiceSearchBar
                  value={relativeSearch}
                  onChange={setRelativeSearch}
                  placeholder={t('searchRelativeAudio')}
                  resultCount={filteredEnvelopes.length}
                  resultLabel="envelopes"
                />

                <EnvelopeGrid gifts={filteredEnvelopes} />
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RecentGifts gifts={stats.recentGifts} />
                  <ReciprocityAlerts items={reciprocityAlerts} />
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
