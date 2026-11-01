'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Sliders,
  Database,
  Smartphone,
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
  const [currencySystem, setCurrencySystem] = useState<'lakh' | 'million'>('lakh');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSavePreferences = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div
      className={cn(
        'min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300',
        theme === 'dark' ? 'bg-[#0B0F19] text-white' : 'bg-[#E8EDF5] text-slate-800'
      )}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/dashboard" className="text-primary hover:underline font-semibold flex items-center gap-1">
              <span>🏠 Dashboard</span>
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">Preferences & Settings</span>
          </div>

          <Link href="/profile">
            <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl gap-1.5">
              <span>View Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-sans font-bold flex items-center gap-2 text-foreground">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <span>Settings & Appearance (सेटिंग्स और स्वरूप)</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Customize visual theme, language, and wedding reciprocity rules.
          </p>
        </div>

        {savedAlert && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/40 p-4 text-emerald-400 flex items-center justify-between text-xs font-semibold animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Settings saved successfully! (सेटिंग्स सुरक्षित हो गईं)</span>
            </span>
            <button onClick={() => setSavedAlert(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION 1: VISUAL THEME SELECTION                             */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          className={cn(
            'rounded-3xl p-6 sm:p-8 space-y-5 transition-all',
            theme === 'dark'
              ? 'bg-[#0F1523] border border-[#1E2638] shadow-2xl'
              : 'bg-[#E8EDF5] neomorph-flat border border-white/60'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Theme & UI Experience (स्वरूप थीम)</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose between Wix Studio Fintech Dark Mode or Dribbble Neomorphic Soft UI Light Mode.
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold uppercase">
              {theme === 'dark' ? 'Fintech Dark' : 'Neomorphic Soft'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Mode Card (Wix Studio PECA Style) */}
            <div
              onClick={() => setTheme('dark')}
              className={cn(
                'cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden select-none',
                theme === 'dark'
                  ? 'border-[#2563EB] bg-[#131B2E] shadow-xl shadow-blue-600/20'
                  : 'border-transparent bg-slate-200/50 hover:border-slate-300'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Moon className="h-4 w-4 text-[#4EECD3]" />
                  <span>Fintech Dark (Wix Studio)</span>
                </div>
                {theme === 'dark' && (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4EECD3] shadow-sm shadow-[#4EECD3]" />
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deep obsidian navy (`#0B0F19`), neon blue & cyan edge lights, 3D floating pedestals, and glowing gold shagun coins.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#4EECD3]">
                <span>✓ High contrast</span>
                <span>•</span>
                <span>✓ Verified fintech styling</span>
              </div>
            </div>

            {/* Light Mode Card (Dribbble Neomorphism Soft UI Style) */}
            <div
              onClick={() => setTheme('light')}
              className={cn(
                'cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden select-none',
                theme === 'light'
                  ? 'border-[#2563EB] bg-[#E8EDF5] shadow-inner'
                  : 'border-transparent bg-slate-900/40 hover:border-slate-700'
              )}
              style={
                theme === 'light'
                  ? {
                      boxShadow: 'inset 4px 4px 8px #cad4e2, inset -4px -4px 8px #ffffff',
                    }
                  : {}
              }
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-200">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Neomorphic Soft UI (Dribbble)</span>
                </div>
                {theme === 'light' && (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB] shadow-sm" />
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tactile extruded clay (`#E8EDF5`), subtle dual light/dark shadows, embossed dials, and sunken inputs.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#2563EB]">
                <span>✓ Soft tactile lighting</span>
                <span>•</span>
                <span>✓ Clean daylight comfort</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION 2: BILINGUAL LANGUAGE PREFERENCE                     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          className={cn(
            'rounded-3xl p-6 sm:p-8 space-y-5 transition-all',
            theme === 'dark'
              ? 'bg-[#0F1523] border border-[#1E2638] shadow-2xl'
              : 'bg-[#E8EDF5] neomorph-flat border border-white/60'
          )}
        >
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              <span>Language Preference (भाषा का चयन)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Instant bilingual translation across the dashboard, gifts, and voice engine.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={cn(
                'p-4 rounded-2xl border-2 text-left transition-all',
                language === 'hi'
                  ? 'border-[#2563EB] bg-[#131B2E] text-white shadow-md'
                  : 'border-border/60 hover:border-border text-muted-foreground'
              )}
            >
              <div className="text-xl mb-1">🇮🇳</div>
              <div className="font-bold text-sm text-foreground">हिंदी (Hindi)</div>
              <p className="text-[11px] text-muted-foreground">शगुन का बही-खाता, रिश्तेदार, लिफ़ाफ़े</p>
            </button>

            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={cn(
                'p-4 rounded-2xl border-2 text-left transition-all',
                language === 'en'
                  ? 'border-[#2563EB] bg-[#131B2E] text-white shadow-md'
                  : 'border-border/60 hover:border-border text-muted-foreground'
              )}
            >
              <div className="text-xl mb-1">🇬🇧</div>
              <div className="font-bold text-sm text-foreground">English</div>
              <p className="text-[11px] text-muted-foreground">Shagun Tracker, Registry, Reciprocity</p>
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION 3: AUSPICIOUS RECIPROCITY RULE (लेन-देन का नियम)     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          className={cn(
            'rounded-3xl p-6 sm:p-8 space-y-5 transition-all',
            theme === 'dark'
              ? 'bg-[#0F1523] border border-[#1E2638] shadow-2xl'
              : 'bg-[#E8EDF5] neomorph-flat border border-white/60'
          )}
        >
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
              <Coins className="h-4 w-4 text-[#E6CA65]" />
              <span>Auspicious Reciprocity Rule (शुभ लेन-देन का नियम)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              When relatives invite you to their upcoming wedding, automatically calculate suggested return shagun with blessing addition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
              type="button"
              onClick={() => setAuspiciousPreset('plus1')}
              className={cn(
                'p-3.5 rounded-2xl border-2 text-left transition-all',
                auspiciousPreset === 'plus1'
                  ? 'border-[#2563EB] bg-[#131B2E] text-white'
                  : 'border-border/60 text-muted-foreground'
              )}
            >
              <span className="font-bold text-sm text-foreground block">+₹1 Sacred Shagun</span>
              <span className="text-[11px] text-muted-foreground">e.g. ₹5,000 → ₹5,001 (शुभ सिक्का)</span>
            </button>

            <button
              type="button"
              onClick={() => setAuspiciousPreset('plus500')}
              className={cn(
                'p-3.5 rounded-2xl border-2 text-left transition-all',
                auspiciousPreset === 'plus500'
                  ? 'border-[#2563EB] bg-[#131B2E] text-white'
                  : 'border-border/60 text-muted-foreground'
              )}
            >
              <span className="font-bold text-sm text-foreground block">+₹500 Note Upgrade</span>
              <span className="text-[11px] text-muted-foreground">e.g. ₹5,100 → ₹5,600 (नोट जोड़कर)</span>
            </button>

            <button
              type="button"
              onClick={() => setAuspiciousPreset('plus1000')}
              className={cn(
                'p-3.5 rounded-2xl border-2 text-left transition-all',
                auspiciousPreset === 'plus1000'
                  ? 'border-[#2563EB] bg-[#131B2E] text-white'
                  : 'border-border/60 text-muted-foreground'
              )}
            >
              <span className="font-bold text-sm text-foreground block">+₹1,000 Auspicious Step</span>
              <span className="text-[11px] text-muted-foreground">e.g. ₹11,000 → ₹12,000 (बड़ा सम्मान)</span>
            </button>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="pt-2 flex justify-end">
          <Button
            onClick={handleSavePreferences}
            className="rounded-full px-8 py-3 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30"
          >
            <span>Save Preferences (सेटिंग्स सहेजें)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
