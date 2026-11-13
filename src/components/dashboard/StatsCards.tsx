'use client';

import React from 'react';
import { formatCurrency } from '@/utils/format';
import { IndianRupee, Gift, Users, RefreshCw } from 'lucide-react';
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
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const stats = [
    {
      title: isHi ? 'कुल नकद शगुन' : 'Total Shagun Cash',
      tag: '₹ CASH',
      subtitle: isHi ? 'सत्यापित बहीखाता बैलेंस' : 'Verified balance',
      value: formatCurrency(totalCash),
      icon: IndianRupee,
      tagBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      title: isHi ? 'उपहार व लिफाफे' : 'Envelopes & Gifts',
      tag: '🎁 GIFTS',
      subtitle: isHi ? 'सीलबंद डिजिटल लिफ़ाफ़े' : 'Wax-sealed envelopes',
      value: totalGifts.toString(),
      icon: Gift,
      tagBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
      iconBg: 'bg-rose-500/10 text-rose-600',
    },
    {
      title: isHi ? 'कुल रिश्तेदार व अतिथि' : 'Guests & Relatives',
      tag: '👥 GUESTS',
      subtitle: isHi ? 'सभी वैवाहिक समारोहों में' : 'Across ceremonies',
      value: totalGuests.toString(),
      icon: Users,
      tagBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: isHi ? 'बकाया लेन-देन' : 'Pending Reciprocity',
      tag: '🔄 DUE',
      subtitle: isHi ? 'लौटाने योग्य शगुन दायित्व' : 'Obligations to return',
      value: pendingReciprocity.toString(),
      icon: RefreshCw,
      tagBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
      iconBg: 'bg-amber-500/10 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="aether-card p-5 space-y-3 relative overflow-hidden group"
          >
            {/* Top row: Label & Mini Tag */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {s.title}
              </span>
              <span className={cn('text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full', s.tagBg)}>
                {s.tag}
              </span>
            </div>

            {/* Value & Inset container */}
            <div className="aether-inset-box p-3.5 flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                  {s.value}
                </p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {s.subtitle}
                </p>
              </div>
              <div className={cn('h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs', s.iconBg)}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
