'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { EventData } from '@/types';
import { EnvelopeGrid } from '@/components/envelope/EnvelopeGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, MapPin, Calendar, Download } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/format';

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`/api/events/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setEvent(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Loading event...</div>;
  }

  if (!event) {
    return <div className="text-center py-20 text-muted-foreground">Event not found</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-6">
      {/* Top breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground font-semibold flex items-center gap-1 text-primary">
          <span>🏠 Dashboard</span>
        </Link>
        <span>/</span>
        <Link href="/events" className="hover:text-foreground font-medium">
          <span>Events</span>
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate max-w-[200px]">{event.title}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="text-xs">
              Dashboard
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>All Events</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <a href={`/api/export?format=excel&eventId=${event.id}`} download>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Download className="h-4 w-4" />
              <span>Export Excel</span>
            </Button>
          </a>
          <Link href="/gifts/new">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-1.5 text-xs">
              <Plus className="h-4 w-4" />
              <span>Add Shagun</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Event Header Banner */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs uppercase">
              {event.eventType}
            </Badge>
          </div>
          <h1 className="text-3xl font-serif font-bold">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(event.eventDate)}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.venue} {event.city ? `, ${event.city}` : ''}
              </span>
            )}
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 text-left md:text-right">
          <span className="text-xs text-muted-foreground uppercase tracking-wide block">
            Total Event Shagun
          </span>
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(event.totalCash || 0)}
          </span>
          <span className="text-xs text-muted-foreground block mt-0.5">
            {event.gifts?.length || 0} gifts collected
          </span>
        </div>
      </div>

      {/* Envelopes Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-serif">
          Gifts & Cash Envelopes ({event.gifts?.length || 0})
        </h2>
        <EnvelopeGrid gifts={event.gifts || []} />
      </div>
    </div>
  );
}
