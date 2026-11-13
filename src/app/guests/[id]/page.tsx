'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GuestData, GiftData } from '@/types';
import { EnvelopeGrid } from '@/components/envelope/EnvelopeGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, MapPin, Mail, IndianRupee, Trash2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { formatCurrency, stringToColor } from '@/utils/format';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';

export default function GuestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [guest, setGuest] = useState<GuestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadGuest() {
      try {
        const res = await fetch(`/api/guests/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setGuest(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGuest();
  }, [params.id]);

  const handleDelete = async () => {
    if (!guest) return;
    const confirmed = window.confirm(
      isHi
        ? `क्या आप वाकई रिश्तेदार "${guest.name}" को हटाना चाहते हैं?\nइनके सभी संबंधित शगुन रिकॉर्ड और लेन-देन भी हमेशा के लिए हटा दिए जाएंगे।`
        : `Are you sure you want to delete relative "${guest.name}"?\nAll associated gift records and reciprocity entries will also be permanently deleted.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/guests/${guest.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        router.push('/guests');
      } else {
        alert(data.error || (isHi ? 'रिश्तेदार हटाने में विफल' : 'Failed to delete guest'));
        setIsDeleting(false);
      }
    } catch (err: any) {
      alert(err.message || (isHi ? 'त्रुटि हुई' : 'Error deleting guest'));
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-muted-foreground font-sans">
        {isHi ? 'रिश्तेदार प्रोफ़ाइल लोड हो रही है...' : 'Loading relative profile...'}
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="container mx-auto p-6 max-w-md text-center py-20 space-y-4 font-sans">
        <h2 className="text-2xl font-bold font-serif">{isHi ? 'रिश्तेदार नहीं मिले' : 'Guest Not Found'}</h2>
        <p className="text-muted-foreground text-sm">
          {isHi ? 'यह रिश्तेदार प्रोफ़ाइल हटाई जा चुकी हो सकती है।' : 'This relative profile may have been removed.'}
        </p>
        <Link href="/guests">
          <Button>{isHi ? 'रिश्तेदार सूची पर वापस जाएँ' : 'Back to Guest Directory'}</Button>
        </Link>
      </div>
    );
  }

  const initials = guest.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Ensure each gift passed to EnvelopeGrid has the complete guest object attached
  const giftsWithGuest: GiftData[] = (guest.gifts || []).map((gift) => ({
    ...gift,
    guest,
  }));

  const isClay = theme === 'clay';

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-300 font-sans',
        isClay
          ? 'bg-[#FBF0EE] text-slate-800'
          : theme === 'dark'
          ? 'bg-[#0B0F19] text-white'
          : 'bg-[#E8EDF5] text-slate-800'
      )}
    >
      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-60 right-1/4 w-[400px] h-[300px] bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-5xl space-y-8">
        {/* Navigation Breadcrumbs & Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-[#1E2638]">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/dashboard" className="hover:underline font-semibold flex items-center gap-1 text-[#FA7C77] dark:text-[#2563EB]">
              <span>{isHi ? '🏠 बही-खाता' : '🏠 Dashboard'}</span>
            </Link>
            <span>/</span>
            <Link href="/guests" className="hover:underline font-medium">
              <span>{isHi ? 'रिश्तेदार सूची' : 'Guest Directory'}</span>
            </Link>
            <span>/</span>
            <span className="font-semibold truncate max-w-[200px]">{guest.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl">
                {isHi ? 'बही-खाता' : 'Dashboard'}
              </Button>
            </Link>
            <Link href="/guests">
              <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{isHi ? 'सभी रिश्तेदार' : 'All Relatives'}</span>
              </Button>
            </Link>
            {/* Delete Guest Action Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs h-8 rounded-xl gap-1.5 bg-rose-600 hover:bg-rose-700 font-bold"
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              <span>{isHi ? 'रिश्तेदार हटाएँ' : 'Delete Relative'}</span>
            </Button>
          </div>
        </div>

        {/* Relative Account Card */}
        <div
          className={cn(
            'relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition',
            isClay
              ? 'clay-card bg-white/80'
              : 'border border-[#1E2638] bg-[#0F1523] backdrop-blur-xl shadow-xl'
          )}
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <Avatar className="h-24 w-24 rounded-3xl border-4 border-amber-400 shadow-xl">
              {guest.photoUrl && <AvatarImage src={guest.photoUrl} alt={guest.name} className="object-cover" />}
              <AvatarFallback
                style={{ backgroundColor: stringToColor(guest.name) }}
                className="text-white text-3xl font-serif font-black rounded-3xl"
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{guest.name}</h1>
                {guest.relation && (
                  <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-800 dark:text-[#4EECD3] border-amber-300 dark:border-[#1E2638]">
                    {guest.relation.replace('_', ' ')}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 justify-center sm:justify-start">
                {guest.phone && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone className="h-3.5 w-3.5 text-[#FA7C77] dark:text-[#2563EB]" />
                    {guest.phone}
                  </span>
                )}
                {guest.city && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-amber-500" />
                    {guest.city}
                  </span>
                )}
                <span className="rounded-full bg-black/5 dark:bg-[#131B2E] border border-black/10 dark:border-[#1E2638] px-2.5 py-0.5 text-[11px] font-semibold capitalize">
                  {isHi ? 'पक्ष' : 'Side'}: {guest.side.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Metrics Box */}
          <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-black/10 dark:border-[#1E2638] pt-4 md:pt-0 md:pl-8 flex flex-col items-center md:items-end">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 block">
              {isHi ? 'कुल प्राप्त शगुन' : 'Total Shagun Received'}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-[#4EECD3] tracking-tight mt-1">
              {formatCurrency(guest.totalGiven || 0)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
              {isHi
                ? `${guest.gifts?.length || 0} विवाह समारोहों में`
                : `across ${guest.gifts?.length || 0} wedding ${guest.gifts?.length === 1 ? 'event' : 'events'}`}
            </span>
          </div>
        </div>

        {/* Gifts & Envelopes Given by this Guest */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <span>{isHi ? 'भेंट किए गए लिफ़ाफ़े व उपहार' : 'Envelopes & Gifts Given'}</span>
              <span className="text-sm font-semibold text-slate-400">
                ({giftsWithGuest.length})
              </span>
            </h2>
          </div>

          <EnvelopeGrid gifts={giftsWithGuest} />
        </div>
      </div>
    </div>
  );
}
