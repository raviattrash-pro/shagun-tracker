'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ReciprocityData } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';

export default function ReciprocityPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [items, setItems] = useState<ReciprocityData[]>([]);
  const [loading, setLoading] = useState(true);

  const isTraditional = theme === 'traditional';

  async function loadData() {
    try {
      const res = await fetch('/api/reciprocity');
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkReturned = async (id: string, amount: number) => {
    try {
      const res = await fetch(`/api/reciprocity`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'COMPLETED',
          actualAmount: amount,
        }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      alert('Failed to update reciprocity');
    }
  };

  const pending = items.filter((i) => i.status === 'PENDING');
  const completed = items.filter((i) => i.status === 'COMPLETED');

  const totalPending = pending.reduce(
    (sum, i) => sum + Number(i.suggestedAmount || 0),
    0
  );

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
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl">
        {/* Top breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
          <Link href="/dashboard" className="hover:underline font-semibold flex items-center gap-1 text-[#8B1D2C] dark:text-[#2563EB]">
            <span>🏠 बही-खाता (Dashboard)</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-stone-900 dark:text-white">लेन-देन डायरी (Reciprocity Ledger)</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200 dark:border-[#1E2638]">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#8B1D2C] dark:text-white flex items-center gap-2">
              <span>लेन-देन व वापसी शगुन डायरी</span>
              <RefreshCw className="h-5 w-5 text-amber-700" />
            </h1>
            <p className="text-xs md:text-sm text-stone-600 dark:text-slate-400 mt-0.5">
              पारंपरिक नियम: रिश्तेदारों द्वारा दिए गए शगुन का हिसाब रखें ताकि उनके समारोह में शुभ शगुन (+₹1 जोड़कर) लौटाया जा सके
            </p>
          </div>

          <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl px-4 py-2 text-right">
            <span className="text-[11px] text-amber-900 block uppercase font-bold tracking-wide">
              कुल भविष्य देय (Pending)
            </span>
            <span className="text-xl font-serif font-black text-[#8B1D2C]">
              {formatCurrency(totalPending)}
            </span>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="rounded-2xl p-1 bg-stone-100 border">
            <TabsTrigger value="pending" className="gap-2 rounded-xl font-bold text-xs">
              <Clock className="h-4 w-4" />
              <span>लौटाना बाकी है ({pending.length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2 rounded-xl font-bold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              <span>सफलतापूर्वक लौटाया गया ({completed.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3">
            {loading ? (
              <div className="text-center py-16 text-stone-400">रिकॉर्ड लोड हो रहे हैं...</div>
            ) : pending.length === 0 ? (
              <div className="text-center py-16 border rounded-2xl bg-white text-stone-500">
                सभी वापसी शगुन चुकता हैं! 🎉
              </div>
            ) : (
              pending.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-[#8B1D2C]/30 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-stone-900">
                        {item.guest?.name}
                      </h4>
                      {item.guest?.relation && (
                        <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                          {item.guest.relation.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      प्राप्त समारोह: {item.originalGift?.event?.title || 'विवाह समारोह'} • {formatDate(item.createdAt)}
                    </p>
                    <p className="text-sm font-serif font-black text-emerald-800 mt-1">
                      हमें प्राप्त शगुन: {formatCurrency(Number(item.suggestedAmount || 0))}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        const amount = prompt(
                          `${item.guest?.name} को कितना शगुन वापस दिया (₹):`,
                          String(Number(item.suggestedAmount || 0) + 1)
                        );
                        if (amount) handleMarkReturned(item.id, Number(amount));
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs w-full sm:w-auto"
                    >
                      वापस दिया दर्ज करें (Mark Returned)
                    </button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {completed.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-white text-stone-500">
                अभी तक कोई पूर्ण वापसी प्रविष्टि नहीं है।
              </div>
            ) : (
              completed.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{item.guest?.name}</h4>
                    <p className="text-xs text-stone-500">
                      मूल शगुन: {formatCurrency(Number(item.suggestedAmount || 0))} • वापस लौटाया: {formatCurrency(Number(item.actualAmount || 0))}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                    ✓ लौटाया गया
                  </span>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
