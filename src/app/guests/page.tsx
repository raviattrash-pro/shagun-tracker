'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GuestData } from '@/types';
import { GuestCard } from '@/components/guest/GuestCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Users, Sparkles } from 'lucide-react';
import { VoiceSearchBar } from '@/components/voice/VoiceSearchBar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';

export default function GuestsPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const isTraditional = theme === 'traditional';

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
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        {/* Top breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
          <Link href="/dashboard" className="hover:underline font-semibold flex items-center gap-1 text-[#8B1D2C] dark:text-[#2563EB]">
            <span>🏠 बही-खाता (Dashboard)</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-stone-900 dark:text-white">रिश्तेदार सूची (Guest Directory)</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200 dark:border-[#1E2638]">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#8B1D2C] dark:text-white">
              रिश्तेदार व मेहमान सूची <span className="font-sans text-base text-stone-500 font-normal">({guests.length})</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-600 dark:text-slate-400 mt-0.5">
              परिवार, रिश्तेदार (चाचा, मामा, बुआ, मौसी) एवं मित्रों की संपर्क सूची व कुल शगुन का हिसाब
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs rounded-xl">
                बही-खाता
              </Button>
            </Link>
            <Link href="/guests/new">
              <Button size="sm" className="bg-[#8B1D2C] hover:bg-[#731522] text-white gap-1.5 shadow-sm font-bold rounded-xl text-xs">
                <UserPlus className="h-4 w-4" />
                <span>+ नया रिश्तेदार जोड़ें</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Relative Audio & Text Search Bar */}
        <VoiceSearchBar
          value={search}
          onChange={setSearch}
          placeholder="रिश्तेदार बोलकर खोजें (उदा. मामाजी, चाचाजी, प्रिया मौसी)..."
          resultCount={guests.length}
          resultLabel="रिश्तेदार"
        />

        {loading ? (
          <div className="text-center py-20 text-stone-400">रिश्तेदार सूची लोड हो रही है...</div>
        ) : guests.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-3xl bg-white text-stone-500 space-y-3">
            <p className="font-serif font-bold text-lg text-stone-800">कोई रिश्तेदार नहीं मिले</p>
            <p className="text-xs">नया नाम जोड़ें या दूसरा नाम खोजें</p>
            <Link href="/guests/new">
              <Button size="sm" className="bg-[#8B1D2C] hover:bg-[#731522] text-white rounded-xl font-bold">
                + पहला रिश्तेदार जोड़ें
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
