'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GuestData } from '@/types';
import { formatCurrency, stringToColor } from '@/utils/format';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, ChevronRight, Trash2, Mail, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface GuestCardProps {
  guest: GuestData;
  onDelete?: (id: string) => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, onDelete }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

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
      `Are you sure you want to delete relative "${guest.name}"?\nAll associated gift records and reciprocity entries will also be removed.`
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
          'relative overflow-hidden rounded-3xl border border-[#1E2638] bg-[#0F1523] backdrop-blur-xl p-5 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-[#2563EB]/50 flex flex-col justify-between gap-4',
          isDeleting && 'opacity-40 pointer-events-none'
        )}
      >
        {/* Subtle Ambient Glow on Hover */}
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />

        {/* Top Header: Avatar + Name + Relation Badge + Delete Action */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* High-End Avatar */}
            <Avatar className="h-14 w-14 rounded-2xl border-2 border-amber-400/80 shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              {guest.photoUrl && <AvatarImage src={guest.photoUrl} alt={guest.name} className="object-cover" />}
              <AvatarFallback
                style={{ backgroundColor: stringToColor(guest.name) }}
                className="text-white font-serif font-black text-base rounded-2xl"
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-sans font-bold text-base text-white group-hover:text-[#4EECD3] transition-colors truncate">
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

          {/* Delete Guest Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete this guest & records"
            className="rounded-xl p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors opacity-70 group-hover:opacity-100 flex-shrink-0"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Contact info: Phone & City */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 relative z-10">
          {guest.phone && (
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="h-3 w-3 text-[#2563EB]" />
              {guest.phone}
            </span>
          )}
          {guest.city && (
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="h-3 w-3 text-[#E6CA65]" />
              {guest.city}
            </span>
          )}
        </div>

        {/* Bottom Metrics Bar (Fintech Asset Look) */}
        <div className="pt-3 border-t border-[#1E2638] flex items-center justify-between relative z-10">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Total Shagun
            </span>
            <span className="text-lg font-black text-[#4EECD3] tracking-tight">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#131B2E] text-slate-300 border border-[#1E2638]">
              {giftCount} {giftCount === 1 ? 'envelope' : 'envelopes'}
            </span>
            <div className="h-7 w-7 rounded-full bg-[#2563EB]/15 flex items-center justify-center text-[#2563EB] group-hover:translate-x-1 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
