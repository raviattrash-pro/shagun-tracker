'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TraditionalBahiKhata } from '@/components/dashboard/TraditionalBahiKhata';
import { GiftData, ReciprocityData } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { BookOpen, Gift, IndianRupee, Sparkles, Plus, Users, Printer, Download } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

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

  useEffect(() => {
    async function loadData() {
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

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-stone-900 font-sans selection:bg-[#8B1D2C] selection:text-white pb-16">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP TRADITIONAL WEDDING WELCOME BANNER                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FBF8EF] to-[#FDFCF7] border-b border-[#8B1D2C]/15 py-8 sm:py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-serif font-black tracking-widest">
            <span>ॐ</span>
            <span>|| श्री गणेशाय नमः ||</span>
            <span>|| शुभ विवाह ||</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#8B1D2C] tracking-wide">
            डिजिटल शादी बही-खाता व उपहार सूची
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            पारंपरिक लाल डायरी (Bahi-Khata) की सरलता के साथ नकद शगुन, प्राप्त उपहार व <strong>लाइव शादी विशलिस्ट</strong> का हिसाब-किताब।
            हर रिश्तेदार देख सकता है कि कौन क्या उपहार ला रहा है ताकि कोई दोहराव न हो।
          </p>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
            <Link href="/gifts/new">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-[#8B1D2C] hover:bg-[#731522] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>+ नया शगुन दर्ज करें (Add Shagun)</span>
              </button>
            </Link>

            <Link href="/guests">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs sm:text-sm border border-stone-300 shadow-xs transition flex items-center gap-1.5"
              >
                <Users className="h-4 w-4 text-[#8B1D2C]" />
                <span>रिश्तेदार सूची (Guests)</span>
              </button>
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs sm:text-sm border border-stone-300 shadow-xs transition flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4 text-amber-700" />
              <span>प्रिंट बही-खाता (Print)</span>
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. THE LIVE TRADITIONAL BAHI-KHATA REGISTER (Directly In View)*/}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="py-6 sm:py-8 px-2 sm:px-4">
        <TraditionalBahiKhata
          stats={stats}
          reciprocityAlerts={reciprocityAlerts}
          isDemo={isDemo}
        />
      </main>
    </div>
  );
}
