'use client';

import React from 'react';
import { formatCurrency } from '@/utils/format';
import { IndianRupee, Gift, Users, RefreshCw, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';

interface StatsCardsProps {
  totalCash: number;
  totalGifts: number;
  totalGuests: number;
  pendingReciprocity: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalCash,
  totalGifts,
  totalGuests,
  pendingReciprocity,
}) => {
  const { t, language } = useLanguage();

  const stats = [
    {
      title: t('totalCashReceived'),
      subtitle: language === 'hi' ? 'बहीखाते में दर्ज नकद' : 'Recorded in bahi-khata',
      value: formatCurrency(totalCash),
      badge: language === 'hi' ? 'सत्यापित राशि' : 'Verified Balance',
      badgeColor: 'text-emerald-700 bg-emerald-500/10 border-emerald-300 dark:border-emerald-800',
      icon: IndianRupee,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-500/15 ring-4 ring-emerald-500/10',
      borderColor: 'border-emerald-200/60 dark:border-emerald-900/40',
      gradient: 'from-emerald-500/5 via-transparent to-transparent',
    },
    {
      title: t('totalGiftsCount'),
      subtitle: language === 'hi' ? '3D सीलबंद लिफ़ाफ़े' : '3D wax-sealed envelopes',
      value: totalGifts.toString(),
      badge: language === 'hi' ? 'सक्रिय रजिस्ट्री' : 'Active Registry',
      badgeColor: 'text-blue-700 bg-blue-500/10 border-blue-300 dark:border-blue-800',
      icon: Gift,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-500/15 ring-4 ring-blue-500/10',
      borderColor: 'border-blue-200/60 dark:border-blue-900/40',
      gradient: 'from-blue-500/5 via-transparent to-transparent',
    },
    {
      title: t('totalGuestsCount'),
      subtitle: language === 'hi' ? 'सभी समारोहों में' : 'Across wedding events',
      value: totalGuests.toString(),
      badge: language === 'hi' ? 'अतिथि सूची' : 'Family Directory',
      badgeColor: 'text-amber-700 bg-amber-500/10 border-amber-300 dark:border-amber-800',
      icon: Users,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-500/15 ring-4 ring-amber-500/10',
      borderColor: 'border-amber-200/60 dark:border-amber-900/40',
      gradient: 'from-amber-500/5 via-transparent to-transparent',
    },
    {
      title: t('pendingReciprocityCount'),
      subtitle: language === 'hi' ? 'लौटाने योग्य दायित्व' : 'Obligations to return',
      value: pendingReciprocity.toString(),
      badge: language === 'hi' ? 'स्मार्ट ट्रैकर' : 'Smart Tracker',
      badgeColor: 'text-rose-700 bg-rose-500/10 border-rose-300 dark:border-rose-800',
      icon: RefreshCw,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-500/15 ring-4 ring-rose-500/10',
      borderColor: 'border-rose-200/60 dark:border-rose-900/40',
      gradient: 'from-rose-500/5 via-transparent to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className={cn(
              'group relative overflow-hidden rounded-3xl border bg-card/90 p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-md',
              s.borderColor
            )}
          >
            {/* Ambient Corner Flare */}
            <div
              className={cn(
                'absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl pointer-events-none opacity-50 transition-opacity group-hover:opacity-100',
                s.gradient
              )}
            />

            <div className="relative z-10 space-y-3">
              {/* Top row: Label & Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {s.title}
                </span>
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl shadow-xs transition-transform group-hover:scale-110', s.iconBg)}>
                  <Icon className={cn('h-5 w-5', s.iconColor)} />
                </div>
              </div>

              {/* Number Value */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {s.value}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{s.subtitle}</p>
              </div>

              {/* Bottom Badge */}
              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border', s.badgeColor)}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {s.badge}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  Live Sync
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
