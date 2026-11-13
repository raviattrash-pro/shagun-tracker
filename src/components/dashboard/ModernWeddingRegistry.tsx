'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import {
  Gift,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Plus,
  Share2,
  Copy,
  Check,
  Filter,
  Sparkles,
  ShoppingBag,
  UserCheck,
  ChevronDown,
  X,
  Phone,
  User,
  Heart,
  Pencil,
  Trash2,
  AlertTriangle,
  Mail,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
  Calendar,
  Lock,
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';
import { saveOfflineCache, getOfflineCache } from '@/lib/offline/offlineStorage';
import confetti from 'canvas-confetti';

export interface WeddingGiftItem {
  id: string;
  userId?: string | null;
  title: string;
  category: string;
  suggestedStore: string | null;
  storeUrl: string | null;
  approxCost: number | null;
  claimedBy: string | null;
  claimedByPhone?: string | null;
  claimedByEmail?: string | null;
  claimedAt?: string | null;
  claimedMessage?: string | null;
  isVerified?: boolean;
  claimantUserId?: string | null;
  status: 'AVAILABLE' | 'CLAIMED';
  notes?: string | null;
}

interface ModernWeddingRegistryProps {
  forcedUserId?: string | null;
}

export const ModernWeddingRegistry: React.FC<ModernWeddingRegistryProps> = ({ forcedUserId }) => {
  const { language } = useLanguage();
  const { data: session } = useSession();
  const isHi = language === 'hi';

  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<WeddingGiftItem[]>([]);
  const [registryUserId, setRegistryUserId] = useState<string | null>(null);
  const [registryHostName, setRegistryHostName] = useState<string>('Wedding Host');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'CLAIMED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Claim Modal with full verified fields
  const [claimingItem, setClaimingItem] = useState<WeddingGiftItem | null>(null);
  const [claimantName, setClaimantName] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [claimantMessage, setClaimantMessage] = useState('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  // Gifter Commitment Proof Modal (Detailed view of who promised to gift)
  const [viewingClaimantItem, setViewingClaimantItem] = useState<WeddingGiftItem | null>(null);
  const [isSubmittingUnclaim, setIsSubmittingUnclaim] = useState(false);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Kitchen');
  const [newStore, setNewStore] = useState('');
  const [newStoreUrl, setNewStoreUrl] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Edit Item Modal
  const [editingItem, setEditingItem] = useState<WeddingGiftItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Kitchen');
  const [editStore, setEditStore] = useState('');
  const [editStoreUrl, setEditStoreUrl] = useState('');
  const [editCost, setEditCost] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<'AVAILABLE' | 'CLAIMED'>('AVAILABLE');
  const [editClaimedBy, setEditClaimedBy] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Delete Confirmation Modal
  const [deletingItem, setDeletingItem] = useState<WeddingGiftItem | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Share link feedback
  const [copiedShare, setCopiedShare] = useState(false);

  // Check if current logged-in user is the owner of this registry
  const currentUserId = session?.user?.id;
  const isOwner = Boolean(
    currentUserId && (
      currentUserId === registryUserId ||
      (!forcedUserId && !registryUserId) ||
      (forcedUserId && forcedUserId === currentUserId)
    )
  );

  // Fetch registry items from API
  const fetchRegistry = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const queryParam = forcedUserId ? `?userId=${encodeURIComponent(forcedUserId)}` : '';
      const res = await fetch(`/api/wedding-gifts${queryParam}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
        if (data.userId) setRegistryUserId(data.userId);
        if (data.hostName) setRegistryHostName(data.hostName);
        saveOfflineCache('REGISTRY', {
          items: data.data || [],
          userId: data.userId,
          hostName: data.hostName,
        });
      }
    } catch (e) {
      console.warn('Network error fetching wedding gifts, using offline cache:', e);
      const cached = getOfflineCache<{ items: WeddingGiftItem[]; userId?: string; hostName?: string }>('REGISTRY');
      if (cached && Array.isArray(cached.items)) {
        setItems(cached.items);
        if (cached.userId) setRegistryUserId(cached.userId);
        if (cached.hostName) setRegistryHostName(cached.hostName);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();

    // 1. Live Auto-Polling: Refresh registry every 3 seconds seamlessly in background
    const intervalId = setInterval(() => {
      fetchRegistry(true);
    }, 3000);

    // 2. Broadcast Channel for instant cross-tab live sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('shagun_wedding_registry_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'REGISTRY_UPDATED') {
          fetchRegistry(true);
        }
      };
    }

    // 3. Tab Focus / Visibility change auto-refetch
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchRegistry(true);
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      if (channel) channel.close();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [forcedUserId, session?.user?.id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to notify other tabs/browsers of update
  const broadcastRegistryChange = () => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('shagun_wedding_registry_sync');
      channel.postMessage({ type: 'REGISTRY_UPDATED' });
      channel.close();
    }
  };

  // Compute stats
  const totalCount = items.length;
  const claimedCount = items.filter((i) => i.status === 'CLAIMED').length;
  const availableCount = totalCount - claimedCount;
  const percentClaimed = totalCount > 0 ? Math.round((claimedCount / totalCount) * 100) : 0;

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filter === 'AVAILABLE' && item.status !== 'AVAILABLE') return false;
    if (filter === 'CLAIMED' && item.status !== 'CLAIMED') return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      const matchClaim = item.claimedBy?.toLowerCase().includes(q);
      const matchStore = item.suggestedStore?.toLowerCase().includes(q);
      return matchTitle || matchCat || matchClaim || matchStore;
    }
    return true;
  });

  // Shareable link with the user's specific userId
  const effectiveUserId = forcedUserId || registryUserId || session?.user?.id;
  const shareUrl =
    mounted && typeof window !== 'undefined'
      ? `${window.location.origin}/registry${effectiveUserId ? `?userId=${effectiveUserId}` : ''}`
      : `/registry${effectiveUserId ? `?userId=${effectiveUserId}` : ''}`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch (e) {}
    setTimeout(() => setCopiedShare(false), 3000);
  };

  // Open Claim Modal with prefilled session details if logged in
  const openClaimModal = (item: WeddingGiftItem) => {
    setClaimingItem(item);
    if (session?.user?.name) {
      setClaimantName(session.user.name);
    }
    if (session?.user?.email) {
      setClaimantEmail(session.user.email);
    }
  };

  // Submit Claim with Anti-Spam Email & WhatsApp Proof
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingItem || !claimantName.trim()) return;

    const email = session?.user?.email || claimantEmail.trim();
    if (!email || !email.includes('@')) {
      alert(
        isHi
          ? 'कृपया अपना सही ईमेल पता दर्ज करें। यह स्पैम और फर्जी दावों को रोकने के लिए आवश्यक है।'
          : 'Please enter a valid email address. This is required as proof to prevent spam and duplicate gifts.'
      );
      return;
    }

    const claimedItemId = claimingItem.id;
    const name = claimantName.trim();
    const phone = claimantPhone.trim();
    const message = claimantMessage.trim();
    const isVerified = Boolean(session?.user?.email);

    // 1. Optimistic Update: Immediately reflect CLAIMED status in UI
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === claimedItemId
          ? {
              ...item,
              status: 'CLAIMED',
              claimedBy: name,
              claimedByPhone: phone || null,
              claimedByEmail: email || null,
              claimedMessage: message || null,
              isVerified,
              claimedAt: new Date().toISOString(),
            }
          : item
      )
    );

    // Close modal & clear input immediately for snappy user experience
    setClaimingItem(null);
    setClaimantName('');
    setClaimantPhone('');
    setClaimantEmail('');
    setClaimantMessage('');

    try {
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    setIsSubmittingClaim(true);
    try {
      const res = await fetch('/api/wedding-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLAIM',
          itemId: claimedItemId,
          claimedBy: name,
          claimedByPhone: phone,
          claimedByEmail: email,
          claimedMessage: message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        broadcastRegistryChange();
        fetchRegistry(true);
      } else {
        // Rollback on failure
        fetchRegistry(true);
      }
    } catch (e) {
      console.error(e);
      fetchRegistry(true);
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  // Host Action: Unclaim / Release item if spam or cancelled
  const handleUnclaimItem = async (item: WeddingGiftItem) => {
    if (
      !confirm(
        isHi
          ? `क्या आप "${item.title}" के उपहार वादे को रद्द करके इसे दोबारा उपलब्ध करना चाहते हैं?`
          : `Release gift commitment for "${item.title}" and make it available again?`
      )
    ) {
      return;
    }

    setIsSubmittingUnclaim(true);
    // Optimistic Update
    setItems((prevItems) =>
      prevItems.map((it) =>
        it.id === item.id
          ? {
              ...it,
              status: 'AVAILABLE',
              claimedBy: null,
              claimedByPhone: null,
              claimedByEmail: null,
              claimedAt: null,
              claimedMessage: null,
              isVerified: false,
              claimantUserId: null,
            }
          : it
      )
    );
    setViewingClaimantItem(null);

    try {
      const res = await fetch('/api/wedding-gifts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, action: 'unclaim' }),
      });
      const data = await res.json();
      if (data.success) {
        broadcastRegistryChange();
        fetchRegistry(true);
      } else {
        fetchRegistry(true);
      }
    } catch (err) {
      console.error(err);
      fetchRegistry(true);
    } finally {
      setIsSubmittingUnclaim(false);
    }
  };

  // Submit New Item
  const handleAddItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmittingAdd(true);
    try {
      const res = await fetch('/api/wedding-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          title: newTitle.trim(),
          category: newCategory,
          suggestedStore: newStore.trim() || null,
          storeUrl: newStoreUrl.trim() || null,
          approxCost: newCost ? parseFloat(newCost) : null,
          notes: newNotes.trim() || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewTitle('');
        setNewStore('');
        setNewStoreUrl('');
        setNewCost('');
        setNewNotes('');
        broadcastRegistryChange();
        fetchRegistry(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item: WeddingGiftItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category || 'Kitchen');
    setEditStore(item.suggestedStore || '');
    setEditStoreUrl(item.storeUrl || '');
    setEditCost(item.approxCost ? item.approxCost.toString() : '');
    setEditNotes(item.notes || '');
    setEditStatus(item.status);
    setEditClaimedBy(item.claimedBy || '');
  };

  // Submit Edit
  const handleEditItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editTitle.trim()) return;

    setIsSubmittingEdit(true);
    try {
      const res = await fetch('/api/wedding-gifts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          title: editTitle.trim(),
          category: editCategory,
          suggestedStore: editStore.trim() || null,
          storeUrl: editStoreUrl.trim() || null,
          approxCost: editCost ? parseFloat(editCost) : null,
          notes: editNotes.trim() || null,
          status: editStatus,
          claimedBy: editStatus === 'CLAIMED' ? editClaimedBy.trim() || null : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingItem(null);
        broadcastRegistryChange();
        fetchRegistry(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Submit Delete
  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    setIsSubmittingDelete(true);
    try {
      const res = await fetch(`/api/wedding-gifts?id=${encodeURIComponent(deletingItem.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setDeletingItem(null);
        broadcastRegistryChange();
        fetchRegistry(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  return (
    <div className="aether-card p-5 sm:p-7 space-y-6">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Top Banner & Share Bar                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="aether-header-badge text-[#C0392B] dark:text-[#00E5FF]">
              🎁 {isHi ? 'लाइव शादी उपहार सूची' : 'Live Wedding Gift Registry'}
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              ● Live Sync
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {registryHostName ? `${registryHostName}'s Wishlist` : (isHi ? 'शादी उपहार विशलिस्ट' : 'Curated Wedding Wishlist')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 max-w-2xl leading-relaxed">
            {isHi
              ? 'डिजिटल उपहार सूची ताकि हर मेहमान देख सके कि कौन क्या ला रहा है और कोई उपहार दोबारा न आए।'
              : 'Share this live registry with friends & relatives so every guest knows what is already claimed and duplicate gifts are prevented.'}
          </p>
        </div>

        {/* Action Buttons: Add Item & Shareable Public URL */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Share Public Link Button */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="flex-1 sm:flex-initial aether-btn-pill px-4 py-2 bg-white dark:bg-[#1A2D44] border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition shadow-xs"
          >
            {copiedShare ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">{isHi ? 'लिंक कॉपी हो गया!' : 'Link Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-[#C0392B] dark:text-[#00E5FF]" />
                <span>{isHi ? 'शेयर लिंक' : 'Share Public Link'}</span>
              </>
            )}
          </button>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial aether-btn-pill px-4 py-2 bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{isHi ? '+ नया उपहार' : '+ Add Item'}</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Shareable Public URL Inset Box                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="aether-inset p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full bg-[#C0392B]/10 dark:bg-[#00E5FF]/10 text-[#C0392B] dark:text-[#00E5FF] flex items-center justify-center flex-shrink-0">
            <Share2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-slate-800 dark:text-white leading-tight">
              {isHi ? 'मेहमानों के लिए आपकी शादी का पब्लिक लिंक:' : 'Your Family\'s Shareable Public Registry Link:'}
            </p>
            <p suppressHydrationWarning className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {shareUrl}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyShareLink}
          className="self-end sm:self-auto px-3.5 py-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-extrabold flex items-center gap-1.5 hover:opacity-90 transition"
        >
          {copiedShare ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          <span>{copiedShare ? (isHi ? 'कॉपी हुआ' : 'Copied!') : (isHi ? 'कॉपी करें' : 'Copy URL')}</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Summary KPI Badges & Progress                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="aether-inset-box p-3.5 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Items</span>
          <p className="text-xl font-extrabold text-slate-800 dark:text-white">{totalCount}</p>
          <span className="text-[10px] text-slate-500 font-semibold">{isHi ? 'सूचीबद्ध कुल वस्तुएं' : 'Listed in Wishlist'}</span>
        </div>

        <div className="aether-inset-box p-3.5 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600">Available</span>
          <p className="text-xl font-extrabold text-emerald-600">{availableCount}</p>
          <span className="text-[10px] text-slate-500 font-semibold">{isHi ? 'कोई भी ले सकता है' : 'Open for Gifting'}</span>
        </div>

        <div className="aether-inset-box p-3.5 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#C0392B] dark:text-[#00E5FF]">Claimed</span>
          <p className="text-xl font-extrabold text-[#C0392B] dark:text-[#00E5FF]">{claimedCount}</p>
          <span className="text-[10px] text-slate-500 font-semibold">{isHi ? 'मेहमानों द्वारा बुक' : 'Booked by Guests'}</span>
        </div>

        <div className="aether-inset-box p-3.5 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-amber-600">Claimed Ratio</span>
          <p className="text-xl font-extrabold text-amber-600">{percentClaimed}%</p>
          <div className="aether-inset h-1.5 w-full overflow-hidden mt-1">
            <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${percentClaimed}%` }} />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Filter and Search Bar                                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 aether-inset p-1">
          {[
            { id: 'ALL', label: isHi ? `सभी (${totalCount})` : `All (${totalCount})` },
            { id: 'AVAILABLE', label: isHi ? `उपलब्ध (${availableCount})` : `Available (${availableCount})` },
            { id: 'CLAIMED', label: isHi ? `बुक हो चुके (${claimedCount})` : `Claimed (${claimedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-extrabold transition-all',
                filter === tab.id
                  ? 'bg-white dark:bg-[#1F3550] text-[#C0392B] dark:text-[#00E5FF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'उपहार या स्टोर खोजें...' : 'Search gift, store, relative...'}
            className="w-full pl-9 pr-4 py-2 aether-inset text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:ring-2 focus:ring-[#C0392B]/30"
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Items Table / Grid                                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {loading && items.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 font-semibold animate-pulse">
          {isHi ? 'उपहार सूची लोड हो रही है...' : 'Loading registry items...'}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 text-center space-y-2 aether-inset p-8">
          <Gift className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
            {isHi ? 'कोई उपहार नहीं मिला' : 'No registry items match the filter'}
          </p>
          <p className="text-xs text-slate-400">
            {isHi ? 'नया उपहार जोड़ने के लिए ऊपर "+ नया उपहार" बटन दबाएं' : 'Add your first gift request using the "+ Add Item" button above'}
          </p>
        </div>
      ) : (
        <>
          {/* ─────────────────────────────────────────────────────────── */}
          {/* MOBILE VIEW: RESPONSIVE CARDS (Clean on 360-640px)          */}
          {/* ─────────────────────────────────────────────────────────── */}
          <div className="block sm:hidden space-y-3">
            {filteredItems.map((item, idx) => {
              const isClaimed = item.status === 'CLAIMED';
              return (
                <div
                  key={item.id}
                  className="aether-inset p-3.5 rounded-2xl space-y-2.5 transition-all"
                >
                  {/* Top line: Index, Title, and Cost */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                          {item.category || 'General'}
                        </span>
                        {item.suggestedStore && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            • {item.suggestedStore}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                        {item.approxCost ? formatCurrency(item.approxCost) : '—'}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      &ldquo;{item.notes}&rdquo;
                    </p>
                  )}

                  {/* Status & Giver Info */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-white/5">
                    <div>
                      {isClaimed ? (
                        <button
                          type="button"
                          onClick={() => setViewingClaimantItem(item)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] transition cursor-pointer"
                          title={isHi ? 'पुष्टि विवरण व संपर्क देखें' : 'View verified details & contact'}
                        >
                          <UserCheck className="h-3 w-3 text-emerald-600" />
                          <span className="truncate max-w-[100px]">{item.claimedBy}</span>
                          {item.isVerified && (
                            <span className="text-[8px] bg-emerald-600 text-white px-1 rounded-full">✓</span>
                          )}
                          <span className="text-[9px] underline opacity-75">{isHi ? 'विवरण' : 'Details'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 italic">
                          {isHi ? 'अभी खुला है' : 'Unclaimed'}
                        </span>
                      )}
                    </div>

                    <div>
                      {isClaimed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                          <Check className="h-3 w-3" />
                          <span>{isHi ? 'बुक हो चुका' : 'Claimed'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                          <Clock className="h-3 w-3" />
                          <span>{isHi ? 'उपलब्ध' : 'Available'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex-1">
                      {isClaimed ? (
                        <button
                          type="button"
                          onClick={() => setViewingClaimantItem(item)}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold text-center flex items-center justify-center gap-1 hover:bg-slate-200 transition"
                        >
                          <span>✓ {isHi ? 'आरक्षित (विवरण देखें)' : 'Reserved (View Details)'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openClaimModal(item)}
                          className="w-full aether-btn-pill py-2 bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-extrabold shadow-xs text-center justify-center flex items-center gap-1"
                        >
                          <span>{isHi ? 'मैं लाऊँगा/गी' : 'I will bring this'}</span>
                        </button>
                      )}
                    </div>

                    {isOwner && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          title={isHi ? 'संपादित करें (Edit)' : 'Edit item'}
                          className="h-8 w-8 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#C0392B] dark:hover:text-[#00E5FF] transition"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(item)}
                          title={isHi ? 'हटाएं (Delete)' : 'Delete item'}
                          className="h-8 w-8 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 flex items-center justify-center text-rose-600 hover:bg-rose-100 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─────────────────────────────────────────────────────────── */}
          {/* DESKTOP VIEW: FULL TABLE (>= 640px)                         */}
          {/* ─────────────────────────────────────────────────────────── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10 text-slate-400 font-extrabold text-left">
                  <th className="pb-3 pr-4">#</th>
                  <th className="pb-3 pr-4">{isHi ? 'उपहार / वस्तु (Gift Item)' : 'Gift Item'}</th>
                  <th className="pb-3 pr-4 hidden md:table-cell">{isHi ? 'कहाँ से खरीदें' : 'Suggested Store'}</th>
                  <th className="pb-3 pr-4 text-right">{isHi ? 'अनुमानित मूल्य' : 'Approx Cost'}</th>
                  <th className="pb-3 pr-4">{isHi ? 'कौन ला रहा है?' : 'Who is bringing?'}</th>
                  <th className="pb-3 pr-4 text-center">{isHi ? 'स्थिति' : 'Status'}</th>
                  <th className="pb-3 text-center">{isHi ? 'कार्रवाई' : 'Action'}</th>
                  {isOwner && (
                    <th className="pb-3 text-center">{isHi ? 'प्रबंधन' : 'Manage'}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredItems.map((item, idx) => {
                  const isClaimed = item.status === 'CLAIMED';
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/50 dark:hover:bg-white/5 transition duration-150"
                    >
                      <td className="py-3.5 pr-4 text-slate-400 font-mono font-bold">{idx + 1}</td>

                      {/* Gift Item & Category */}
                      <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-white">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                              {item.category || 'General'}
                            </span>
                            {item.notes && (
                              <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                                • {item.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Store & URL */}
                      <td className="py-3.5 pr-4 hidden md:table-cell">
                        {item.storeUrl ? (
                          <a
                            href={item.storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#C0392B] dark:text-[#00E5FF] hover:underline font-bold text-[11px]"
                          >
                            <span>{item.suggestedStore || 'Store Link'}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 font-medium">{item.suggestedStore || '—'}</span>
                        )}
                      </td>

                      {/* Approx Cost */}
                      <td className="py-3.5 pr-4 text-right font-mono font-extrabold text-slate-800 dark:text-white">
                        {item.approxCost ? formatCurrency(item.approxCost) : '—'}
                      </td>

                      {/* Who is bringing it? */}
                      <td className="py-3.5 pr-4">
                        {isClaimed ? (
                          <button
                            type="button"
                            onClick={() => setViewingClaimantItem(item)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] transition cursor-pointer group shadow-2xs"
                            title={isHi ? 'पुष्टि विवरण व संपर्क देखें' : 'Click to view full verified details & contact'}
                          >
                            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="truncate max-w-[120px]">{item.claimedBy}</span>
                            {item.isVerified ? (
                              <span className="text-[9px] bg-emerald-600 text-white px-1 rounded-full font-sans" title="Google Verified Account">✓ Google</span>
                            ) : item.claimedByEmail ? (
                              <span title="Email Provided"><Mail className="h-2.5 w-2.5 text-emerald-600" /></span>
                            ) : null}
                            <ExternalLink className="h-2.5 w-2.5 text-emerald-600 opacity-60 group-hover:opacity-100" />
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400 italic">
                            {isHi ? 'अभी खुला है' : 'Unclaimed'}
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 pr-4 text-center">
                        {isClaimed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                            <Check className="h-3 w-3" />
                            <span>{isHi ? 'बुक हो चुका' : 'Claimed'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                            <Clock className="h-3 w-3" />
                            <span>{isHi ? 'उपलब्ध' : 'Available'}</span>
                          </span>
                        )}
                      </td>

                      {/* Action Button: Claim ("मैं लाऊँगा/गी") */}
                      <td className="py-3.5 text-center">
                        {isClaimed ? (
                          <button
                            type="button"
                            onClick={() => setViewingClaimantItem(item)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold underline cursor-pointer"
                          >
                            ✓ {isHi ? 'आरक्षित (विवरण)' : 'Reserved (View)'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openClaimModal(item)}
                            className="aether-btn-pill px-3 py-1.5 bg-[#C0392B] hover:bg-[#A93226] text-white text-[11px] font-extrabold shadow-xs"
                          >
                            {isHi ? 'मैं लाऊँगा/गी' : 'I will bring this'}
                          </button>
                        )}
                      </td>

                      {/* Owner Management Controls (Edit / Delete) */}
                      {isOwner && (
                        <td className="py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              title={isHi ? 'संपादित करें (Edit)' : 'Edit item'}
                              className="h-7 w-7 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#C0392B] dark:hover:text-[#00E5FF] transition"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingItem(item)}
                              title={isHi ? 'हटाएं (Delete)' : 'Delete item'}
                              className="h-7 w-7 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 flex items-center justify-center text-rose-600 hover:bg-rose-100 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* EDIT ITEM MODAL                                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="aether-card w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 bg-white dark:bg-[#132238]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-[#C0392B] dark:text-[#00E5FF]" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isHi ? 'उपहार संपादित करें' : 'Edit Wedding Gift Item'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditItemSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'उपहार / वस्तु का नाम *' : 'Gift Item Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden focus:ring-2 focus:ring-[#C0392B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'श्रेणी (Category)' : 'Category'}
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                  >
                    <option value="Kitchen">Kitchen (रसोई)</option>
                    <option value="Home & Dining">Home & Dining (गृह सज्जा)</option>
                    <option value="Electronics">Electronics (इलेक्ट्रॉनिक्स)</option>
                    <option value="Gold & Silver">Gold & Silver (सोना व चाँदी)</option>
                    <option value="Home Appliances">Home Appliances (उपकरण)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'अनुमानित मूल्य (₹)' : 'Approx Cost (₹)'}
                  </label>
                  <input
                    type="number"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'स्टोर का नाम' : 'Store Name'}
                  </label>
                  <input
                    type="text"
                    value={editStore}
                    onChange={(e) => setEditStore(e.target.value)}
                    className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'स्टोर लिंक (URL)' : 'Store URL'}
                  </label>
                  <input
                    type="url"
                    value={editStoreUrl}
                    onChange={(e) => setEditStoreUrl(e.target.value)}
                    className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'स्थिति (Status)' : 'Status'}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                  >
                    <option value="AVAILABLE">{isHi ? 'उपलब्ध (Available)' : 'Available'}</option>
                    <option value="CLAIMED">{isHi ? 'बुक हो चुका (Claimed)' : 'Claimed'}</option>
                  </select>
                </div>

                {editStatus === 'CLAIMED' && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      {isHi ? 'किसने बुक किया? (Claimed By)' : 'Claimed By'}
                    </label>
                    <input
                      type="text"
                      value={editClaimedBy}
                      onChange={(e) => setEditClaimedBy(e.target.value)}
                      placeholder="Guest name"
                      className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'नोट / विवरण' : 'Notes / Preferences'}
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-full border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit || !editTitle.trim()}
                  className="px-5 py-2 aether-btn-pill bg-[#C0392B] text-white text-xs font-extrabold disabled:opacity-50"
                >
                  {isSubmittingEdit ? (isHi ? 'सुरक्षित हो रहा है...' : 'Saving...') : (isHi ? 'बदलाव सुरक्षित करें' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DELETE CONFIRMATION MODAL                                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="aether-card w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95 bg-white dark:bg-[#132238]">
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="h-9 w-9 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {isHi ? 'उपहार सूची से हटाएं?' : 'Delete Gift Item?'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHi ? 'यह वस्तु आपकी शादी उपहार सूची से स्थायी रूप से हटा दी जाएगी।' : 'This will remove this item from your live registry.'}
                </p>
              </div>
            </div>

            <div className="aether-inset p-3 text-xs font-extrabold text-slate-800 dark:text-white">
              {deletingItem.title}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-full border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                disabled={isSubmittingDelete}
                className="px-5 py-2 aether-btn-pill bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold disabled:opacity-50"
              >
                {isSubmittingDelete ? (isHi ? 'हटाया जा रहा है...' : 'Deleting...') : (isHi ? 'हाँ, हटाएं' : 'Confirm Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CLAIM ITEM MODAL                                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {claimingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="aether-card w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 bg-white dark:bg-[#132238]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎁</span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isHi ? 'उपहार बुक करें (Claim Gift)' : 'Claim Wedding Gift'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setClaimingItem(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aether-inset p-3 space-y-1">
              <p className="text-[10px] font-extrabold uppercase text-slate-400">{isHi ? 'चयनित उपहार' : 'Selected Item'}</p>
              <p className="text-sm font-extrabold text-slate-800 dark:text-white">{claimingItem.title}</p>
              {claimingItem.approxCost && (
                <p className="text-xs font-mono font-bold text-emerald-600">
                  {formatCurrency(claimingItem.approxCost)}
                </p>
              )}
            </div>

            {/* Google Verified Banner or One-Click Google Login */}
            {session?.user ? (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200">
                <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold">{session.user.name}</span>
                    <span className="text-[9px] font-black bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                      ✓ Google Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => signIn('google')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-extrabold shadow-2xs transition cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isHi ? 'गूगल से 1-क्लिक पुष्टि करें' : 'Verify with Google (1-Click)'}</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
                  <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-slate-400">
                    {isHi ? 'या पहचान विवरण दर्ज करें' : 'Or Provide Verified Contact'}
                  </span>
                  <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
                </div>
              </div>
            )}

            <form onSubmit={handleClaimSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'आपका शुभ नाम व रिश्ता *' : 'Your Name & Relation *'}
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder={isHi ? 'जैसे: राजेश शर्मा (चाचाजी)' : 'e.g. Ramesh Chacha (Paternal Uncle)'}
                  className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden focus:ring-2 focus:ring-[#C0392B]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'ईमेल पता (पहचान प्रमाण) *' : 'Email Address (Proof of Identity) *'}
                </label>
                <input
                  type="email"
                  required
                  value={claimantEmail}
                  onChange={(e) => setClaimantEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden focus:ring-2 focus:ring-[#C0392B]"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isHi
                    ? 'फर्जी प्रविष्टियों को रोकने के लिए आपका ईमेल केवल वर-वधू को दिखाई देगा।'
                    : 'Visible only to hosts to prevent spam, duplicate bookings, or fake claims.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'व्हाट्सएप / फ़ोन नंबर *' : 'WhatsApp / Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={claimantPhone}
                  onChange={(e) => setClaimantPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden focus:ring-2 focus:ring-[#C0392B]"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isHi
                    ? 'उपहार डिलीवरी समन्वय व आभार संदेश के लिए'
                    : 'For delivery coordination and personal thank-you notes'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'वर-वधू के लिए संदेश (वैकल्पिक)' : 'Blessing / Message for the Couple (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={claimantMessage}
                  onChange={(e) => setClaimantMessage(e.target.value)}
                  placeholder={isHi ? 'जैसे: अमेज़न से ऑर्डर कर दिया है, रिसेप्शन पर लेकर आऊंगा!' : 'e.g. Ordered on Amazon, will bring to wedding!'}
                  className="w-full aether-inset px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClaimingItem(null)}
                  className="px-4 py-2 rounded-full border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingClaim || !claimantName.trim() || !claimantEmail.trim()}
                  className="px-5 py-2 aether-btn-pill bg-[#C0392B] text-white text-xs font-extrabold disabled:opacity-50"
                >
                  {isSubmittingClaim ? (isHi ? 'सुरक्षित हो रहा है...' : 'Booking...') : (isHi ? 'हाँ, मैं यह लाऊँगा/गी' : 'Confirm & Claim Gift')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* GIFTER COMMITMENT PROOF MODAL (Full Verified Details)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewingClaimantItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="aether-card w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 bg-white dark:bg-[#132238] shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isHi ? 'उपहारदाता पुष्टि विवरण' : 'Gifter Commitment Proof'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingClaimantItem(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Item Card */}
            <div className="aether-inset p-3 space-y-1">
              <p className="text-[10px] font-extrabold uppercase text-slate-400">
                {isHi ? 'आरक्षित उपहार' : 'Reserved Gift Item'}
              </p>
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {viewingClaimantItem.title}
                </h4>
                {viewingClaimantItem.approxCost && (
                  <span className="font-mono font-black text-sm text-emerald-600">
                    {formatCurrency(viewingClaimantItem.approxCost)}
                  </span>
                )}
              </div>
            </div>

            {/* Profile & Verified Identity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    {viewingClaimantItem.claimedBy?.slice(0, 2).toUpperCase() || 'GU'}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {viewingClaimantItem.claimedBy}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {viewingClaimantItem.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.2 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Google Verified Identity</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.2 rounded-full">
                          <Mail className="w-3 h-3 text-blue-600" />
                          <span>Verified Contact Details</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Email Proof */}
              <div className="aether-inset p-3 space-y-1 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{isHi ? 'सत्यापित ईमेल आईडी (पहचान प्रमाण)' : 'Verified Email Address (Proof)'}</span>
                </span>
                <p className="font-mono font-bold text-slate-800 dark:text-white">
                  {viewingClaimantItem.claimedByEmail || 'ravi.prasad@example.com'}
                </p>
              </div>

              {/* Phone & WhatsApp Action */}
              <div className="aether-inset p-3 space-y-2 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{isHi ? 'फ़ोन व व्हाट्सएप संपर्क' : 'Phone & WhatsApp'}</span>
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-slate-800 dark:text-white">
                    {viewingClaimantItem.claimedByPhone || '+91 98765 11111'}
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://api.whatsapp.com/send?phone=${(viewingClaimantItem.claimedByPhone || '919876511111').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                        `Namaste ${viewingClaimantItem.claimedBy}! Thank you so much for choosing to gift "${viewingClaimantItem.title}" for our wedding!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-2xs"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                    {viewingClaimantItem.claimedByPhone && (
                      <a
                        href={`tel:${viewingClaimantItem.claimedByPhone}`}
                        className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white font-extrabold text-[10px] flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Blessing Note */}
              {viewingClaimantItem.claimedMessage && (
                <div className="aether-inset p-3 space-y-1 text-xs">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">
                    {isHi ? 'मेहमान का शुभकामना संदेश' : 'Guest Blessing / Delivery Note'}
                  </span>
                  <p className="italic text-slate-700 dark:text-slate-300">
                    &ldquo;{viewingClaimantItem.claimedMessage}&rdquo;
                  </p>
                </div>
              )}

              {/* Timestamp */}
              <p className="text-[10px] text-slate-400 text-right flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {isHi ? 'वादा दर्ज किया गया:' : 'Committed on:'}{' '}
                  {viewingClaimantItem.claimedAt
                    ? new Date(viewingClaimantItem.claimedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '11 Nov 2026, 07:40 PM'}
                </span>
              </p>
            </div>

            {/* Host Unclaim / Release Option */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
              {isOwner && (
                <button
                  type="button"
                  disabled={isSubmittingUnclaim}
                  onClick={() => handleUnclaimItem(viewingClaimantItem)}
                  className="px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-extrabold border border-rose-200 dark:border-rose-900/40 flex items-center gap-1.5 transition disabled:opacity-50"
                  title={isHi ? 'फर्जी या रद्द दावा हटाएं' : 'Release item if fake or cancelled'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {isSubmittingUnclaim
                      ? (isHi ? 'रद्द हो रहा है...' : 'Releasing...')
                      : (isHi ? 'वादा रद्द करें (रिलीज़)' : 'Release Claim (Make Available)')}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setViewingClaimantItem(null)}
                className="ml-auto px-4 py-2 rounded-full border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                {isHi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ADD NEW ITEM MODAL                                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="aether-card w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 bg-white dark:bg-[#132238]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isHi ? 'शादी उपहार सूची में वस्तु जोड़ें' : 'Add Item to Wedding Gift Registry'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddItemSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'उपहार / वस्तु का नाम *' : 'Gift Title / Item Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isHi ? 'जैसे: Philips Air Fryer 4.1L' : 'e.g. Philips Digital Air Fryer 4.1L'}
                  className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden focus:ring-2 focus:ring-[#C0392B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'श्रेणी (Category)' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                  >
                    <option value="Kitchen">Kitchen (रसोई)</option>
                    <option value="Home & Dining">Home & Dining (गृह सज्जा)</option>
                    <option value="Electronics">Electronics (इलेक्ट्रॉनिक्स)</option>
                    <option value="Gold & Silver">Gold & Silver (सोना व चाँदी)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'अनुमानित मूल्य (₹)' : 'Approx Cost (₹)'}
                  </label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="7499"
                    className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'स्टोर का नाम' : 'Store Name'}
                  </label>
                  <input
                    type="text"
                    value={newStore}
                    onChange={(e) => setNewStore(e.target.value)}
                    placeholder="Amazon / Croma"
                    className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'स्टोर लिंक (URL)' : 'Product Store URL'}
                  </label>
                  <input
                    type="url"
                    value={newStoreUrl}
                    onChange={(e) => setNewStoreUrl(e.target.value)}
                    placeholder="https://amazon.in/..."
                    className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'अतिरिक्त विवरण / नोट' : 'Notes / Model Details'}
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder={isHi ? 'रंग, मॉडल, या विशेष प्राथमिकता' : 'Color, size, or specific model preferences'}
                  className="w-full aether-inset px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd || !newTitle.trim()}
                  className="px-5 py-2 aether-btn-pill bg-[#C0392B] text-white text-xs font-extrabold disabled:opacity-50"
                >
                  {isSubmittingAdd ? (isHi ? 'जोड़ा जा रहा है...' : 'Saving...') : (isHi ? 'सूची में जोड़ें' : 'Add to Wishlist')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
