'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GuestForm } from '@/components/guest/GuestForm';
import { CreateGuestInput } from '@/types';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewGuestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: CreateGuestInput, photoFile: File | string | null) => {
    setSubmitting(true);
    try {
      let photoUrl: string | undefined = undefined;

      // Handle photo upload (file or camera base64 data url)
      if (photoFile) {
        const formData = new FormData();
        if (typeof photoFile === 'string') {
          formData.append('base64', photoFile);
        } else {
          formData.append('file', photoFile);
        }

        const upRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const upData = await upRes.json();
        if (upData.success) {
          photoUrl = upData.url;
        }
      }

      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          photoUrl,
        }),
      });

      const result = await res.json();
      if (result.success) {
        router.push('/guests');
      } else {
        alert(result.error || 'Failed to add guest');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving guest');
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
        <Link href="/guests" className="hover:text-foreground font-medium">
          <span>Guests</span>
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Add Guest</span>
      </div>

      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-3">
          <Link href="/guests">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
              <span>Add New Wedding Guest</span>
              <UserPlus className="h-4 w-4 text-amber-600" />
            </h1>
            <p className="text-xs text-muted-foreground">
              Capture relative's photo via camera or upload file
            </p>
          </div>
        </div>

        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="text-xs">
            Dashboard
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <GuestForm onSubmit={handleSubmit} isLoading={submitting} />
      </div>
    </div>
  );
}
