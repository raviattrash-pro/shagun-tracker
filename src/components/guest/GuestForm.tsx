'use client';

import React, { useState } from 'react';
import { CreateGuestInput, GuestSide } from '@/types';
import { RELATION_TYPES } from '@/utils/constants';
import { GuestPhoto } from './GuestPhoto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GuestFormProps {
  initialValues?: Partial<CreateGuestInput & { photoUrl?: string }>;
  onSubmit: (data: CreateGuestInput, photoFile: File | string | null) => Promise<void>;
  isLoading?: boolean;
}

export const GuestForm: React.FC<GuestFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [phone, setPhone] = useState(initialValues?.phone || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [address, setAddress] = useState(initialValues?.address || '');
  const [city, setCity] = useState(initialValues?.city || '');
  const [relation, setRelation] = useState(initialValues?.relation || 'relative');
  const [side, setSide] = useState<GuestSide>(initialValues?.side || 'GROOM');
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [photo, setPhoto] = useState<File | string | null>(initialValues?.photoUrl || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSubmit(
      {
        name,
        phone: phone || undefined,
        email: email || undefined,
        address: address || undefined,
        city: city || undefined,
        relation,
        side,
        notes: notes || undefined,
      },
      photo
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo with Camera capture */}
      <div className="flex flex-col items-center pb-2">
        <GuestPhoto
          photoUrl={typeof photo === 'string' ? photo : undefined}
          guestName={name}
          onPhotoChange={setPhoto}
        />
        <span className="text-xs text-muted-foreground mt-2">
          Click Camera to take photo or Upload
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label htmlFor="guest-name">Full Name (पूरा नाम) *</Label>
          <Input
            id="guest-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Kumar Sharma"
          />
        </div>

        {/* Relation */}
        <div className="space-y-2">
          <Label htmlFor="guest-relation">Relation (रिश्ता)</Label>
          <Select value={relation} onValueChange={setRelation}>
            <SelectTrigger id="guest-relation">
              <SelectValue placeholder="Select relation" />
            </SelectTrigger>
            <SelectContent>
              {RELATION_TYPES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label} ({r.labelHindi})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Side */}
        <div className="space-y-2">
          <Label htmlFor="guest-side">Side (पक्ष)</Label>
          <Select value={side} onValueChange={(v) => setSide(v as GuestSide)}>
            <SelectTrigger id="guest-side">
              <SelectValue placeholder="Select side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GROOM">Groom Side (वर पक्ष)</SelectItem>
              <SelectItem value="BRIDE">Bride Side (वधू पक्ष)</SelectItem>
              <SelectItem value="MUTUAL">Mutual (दोनों तरफ से)</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="guest-phone">Phone Number</Label>
          <Input
            id="guest-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="guest-city">City / Hometown</Label>
          <Input
            id="guest-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Jaipur, Delhi, Mumbai"
          />
        </div>

        {/* Address */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label htmlFor="guest-address">Postal Address</Label>
          <Textarea
            id="guest-address"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House/Street, Area, Pincode"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label htmlFor="guest-notes">Personal Notes</Label>
          <Input
            id="guest-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details or family tree context"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base py-5"
      >
        {isLoading ? 'Saving...' : 'Save Guest Details'}
      </Button>
    </form>
  );
};
