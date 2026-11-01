'use client';

import React, { useState } from 'react';
import { CreateGiftInput, GiftType, EnvelopeStyle, CashBreakdown, EventData, GuestData } from '@/types';
import { ENVELOPE_STYLES } from '@/utils/constants';
import { DenominationPicker } from '@/components/currency/DenominationPicker';
import { VoiceCommandPanel } from '@/components/voice/VoiceCommandPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateBreakdown } from '@/lib/currency';
import { formatCurrency } from '@/utils/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Mic,
  Keyboard,
  Gift,
  IndianRupee,
  Image as ImageIcon,
  UserPlus,
  X,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface GiftFormProps {
  events: EventData[];
  guests: GuestData[];
  onSubmit: (data: CreateGiftInput, itemImage?: File | null) => Promise<void>;
  isLoading?: boolean;
}

export const GiftForm: React.FC<GiftFormProps> = ({
  events,
  guests: initialGuests,
  onSubmit,
  isLoading = false,
}) => {
  const { t, language } = useLanguage();

  // Local lists to support inline dynamic additions
  const [eventList, setEventList] = useState<EventData[]>(events);
  const [guestList, setGuestList] = useState<GuestData[]>(initialGuests);
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [selectedGuestId, setSelectedGuestId] = useState(initialGuests[0]?.id || '');
  const [guestSearch, setGuestSearch] = useState('');

  // Inline Quick Add Event State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('WEDDING');
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // Inline Quick Add Relative State
  const [showAddRelative, setShowAddRelative] = useState(false);
  const [newRelativeName, setNewRelativeName] = useState('');
  const [newRelativeRelation, setNewRelativeRelation] = useState('paternal_uncle');
  const [newRelativePhone, setNewRelativePhone] = useState('');
  const [newRelativeCity, setNewRelativeCity] = useState('');
  const [newRelativeSide, setNewRelativeSide] = useState<'GROOM' | 'BRIDE'>('GROOM');
  const [isSavingRelative, setIsSavingRelative] = useState(false);
  const [recentlyAddedGuest, setRecentlyAddedGuest] = useState<string | null>(null);

  // Gift Details
  const [giftType, setGiftType] = useState<GiftType>('CASH');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [cashBreakdown, setCashBreakdown] = useState<CashBreakdown>({});
  const [giftDescription, setGiftDescription] = useState('');
  const [envelopeStyle, setEnvelopeStyle] = useState<EnvelopeStyle>('CLASSIC_RED');
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Quick relation presets for inline adding
  const quickRelations = [
    { label: 'चाचा (Uncle)', value: 'paternal_uncle' },
    { label: 'मामा (Maternal Uncle)', value: 'maternal_uncle' },
    { label: 'बुआ (Aunt)', value: 'paternal_aunt' },
    { label: 'मौसी (Mausi)', value: 'maternal_aunt' },
    { label: 'ताऊजी', value: 'elder_uncle' },
    { label: 'दादा / नाना', value: 'grandparent' },
    { label: 'दोस्त (Friend)', value: 'family_friend' },
    { label: 'कज़न (Cousin)', value: 'cousin' },
  ];

  const handleVoiceParsed = (result: any) => {
    if (result.guestName) {
      // Find matching guest by name in the local list
      const match = guestList.find((g) =>
        g.name.toLowerCase().includes(result.guestName.toLowerCase())
      );
      if (match) {
        setSelectedGuestId(match.id);
      } else {
        // If voice mentions someone not in the list, prefill the inline quick-add!
        setNewRelativeName(result.guestName);
        setShowAddRelative(true);
      }
    }
    if (result.cashAmount) {
      setCashAmount(result.cashAmount);
      const breakdown = calculateBreakdown(result.cashAmount);
      setCashBreakdown(breakdown);
    }
    if (result.giftDescription) {
      setGiftDescription(result.giftDescription);
    }
    if (result.giftType) {
      setGiftType(result.giftType);
    }
    if (result.rawTranscript) {
      setVoiceTranscript(result.rawTranscript);
    }
  };

  const handleDenominationChange = (breakdown: CashBreakdown, total: number) => {
    setCashBreakdown(breakdown);
    setCashAmount(total);
  };

  // Inline Quick Add Relative Handler
  const handleSaveInlineRelative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelativeName.trim()) {
      alert(language === 'hi' ? 'कृपया रिश्तेदार का नाम लिखें' : 'Please enter relative name');
      return;
    }

    setIsSavingRelative(true);
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRelativeName.trim(),
          relation: newRelativeRelation,
          phone: newRelativePhone.trim() || undefined,
          city: newRelativeCity.trim() || undefined,
          side: newRelativeSide,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const createdGuest: GuestData = data.data;

        // Append to local guest list
        setGuestList((prev) => [createdGuest, ...prev]);

        // Auto-select this newly created relative
        setSelectedGuestId(createdGuest.id);
        setRecentlyAddedGuest(createdGuest.name);

        // Reset inline form fields
        setNewRelativeName('');
        setNewRelativePhone('');
        setNewRelativeCity('');
        setGuestSearch('');
        setShowAddRelative(false);
      } else {
        alert(data.error || 'Failed to save relative');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving relative');
    } finally {
      setIsSavingRelative(false);
    }
  };

  const handleSaveEvent = async () => {
    if (!newEventTitle.trim()) {
      alert(language === 'hi' ? 'कृपया समारोह का नाम दर्ज करें।' : 'Please enter an event title.');
      return;
    }

    setIsSavingEvent(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle.trim(),
          eventType: newEventType,
          eventDate: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const createdEvent: EventData = data.data;
        setEventList((prev) => [createdEvent, ...prev]);
        setSelectedEventId(createdEvent.id);
        setNewEventTitle('');
        setShowAddEvent(false);
      } else {
        alert(data.error || 'Failed to create event');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating event');
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !selectedGuestId) {
      alert(language === 'hi' ? 'कृपया समारोह और रिश्तेदार दोनों चुनें।' : 'Please select both an event and a guest.');
      return;
    }

    if (giftType === 'CASH' && (!cashAmount || cashAmount <= 0)) {
      alert(language === 'hi' ? 'कृपया नकद राशि दर्ज करें या बोलकर बताएं।' : 'Please enter a cash amount or speak the amount.');
      return;
    }

    if (giftType === 'GIFT_ITEM' && !giftDescription.trim()) {
      alert(language === 'hi' ? 'कृपया उपहार का विवरण दर्ज करें।' : 'Please enter a gift item description.');
      return;
    }

    await onSubmit(
      {
        eventId: selectedEventId,
        guestId: selectedGuestId,
        giftType,
        cashAmount: cashAmount > 0 ? cashAmount : undefined,
        cashBreakdown: Object.keys(cashBreakdown).length > 0 ? cashBreakdown : undefined,
        giftDescription: giftDescription || undefined,
        envelopeStyle,
        voiceTranscript: voiceTranscript || undefined,
      },
      itemImage
    );
  };

  const filteredGuests = guestList.filter(
    (g) =>
      !guestSearch ||
      g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      (g.relation && g.relation.toLowerCase().includes(guestSearch.toLowerCase()))
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event and Guest Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Event Selector with Quick Add */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-white">{t('selectEvent')}</Label>
            <button
              type="button"
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4EECD3] hover:underline"
            >
              <span>{showAddEvent ? 'Close' : '+ Add Event'}</span>
            </button>
          </div>

          {showAddEvent && (
            <div className="p-3.5 rounded-2xl bg-[#0F1523] border border-[#2563EB]/40 space-y-2.5 animate-in fade-in">
              <Input
                placeholder="e.g. Wedding Reception (शुभ विवाह)"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="h-9 text-xs rounded-xl bg-[#0B0F19] border-[#1E2638] text-white"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddEvent(false)}
                  className="h-7 text-xs text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveEvent}
                  disabled={isSavingEvent || !newEventTitle.trim()}
                  className="h-7 text-xs bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg font-bold"
                >
                  {isSavingEvent ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save & Select'}
                </Button>
              </div>
            </div>
          )}

          <Select value={selectedEventId} onValueChange={setSelectedEventId} required>
            <SelectTrigger className="h-11 rounded-xl bg-[#0F1523] border-[#1E2638] text-white">
              <SelectValue placeholder={eventList.length === 0 ? "No events yet — click + Add Event" : "Choose event"} />
            </SelectTrigger>
            <SelectContent className="bg-[#0F1523] border-[#1E2638] text-white">
              {eventList.map((e) => (
                <SelectItem key={e.id} value={e.id} className="text-white hover:bg-[#131B2E]">
                  {e.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guest Selector with Seamless Inline Add Option */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-white">{t('selectGuest')}</Label>
            {/* Prominent Quick Add Relative Button */}
            <button
              type="button"
              onClick={() => {
                setShowAddRelative(!showAddRelative);
                if (guestSearch && !newRelativeName) {
                  setNewRelativeName(guestSearch);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#2563EB] hover:bg-blue-600 text-white px-3.5 py-1.5 rounded-full shadow-md shadow-blue-600/30 transition hover:scale-105 active:scale-95"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{showAddRelative ? t('closeInlineAdd') : `+ ${t('addNewRelativeInline')}`}</span>
            </button>
          </div>

          {/* Recently Added Confirmation Banner */}
          {recentlyAddedGuest && (
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-400/40 px-3 py-1.5 text-xs text-[#4EECD3] font-semibold animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {language === 'hi' ? 'चयनित रिश्तेदार:' : 'Selected Relative:'} <strong>{recentlyAddedGuest}</strong>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setRecentlyAddedGuest(null)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick Search & Select */}
          <div className="space-y-1.5">
            <Input
              type="text"
              placeholder={
                language === 'hi'
                  ? 'रिश्तेदार खोजें (जैसे रमेश, प्रिया, विक्रम)...'
                  : 'Search relative by name (e.g. Ramesh, Priya, Vikram)...'
              }
              value={guestSearch}
              onChange={(e) => setGuestSearch(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#131B2E] border-[#1E2638] text-white placeholder:text-slate-500 focus-visible:ring-[#2563EB]"
            />

            <Select value={selectedGuestId} onValueChange={setSelectedGuestId} required>
              <SelectTrigger className="h-11 rounded-xl bg-[#131B2E] border-[#1E2638] text-white">
                <SelectValue placeholder="Choose guest from list" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F1523] border-[#1E2638] text-white">
                {filteredGuests.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400 space-y-2">
                    <p>
                      {language === 'hi'
                        ? `"${guestSearch}" सूची में नहीं हैं`
                        : `No relative found matching "${guestSearch}"`}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setNewRelativeName(guestSearch);
                        setShowAddRelative(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#4EECD3] hover:underline"
                    >
                      <UserPlus className="h-3 w-3" />
                      <span>
                        {language === 'hi'
                          ? `+ "${guestSearch}" को तुरंत जोड़ें`
                          : `+ Add "${guestSearch}" as New Relative`}
                      </span>
                    </button>
                  </div>
                ) : (
                  filteredGuests.map((g) => (
                    <SelectItem key={g.id} value={g.id} className="text-white hover:bg-[#131B2E]">
                      {g.name} {g.relation ? `(${g.relation.replace('_', ' ')})` : ''}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5 px-1">
              <span>{language === 'hi' ? 'रिश्तेदार सूची में नहीं मिले?' : 'Relative not in list?'}</span>
              <button
                type="button"
                onClick={() => {
                  setNewRelativeName(guestSearch || '');
                  setShowAddRelative(true);
                }}
                className="text-[#4EECD3] hover:underline font-bold"
              >
                {language === 'hi' ? '+ तुरंत नया रिश्तेदार जोड़ें (यहीं पर)' : '+ Add Relative Now (stays on this page)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INLINE QUICK ADD RELATIVE CARD (Expands without leaving tab) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showAddRelative && (
        <div className="rounded-2xl border-2 border-[#2563EB]/60 bg-[#0F1523] p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between border-b border-[#1E2638] pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4EECD3] font-sans">
              <UserPlus className="h-4 w-4 text-[#2563EB]" />
              <span>{t('quickAddRelativeTitle')}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddRelative(false)}
              className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-[#131B2E]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Name */}
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="inline-name" className="text-xs font-semibold text-white">
                {t('relativeName')}
              </Label>
              <Input
                id="inline-name"
                required
                value={newRelativeName}
                onChange={(e) => setNewRelativeName(e.target.value)}
                placeholder="e.g. Ramesh Kumar Sharma (रमेश चाचाजी)"
                className="h-10 text-sm rounded-xl border-[#1E2638] bg-[#131B2E] text-white placeholder:text-slate-500"
              />
            </div>

            {/* Quick Relation Chips */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold text-white">{t('relativeRelation')}</Label>
              <div className="flex flex-wrap gap-1.5">
                {quickRelations.map((qr) => (
                  <button
                    key={qr.value}
                    type="button"
                    onClick={() => setNewRelativeRelation(qr.value)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all',
                      newRelativeRelation === qr.value
                        ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-md'
                        : 'bg-[#131B2E] hover:bg-[#1E2638] text-slate-300 border-[#1E2638]'
                    )}
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone & City */}
            <div className="space-y-1">
              <Label htmlFor="inline-phone" className="text-xs font-semibold text-white">
                {t('relativePhone')}
              </Label>
              <Input
                id="inline-phone"
                value={newRelativePhone}
                onChange={(e) => setNewRelativePhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="h-9 text-xs rounded-xl bg-[#131B2E] border-[#1E2638] text-white"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="inline-city" className="text-xs font-semibold text-white">
                {t('relativeCity')}
              </Label>
              <Input
                id="inline-city"
                value={newRelativeCity}
                onChange={(e) => setNewRelativeCity(e.target.value)}
                placeholder="e.g. Delhi, Jaipur, Mumbai"
                className="h-9 text-xs rounded-xl bg-[#131B2E] border-[#1E2638] text-white"
              />
            </div>

            {/* Side */}
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs font-semibold text-white">{t('relativeSide')}</Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewRelativeSide('GROOM')}
                  className={cn(
                    'flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all',
                    newRelativeSide === 'GROOM'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-[#131B2E] text-slate-400 border-[#1E2638]'
                  )}
                >
                  {t('sideGroom')}
                </button>
                <button
                  type="button"
                  onClick={() => setNewRelativeSide('BRIDE')}
                  className={cn(
                    'flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all',
                    newRelativeSide === 'BRIDE'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-[#131B2E] text-slate-400 border-[#1E2638]'
                  )}
                >
                  {t('sideBride')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E2638]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAddRelative(false)}
              className="text-xs rounded-xl text-slate-400 hover:text-white"
            >
              {t('cancel')}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveInlineRelative}
              disabled={isSavingRelative || !newRelativeName.trim()}
              className="bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs rounded-xl gap-1.5 shadow-lg shadow-blue-600/30"
            >
              {isSavingRelative ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              <span>{t('saveAndSelect')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Input Mode Tabs: Voice or Manual */}
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12 p-1 bg-muted/60">
          <TabsTrigger value="manual" className="rounded-xl gap-2 font-semibold">
            <Keyboard className="h-4 w-4" />
            <span>{t('manualEntryTab')}</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="rounded-xl gap-2 text-amber-600 font-bold">
            <Mic className="h-4 w-4" />
            <span>{t('voiceCommandTab')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Voice Command Tab */}
        <TabsContent value="voice" className="pt-4">
          <div className="rounded-2xl border p-4 bg-muted/20">
            <VoiceCommandPanel onParsedResult={handleVoiceParsed} />
          </div>
        </TabsContent>

        {/* Manual Entry Tab */}
        <TabsContent value="manual" className="pt-4 space-y-6">
          {/* Gift Type selector */}
          <div className="space-y-2">
            <Label className="font-semibold text-foreground">{t('giftTypeLabel')}</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant={giftType === 'CASH' ? 'default' : 'outline'}
                onClick={() => setGiftType('CASH')}
                className="gap-2 rounded-xl font-bold"
              >
                <IndianRupee className="h-4 w-4" />
                <span>{t('cashOnly')}</span>
              </Button>
              <Button
                type="button"
                variant={giftType === 'GIFT_ITEM' ? 'default' : 'outline'}
                onClick={() => setGiftType('GIFT_ITEM')}
                className="gap-2 rounded-xl font-bold"
              >
                <Gift className="h-4 w-4" />
                <span>{t('giftItemOnly')}</span>
              </Button>
              <Button
                type="button"
                variant={giftType === 'BOTH' ? 'default' : 'outline'}
                onClick={() => setGiftType('BOTH')}
                className="gap-2 rounded-xl font-bold"
              >
                <span>{t('bothCashAndItem')}</span>
              </Button>
            </div>
          </div>

          {/* Cash inputs if CASH or BOTH */}
          {(giftType === 'CASH' || giftType === 'BOTH') && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold text-foreground">{t('cashAmountLabel')}</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={cashAmount || ''}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  placeholder="₹ e.g. 5100"
                  className="text-xl font-bold h-12 rounded-xl border-amber-300"
                />
              </div>

              {/* Denomination Picker with Real Notes/Coins */}
              <DenominationPicker
                value={cashBreakdown}
                onChange={handleDenominationChange}
              />
            </div>
          )}

          {/* Item inputs if GIFT_ITEM or BOTH */}
          {(giftType === 'GIFT_ITEM' || giftType === 'BOTH') && (
            <div className="space-y-4 rounded-2xl border p-4 bg-card">
              <div className="space-y-2">
                <Label className="font-semibold text-foreground">{t('giftDescLabel')}</Label>
                <Input
                  value={giftDescription}
                  onChange={(e) => setGiftDescription(e.target.value)}
                  placeholder="e.g. Gold necklace, Silk Saree, Silver Coin Set"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-foreground">
                  {language === 'hi' ? 'उपहार का फोटो' : 'Gift Item Photo'}
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setItemImage(e.target.files?.[0] || null)}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Envelope Style Picker (6 Beautiful Designs) */}
      <div className="space-y-3 pt-2">
        <Label className="font-semibold text-foreground">
          {language === 'hi' ? 'लिफ़ाफ़े का डिज़ाइन चुनें' : 'Select Envelope Design'}
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(ENVELOPE_STYLES) as EnvelopeStyle[]).map((styleKey) => {
            const conf = ENVELOPE_STYLES[styleKey];
            const isSelected = envelopeStyle === styleKey;
            return (
              <button
                key={styleKey}
                type="button"
                onClick={() => setEnvelopeStyle(styleKey)}
                style={{
                  background: conf.gradient || conf.bodyColor,
                  borderColor: isSelected ? '#ffffff' : conf.borderColor,
                }}
                className={cn(
                  'relative flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 text-white shadow-md transition-all duration-200',
                  isSelected ? 'ring-4 ring-amber-400 scale-105' : 'opacity-85 hover:opacity-100'
                )}
              >
                <span className="text-xs font-bold drop-shadow">{conf.name}</span>
                <span className="text-[10px] opacity-80 mt-0.5">Shagun Envelope</span>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !selectedEventId || !selectedGuestId}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base py-6 rounded-2xl shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-98"
      >
        {isLoading ? t('loading') : t('saveShagunBtn')}
      </Button>
    </form>
  );
};
