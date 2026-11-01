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

export default function GiftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (!confirm('Are you sure you want to delete this gift record?')) return;
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
    return <div className="text-center py-20 text-muted-foreground">Loading envelope details...</div>;
  }

  if (!gift) {
    return <div className="text-center py-20 text-muted-foreground">Gift not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Ambient Radial Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-4xl space-y-8">
        {/* Navigation Breadcrumbs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white font-semibold flex items-center gap-1 text-[#2563EB]">
              <span>🏠 Dashboard</span>
            </Link>
            <span>/</span>
            <Link href="/gifts" className="hover:text-white font-medium text-slate-300">
              <span>✉️ Shagun Registry</span>
            </Link>
            <span>/</span>
            <span className="text-white font-semibold truncate max-w-[150px]">{gift.guest?.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl bg-[#0F1523] border-[#1E2638] text-slate-300 hover:text-white">
                Dashboard
              </Button>
            </Link>
            <Link href="/gifts">
              <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl bg-[#0F1523] border-[#1E2638] text-slate-300 hover:text-white">
                All Envelopes
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="gap-1 text-xs h-8 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider bg-[#131B2E] border-[#1E2638] text-[#4EECD3]">
            {gift.envelopeStyle.replace('_', ' ')}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-sans font-black text-white">
            Shagun Envelope for {gift.guest?.name}
          </h1>
          <p className="text-xs text-slate-400">
            Received on {formatDate(gift.receivedAt)} • {gift.event?.title}
          </p>
        </div>

        {/* 3D Envelope Component - Default Sealed with rich Burgundy Velvet & Gold Wax Seal */}
        <div className="py-6 flex justify-center">
          <div className="w-full max-w-md">
            <Envelope gift={gift} initialOpen={false} />
          </div>
        </div>

        {/* Additional Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1E2638]">
          {/* Guest Information */}
          <div className="rounded-3xl border border-[#1E2638] p-6 space-y-3 bg-[#0F1523] shadow-xl">
            <h3 className="font-semibold text-base flex items-center gap-2 text-white">
              <User className="h-4 w-4 text-[#4EECD3]" />
              <span>Guest Profile (रिश्तेदार प्रोफ़ाइल)</span>
            </h3>
            <div className="space-y-2 text-sm pt-1">
              <p className="font-bold text-white text-base">{gift.guest?.name}</p>
              {gift.guest?.relation && (
                <p className="text-xs text-slate-400 capitalize">
                  Relation: {gift.guest.relation.replace('_', ' ')}
                </p>
              )}
              {gift.guest?.phone && (
                <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
                  {gift.guest.phone}
                </p>
              )}
              {gift.guest?.city && (
                <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-[#E6CA65]" />
                  {gift.guest.city}
                </p>
              )}
            </div>
          </div>

          {/* Currency Denominations Breakdown */}
          {gift.cashBreakdown && Object.keys(gift.cashBreakdown).length > 0 && (
            <div className="rounded-3xl border border-[#1E2638] p-6 bg-[#0F1523] shadow-xl">
              <CashBreakdownDisplay breakdown={gift.cashBreakdown} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
