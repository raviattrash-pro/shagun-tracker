'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GiftForm } from '@/components/gift/GiftForm';
import { CreateGiftInput, EventData, GuestData } from '@/types';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function NewGiftPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const isHi = language === 'hi';
  const [events, setEvents] = useState<EventData[]>([]);
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [evRes, guRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/guests'),
        ]);
        const evData = await evRes.json();
        const guData = await guRes.json();

        setEvents(evData.data || []);
        setGuests(guData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (data: CreateGiftInput, itemImage?: File | null) => {
    setSubmitting(true);
    try {
      let imageUrl: string | undefined = undefined;

      // Upload image if provided
      if (itemImage) {
        const formData = new FormData();
        formData.append('file', itemImage);
        const upRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const upData = await upRes.json();
        if (upData.success) {
          imageUrl = upData.url;
        }
      }

      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          giftImageUrl: imageUrl,
        }),
      });

      const result = await res.json();
      if (result.success) {
        router.push(`/gifts/${result.data.id}`);
      } else {
        alert(result.error || (isHi ? 'शगुन सुरक्षित करने में विफल' : 'Failed to save gift'));
      }
    } catch (err: any) {
      alert(err.message || (isHi ? 'त्रुटि हुई' : 'Error saving gift'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-3xl text-center py-20 text-muted-foreground font-sans">
        {isHi ? 'विवाह समारोह व रिश्तेदार सूची लोड हो रही है...' : 'Loading wedding events & guests...'}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-xl text-center py-16 space-y-4 font-sans">
        <h2 className="text-2xl font-bold font-serif">
          {isHi ? 'पहले विवाह समारोह बनाना आवश्यक है' : 'Wedding Event Required First'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {isHi
            ? 'शगुन दर्ज करने के लिए कम से कम एक विवाह समारोह (जैसे शादी, रिसेप्शन) जोड़ें।'
            : 'Please create at least one wedding ceremony (e.g. Wedding, Reception) to record gifts.'}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/events/new">
            <Button className="bg-[#C0392B] hover:bg-[#A93226] text-white font-bold rounded-xl">
              {isHi ? '+ विवाह समारोह जोड़ें' : 'Create Wedding Event'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl space-y-6 font-sans">
      {/* Top breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground font-semibold flex items-center gap-1 text-primary">
          <span>{isHi ? '🏠 बही-खाता' : '🏠 Dashboard'}</span>
        </Link>
        <span>/</span>
        <Link href="/gifts" className="hover:text-foreground font-medium">
          <span>{isHi ? 'शगुन' : 'Shagun Registry'}</span>
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isHi ? 'नया शगुन दर्ज करें' : 'Add Shagun'}
        </span>
      </div>

      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-3">
          <Link href="/gifts">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
              <span>{t('recordNewGift')}</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </h1>
            <p className="text-xs text-muted-foreground">
              {t('recordNewGiftSub')}
            </p>
          </div>
        </div>

        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="text-xs rounded-xl">
            {t('dashboard')}
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <GiftForm
          events={events}
          guests={guests}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      </div>
    </div>
  );
}
