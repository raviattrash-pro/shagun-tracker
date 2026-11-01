'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  Gift,
  Sparkles,
  RefreshCw,
  Download,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Volume2,
  CheckCircle2,
  Zap,
  Users,
  Camera,
  Layers,
  Award,
  ChevronRight,
  Bell,
  Menu as MenuIcon,
  Check,
  Lock,
  ArrowDownUp,
  KeyRound,
  ShieldAlert,
  Coins,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  const [demoEnvelopeOpen, setDemoEnvelopeOpen] = useState(false);
  const [phoneTab, setPhoneTab] = useState<'envelope' | 'exchange'>('envelope');
  const [exchangeAmount, setExchangeAmount] = useState<number>(5100);

  // Safe Keypad interactive demo (Screenshot 8)
  const [pinDigits, setPinDigits] = useState<string[]>(['6', '7']);
  const [safeUnlocked, setSafeUnlocked] = useState(false);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#4EECD3', '#D4AF37', '#75182A'],
      });
    } catch (e) {}
  };

  const handleEnvelopeClick = () => {
    const next = !demoEnvelopeOpen;
    setDemoEnvelopeOpen(next);
    if (next) triggerConfetti();
  };

  const handlePinPress = (digit: string) => {
    if (pinDigits.length < 4) {
      const next = [...pinDigits, digit];
      setPinDigits(next);
      if (next.length === 4) {
        setSafeUnlocked(true);
        triggerConfetti();
      }
    }
  };

  const handleResetPin = () => {
    setPinDigits([]);
    setSafeUnlocked(false);
  };

  return (
    <div
      className={cn(
        'min-h-screen selection:bg-[#2563EB] selection:text-white font-sans overflow-x-hidden transition-colors duration-300',
        theme === 'dark' ? 'bg-[#0B0F19] text-white' : 'bg-[#E8EDF5] text-slate-800'
      )}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* AMBIENT BACKGROUND GLOW & SPOTLIGHT (Exact Wix Studio Template) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.22)_0%,rgba(78,236,211,0.08)_40%,transparent_70%)] blur-3xl animate-pulse-glow" />
        <div className="absolute top-[800px] -left-48 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[1400px] -right-48 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: HERO (Matching media_1793559317980_70c3bd61.png)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Floating 3D Pedestals & Golden Shagun Coins Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-5">
          {/* Top Left Floating 3D Coin on Pedestal */}
          <div className="absolute top-8 left-2 md:left-12 flex flex-col items-center animate-float-slow">
            <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-[#996515] via-[#E6CA65] to-[#FFED8A] p-1.5 shadow-[0_20px_45px_rgba(230,202,101,0.4)] flex items-center justify-center rotate-[-15deg] animate-shine-coin">
              <div className="w-full h-full rounded-full border-2 border-[#8A5C0E] bg-gradient-to-br from-[#E6CA65] via-[#D4AF37] to-[#B38728] flex items-center justify-center font-serif text-2xl md:text-4xl font-black text-[#5C3D06] shadow-inner">
                ₹
              </div>
            </div>
            {/* 3D Slate Pedestal with Rim Glow */}
            <div className="w-28 h-10 md:w-44 md:h-14 mt-2 rounded-2xl bg-gradient-to-b from-[#22314E] via-[#1C263A] to-[#0F1523] border border-[#3B4F73] shadow-2xl transform skew-x-[-12deg]" />
          </div>

          {/* Top Right Floating 3D Coin on Pedestal */}
          <div className="absolute top-12 right-2 md:right-12 flex flex-col items-center animate-float-reverse">
            <div className="relative w-20 h-20 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-[#996515] via-[#E6CA65] to-[#FFED8A] p-1.5 shadow-[0_20px_45px_rgba(230,202,101,0.4)] flex items-center justify-center rotate-[20deg] animate-shine-coin">
              <div className="w-full h-full rounded-full border-2 border-[#8A5C0E] bg-gradient-to-br from-[#E6CA65] via-[#D4AF37] to-[#B38728] flex items-center justify-center font-serif text-2xl md:text-5xl font-black text-[#5C3D06] shadow-inner">
                ₹
              </div>
            </div>
            {/* 3D Slate Pedestal with Rim Glow */}
            <div className="w-32 h-10 md:w-48 md:h-14 mt-2 rounded-2xl bg-gradient-to-b from-[#22314E] via-[#1C263A] to-[#0F1523] border border-[#3B4F73] shadow-2xl transform skew-x-[12deg]" />
          </div>
        </div>

        {/* Centered Bold Typography Headline (Exact Wix Studio Template) */}
        <div className="text-center max-w-4xl mx-auto space-y-4 relative z-10 pt-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#131B2E] border border-[#1E2638] px-4 py-1.5 text-xs font-semibold text-[#4EECD3] shadow-inner">
            <span className="h-2 w-2 rounded-full bg-[#4EECD3] animate-ping" />
            <span>{language === 'hi' ? 'भारतीय शादी का डिजिटल बही-खाता' : 'Traditional Indian Wedding Fintech Registry'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-sans font-black tracking-tight text-white leading-[1.05]">
            Track Wedding Shagun <br className="hidden sm:inline" />
            <span className="text-white">Easily & Securely</span>
          </h1>
        </div>

        {/* Three-Column Composition below Headline (Matching Wix Studio Template) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12 md:mt-16 relative z-10">
          {/* Left Column: Description & CTAs */}
          <div className="lg:col-span-4 space-y-6 text-center lg:text-left order-2 lg:order-1">
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              {language === 'hi'
                ? 'कागज़ी डायरी और लिफाफे खोने का झंझट खत्म। 3D वैक्स-सील लिफाफे, नोट-वार नकद गणना, हिंदी वॉयस एंट्री और 100% सुरक्षित लेन-देन हिसाब।'
                : 'This is the space to welcome visitors to your family wedding celebration. Digitize shagun envelopes, track RBI cash notes with automated denomination calculations, and maintain reciprocal commitments.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-7 py-3.5 shadow-xl shadow-blue-600/30 transition hover:scale-105 active:scale-95 text-sm">
                  <span>{language === 'hi' ? 'शगुन बही-खाता खोलें' : 'Open Shagun Ledger'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>

              <Link href="/gifts/new" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#131B2E] hover:bg-[#1E2638] text-slate-200 border border-[#1E2638] font-semibold px-6 py-3.5 transition text-sm">
                  <Mic className="h-4 w-4 text-[#4EECD3]" />
                  <span>{language === 'hi' ? 'बोलकर दर्ज करें' : 'Voice Record'}</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Center Column: Central Dark Smartphone Mockup with Gradient Balance Card & Interactive Tabs */}
          <div className="lg:col-span-4 flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-[340px] rounded-[48px] border-[8px] border-[#1C263A] bg-[#0F1523] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(37,99,235,0.25)] p-4 select-none">
              {/* Speaker Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-4 w-28 rounded-full bg-[#1C263A] flex items-center justify-center">
                <div className="h-1.5 w-10 rounded-full bg-[#0B0F19]" />
                <div className="ml-2 h-2 w-2 rounded-full bg-[#2563EB]/40" />
              </div>

              {/* In-app Top Nav Bar */}
              <div className="flex items-center justify-between pt-5 pb-3 px-1 border-b border-[#1E2638]">
                <div className="h-8 w-8 rounded-xl bg-[#131B2E] border border-[#1E2638] flex items-center justify-center text-slate-300">
                  <MenuIcon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wider text-white">SHAGUN</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4EECD3]" />
                </div>
                <div className="h-8 w-8 rounded-xl bg-[#131B2E] border border-[#1E2638] flex items-center justify-center text-slate-300 relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
                </div>
              </div>

              {/* Greeting */}
              <div className="pt-3 pb-2 px-1">
                <p className="text-[11px] text-slate-400 font-medium">Welcome</p>
                <h3 className="text-base font-bold text-white truncate">Sharma Family (शर्मा परिवार)</h3>
              </div>

              {/* Gradient Balance Card (Matching Wix Studio Template Cyan-Indigo-Purple Gradient) */}
              <div className="rounded-2xl p-4 bg-gradient-to-r from-[#00D4FF] via-[#5B51D8] to-[#833AB4] text-white shadow-xl relative overflow-hidden my-2">
                <div className="relative z-10">
                  <span className="text-[11px] font-semibold text-white/80 block uppercase tracking-wider">
                    Total Shagun Balance
                  </span>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                    ₹1,48,500
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20 text-[11px]">
                    <span className="text-white/80">Reciprocal Pending:</span>
                    <span className="font-bold text-white bg-black/20 px-2 py-0.5 rounded-md">
                      25,368₹ <span className="text-[#4EECD3]">+3%</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Phone In-App Sub-Navigation Tabs */}
              <div className="flex items-center justify-center gap-1 bg-[#131B2E] p-1 rounded-xl border border-[#1E2638] my-2 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setPhoneTab('envelope')}
                  className={cn(
                    'flex-1 py-1 rounded-lg transition-all',
                    phoneTab === 'envelope'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  ✉️ 3D Envelope
                </button>
                <button
                  type="button"
                  onClick={() => setPhoneTab('exchange')}
                  className={cn(
                    'flex-1 py-1 rounded-lg transition-all',
                    phoneTab === 'exchange'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  🔄 Cash Breakup
                </button>
              </div>

              {/* Tab 1: Live Interactive Sealed Burgundy Pinterest Envelope */}
              {phoneTab === 'envelope' && (
                <div className="mt-2 animate-in fade-in duration-200">
                  <div
                    onClick={handleEnvelopeClick}
                    className="group relative cursor-pointer rounded-2xl overflow-hidden border border-[#8B1D32] shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, #75182A 0%, #5A0E1C 100%)',
                    }}
                  >
                    {demoEnvelopeOpen ? (
                      /* Revealed Inside */
                      <div className="p-4 bg-[#0F1523] border border-[#1E2638] space-y-2 text-center animate-in zoom-in-95 duration-300">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4EECD3]">
                          ✓ Cash Verified & Logged
                        </span>
                        <div className="text-2xl font-black text-white">₹5,100</div>
                        <div className="text-[11px] text-slate-300">
                          10 x ₹500 + 1 x ₹100 note
                        </div>
                        <p className="text-[10px] text-slate-400">Priya Aunty (प्रिया मौसी)</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDemoEnvelopeOpen(false);
                          }}
                          className="mt-2 text-[10px] font-bold text-blue-400 hover:underline"
                        >
                          Reseal Envelope (दोबारा सील करें)
                        </button>
                      </div>
                    ) : (
                      /* Sealed Pinterest Envelope Silhouette */
                      <div className="relative p-5 text-center min-h-[170px] flex flex-col items-center justify-between">
                        {/* V-pointed flap simulation */}
                        <div className="absolute top-0 left-0 right-0 h-16 bg-[#8B1D32] border-b border-black/30 shadow-md [clip-path:polygon(0_0,100%_0,50%_100%)] flex items-center justify-center">
                          {/* Gold Wax Medallion */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#996515] via-[#E6CA65] to-[#FFED8A] border-2 border-[#5C3D06] shadow-lg flex items-center justify-center font-serif text-sm font-black text-[#5C3D06] mt-4 animate-shine-coin">
                            ॐ
                          </div>
                        </div>

                        <div className="pt-16 w-full">
                          <p className="text-[9px] uppercase tracking-widest text-[#E6CA65] font-black">
                            Shagun With Blessings
                          </p>
                          <h4 className="text-sm font-bold text-amber-100 truncate mt-0.5">
                            Priya Aunty (प्रिया मौसी)
                          </h4>
                        </div>

                        <p className="text-[10px] text-amber-200/90 font-medium flex items-center gap-1 mt-1 animate-pulse">
                          <span>✨ Tap wax seal to open</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Interactive Cash & Note Exchange Counter (Matching Wix Template Screenshot 7 GET/PAY widget) */}
              {phoneTab === 'exchange' && (
                <div className="mt-2 p-3.5 rounded-2xl bg-[#131B2E] border border-[#1E2638] space-y-2.5 animate-in fade-in duration-200 text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">SELECT SHAGUN AMOUNT</span>
                    <div className="flex gap-1">
                      {[2100, 5100, 11000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setExchangeAmount(amt)}
                          className={cn(
                            'flex-1 py-1 rounded-lg text-[10px] font-bold border transition',
                            exchangeAmount === amt
                              ? 'bg-[#2563EB] text-white border-[#2563EB]'
                              : 'bg-[#0F1523] text-slate-300 border-[#1E2638]'
                          )}
                        >
                          ₹{amt.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GET / PAY Breakdown */}
                  <div className="p-2.5 rounded-xl bg-[#0F1523] border border-[#1E2638] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">500₹ Notes:</span>
                      <span className="font-bold text-white">{Math.floor(exchangeAmount / 500)} notes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">100₹ Notes:</span>
                      <span className="font-bold text-white">{Math.floor((exchangeAmount % 500) / 100)} note</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#1E2638] pt-1">
                      <span className="text-[10px] text-[#4EECD3]">Sacred Blessing:</span>
                      <span className="font-bold text-[#E6CA65]">+₹1 auspicious coin</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerConfetti();
                      alert(`Recorded ₹${exchangeAmount.toLocaleString('en-IN')} shagun envelope!`);
                    }}
                    className="w-full py-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition"
                  >
                    CALCULATE & LOG (गिनती करें)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Three Circular White Feature Pills (Exact Wix Studio Template) */}
          <div className="lg:col-span-4 space-y-4 text-center lg:text-left order-3">
            {/* Pill 1 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0F1523]/80 border border-[#1E2638] backdrop-blur-md shadow-lg hover:border-[#2563EB]/50 transition hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0B0F19] shadow-md flex-shrink-0">
                <Gift className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">3D Sealed Envelopes</h4>
                <p className="text-xs text-slate-400">Authentic wax seals & currency reveals</p>
              </div>
            </div>

            {/* Pill 2 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0F1523]/80 border border-[#1E2638] backdrop-blur-md shadow-lg hover:border-[#4EECD3]/50 transition hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0B0F19] shadow-md flex-shrink-0">
                <Mic className="h-5 w-5 text-[#4EECD3]" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Hindi Voice Command Entry</h4>
                <p className="text-xs text-slate-400">Hands-free speech recognition in 3s</p>
              </div>
            </div>

            {/* Pill 3 */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0F1523]/80 border border-[#1E2638] backdrop-blur-md shadow-lg hover:border-[#2563EB]/50 transition hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0B0F19] shadow-md flex-shrink-0">
                <RefreshCw className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Private & Secure Reciprocity</h4>
                <p className="text-xs text-slate-400">Complete लेन-देन bahi-khata ledger</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: CHECKLIST (Matching media_1793559342983_47fda8f2.png)*/}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#1E2638]">
        {/* Glow & Radial Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-white leading-tight">
            Accomplish Everything in Shagun Tracking
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-2xl mx-auto">
            {language === 'hi'
              ? 'शादी के व्यस्त माहौल में भी हर रिश्तेदार का नकद शगुन, तोहफा और लेन-देन का हिसाब सेकंडों में सुरक्षित रखें।'
              : 'This is the space to celebrate Indian traditions with modern fintech efficiency. Record every shagun gift, manage guest relations, count cash notes, and never miss return obligations.'}
          </p>
        </div>

        {/* Central Glowing Circuit Graphic with Checklist Items */}
        <div className="mt-14 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Left Column Checklist */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0F1523] border border-[#1E2638] shadow-md hover:border-slate-700 transition hover:-translate-y-0.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0B0F19] flex-shrink-0">
                  <Check className="h-4 w-4 stroke-[3] text-black" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-white">
                  {language === 'hi' ? '3 सेकंड में बोलकर दर्ज करें' : 'Record in under three seconds with voice'}
                </span>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0F1523] border border-[#1E2638] shadow-md hover:border-slate-700 transition hover:-translate-y-0.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0B0F19] flex-shrink-0">
                  <Check className="h-4 w-4 stroke-[3] text-black" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-white">
                  {language === 'hi' ? 'असली RBI नोटों और सिक्कों की गिनती' : 'Track RBI currency notes and coin counts'}
                </span>
              </div>
            </div>

            {/* Right Column Checklist */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0F1523] border border-[#1E2638] shadow-md hover:border-slate-700 transition hover:-translate-y-0.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0B0F19] flex-shrink-0">
                  <Check className="h-4 w-4 stroke-[3] text-black" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-white">
                  {language === 'hi' ? 'लेन-देन (Reciprocity) का पक्का हिसाब' : 'Exchange & return shagun with reciprocity (लेन-देन)'}
                </span>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0F1523] border border-[#1E2638] shadow-md hover:border-slate-700 transition hover:-translate-y-0.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0B0F19] flex-shrink-0">
                  <Check className="h-4 w-4 stroke-[3] text-black" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-white">
                  {language === 'hi' ? 'परिवार और सभी मेहमान एक ही जगह' : 'See all family members & guests in one place'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: KEY FEATURES BENTO CONTAINER                       */}
      {/* (Matching media_1793559358610_20746b67.png & 373758_a31df011)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-4xl font-sans font-black text-white tracking-tight">
            Key Features
          </h2>
        </div>

        {/* The Soft Ice-Blue/Lavender Bento Container (Exact Wix Studio Template `#CBDCE9`) */}
        <div className="rounded-[40px] bg-[#CBDCE9] p-6 sm:p-10 md:p-12 text-[#0B0F19] shadow-2xl space-y-8">
          {/* Card 1: Easy Exchanges / Digital Envelopes (media_1793559358610_20746b67.png) */}
          <div className="rounded-[32px] bg-[#0F1523] border border-[#1E2638] p-8 md:p-12 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Sub-card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#131B2E] border border-[#1E2638]">
              {/* 3D Gold Shagun Coins Illustration with floating animation */}
              <div className="relative w-28 h-28 my-3 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#996515] via-[#E6CA65] to-[#FFED8A] p-1 shadow-lg flex items-center justify-center rotate-[-10deg] animate-float-slow">
                  <span className="font-serif text-3xl font-black text-[#5C3D06]">₹</span>
                </div>
                <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-gradient-to-tr from-[#996515] via-[#E6CA65] to-[#FFED8A] p-1 shadow-lg flex items-center justify-center rotate-[20deg] animate-float-reverse">
                  <span className="font-serif text-2xl font-black text-[#5C3D06]">₹</span>
                </div>
              </div>

              <h3 className="text-2xl font-sans font-black text-white mt-2">
                Digital Shagun Envelopes
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Luxury velvet Burgundy cardstock with gold wax seals
              </p>
            </div>

            {/* Right Sub-card: Interactive Feature Description */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-xl font-bold text-white">
                Bespoke 3D Unsealing & Automatic Cash Counting
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Describe the celebration and how your family benefits from it. Every envelope is rendered with realistic Burgundy velvet texture, dried wheat botanical sprigs, and antique wax medallions. Click to unseal and instantly calculate cash note totals without manual math errors.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/gifts">
                  <button className="flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-5 py-2.5 text-xs shadow-md transition hover:scale-105">
                    <span>Explore Envelope Gallery</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/gifts/new">
                  <button className="flex items-center gap-2 rounded-xl bg-[#131B2E] hover:bg-[#1E2638] text-slate-200 border border-[#1E2638] font-semibold px-4 py-2.5 text-xs transition">
                    <span>+ Add First Envelope</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Private & Secure / Reciprocity Vault with Interactive PIN Phone (media_1793559373758_a31df011.png) */}
          <div className="rounded-[32px] bg-[#0F1523] border border-[#1E2638] p-8 md:p-12 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Sub-card: 3D Safe Vault Graphic */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#131B2E] border border-[#1E2638]">
              {/* 3D Safe with Coin popping out */}
              <div className="relative w-32 h-32 my-3 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1E3A4A] via-[#112430] to-[#0A161E] border-2 border-[#2E556C] shadow-2xl flex items-center justify-center relative">
                  {/* Gold coin popping out */}
                  <div className="absolute -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-[#996515] via-[#E6CA65] to-[#FFED8A] p-0.5 shadow-md flex items-center justify-center animate-bounce">
                    <span className="font-serif text-sm font-black text-[#5C3D06]">₹</span>
                  </div>
                  {/* Safe Dial */}
                  <div className="w-10 h-10 rounded-full border-2 border-[#4EECD3]/60 bg-[#0F1523] flex items-center justify-center">
                    <Lock className={cn('h-4 w-4', safeUnlocked ? 'text-emerald-400' : 'text-[#4EECD3]')} />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-sans font-black text-white mt-2">
                Private & Secure
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Zero data leaks, 100% offline-ready encrypted storage
              </p>
            </div>

            {/* Right Sub-card: Verification Keypad Phone Demo (Exact Wix Screenshot 8) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl p-4 bg-[#131B2E] border border-[#1E2638] max-w-sm mx-auto lg:mx-0 space-y-3 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  VERIFICATION PIN DEMO
                </span>
                <p className="text-sm font-bold text-white">Your Private Code Has Been Sent</p>

                {/* PIN Boxes matching Screenshot 8 */}
                <div className="flex items-center justify-center gap-2 py-1">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'w-10 h-11 rounded-xl border flex items-center justify-center font-mono text-base font-bold transition-all',
                        pinDigits[idx]
                          ? 'border-[#4EECD3] bg-[#0F1523] text-[#4EECD3]'
                          : 'border-[#1E2638] bg-[#0B0F19] text-slate-500'
                      )}
                    >
                      {pinDigits[idx] || '•'}
                    </div>
                  ))}
                </div>

                {safeUnlocked ? (
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-400 text-xs text-emerald-300 font-bold">
                    ✓ Safe Unlocked! Reciprocity Ledger Verified.
                  </div>
                ) : (
                  <div className="flex justify-center gap-1.5 pt-1">
                    {['3', '5', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => handlePinPress(digit)}
                        className="w-8 h-8 rounded-lg bg-[#0F1523] hover:bg-[#2563EB] text-white border border-[#1E2638] font-bold text-xs transition"
                      >
                        {digit}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleResetPin}
                      className="px-2 h-8 rounded-lg bg-[#0F1523] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-[10px] font-bold"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/reciprocity">
                  <button className="flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-5 py-2.5 text-xs shadow-md transition hover:scale-105">
                    <span>Open Reciprocity Ledger</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/guests">
                  <button className="flex items-center gap-2 rounded-xl bg-[#131B2E] hover:bg-[#1E2638] text-slate-200 border border-[#1E2638] font-semibold px-4 py-2.5 text-xs transition">
                    <span>View Guest Directory</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: PARTNERS & CTA BANNER (media_1793559386825_787eccbc.png) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1E2638]">
        {/* Partner Venues Ribbon in Monochrome White */}
        <div className="text-center space-y-6">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Trusted by Families at Premier Wedding Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75">
            <span className="font-serif text-lg font-black tracking-widest text-white">THE LEELA PALACE</span>
            <span className="font-serif text-lg font-black tracking-widest text-white">TAJ HOTELS</span>
            <span className="font-serif text-lg font-black tracking-widest text-white">OBEROI RESORTS</span>
            <span className="font-serif text-lg font-black tracking-widest text-white">ITC GRAND CHOLA</span>
            <span className="font-sans text-base font-black tracking-wider text-white">WEDMEGOOD</span>
            <span className="font-sans text-base font-black tracking-wider text-white">SHAADI.COM</span>
          </div>
        </div>

        {/* Hero CTA Box with Floating Coins */}
        <div className="mt-16 rounded-[40px] bg-[#0F1523] border border-[#1E2638] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          {/* Ambient Glows & Floating Coins inside CTA */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Gold Coin Left */}
          <div className="absolute top-10 left-6 sm:left-14 w-16 h-16 rounded-full bg-gradient-to-tr from-[#996515] via-[#E6CA65] to-[#FFED8A] p-1 shadow-xl hidden sm:flex items-center justify-center rotate-[-15deg] animate-float-slow">
            <span className="font-serif text-xl font-black text-[#5C3D06]">₹</span>
          </div>

          {/* Floating Gold Coin Right */}
          <div className="absolute bottom-10 right-6 sm:right-14 w-20 h-20 rounded-full bg-gradient-to-tr from-[#996515] via-[#E6CA65] to-[#FFED8A] p-1 shadow-xl hidden sm:flex items-center justify-center rotate-[20deg] animate-float-reverse">
            <span className="font-serif text-2xl font-black text-[#5C3D06]">₹</span>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4EECD3] text-white shadow-xl shadow-blue-600/30">
              <span className="text-2xl" role="img" aria-label="shagun">💍</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-sans font-black text-white tracking-tight">
              Get Shagun Tracker Now
            </h2>

            <p className="text-slate-300 text-sm sm:text-base">
              Start recording gifts, managing guests, and enjoying your family wedding without financial stress.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/gifts/new" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-8 py-4 shadow-xl shadow-blue-600/30 transition hover:scale-105 active:scale-95 text-sm">
                  <span>+ Record First Shagun</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>

              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#131B2E] hover:bg-[#1E2638] text-white border border-[#1E2638] font-semibold px-7 py-4 transition text-sm">
                  <span>Open Full Dashboard</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
