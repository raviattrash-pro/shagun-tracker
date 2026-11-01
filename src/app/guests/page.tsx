'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GuestData } from '@/types';
import { GuestCard } from '@/components/guest/GuestCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';
import { VoiceSearchBar } from '@/components/voice/VoiceSearchBar';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function GuestsPage() {
  const { t, language } = useLanguage();
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGuests() {
      try {
        const res = await fetch(`/api/guests${search ? `?search=${encodeURIComponent(search)}` : ''}`);
        const data = await res.json();
        if (data.success) {
          setGuests(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(loadGuests, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDeleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        {/* Top breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-white font-semibold flex items-center gap-1 text-[#2563EB]">
            <span>🏠 Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-white font-medium">Guest Directory</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1E2638]">
          <div>
            <h1 className="text-2xl md:text-3xl font-sans font-bold text-white">
              {t('guestDirectoryTitle')} <span className="text-[#4EECD3] font-sans text-xl">{t('guestDirectoryHindiSubtitle')}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              {t('guestDirectorySubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs rounded-xl bg-[#0F1523] border-[#1E2638] text-slate-300 hover:text-white">
                {t('dashboard')}
              </Button>
            </Link>
            <Link href="/guests/new">
              <Button size="sm" className="bg-[#2563EB] hover:bg-blue-600 text-white gap-1.5 shadow-lg shadow-blue-600/30 font-bold rounded-xl text-xs">
                <UserPlus className="h-4 w-4" />
                <span>{t('addGuestBtn')}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Relative Audio & Text Search Bar */}
        <VoiceSearchBar
          value={search}
          onChange={setSearch}
          placeholder={t('searchGuestPlaceholder')}
          resultCount={guests.length}
          resultLabel="relatives"
        />

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading guests...</div>
        ) : guests.length === 0 ? (
          <div className="text-center py-20 border border-[#1E2638] rounded-3xl bg-[#0F1523] text-slate-400 space-y-3">
            <p className="font-semibold text-white">No relatives found</p>
            <p className="text-xs">Add a new guest or try another search term</p>
            <Link href="/guests/new">
              <Button size="sm" className="bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl font-bold">
                Add First Guest
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {guests.map((g) => (
              <GuestCard key={g.id} guest={g} onDelete={handleDeleteGuest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
