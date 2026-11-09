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
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [auspiciousPreset, setAuspiciousPreset] = useState<'plus1' | 'plus500' | 'plus1000'>('plus1');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSavePreferences = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const isTraditional = theme === 'traditional';
  const isHi = language === 'hi';

  return (
    <div
      className={cn(
        'min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans',
        isTraditional
          ? 'bg-[#FDFCF7] text-stone-900'
          : theme === 'clay'
          ? 'bg-[#FBF0EE] text-slate-800'
          : theme === 'dark'
          ? 'bg-[#0B0F19] text-white'
          : 'bg-[#E8EDF5] text-slate-800'
      )}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
            <Link href="/dashboard" className="text-[#8B1D2C] hover:underline font-semibold flex items-center gap-1">
              <span>{isHi ? '🏠 बही-खाता' : '🏠 Dashboard'}</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900 dark:text-white">
              {isHi ? 'प्राथमिकताएं व सेटिंग्स' : 'Preferences & Settings'}
            </span>
          </div>

          <Link href="/profile">
            <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl gap-1.5">
              <span>{isHi ? 'प्रोफ़ाइल (Profile)' : 'Profile'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight flex items-center gap-2 text-[#8B1D2C] dark:text-white">
            <SettingsIcon className="h-6 w-6 text-amber-700" />
            <span>
              {isHi ? 'एप्लिकेशन सेटिंग्स व प्राथमिकताएं' : 'Application Settings & Preferences'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400">
            {isHi
              ? 'थीम स्वरूप, भाषा (हिंदी/English), एवं पारंपरिक शगुन नियमों को अपनी पसंद अनुसार सेट करें'
              : 'Customize theme appearance, language (Hindi/English), and traditional shagun reciprocity rules'}
          </p>
        </div>

        {/* Success Alert */}
        {savedAlert && (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/40 p-4 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>
                {isHi
                  ? 'आपकी प्राथमिकताएं सफलतापूर्वक सुरक्षित कर ली गई हैं!'
                  : 'Your preferences have been successfully saved!'}
              </span>
            </div>
            <button onClick={() => setSavedAlert(false)} className="text-stone-400 hover:text-stone-700">✕</button>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION 1: VISUAL THEME SELECTION                             */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          className={cn(
            'rounded-3xl p-6 sm:p-8 space-y-5 transition-all',
            isTraditional
              ? 'bg-white border-2 border-stone-200/90 shadow-sm'
              : theme === 'clay'
              ? 'clay-card'
              : 'bg-[#0F1523] border border-[#1E2638] shadow-2xl text-white'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#8B1D2C]" />
                <span>{isHi ? 'थीम स्वरूप (Theme & Look)' : 'Visual Theme & Appearance'}</span>
              </h2>
              <p className="text-xs text-stone-500">
                {isHi
                  ? 'अपनी पसंदीदा शैली चुनें: पारंपरिक बही-खाता रजिस्टर (अनुशंसित), क्लेमॉर्फिज्म 3D, या डार्क मोड'
                  : 'Select your preferred visual theme: Traditional Bahi-Khata ledger (Recommended), Claymorphism 3D, or Dark Mode'}
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold uppercase">
              {theme}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* 1. Traditional Bahi-Khata */}
            <div
              onClick={() => setTheme('traditional')}
              className={cn(
                'cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden select-none',
                theme === 'traditional'
                  ? 'border-[#8B1D2C] bg-[#FFFDF9] shadow-md shadow-rose-950/10'
                  : 'border-stone-200 bg-stone-50 hover:border-stone-300'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-serif font-black text-sm text-[#8B1D2C]">
                  <span className="text-base">📕</span>
                  <span>{isHi ? 'पारंपरिक बही-खाता' : 'Traditional Bahi-Khata'}</span>
                </div>
                {theme === 'traditional' && (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#8B1D2C]" />
                )}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isHi
                  ? 'पारंपरिक लाल डायरी जिल्द, क्रीम पेपर टेक्सचर, साफ-सुथरा लेजर ग्रिड, व लाइव शादी विशलिस्ट।'
                  : 'Auspicious red cloth spine, ivory parchment texture, clean ledger lines & live wedding gift list.'}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-[#8B1D2C]">
                <span>{isHi ? '✓ सादा व पारंपरिक' : '✓ Authentic & Simple'}</span>
              </div>
            </div>

            {/* 2. Claymorphism Card */}
            <div
              onClick={() => setTheme('clay')}
              className={cn(
                'cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden select-none',
                theme === 'clay'
                  ? 'border-[#FA7C77] bg-[#FFF5F3] shadow-md'
                  : 'border-stone-200 bg-stone-50 hover:border-stone-300'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-stone-800">
                  <span className="text-base">🌸</span>
                  <span>Claymorphism 3D</span>
                </div>
                {theme === 'clay' && (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FA7C77]" />
                )}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isHi
                  ? 'सॉफ्ट पेस्टल 3D क्ले कार्ड, कोरल साइडबार, व 3D एलीमेंट।'
                  : 'Soft pastel 3D clay cards, coral sidebar, and tactile pill widgets.'}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-[#FA7C77]">
                <span>✓ 3D Soft Look</span>
              </div>
            </div>

            {/* 3. Dark Mode Card */}
            <div
              onClick={() => setTheme('dark')}
              className={cn(
                'cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden select-none',
                theme === 'dark'
                  ? 'border-[#2563EB] bg-[#131B2E] text-white shadow-md'
                  : 'border-stone-200 bg-stone-50 hover:border-stone-300'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-stone-800 dark:text-white">
                  <Moon className="h-4 w-4 text-[#4EECD3]" />
                  <span>{isHi ? 'डार्क मोड' : 'Dark Mode'}</span>
                </div>
                {theme === 'dark' && (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4EECD3]" />
                )}
              </div>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                {isHi
                  ? 'रात के समय उपयोग हेतु हाई-कंट्रास्ट डार्क मोड।'
                  : 'High-contrast midnight dark theme for night events.'}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-[#2563EB] dark:text-[#4EECD3]">
                <span>✓ Night friendly</span>
              </div>
            </div>

            {/* 4. Light Mode Card */}
            <div
              onClick={() => setTheme('light')}
              className={cn(
                'cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden select-none',
                theme === 'light'
                  ? 'border-slate-800 bg-[#E8EDF5] shadow-md'
                  : 'border-stone-200 bg-stone-50 hover:border-stone-300'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-stone-800">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>{isHi ? 'लाइट मोड' : 'Light Mode'}</span>
                </div>
                {theme === 'light' && (
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
                )}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isHi
                  ? 'साफ़-सुथरी आधुनिक लाइट थीम।'
                  : 'Minimal modern bright theme with soft grey shadows.'}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-700">
                <span>✓ Clean & Crisp</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION 2: LANGUAGE & LOCALIZATION                            */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          className={cn(
            'rounded-3xl p-6 sm:p-8 space-y-5 transition-all',
            isTraditional
              ? 'bg-white border-2 border-stone-200/90 shadow-sm'
              : 'border border-[#1E2638] bg-[#0F1523] text-white'
          )}
        >
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-700" />
              <span>{isHi ? 'भाषा प्राथमिकता (Language Preference)' : 'Language Preference'}</span>
            </h2>
            <p className="text-xs text-stone-500">
              {isHi
                ? 'एप्लिकेशन की भाषा चुनें — हिंदी (पारंपरिक शब्दावली) या English'
                : 'Select application display language — English or हिंदी (Hindi)'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setLanguage('hi')}
              className={cn(
                'cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center justify-between',
                language === 'hi'
                  ? 'border-[#8B1D2C] bg-amber-50/50'
                  : 'border-stone-200 hover:border-stone-300'
              )}
            >
              <div>
                <h4 className="font-bold text-sm text-stone-900">हिंदी (Hindi)</h4>
                <p className="text-xs text-stone-500">बही-खाता, नकद शगुन, लेन-देन, रिश्तेदार</p>
              </div>
              {language === 'hi' && <CheckCircle2 className="h-5 w-5 text-[#8B1D2C]" />}
            </div>

            <div
              onClick={() => setLanguage('en')}
              className={cn(
                'cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center justify-between',
                language === 'en'
                  ? 'border-[#8B1D2C] bg-amber-50/50'
                  : 'border-stone-200 hover:border-stone-300'
              )}
            >
              <div>
                <h4 className="font-bold text-sm text-stone-900">English (India)</h4>
                <p className="text-xs text-stone-500">Bahi-Khata, Shagun Envelopes, Guests, Gift Registry</p>
              </div>
              {language === 'en' && <CheckCircle2 className="h-5 w-5 text-[#8B1D2C]" />}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION 3: AUSPICIOUS SHAGUN RULES (+1 Rupee Coin)            */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          className={cn(
            'rounded-3xl p-6 sm:p-8 space-y-5 transition-all',
            isTraditional
              ? 'bg-white border-2 border-stone-200/90 shadow-sm'
              : 'border border-[#1E2638] bg-[#0F1523] text-white'
          )}
        >
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-600" />
              <span>
                {isHi ? 'पारंपरिक शुभ शगुन नियम (+₹1 सिक्का)' : 'Auspicious Shagun Reciprocity Rules (+₹1 Coin)'}
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              {isHi
                ? 'भारतीय परंपरा अनुसार शगुन में ₹1 का शुभ सिक्का (जैसे ₹501, ₹1101, ₹2101, ₹5101) स्वचालित रूप से जोड़ने का नियम'
                : 'Rule to automatically add auspicious ₹1 coin (e.g. ₹501, ₹1,101, ₹2,101, ₹5,101) according to Indian tradition'}
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
                desc: isHi ? 'रिश्तेदारों को वापसी में ₹500 अधिक शगुन' : 'Return ₹500 more than received amount',
              },
              {
                id: 'plus1000',
                title: isHi ? '+₹1,000 वृद्धि' : '+₹1,000 Increase',
                desc: isHi ? 'घनिष्ठ रिश्तेदारों (मामा/बुआ) हेतु' : 'For close relatives (Maternal/Paternal family)',
              },
            ].map((rule) => (
              <div
                key={rule.id}
                onClick={() => setAuspiciousPreset(rule.id as any)}
                className={cn(
                  'cursor-pointer rounded-2xl p-4 border-2 transition-all',
                  auspiciousPreset === rule.id
                    ? 'border-amber-600 bg-amber-50/60'
                    : 'border-stone-200 hover:border-stone-300'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">{rule.title}</h4>
                  {auspiciousPreset === rule.id && <CheckCircle2 className="h-4 w-4 text-amber-700" />}
                </div>
                <p className="text-[11px] text-stone-500">{rule.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-5 py-2.5 rounded-xl bg-[#8B1D2C] hover:bg-[#731522] text-white text-xs font-bold shadow-md transition"
            >
              {isHi ? 'प्राथमिकताएं सुरक्षित करें (Save Preferences)' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
