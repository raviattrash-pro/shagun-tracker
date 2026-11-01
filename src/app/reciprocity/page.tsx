'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ReciprocityData } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ReciprocityPage() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<ReciprocityData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkReturned = async (id: string, amount: number) => {
    try {
      const res = await fetch('/api/reciprocity', {
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
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl">
        {/* Top breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-white font-semibold flex items-center gap-1 text-[#2563EB]">
            <span>🏠 Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-white font-medium">Reciprocity Ledger</span>
        </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1E2638]">
        <div>
          <h1 className="text-2xl md:text-3xl font-sans font-bold flex items-center gap-2 text-white">
            <span>{t('reciprocityTitle')} <span className="text-[#4EECD3] font-sans text-xl">{t('reciprocityHindiSubtitle')}</span></span>
            <RefreshCw className="h-5 w-5 text-[#4EECD3]" />
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            {t('reciprocitySubtitle')}
          </p>
        </div>

        <div className="bg-[#131B2E] border border-[#1E2638] rounded-2xl px-4 py-2 text-right">
          <span className="text-[11px] text-slate-400 block uppercase font-semibold">
            {t('pendingObligations')}
          </span>
          <span className="text-xl font-bold text-[#E6CA65]">
            {formatCurrency(totalPending)}
          </span>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="rounded-2xl p-1 bg-muted/60">
          <TabsTrigger value="pending" className="gap-2 rounded-xl font-bold">
            <Clock className="h-4 w-4" />
            <span>{t('pendingTab')} ({pending.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2 rounded-xl font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{t('completedTab')} ({completed.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading records...</div>
          ) : pending.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-card text-muted-foreground">
              All reciprocal gifts are settled! 🎉
            </div>
          ) : (
            pending.map((item) => (
              <Card key={item.id} className="hover:shadow-sm transition">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-base">
                        {item.guest?.name}
                      </h4>
                      {item.guest?.relation && (
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {item.guest.relation.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Received at {item.originalGift?.event?.title || 'Wedding'} • {formatDate(item.createdAt)}
                    </p>
                    <p className="text-sm font-medium text-emerald-600 mt-1">
                      Received: {formatCurrency(Number(item.suggestedAmount || 0))}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      onClick={() => {
                        const amount = prompt(
                          `Enter returned amount for ${item.guest?.name}:`,
                          String(item.suggestedAmount || 0)
                        );
                        if (amount) handleMarkReturned(item.id, Number(amount));
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs w-full sm:w-auto"
                    >
                      Mark Returned (वापस दिया)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completed.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-card text-muted-foreground">
              No completed returns recorded yet.
            </div>
          ) : (
            completed.map((item) => (
              <Card key={item.id} className="opacity-90">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">{item.guest?.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Originally gave: {formatCurrency(Number(item.suggestedAmount || 0))} • Returned: {formatCurrency(Number(item.actualAmount || 0))}
                    </p>
                  </div>
                  <Badge variant="success" className="text-xs">
                    Returned
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  </div>
  );
}
