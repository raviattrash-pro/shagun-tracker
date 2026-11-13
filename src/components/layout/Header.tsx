'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  BookOpen,
  Users,
  Gift,
  RefreshCw,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  LogIn,
  Plus,
  IndianRupee,
  Calendar,
  Share2,
  WifiOff,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { getInitials, stringToColor } from '@/utils/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { useOnlineStatus } from '@/lib/offline/offlineStorage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AetherThemeSwitcher } from '@/components/theme/AetherThemeSwitcher';
import { PwaInstallButton } from '@/components/pwa/PwaInstallButton';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isOnline = useOnlineStatus();
  const isHi = language === 'hi';

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/dashboard', label: isHi ? 'बही-खाता' : 'Bahi-Khata', icon: BookOpen },
    { href: '/dashboard?tab=registry', label: isHi ? 'शादी उपहार' : 'Gift Registry', icon: Gift },
    { href: '/guests', label: isHi ? 'रिश्तेदार' : 'Guests', icon: Users },
    { href: '/gifts', label: isHi ? 'लिफ़ाफ़े' : 'Envelopes', icon: IndianRupee },
    { href: '/reciprocity', label: isHi ? 'लेन-देन' : 'Reciprocity', icon: RefreshCw },
  ];

  return (
    <header className="sticky top-0 z-50 w-full py-2 px-2.5 sm:px-6 transition-all font-sans">
      <div className="mx-auto max-w-7xl flex items-center justify-between rounded-full bg-white/85 dark:bg-[#132238]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-3 sm:px-5 py-1.5 sm:py-2">
        {/* Left: Brand / Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C0392B] to-[#F39C12] text-white shadow-md shadow-[#C0392B]/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <span className="text-sm sm:text-base font-black" role="img" aria-label="wedding">
              💍
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight leading-none text-slate-800 dark:text-white">
              Shagun Tracker
            </span>
            <span className="hidden sm:inline-block text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-[#C0392B] dark:text-[#00E5FF] mt-0.5">
              {isHi ? 'विवाह बही-खाता' : 'Wedding Registry'}
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F5E8DA]/60 dark:bg-[#0A1320]/60 p-1 rounded-full border border-white/60 dark:border-white/5" aria-label="Main navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isRegistry = link.href.includes('tab=registry');
            const isActive = isRegistry
              ? pathname === '/dashboard' && typeof window !== 'undefined' && window.location.search.includes('tab=registry')
              : link.href === '/dashboard'
              ? (pathname === '/dashboard' || pathname === '/') && !(typeof window !== 'undefined' && window.location.search.includes('tab=registry'))
              : pathname === link.href || pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200',
                  isActive
                    ? 'bg-white dark:bg-[#1E334D] text-[#C0392B] dark:text-[#00E5FF] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side tools: Responsive cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Offline Status Badge */}
          {!isOnline && (
            <div
              className="flex items-center gap-1 bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40 px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold animate-pulse shadow-xs"
              title={isHi ? 'ऑफ़लाइन मोड: स्थानीय कैश सुरक्षित है' : 'Offline Mode: Local cache is active'}
            >
              <WifiOff className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">{isHi ? 'ऑफ़लाइन' : 'Offline'}</span>
            </div>
          )}

          {/* PWA Install / App Download Button */}
          <PwaInstallButton />

          {/* Aether 8-Dot Theme Switcher (Authentic Aether Planner SS) */}
          <AetherThemeSwitcher />

          {/* Language Toggle (Hindi / English) */}
          <div className="flex items-center rounded-full bg-[#F5E8DA]/80 dark:bg-[#0A1320]/80 p-0.5 border border-white/60 dark:border-white/5 shadow-inner text-xs font-bold">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={cn(
                'rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] font-bold transition-all',
                language === 'hi'
                  ? 'bg-white dark:bg-[#1E334D] text-[#C0392B] dark:text-[#00E5FF] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              हिं
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={cn(
                'rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] font-bold transition-all',
                language === 'en'
                  ? 'bg-white dark:bg-[#1E334D] text-[#C0392B] dark:text-[#00E5FF] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              En
            </button>
          </div>

          {/* Quick Add CTA */}
          <Link href="/gifts/new" className="hidden sm:inline-flex">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C0392B] to-[#D9534F] hover:from-[#B03022] hover:to-[#C0392B] text-white shadow-sm shadow-[#C0392B]/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{isHi ? '+ शगुन' : '+ Shagun'}</span>
            </button>
          </Link>

          {/* User Account / Avatar */}
          {session?.user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 rounded-full p-0.5 transition hover:opacity-85"
                aria-label="User account"
              >
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-[#C0392B]/40">
                  <AvatarFallback
                    style={{ backgroundColor: stringToColor(session.user.name || 'User') }}
                    className="text-white font-bold text-xs"
                  >
                    {getInitials(session.user.name || 'User')}
                  </AvatarFallback>
                </Avatar>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/80 dark:border-white/10 bg-white/95 dark:bg-[#132238]/95 backdrop-blur-xl p-2 shadow-xl z-50 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10">
                    <p className="font-bold text-xs truncate">{session.user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-white/5 font-semibold"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isHi ? 'प्राथमिकताएं' : 'Settings'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{isHi ? 'लॉग आउट' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-block">
              <button
                type="button"
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1"
              >
                <LogIn className="h-3 w-3" />
                <span>{isHi ? 'लॉगिन' : 'Sign In'}</span>
              </button>
            </Link>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-auto max-w-7xl rounded-3xl border border-white/80 dark:border-white/10 bg-white/95 dark:bg-[#132238]/95 backdrop-blur-xl p-4 space-y-2 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-[#F5E8DA]/60 dark:hover:bg-white/5"
            >
              <link.icon className="h-4 w-4 text-[#C0392B] dark:text-[#00E5FF]" />
              <span>{link.label}</span>
            </Link>
          ))}
          {!session?.user && (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-[#F5E8DA]/60"
            >
              <LogIn className="h-4 w-4 text-[#C0392B]" />
              <span>{isHi ? 'लॉगिन' : 'Sign In'}</span>
            </Link>
          )}
          <Link
            href="/gifts/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[#C0392B] text-white text-xs font-bold shadow-md"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{isHi ? '+ नया शगुन दर्ज करें' : '+ Record New Shagun'}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
