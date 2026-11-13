'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, X, Share2, PlusSquare } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PwaInstallButtonProps {
  className?: string;
  variant?: 'header' | 'card' | 'pill';
}

export function PwaInstallButton({ className, variant = 'header' }: PwaInstallButtonProps) {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone);

      // Detect iOS
      const ua = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(ua);
      setIsIos(isApple);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) return;

    if (deferredPrompt) {
      // Chrome / Edge / Android native prompt
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      // iOS Safari guide
      setShowIosGuide(true);
    } else {
      // Fallback instruction guide
      setShowIosGuide(true);
    }
  };

  // If already running inside installed standalone PWA, don't show install button in header
  if (isInstalled && variant === 'header') {
    return null;
  }

  return (
    <>
      {variant === 'header' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          title={isHi ? 'ऐप के रूप में फ़ोन में इंस्टॉल करें' : 'Install as Native App on your device'}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-extrabold transition-all duration-200 cursor-pointer shadow-xs',
            'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-800 dark:text-amber-200',
            'border border-amber-500/40 hover:bg-amber-500/30 active:scale-95 flex-shrink-0',
            className
          )}
        >
          <Smartphone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden sm:inline">
            {isInstalled ? (isHi ? 'ऐप इंस्टॉल है ✓' : 'App Installed ✓') : isHi ? 'ऐप इंस्टॉल करें' : 'Install App'}
          </span>
          <span className="sm:hidden">
            {isHi ? 'ऐप' : 'App'}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          className={cn(
            'w-full py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm cursor-pointer',
            'bg-gradient-to-r from-[#C0392B] to-[#E67E22] text-white hover:opacity-95 active:scale-95',
            className
          )}
        >
          <Download className="h-4 w-4" />
          <span>{isHi ? 'फ़ोन में ऐप डाउनलोड करें' : 'Download / Install App (PWA)'}</span>
        </button>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* iOS & Manual Installation Instruction Modal                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="aether-card w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95 bg-white dark:bg-[#132238] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📲</span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {isHi ? 'ऐप कैसे इंस्टॉल करें' : 'How to Install as App'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-white">
                {isHi
                  ? 'शगुन ट्रैकर को बिना ऐप स्टोर के सीधे अपने फ़ोन की होम स्क्रीन पर जोड़ें:'
                  : 'Add Shagun Tracker directly to your home screen for instant offline access:'}
              </p>

              {isIos ? (
                <div className="aether-inset p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                      1
                    </span>
                    <span>
                      {isHi ? 'सफारी ब्राउज़र में नीचे शेयर ' : 'In Safari, tap the Share '}
                      <Share2 className="inline h-3.5 w-3.5 text-blue-600" />
                      {isHi ? ' बटन पर टैप करें।' : ' icon at bottom.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                      2
                    </span>
                    <span>
                      {isHi ? 'नीचे स्क्रॉल कर ' : 'Scroll down & select '}
                      <strong>&quot;Add to Home Screen&quot; </strong>
                      <PlusSquare className="inline h-3.5 w-3.5 text-blue-600" />
                      {isHi ? ' चुनें।' : '.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                      3
                    </span>
                    <span>
                      {isHi ? 'ऊपर दाईं ओर ' : 'Tap '}
                      <strong>&quot;Add&quot;</strong>
                      {isHi ? ' पर टैप करें।' : ' on top right.'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aether-inset p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                      1
                    </span>
                    <span>
                      {isHi
                        ? 'ब्राउज़र मेनू (ऊपर 3 डॉट्स ⋮) पर टैप करें।'
                        : 'Tap the browser menu (⋮ on top right).'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                      2
                    </span>
                    <span>
                      {isHi
                        ? '"ऐप इंस्टॉल करें" या "Add to Home Screen" पर क्लिक करें।'
                        : 'Click "Install app" or "Add to Home screen".'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-600 font-bold">
                <Check className="h-3.5 w-3.5" />
                <span>
                  {isHi ? 'यह इंटरनेट न होने पर भी काम करेगा (Offline PWA)' : 'Works 100% offline with zero data usage'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-extrabold hover:opacity-90 transition"
            >
              {isHi ? 'समझ गया' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PwaInstallButton;
