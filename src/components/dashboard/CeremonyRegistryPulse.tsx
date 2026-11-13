'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Calendar,
  Gift,
  Share2,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  ExternalLink,
  MapPin,
  RefreshCw,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/utils/cn';

interface CeremonyRegistryPulseProps {
  totalGiftsCount?: number;
  totalGuestsCount?: number;
  pendingReciprocityCount?: number;
}

export const CeremonyRegistryPulse: React.FC<CeremonyRegistryPulseProps> = ({
  totalGiftsCount = 8,
  totalGuestsCount = 8,
  pendingReciprocityCount = 5,
}) => {
  const { language } = useLanguage();
  const { data: session } = useSession();
  const isHi = language === 'hi';

  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/wedding-gifts')
        .then((r) => r.json())
        .then((d) => {
          const uid = d.userId || session?.user?.id;
          setShareUrl(`${window.location.origin}/registry${uid ? `?userId=${uid}` : ''}`);
        })
        .catch(() => {
          setShareUrl(`${window.location.origin}/registry`);
        });
    }
  }, [session?.user?.id]);

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = isHi
      ? `नमस्ते! हमारे विवाह समारोह की लाइव उपहार विशलिस्ट (Wedding Gift Registry) यहाँ देखें: ${shareUrl}`
      : `Hello! Check out our official Wedding Gift Registry wishlist here: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="aether-card p-4 sm:p-5 select-none transition-all border-l-4 border-l-[#C0392B] dark:border-l-[#00E5FF]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
        {/* ─── SECTION 1: UPCOMING CEREMONY & SACRED MUHURAT (5 cols) ─── */}
        <div className="lg:col-span-5 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#C0392B]/10 text-[#C0392B] dark:bg-[#00E5FF]/10 dark:text-[#00E5FF] border border-[#C0392B]/20 dark:border-[#00E5FF]/20">
              💍 {isHi ? 'मुख्य वैवाहिक समारोह' : 'Upcoming Ceremony'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/40 px-2 py-0.2 rounded-full">
              <Clock className="w-3 h-3" />
              <span>28 {isHi ? 'दिन शेष' : 'Days to go'}</span>
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
            {isHi ? 'आरव एवं दिया शुभ विवाह उत्सव' : 'Aarav & Diya Wedding Ceremony'}
          </h3>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>The Leela Palace, Jaipur</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isHi ? 'शुभ मुहूर्त: 07:15 PM गोधूलि वेला' : 'Shubh Muhurat: 07:15 PM'}
            </span>
          </div>
        </div>

        {/* ─── SECTION 2: LIVE REGISTRY & GIFTER VERIFICATION STATUS (4 cols) ─── */}
        <div className="lg:col-span-4 space-y-2 border-t lg:border-t-0 lg:border-l border-slate-200/60 dark:border-white/10 pt-3 lg:pt-0 lg:pl-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#C0392B] dark:text-[#00E5FF]" />
              <span>{isHi ? 'विशलिस्ट स्थिति (Registry)' : 'Live Wishlist Pulse'}</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              1 / {totalGiftsCount} {isHi ? 'बुक' : 'Claimed'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 aether-inset h-2 overflow-hidden p-0.5 rounded-full">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C0392B] to-[#F39C12]"
                style={{ width: `${Math.round((1 / Math.max(totalGiftsCount, 1)) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              {Math.round((1 / Math.max(totalGiftsCount, 1)) * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>
              {isHi
                ? 'गूगल व फोन सत्यापन सुरक्षा सक्रिय (एंटी-स्पैम प्रोटेक्टेड)'
                : 'Google & Phone verification active (Anti-Spam)'}
            </span>
          </div>
        </div>

        {/* ─── SECTION 3: QUICK SHARE & HOST ACTIONS (3 cols) ─── */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 border-t lg:border-t-0 border-slate-200/60 dark:border-white/10 pt-3 lg:pt-0">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex-1 lg:flex-none w-full px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition"
            title="Share with relatives on WhatsApp"
          >
            <span>💬</span>
            <span>{isHi ? 'व्हाट्सएप पर शेयर' : 'Share on WhatsApp'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 lg:flex-none w-full px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 border border-slate-300/80 dark:border-white/10 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? (isHi ? 'लिंक कॉपी हुआ!' : 'Copied!') : (isHi ? 'पब्लिक लिंक कॉपी' : 'Copy Link')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
