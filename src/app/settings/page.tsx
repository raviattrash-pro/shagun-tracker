'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Coins,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme, AppTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [auspiciousPreset, setAuspiciousPreset] = useState<'plus1' | 'plus500' | 'plus1000'>('plus1');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSavePreferences = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const isHi = language === 'hi';

  const themeOptions: {
    id: AppTheme;
    title: string;
    desc: string;
    badge: string;
    color: string;
    emoji: string;
  }[] = [
    {
      id: 'traditional',
      title: isHi ? 'वार्म पीच (Aether Gold)' : 'Warm Peach (Aether Gold)',
      desc: isHi
        ? 'सॉफ्ट एम्बर वार्म कार्ड, सुरुचिपूर्ण इनसेट शैडो, पारंपरिक भारतीय विवाह लालित्य।'
        : 'Soft amber warm cards, elegant inset glow, inspired by Aether Planner warm gold palette.',
      badge: 'Default',
      color: 'border-[#F5A962] bg-[#FDF4E7]/60',
      emoji: '🍑',
    },
    {
      id: 'clay',
      title: isHi ? 'स्यान स्काई (Aether Cyan)' : 'Cyan Sky (Aether Cyan)',
      desc: isHi
        ? 'शांत आसमानी नीला रंग, आधुनिक रिफ्रेशिंग लेआउट व 3D सॉफ्ट कार्ड्स।'
        : 'Refreshing sky cyan theme with tactile widgets, matching Aether cyan screenshot.',
      badge: 'Modern',
      color: 'border-[#4DD0E1] bg-[#E6FAFD]/60',
      emoji: '🩵',
    },
    {
      id: 'dark',
      title: isHi ? 'मिडनाइट नेवी (Aether Dark)' : 'Midnight Navy (Aether Dark)',
      desc: isHi
        ? 'रात के समारोहों हेतु डीप नेवी ब्लू बैकग्राउंड, उच्च कंट्रास्ट व ग्लोइंग एक्सेंट।'
        : 'Deep midnight navy palette for night events with glowing neon cyan accents.',
      badge: 'Night',
      color: 'border-[#1B3A4B] bg-[#112238]/60 text-white',
      emoji: '🌌',
    },
    {
      id: 'light',
      title: isHi ? 'क्लीन स्लेट (Clean Light)' : 'Clean Slate (Modern Light)',
      desc: isHi
        ? 'साफ़-सुथरी आधुनिक लाइट थीम, सॉफ्ट ग्रे शैडोज़ व मिनिमल लुक।'
        : 'Crisp minimal modern theme with soft grey dropshadows and high readability.',
      badge: 'Minimal',
      color: 'border-slate-300 bg-white/70',
      emoji: '☀️',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 font-sans">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-white/60 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Link href="/dashboard" className="text-[#C0392B] dark:text-[#00E5FF] hover:underline flex items-center gap-1">
            <span>🏠 {isHi ? 'बही-खाता' : 'Dashboard'}</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-white">
            {isHi ? 'प्राथमिकताएं व सेटिंग्स' : 'Preferences & Settings'}
          </span>
        </div>

        <Link href="/profile">
          <button
            type="button"
            className="aether-inset px-3 py-1.5 text-xs font-bold flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:opacity-80 transition"
          >
            <span>{isHi ? 'प्रोफ़ाइल' : 'Profile'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </Link>
      </div>

      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
          <SettingsIcon className="h-6 w-6 text-[#C0392B] dark:text-[#00E5FF]" />
          <span>{isHi ? 'एप्लिकेशन सेटिंग्स' : 'Application Settings'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          {isHi
            ? 'थीम स्वरूप, भाषा (हिंदी/English), एवं पारंपरिक शगुन नियमों को अपनी पसंद अनुसार सेट करें'
            : 'Customize visual theme, language (Hindi/English), and auspicious shagun reciprocity rules'}
        </p>
      </div>

      {/* Success Alert */}
      {savedAlert && (
        <div className="aether-card p-4 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in bg-emerald-50/80 border-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>
              {isHi
                ? 'आपकी प्राथमिकताएं सफलतापूर्वक सुरक्षित कर ली गई हैं!'
                : 'Your preferences have been successfully saved!'}
            </span>
          </div>
          <button onClick={() => setSavedAlert(false)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: VISUAL THEME SELECTION (Aether Inspired)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="aether-card p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="aether-header-badge text-[#C0392B] dark:text-[#00E5FF]">
              🎨 {isHi ? 'थीम स्वरूप' : 'Visual Theme'}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
              {isHi ? 'डैशबोर्ड रंग व डिज़ाइन शैली' : 'Dashboard Color Palette & Style'}
            </h2>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            {theme}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themeOptions.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={cn(
                  'cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all relative overflow-hidden select-none aether-inset-box',
                  isSelected
                    ? `${opt.color} ring-2 ring-slate-900 dark:ring-white shadow-md scale-[1.01]`
                    : 'border-white/60 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
                    <span className="text-lg">{opt.emoji}</span>
                    <span>{opt.title}</span>
                  </div>
                  {isSelected && (
                    <span className="h-3 w-3 rounded-full bg-[#C0392B] dark:bg-[#00E5FF]" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {opt.desc}
                </p>
                <div className="mt-3 flex items-center justify-between text-[10px] font-extrabold">
                  <span className="text-[#C0392B] dark:text-[#00E5FF] uppercase tracking-wider">{opt.badge}</span>
                  {isSelected && <span className="text-emerald-600">✓ Active</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: LANGUAGE & LOCALIZATION                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="aether-card p-6 sm:p-7 space-y-5">
        <div className="space-y-0.5">
          <span className="aether-header-badge text-amber-700 dark:text-amber-400">
            🌐 {isHi ? 'भाषा प्राथमिकता' : 'Language'}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
            {isHi ? 'एप्लिकेशन की भाषा चुनें' : 'Choose Application Display Language'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setLanguage('hi')}
            className={cn(
              'cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center justify-between aether-inset-box',
              language === 'hi'
                ? 'border-[#C0392B] bg-[#FDF4E7]/60 ring-1 ring-[#C0392B]'
                : 'border-white/60 dark:border-white/10 hover:border-slate-300'
            )}
          >
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">हिंदी (Hindi)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">बही-खाता, नकद शगुन, लेन-देन, रिश्तेदार</p>
            </div>
            {language === 'hi' && <CheckCircle2 className="h-5 w-5 text-[#C0392B]" />}
          </div>

          <div
            onClick={() => setLanguage('en')}
            className={cn(
              'cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center justify-between aether-inset-box',
              language === 'en'
                ? 'border-[#C0392B] bg-[#FDF4E7]/60 ring-1 ring-[#C0392B]'
                : 'border-white/60 dark:border-white/10 hover:border-slate-300'
            )}
          >
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">English (India)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bahi-Khata, Shagun Envelopes, Guests, Gift Registry</p>
            </div>
            {language === 'en' && <CheckCircle2 className="h-5 w-5 text-[#C0392B]" />}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: AUSPICIOUS SHAGUN RULES (+1 Rupee Coin)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="aether-card p-6 sm:p-7 space-y-5">
        <div className="space-y-0.5">
          <span className="aether-header-badge text-amber-600 dark:text-amber-400">
            🪙 {isHi ? 'पारंपरिक शुभ शगुन नियम' : 'Auspicious Rules'}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
            {isHi ? '+₹1 शुभ सिक्का व लेन-देन वृद्धि' : '+₹1 Auspicious Coin & Reciprocity Addition'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isHi
              ? 'भारतीय परंपरा अनुसार शगुन में ₹1 का शुभ सिक्का (जैसे ₹501, ₹1101, ₹2101, ₹5101) स्वचालित रूप से जोड़ने का नियम'
              : 'Automatically calculate auspicious amounts (+₹1 coin) according to Indian tradition'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'plus1',
              title: isHi ? '+₹1 शुभ सिक्का' : '+₹1 Auspicious Coin',
              desc: isHi ? 'उदा. ₹2,100 → ₹2,101 (पारंपरिक वरदान)' : 'e.g. ₹2,100 → ₹2,101 (Sacred blessing)',
            },
            {
              id: 'plus500',
              title: isHi ? '+₹500 वृद्धि' : '+₹500 Increase',
              desc: isHi ? 'रिश्तेदारों को वापसी में ₹500 अधिक शगुन' : 'Return ₹500 more than received',
            },
            {
              id: 'plus1000',
              title: isHi ? '+₹1,000 वृद्धि' : '+₹1,000 Increase',
              desc: isHi ? 'घनिष्ठ रिश्तेदारों (मामा/बुआ) हेतु' : 'For close maternal/paternal family',
            },
          ].map((rule) => (
            <div
              key={rule.id}
              onClick={() => setAuspiciousPreset(rule.id as any)}
              className={cn(
                'cursor-pointer rounded-2xl p-4 border-2 transition-all aether-inset-box',
                auspiciousPreset === rule.id
                  ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/20 ring-1 ring-amber-500'
                  : 'border-white/60 dark:border-white/10 hover:border-slate-300'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">{rule.title}</h4>
                {auspiciousPreset === rule.id && <CheckCircle2 className="h-4 w-4 text-amber-600" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{rule.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C0392B] to-[#D9534F] text-white text-xs font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            {isHi ? 'प्राथमिकताएं सुरक्षित करें' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
