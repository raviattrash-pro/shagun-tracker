'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GuestData } from '@/types';
import { formatCurrency, stringToColor } from '@/utils/format';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, ChevronRight, Trash2, Mail, Loader2, Sparkles } from 'lucide-react';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';

interface GuestCardProps {
  guest: GuestData;
  onDelete?: (id: string) => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, onDelete }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const [isDeleting, setIsDeleting] = useState(false);

  const isTraditional = theme === 'traditional';
  const isClay = theme === 'clay';

  const initials = guest.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const total = guest.totalGiven || 0;
  const giftCount = guest._count?.gifts || guest.gifts?.length || 0;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      isHi
        ? `क्या आप वाकई रिश्तेदार "${guest.name}" को हटाना चाहते हैं?\nइनके सभी संबंधित शगुन रिकॉर्ड और लेन-देन भी हटा दिए जाएंगे।`
        : `Are you sure you want to delete relative "${guest.name}"?\nAll associated gift records and reciprocity entries will also be removed.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/guests/${guest.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onDelete?.(guest.id);
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete guest');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting guest');
    } finally {
      setIsDeleting(false);
    }
  };

  const getRelationBadgeStyle = (rel?: string | null) => {
    const r = (rel || '').toLowerCase();
    if (r.includes('maternal') || r.includes('मामा') || r.includes('मौसी')) {
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800';
    }
    if (r.includes('paternal') || r.includes('चाचा') || r.includes('बुआ')) {
      return 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    }
    if (r.includes('friend')) {
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800';
    }
    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
  };

  return (
    <Link href={`/guests/${guest.id}`} className="block group">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between gap-4',
          isDeleting && 'opacity-40 pointer-events-none',
          isTraditional
            ? 'bg-white border-2 border-stone-200/90 shadow-xs hover:border-[#8B1D2C]/40 hover:shadow-md'
            : isClay
            ? 'clay-card'
            : 'border border-[#1E2638] bg-[#0F1523] backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-[#2563EB]/50'
        )}
      >
        {/* Top Header: Avatar + Name + Relation Badge + Delete Action */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar */}
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border-2 border-amber-400/80 shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
              {guest.photoUrl && <AvatarImage src={guest.photoUrl} alt={guest.name} className="object-cover" />}
              <AvatarFallback
                style={{ backgroundColor: isTraditional ? '#8B1D2C' : stringToColor(guest.name) }}
                className="text-white font-serif font-black text-sm sm:text-base rounded-2xl"
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4
                  className={cn(
                    'font-bold text-sm sm:text-base transition-colors truncate',
                    isTraditional
                      ? 'text-stone-900 group-hover:text-[#8B1D2C]'
                      : 'text-white group-hover:text-[#4EECD3]'
                  )}
                >
                  {guest.name}
                </h4>
              </div>

              {guest.relation && (
                <div className="mt-1">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                      getRelationBadgeStyle(guest.relation)
                    )}
                  >
                    {guest.relation.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delete Guest Action Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-500/10 transition flex-shrink-0"
            title={`Delete ${guest.name}`}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Guest Contact & Location Details */}
        <div className="space-y-1.5 text-xs text-stone-500 dark:text-slate-400 pt-1 border-t border-stone-100 dark:border-white/5 relative z-10">
          {guest.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#8B1D2C] dark:text-[#2563EB] flex-shrink-0" />
              <span className="truncate">{guest.phone}</span>
            </div>
          )}

          {guest.city && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-amber-600 dark:text-[#E6CA65] flex-shrink-0" />
              <span className="truncate">{guest.city}</span>
            </div>
          )}
        </div>

        {/* Footer: Total Shagun Contributed & Gifts Count */}
        <div
          className={cn(
            'flex items-center justify-between pt-2 border-t text-xs font-semibold relative z-10',
            isTraditional ? 'border-stone-100 text-stone-600' : 'border-[#1E2638] text-slate-300'
          )}
        >
          <div>
            <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
              {isHi ? 'कुल शगुन' : 'Total Shagun'}
            </span>
            <span
              className={cn(
                'text-base sm:text-lg font-serif font-black',
                isTraditional ? 'text-emerald-800' : 'text-[#4EECD3]'
              )}
            >
              {formatCurrency(total)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-stone-400 group-hover:text-stone-700 transition">
            <span className="text-[11px] font-bold">
              {isHi
                ? `${giftCount} उपहार`
                : `${giftCount} ${giftCount === 1 ? 'gift' : 'gifts'}`}
            </span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};
