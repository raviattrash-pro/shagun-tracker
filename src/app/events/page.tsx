'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EventData } from '@/types';
import { EVENT_TYPE_LABELS } from '@/utils/constants';
import { formatDate, formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, MapPin, Gift, ChevronRight } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.success) {
          setEvents(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Top breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground font-semibold flex items-center gap-1 text-primary">
          <span>🏠 Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Family Wedding Events</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            Family Wedding Events (विवाह व मांगलिक कार्य)
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Track shagun separately for weddings, engagements, receptions, and anniversaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="text-xs">
              Dashboard
            </Button>
          </Link>
          <Link href="/events/new">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-1.5 shadow-md font-bold">
              <CalendarPlus className="h-4 w-4" />
              <span>Create Event</span>
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card text-muted-foreground space-y-3">
          <p>No events created yet.</p>
          <Link href="/events/new">
            <Button size="sm">Create First Wedding Event</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const meta = EVENT_TYPE_LABELS[event.eventType] || EVENT_TYPE_LABELS.WEDDING;
            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{meta.emoji}</span>
                      <Badge variant="outline" className="text-xs">
                        {meta.label} ({meta.labelHindi})
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(event.eventDate)}
                      </p>
                    </div>

                    {event.venue && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.venue} {event.city ? `, ${event.city}` : ''}
                      </p>
                    )}

                    <div className="flex items-center justify-between border-t pt-3 text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Gift className="h-3.5 w-3.5" />
                        {event._count?.gifts || 0} Gifts
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatCurrency(event.totalCash || 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
