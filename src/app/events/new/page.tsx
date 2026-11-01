'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventType } from '@/types';
import { EVENT_TYPE_LABELS } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CalendarPlus } from 'lucide-react';

export default function NewEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('WEDDING');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          eventType,
          eventDate,
          venue: venue || undefined,
          city: city || undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/events/${data.data.id}`);
      } else {
        alert(data.error || 'Failed to create event');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl space-y-6">
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
        <span className="text-foreground font-medium">Create Event</span>
      </div>

      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-3">
          <Link href="/events">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
              <span>Create New Wedding Event</span>
              <CalendarPlus className="h-4 w-4 text-red-600" />
            </h1>
            <p className="text-xs text-muted-foreground">
              Set up an event to organize received cash envelopes and gifts
            </p>
          </div>
        </div>

        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="text-xs">
            Dashboard
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
        <div className="space-y-2">
          <Label htmlFor="event-title">Event Title (समारोह का नाम) *</Label>
          <Input
            id="event-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Rahul & Priya Wedding, Reception"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event-type">Event Category</Label>
            <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
              <SelectTrigger id="event-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((key) => {
                  const meta = EVENT_TYPE_LABELS[key];
                  return (
                    <SelectItem key={key} value={key}>
                      {meta.emoji} {meta.label} ({meta.labelHindi})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-date">Date (दिनांक) *</Label>
            <Input
              id="event-date"
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event-venue">Venue / Hotel / Lawn</Label>
            <Input
              id="event-venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Grand Heritage Palace"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-city">City</Label>
            <Input
              id="event-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Jaipur, Rajasthan"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-notes">Notes / Family Remarks</Label>
          <Textarea
            id="event-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional information or wedding program details"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting || !title.trim()}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 text-base"
        >
          {submitting ? 'Creating...' : 'Create Wedding Event'}
        </Button>
      </form>
    </div>
  );
}
