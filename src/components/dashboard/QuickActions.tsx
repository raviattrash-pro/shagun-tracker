'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mic, UserPlus, CalendarPlus, Download, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const QuickActions: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      {/* 1. Add Gift with Voice */}
      <Link href="/gifts/new" className="block group">
        <div className="h-20 rounded-2xl p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:scale-[1.02] active:scale-95 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">Instant Entry</span>
            <Mic className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base leading-tight block">
              {t('recordShagunAction')}
            </span>
            <span className="text-[10px] opacity-80">{t('recordShagunSub')}</span>
          </div>
        </div>
      </Link>

      {/* 2. Add Guest */}
      <Link href="/guests/new" className="block group">
        <div className="h-20 rounded-2xl p-3.5 border border-[#1E2638] bg-[#0F1523] hover:bg-[#131B2E] transition-all duration-300 group-hover:scale-[1.02] active:scale-95 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4EECD3]">Directory</span>
            <UserPlus className="h-4 w-4 text-[#4EECD3]" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-white leading-tight block">
              {t('addGuestAction')}
            </span>
            <span className="text-[10px] text-slate-400">{t('addGuestSub')}</span>
          </div>
        </div>
      </Link>

      {/* 3. New Event */}
      <Link href="/events/new" className="block group">
        <div className="h-20 rounded-2xl p-3.5 border border-[#1E2638] bg-[#0F1523] hover:bg-[#131B2E] transition-all duration-300 group-hover:scale-[1.02] active:scale-95 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E6CA65]">Ceremony</span>
            <CalendarPlus className="h-4 w-4 text-[#E6CA65]" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-white leading-tight block">
              {t('newEventAction')}
            </span>
            <span className="text-[10px] text-slate-400">{t('newEventSub')}</span>
          </div>
        </div>
      </Link>

      {/* 4. Export */}
      <a href="/api/export?format=excel" download className="block group">
        <div className="h-20 rounded-2xl p-3.5 border border-[#1E2638] bg-[#0F1523] hover:bg-[#131B2E] transition-all duration-300 group-hover:scale-[1.02] active:scale-95 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Reports</span>
            <Download className="h-4 w-4 text-slate-300" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-white leading-tight block">
              {t('exportLedgerAction')}
            </span>
            <span className="text-[10px] text-slate-400">{t('exportLedgerSub')}</span>
          </div>
        </div>
      </a>
    </div>
  );
};
