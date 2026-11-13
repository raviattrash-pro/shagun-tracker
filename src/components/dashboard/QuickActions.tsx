'use client';

import React from 'react';
import Link from 'next/link';
import { Mic, UserPlus, CalendarPlus, Download } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const QuickActions: React.FC = () => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const actions = [
    {
      href: '/gifts/new',
      label: isHi ? 'नया शगुन दर्ज' : 'Record Shagun',
      sub: isHi ? 'वॉइस या फॉर्म द्वारा' : 'Voice or Quick Entry',
      icon: Mic,
      color: 'bg-gradient-to-r from-[#C0392B] to-[#E74C3C] text-white',
      badge: 'MIC AI',
    },
    {
      href: '/guests/new',
      label: isHi ? 'अतिथि जोड़ें' : 'Add Guest',
      sub: isHi ? 'परिवार व रिश्तेदार' : 'Family Directory',
      icon: UserPlus,
      color: 'bg-white/80 dark:bg-[#152438] text-slate-800 dark:text-white',
      badge: 'DIRECTORY',
    },
    {
      href: '/events/new',
      label: isHi ? 'नया समारोह' : 'New Ceremony',
      sub: isHi ? 'संगीत / फेरे / रिसेप्शन' : 'Sangeet / Wedding',
      icon: CalendarPlus,
      color: 'bg-white/80 dark:bg-[#152438] text-slate-800 dark:text-white',
      badge: 'EVENT',
    },
    {
      href: '/api/export?format=excel',
      label: isHi ? 'बहीखाता डाउनलोड' : 'Export Ledger',
      sub: isHi ? 'Excel / PDF शीट' : 'Excel & PDF Report',
      icon: Download,
      color: 'bg-white/80 dark:bg-[#152438] text-slate-800 dark:text-white',
      badge: 'REPORTS',
      download: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        const CardInner = (
          <div className="aether-card p-4 space-y-3 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {act.badge}
              </span>
              <div className="h-8 w-8 rounded-full bg-[#F5E8DA] dark:bg-white/10 flex items-center justify-center text-[#C0392B] dark:text-[#00E5FF]">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-tight">
                {act.label}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {act.sub}
              </p>
            </div>
          </div>
        );

        return act.download ? (
          <a key={idx} href={act.href} download className="block">
            {CardInner}
          </a>
        ) : (
          <Link key={idx} href={act.href} className="block">
            {CardInner}
          </Link>
        );
      })}
    </div>
  );
};
