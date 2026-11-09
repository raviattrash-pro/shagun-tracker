'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GiftData } from '@/types';
import { Envelope } from '@/components/envelope/Envelope';
import { CashBreakdownDisplay } from '@/components/currency/CashBreakdownDisplay';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, Calendar, User, Phone, MapPin } from 'lucide-react';
import { formatDate } from '@/utils/format';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';

export default function GiftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);

  const isTraditional = theme === 'traditional';
  const isHi = language === 'hi';

  useEffect(() => {
    async function loadGift() {
      try {
        const res = await fetch(`/api/gifts/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setGift(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGift();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm(isHi ? 'क्या आप वाकई इस शगुन रिकॉर्ड को हटाना चाहते हैं?' : 'Are you sure you want to delete this gift record?')) return;
    try {
      const res = await fetch(`/api/gifts/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/gifts');
      }
    } catch (err) {
      alert('Failed to delete gift');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-500 font-sans">
        {isHi ? 'शगुन लिफ़ाफ़ा लोड हो रहा है...' : 'Loading envelope details...'}
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-3 font-sans">
        <p className="text-stone-500">{isHi ? 'शगुन रिकॉर्ड नहीं मिला' : 'Gift not found'}</p>
        <Link href="/gifts">
          <Button variant="outline" size="sm">{isHi ? 'वापस जाएँ' : 'Back to Envelopes'}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-screen py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans',
        isTraditional
          ? 'bg-[#FDFCF7] text-stone-900'
          : theme === 'clay'
          ? 'bg-[#FBF0EE] text-slate-800'
          : theme === 'dark'
          ? 'bg-[#0B0F19] text-white'
          : 'bg-[#E8EDF5] text-slate-800'
      )}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumbs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-[#1E2638]">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
            <Link href="/dashboard" className="text-[#8B1D2C] dark:text-[#4EECD3] hover:underline font-semibold flex items-center gap-1">
              <span>{isHi ? '🏠 बही-खाता' : '🏠 Dashboard'}</span>
            </Link>
            <span>/</span>
            <Link href="/gifts" className="hover:underline font-medium">
              <span>{isHi ? '✉️ लिफ़ाफ़े' : '✉️ Envelopes'}</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900 dark:text-white truncate max-w-[150px]">{gift.guest?.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl">
                {isHi ? 'डैशबोर्ड' : 'Dashboard'}
              </Button>
            </Link>
            <Link href="/gifts">
              <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl">
                {isHi ? 'सभी लिफ़ाफ़े' : 'All Envelopes'}
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="gap-1 text-xs h-8 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isHi ? 'हटाएँ' : 'Delete'}</span>
            </Button>
          </div>
        </div>

        {/* Envelope Title Banner */}
        <div className="text-center space-y-1.5 pt-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider">
            {gift.envelopeStyle.replace('_', ' ')}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#8B1D2C] dark:text-white">
            {isHi ? `शगुन लिफ़ाफ़ा: ${gift.guest?.name}` : `Shagun Envelope for ${gift.guest?.name}`}
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400">
            {formatDate(gift.receivedAt)} {gift.event?.title ? `• ${gift.event.title}` : ''}
          </p>
        </div>

        {/* 3D Envelope Component */}
        <div className="py-4 flex justify-center">
          <div className="w-full max-w-md">
            <Envelope gift={gift} initialOpen={false} />
          </div>
        </div>

        {/* Additional Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-stone-200 dark:border-[#1E2638]">
          {/* Guest Information */}
          <div className={cn(
            'rounded-3xl p-5 space-y-3 shadow-sm border',
            isTraditional
              ? 'bg-white border-stone-200'
              : theme === 'clay'
              ? 'clay-card'
              : 'bg-[#0F1523] border-[#1E2638] text-white'
          )}>
            <h3 className="font-semibold text-sm flex items-center gap-2 text-[#8B1D2C] dark:text-[#4EECD3]">
              <User className="h-4 w-4" />
              <span>{isHi ? 'रिश्तेदार विवरण (Guest Profile)' : 'Guest Information'}</span>
            </h3>
            <div className="space-y-1.5 text-xs pt-1">
              <p className="font-bold text-sm text-stone-900 dark:text-white">{gift.guest?.name}</p>
              {gift.guest?.relation && (
                <p className="text-stone-500 dark:text-slate-400 capitalize">
                  {isHi ? 'रिश्ता' : 'Relation'}: {gift.guest.relation.replace('_', ' ')}
                </p>
              )}
              {gift.guest?.phone && (
                <p className="text-stone-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Phone className="h-3 w-3 text-emerald-600" />
                  {gift.guest.phone}
                </p>
              )}
              {gift.guest?.city && (
                <p className="text-stone-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3 w-3 text-amber-600" />
                  {gift.guest.city}
                </p>
              )}
            </div>
          </div>

          {/* Currency Denominations Breakdown */}
          {gift.cashBreakdown && Object.keys(gift.cashBreakdown).length > 0 && (
            <div className={cn(
              'rounded-3xl p-5 shadow-sm border',
              isTraditional
                ? 'bg-white border-stone-200'
                : theme === 'clay'
                ? 'clay-card'
                : 'bg-[#0F1523] border-[#1E2638] text-white'
            )}>
              <CashBreakdownDisplay breakdown={gift.cashBreakdown} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
