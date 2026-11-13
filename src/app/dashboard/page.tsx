'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentGifts } from '@/components/dashboard/RecentGifts';
import { ReciprocityAlerts } from '@/components/dashboard/ReciprocityAlerts';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ModernWeddingRegistry } from '@/components/dashboard/ModernWeddingRegistry';
import { CeremonyRegistryPulse } from '@/components/dashboard/CeremonyRegistryPulse';
import { GlassyStickyBoard } from '@/components/dashboard/GlassyStickyBoard';
import { GiftData, ReciprocityData } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  Gift,
  RefreshCw,
  Plus,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Calendar,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  Share2,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { formatCurrency, getInitials } from '@/utils/format';
import { TraditionalBahiKhata } from '@/components/dashboard/TraditionalBahiKhata';

export default function DashboardPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { data: session } = useSession();
  const isHi = language === 'hi';

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

  // View Mode: 'aether' | 'traditional'
  const [viewMode, setViewMode] = useState<'aether' | 'traditional'>('aether');

  // Modern View Sub-tab: 'overview' | 'registry'
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'registry'>('overview');

  const hostName = session?.user?.name || (isDemo ? 'Sharma Family' : 'Beloved Host');

  useEffect(() => {
    // Check if URL has tab=registry
    if (typeof window !== 'undefined' && window.location.search.includes('tab=registry')) {
      setActiveSubTab('registry');
    }

    async function loadDashboard(silent = false) {
      try {
        if (!silent) setLoading(true);
        const [dashRes, recRes] = await Promise.all([
          fetch('/api/dashboard', { cache: 'no-store' }),
          fetch('/api/reciprocity?status=PENDING', { cache: 'no-store' }),
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
        if (!silent) setLoading(false);
      }
    }

    loadDashboard();

    // Live Auto-Refresh: Refresh dashboard overview stats every 4s and on window focus
    const interval = setInterval(() => {
      loadDashboard(true);
    }, 4000);

    const onFocus = () => loadDashboard(true);
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onFocus);
    };
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? isHi ? 'शुभ प्रभात 🌅' : 'Good Morning 🌅'
      : currentHour < 17
      ? isHi ? 'शुभ दोपहर ☀️' : 'Good Afternoon ☀️'
      : isHi ? 'शुभ संध्या 🌙' : 'Good Evening 🌙';

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6 font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* AETHER HEADER: Title + Good Afternoon + Date/Action Bar       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isHi ? 'विवाह बही-खाता' : 'Shagun Tracker'}
          </h1>
          <p className="text-xs sm:text-sm font-semibold italic text-[#C0392B] dark:text-[#00E5FF] mt-0.5">
            {greeting}, {hostName}
          </p>
        </div>

        {/* Date & Traditional Mode Toggle */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
          <div className="flex items-center rounded-full bg-white/70 dark:bg-[#132238]/70 p-1 border border-white/80 dark:border-white/10 shadow-sm text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('aether')}
              className={`rounded-full px-2.5 sm:px-3 py-1 transition-all ${
                viewMode === 'aether'
                  ? 'bg-[#C0392B] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              ✨ {isHi ? 'आधुनिक' : 'Modern View'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('traditional')}
              className={`rounded-full px-2.5 sm:px-3 py-1 transition-all ${
                viewMode === 'traditional'
                  ? 'bg-[#8B1D2C] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              📕 {isHi ? 'पारंपरिक' : 'Traditional'}
            </button>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-[#132238]/70 px-3 sm:px-4 py-1.5 border border-white/80 dark:border-white/10 shadow-sm text-xs font-bold text-slate-700 dark:text-slate-200">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </div>

      {/* Render traditional view if selected */}
      {viewMode === 'traditional' ? (
        <div className="pt-2">
          <TraditionalBahiKhata
            stats={stats}
            reciprocityAlerts={reciprocityAlerts}
            isDemo={isDemo}
          />
        </div>
      ) : (
        <>
          {/* ───────────────────────────────────────────────────────── */}
          {/* MODERN VIEW TABS: Overview vs Live Wedding Gift Registry  */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-white/10 pb-2.5 flex-wrap justify-between">
            <div className="flex items-center gap-1 aether-inset p-1">
              <button
                type="button"
                onClick={() => setActiveSubTab('overview')}
                className={`rounded-full px-3 sm:px-4 py-1.5 text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeSubTab === 'overview'
                    ? 'bg-white dark:bg-[#1F3550] text-[#C0392B] dark:text-[#00E5FF] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>📊 {isHi ? 'अवलोकन' : 'Overview'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('registry')}
                className={`rounded-full px-3 sm:px-4 py-1.5 text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeSubTab === 'registry'
                    ? 'bg-white dark:bg-[#1F3550] text-[#C0392B] dark:text-[#00E5FF] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>🎁 {isHi ? 'उपहार सूची' : 'Gift Registry'}</span>
                <span className="text-[9px] font-extrabold bg-[#C0392B] text-white px-1.5 py-0.2 rounded-full">
                  Live
                </span>
              </button>
            </div>

            <Link href="/registry" target="_blank" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#C0392B] dark:text-[#00E5FF] hover:underline">
              <Share2 className="h-3.5 w-3.5" />
              <span>{isHi ? 'पब्लिक लिंक (/registry)' : 'Open Public Registry URL'}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* SUB-TAB 2: LIVE WEDDING GIFT REGISTRY                     */}
          {/* ───────────────────────────────────────────────────────── */}
          {activeSubTab === 'registry' ? (
            <ModernWeddingRegistry />
          ) : (
            /* ───────────────────────────────────────────────────────── */
            /* SUB-TAB 1: MODERN AETHER OVERVIEW                         */
            /* ───────────────────────────────────────────────────────── */
            <>
              {/* PROGRESS BAR WIDGET */}
              <div className="aether-card p-3.5 sm:p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span>🎯</span>
                    <span>{isHi ? 'विवाह शगुन प्रगति' : 'WEDDING GIFT REGISTRY PROGRESS'}</span>
                  </span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">
                    {stats.totalGifts > 0 ? Math.min(Math.round((stats.totalGifts / 25) * 100), 100) : 0}%
                  </span>
                </div>
                <div className="aether-inset h-3 w-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#C0392B] via-[#E67E22] to-[#F1C40F] transition-all duration-700 shadow-sm"
                    style={{
                      width: `${stats.totalGifts > 0 ? Math.min(Math.round((stats.totalGifts / 25) * 100), 100) : 5}%`,
                    }}
                  />
                </div>
              </div>

              {/* AUSPICIOUS BLESSING BANNER */}
              <div className="aether-card p-3.5 sm:p-5 flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-base">🪔</span>
                    <h3 className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white">
                      {isHi ? 'शुभ विवाह शगुन व उपहार' : 'Auspicious Wedding Shagun & Gifts'}
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {isHi
                      ? 'पारंपरिक +₹1 शुभ सिक्के का नियम सक्रिय है • हर उपहार का पवित्र हिसाब'
                      : 'Traditional +₹1 coin rule active • Every gift blessed and recorded in sacred bahi-khata'}
                  </p>
                </div>

                <Link href="/gifts/new">
                  <div className="aether-start-btn flex-shrink-0 cursor-pointer">
                    <span>{isHi ? 'दर्ज करें' : '+ ADD'}</span>
                  </div>
                </Link>
              </div>

              {/* STATS CARDS ROW */}
              <StatsCards
                totalCash={stats.totalCashReceived}
                totalGifts={stats.totalGifts}
                totalGuests={stats.totalGuests}
                pendingReciprocity={stats.pendingReciprocity}
              />

              {/* CEREMONY & LIVE REGISTRY PULSE */}
              <CeremonyRegistryPulse
                totalGiftsCount={stats.totalGifts}
                totalGuestsCount={stats.totalGuests}
                pendingReciprocityCount={stats.pendingReciprocity}
              />

              {/* QUICK ACTIONS ROW */}
              <QuickActions />

              {/* 3-COLUMN RESPONSIVE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
                {/* ─── COLUMN 1: Prime Focus & Timeline (4 cols on lg) ─── */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-5">
                  <div className="aether-card p-4 sm:p-5 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="aether-header-badge text-rose-600 dark:text-rose-400">
                        🎯 {isHi ? 'प्राथमिक लक्ष्य' : 'Prime Focus'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Live</span>
                    </div>

                    <div className="space-y-2">
                      <div className="aether-inset p-3 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span className="flex items-center gap-2">
                          <span>⭐</span>
                          <span>{isHi ? 'शगुन नकद मिलान' : 'Cash Reconciliation'}</span>
                        </span>
                        <span className="text-emerald-600 font-extrabold font-mono">
                          {formatCurrency(stats.totalCashReceived)}
                        </span>
                      </div>

                      <div className="aether-inset p-3 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span className="flex items-center gap-2">
                          <span>✉️</span>
                          <span>{isHi ? 'डिजिटल लिफाफे' : 'Digital Envelopes'}</span>
                        </span>
                        <span className="text-blue-600 font-extrabold">{stats.totalGifts}</span>
                      </div>

                      <div className="aether-inset p-3 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span className="flex items-center gap-2">
                          <span>🔄</span>
                          <span>{isHi ? 'लेन-देन शेष' : 'Pending Returns'}</span>
                        </span>
                        <span className="text-amber-600 font-extrabold">{stats.pendingReciprocity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ceremony Timeline Card */}
                  <div className="aether-card p-4 sm:p-5 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="aether-header-badge text-amber-700 dark:text-amber-400">
                        ⏳ {isHi ? 'विवाह समय-सारणी' : 'Ceremony Timeline'}
                      </span>
                      <Link href="/events/new" className="text-[10px] font-bold text-[#C0392B] hover:underline">
                        + {isHi ? 'जोड़ें' : 'Add'}
                      </Link>
                    </div>

                    <div className="space-y-2 text-xs">
                      {[
                        { time: '10:00 AM', title: isHi ? 'हल्दी व मेहंदी रस्म' : 'Haldi & Mehendi', status: 'Done' },
                        { time: '04:00 PM', title: isHi ? 'संगीत व बारात स्वागत' : 'Sangeet & Baarat', status: 'Ongoing' },
                        { time: '07:30 PM', title: isHi ? 'जयमाला व फेरे (विवाह)' : 'Varmala & Pheras', status: 'Next' },
                        { time: '09:30 PM', title: isHi ? 'शाही प्रीतिभोज व शगुन' : 'Dinner & Shagun', status: 'Later' },
                      ].map((evt, i) => (
                        <div key={i} className="aether-inset p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 font-mono">{evt.time}</span>
                            <span className="font-bold text-slate-800 dark:text-white truncate max-w-[130px] sm:max-w-[160px]">{evt.title}</span>
                          </div>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            evt.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                            evt.status === 'Ongoing' ? 'bg-rose-100 text-rose-700 animate-pulse' :
                            'bg-slate-100 dark:bg-white/10 text-slate-500'
                          }`}>
                            {evt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shagun Wisdom Card */}
                  <div className="aether-card p-4 sm:p-5 space-y-2.5">
                    <span className="aether-header-badge text-amber-600 dark:text-amber-400">
                      💡 {isHi ? 'शुभ शगुन सीख' : 'Shagun Wisdom'}
                    </span>
                    <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
                      {isHi
                        ? '"शगुन केवल धन का आदान-प्रदान नहीं, अपितु दो परिवारों के बीच प्रेम, सम्मान व आजीवन संबंध की डोर है।"'
                        : '"Shagun is not merely an exchange of gifts, but a sacred bond of love, respect, and enduring kinship between families."'}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span>— भारतीय संस्कार</span>
                      <span>शुभ वरदान 🪷</span>
                    </div>
                  </div>
                </div>

                {/* ─── COLUMN 2: Gifts & Reciprocity Tabs (5 cols on lg) ─── */}
                <div className="lg:col-span-5 space-y-4 sm:space-y-5">
                  <div className="aether-card p-4 sm:p-5 space-y-4">
                    <Tabs defaultValue="gifts" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <TabsList className="bg-[#F5E8DA]/80 dark:bg-[#0A1320]/80 p-1 rounded-full border border-white/60 dark:border-white/5">
                          <TabsTrigger value="gifts" className="rounded-full text-xs font-bold gap-1.5 px-3 py-1.5">
                            <Gift className="h-3.5 w-3.5" />
                            <span>{isHi ? 'उपहार व शगुन' : 'Gifts Received'}</span>
                          </TabsTrigger>
                          <TabsTrigger value="reciprocity" className="rounded-full text-xs font-bold gap-1.5 px-3 py-1.5">
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>{isHi ? 'लेन-देन' : 'Reciprocity'}</span>
                            {reciprocityAlerts.length > 0 && (
                              <span className="ml-1 rounded-full bg-[#C0392B] px-1.5 py-0.2 text-[9px] text-white font-bold">
                                {reciprocityAlerts.length}
                              </span>
                            )}
                          </TabsTrigger>
                        </TabsList>

                        <Link href="/gifts" className="text-xs font-bold text-[#C0392B] hover:underline flex items-center gap-1">
                          <span>{isHi ? 'सभी' : 'All'}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      <TabsContent value="gifts" className="space-y-3 m-0">
                        <RecentGifts gifts={stats.recentGifts} />
                      </TabsContent>

                      <TabsContent value="reciprocity" className="space-y-3 m-0">
                        <ReciprocityAlerts items={reciprocityAlerts} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>

                {/* ─── COLUMN 3: Live Wedding Gift Registry & Summary (3 cols on lg) ─── */}
                <div className="lg:col-span-3 space-y-4 sm:space-y-5">
                  {/* Real Indian Wedding Reciprocity Rules Card */}
                  <div className="aether-card p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="aether-header-badge text-amber-600 dark:text-amber-400">
                        🪙 {isHi ? 'शुभ ₹1 नियम' : '+₹1 Rule'}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {isHi
                        ? 'परंपरा अनुसार हर शगुन में ₹1 का शुभ सिक्का (जैसे ₹501, ₹1101, ₹2101) जोड़ा जाता है।'
                        : 'Automatic auspicious coin increment active on all returns for traditional luck.'}
                    </p>

                    <div className="aether-inset p-2.5 text-center text-xs font-mono font-extrabold text-[#C0392B] dark:text-[#00E5FF]">
                      ₹501 • ₹1,101 • ₹2,101 • ₹5,101
                    </div>
                  </div>

                  {/* Live Wedding Wishlist Shortcut */}
                  <div className="aether-card p-4 sm:p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="aether-header-badge text-emerald-600 dark:text-emerald-400">
                          🎁 {isHi ? 'उपहार सूची' : 'Gift Registry'}
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Live
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-3 leading-relaxed">
                        {isHi
                          ? 'मेहमानों के लिए लाइव शादी उपहार सूची — कोई उपहार दोबारा नहीं आएगा।'
                          : 'Live gift wishlist for guests — prevent duplicate air fryers and mixers.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('registry')}
                        className="w-full py-2.5 px-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <span>{isHi ? 'लाइव विशलिस्ट खोलें' : 'Open Live Registry'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>

                      <Link href="/registry" target="_blank" className="block">
                        <button
                          type="button"
                          className="w-full py-2 px-3 rounded-full border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-white/50"
                        >
                          <Share2 className="h-3 w-3 text-[#C0392B]" />
                          <span>{isHi ? 'पब्लिक शेयर लिंक (/registry)' : 'Share Link (/registry)'}</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── STICKY NOTES & LISTS SECTION (GlassyBoard Pro) ─── */}
              <GlassyStickyBoard />
            </>
          )}
        </>
      )}
    </div>
  );
}
