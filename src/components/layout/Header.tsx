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
  Moon,
  Sun,
  LogIn,
  Plus,
  ChevronDown,
  Sparkles,
  IndianRupee,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { getInitials, stringToColor } from '@/utils/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);

  const viewMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isTraditional = theme === 'traditional';
  const isClay = theme === 'clay';
  const isHi = language === 'hi';

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setViewMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/dashboard', label: isHi ? 'बही-खाता' : 'Bahi-Khata', icon: BookOpen },
    { href: '/dashboard?tab=registry', label: isHi ? 'शादी उपहार सूची' : 'Gift Registry', icon: Gift },
    { href: '/guests', label: isHi ? 'रिश्तेदार' : 'Guests', icon: Users },
    { href: '/gifts', label: isHi ? 'लिफ़ाफ़े' : 'Envelopes', icon: IndianRupee },
    { href: '/reciprocity', label: isHi ? 'लेन-देन' : 'Reciprocity', icon: RefreshCw },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full backdrop-blur-xl transition-colors duration-300 font-sans',
        isTraditional
          ? 'bg-[#FFFDF9]/95 border-b border-[#8B1D2C]/20 text-stone-900 shadow-xs'
          : isClay
          ? 'bg-[#FBF0EE]/95 border-b border-[#F2D7D3] text-slate-800'
          : theme === 'dark'
          ? 'bg-[#0B0F19]/90 border-b border-[#1E2638] text-white'
          : 'bg-[#E8EDF5]/90 border-b border-slate-200 text-slate-800'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div
            className={cn(
              'flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl text-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0',
              isTraditional
                ? 'bg-gradient-to-tr from-[#7A1522] to-[#8B1D2C] border border-amber-300 shadow-rose-950/20'
                : isClay
                ? 'bg-gradient-to-tr from-[#FA837F] to-[#FA726C] shadow-[0_6px_14px_rgba(250,124,119,0.35)]'
                : 'bg-gradient-to-tr from-[#2563EB] to-[#4EECD3] shadow-blue-600/30'
            )}
          >
            <span className="text-lg sm:text-xl font-serif font-black" role="img" aria-label="om">
              {isTraditional ? 'ॐ' : '💍'}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className={cn(
                'font-serif text-base sm:text-lg font-black tracking-wide leading-none',
                isTraditional
                  ? 'text-[#8B1D2C]'
                  : isClay
                  ? 'text-slate-800 font-sans'
                  : theme === 'dark'
                  ? 'text-white font-sans'
                  : 'text-slate-800 font-sans'
              )}
            >
              SHAGUN TRACKER
            </span>
            <span
              className={cn(
                'text-[9px] sm:text-[10px] uppercase font-bold tracking-widest mt-0.5 sm:mt-1',
                isTraditional
                  ? 'text-amber-800'
                  : isClay
                  ? 'text-[#FA7C77]'
                  : 'text-[#4EECD3]'
              )}
            >
              {isTraditional ? (isHi ? 'शुभ विवाह बही-खाता' : 'WEDDING BAHI-KHATA') : 'FINTECH BAHI-KHATA'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isRegistryLink = link.href.includes('tab=registry');
            const isActive = isRegistryLink
              ? pathname === '/dashboard' && typeof window !== 'undefined' && window.location.search.includes('tab=registry')
              : link.href === '/dashboard'
              ? (pathname === '/dashboard' || pathname === '/') && !(typeof window !== 'undefined' && window.location.search.includes('tab=registry'))
              : pathname === link.href || pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all',
                  isTraditional
                    ? isActive
                      ? 'bg-[#8B1D2C] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:text-[#8B1D2C] hover:bg-[#8B1D2C]/10'
                    : isClay
                    ? isActive
                      ? 'text-[#FA7C77] font-black bg-white shadow-xs'
                      : 'text-slate-600 hover:text-[#FA7C77] hover:bg-white/60'
                    : isActive
                    ? 'text-[#4EECD3] font-bold bg-[#131B2E]'
                    : 'text-slate-300 hover:text-white hover:bg-[#131B2E]/60'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4',
                    isTraditional
                      ? isActive
                        ? 'text-amber-200'
                        : 'text-stone-400'
                      : isClay
                      ? isActive
                        ? 'text-[#FA7C77]'
                        : 'text-slate-400'
                      : isActive
                      ? 'text-[#4EECD3]'
                      : 'text-slate-400'
                  )}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side tools: View Menu Dropdown, Language Toggle, CTA, User */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* ───────────────────────────────────────────────────────── */}
          {/* VIEW / THEME SELECTOR DROPDOWN BUTTON                     */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="relative" ref={viewMenuRef}>
            <button
              type="button"
              onClick={() => setViewMenuOpen(!viewMenuOpen)}
              className={cn(
                'flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl transition shadow-xs font-bold text-xs border',
                isTraditional
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : isClay
                  ? 'bg-white clay-card p-0 text-[#FA7C77] px-2.5'
                  : theme === 'dark'
                  ? 'bg-[#131B2E] border-[#1E2638] text-slate-300 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              )}
              title={isHi ? 'डैशबोर्ड व्यू बदलें' : 'Switch View / Theme'}
            >
              <span>{theme === 'traditional' ? '📕' : theme === 'clay' ? '🌸' : theme === 'dark' ? '🌌' : '☀️'}</span>
              <span className="hidden sm:inline font-semibold">{isHi ? 'व्यू' : 'View'}</span>
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', viewMenuOpen && 'rotate-180')} />
            </button>

            {viewMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#131B2E] border border-stone-200 dark:border-[#1E2638] shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider">
                  {isHi ? 'डैशबोर्ड शैली (View Mode)' : 'Select Dashboard View'}
                </div>

                {/* 1. Traditional */}
                <button
                  type="button"
                  onClick={() => { setTheme('traditional'); setViewMenuOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-bold transition',
                    theme === 'traditional'
                      ? 'bg-[#8B1D2C] text-white'
                      : 'text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/10'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>📕</span>
                    <span>{isHi ? 'पारंपरिक बही-खाता' : 'Traditional Bahi-Khata'}</span>
                  </span>
                  {theme === 'traditional' && <span>✓</span>}
                </button>

                {/* 2. Claymorphism */}
                <button
                  type="button"
                  onClick={() => { setTheme('clay'); setViewMenuOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-bold transition',
                    theme === 'clay'
                      ? 'bg-[#FA7C77] text-white'
                      : 'text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/10'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>🌸</span>
                    <span>Claymorphism 3D</span>
                  </span>
                  {theme === 'clay' && <span>✓</span>}
                </button>

                {/* 3. Dark Mode */}
                <button
                  type="button"
                  onClick={() => { setTheme('dark'); setViewMenuOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-bold transition',
                    theme === 'dark'
                      ? 'bg-[#2563EB] text-white'
                      : 'text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/10'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>🌌</span>
                    <span>{isHi ? 'डार्क मोड' : 'Dark Mode'}</span>
                  </span>
                  {theme === 'dark' && <span>✓</span>}
                </button>

                {/* 4. Light Mode */}
                <button
                  type="button"
                  onClick={() => { setTheme('light'); setViewMenuOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-bold transition',
                    theme === 'light'
                      ? 'bg-slate-700 text-white'
                      : 'text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/10'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>☀️</span>
                    <span>{isHi ? 'लाइट मोड' : 'Light Mode'}</span>
                  </span>
                  {theme === 'light' && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Global i18n Language Toggle */}
          <div
            className={cn(
              'flex items-center gap-0.5 sm:gap-1 rounded-full p-0.5 sm:p-1 text-xs font-semibold border',
              isTraditional
                ? 'bg-white border-stone-300'
                : isClay
                ? 'bg-white border-[#F2D7D3] shadow-inner'
                : 'bg-[#131B2E] border-[#1E2638]'
            )}
          >
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={cn(
                'rounded-full px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] transition-all',
                language === 'hi'
                  ? isTraditional
                    ? 'bg-[#8B1D2C] text-white shadow-xs font-bold'
                    : isClay
                    ? 'bg-[#FA7C77] text-white shadow-xs font-bold'
                    : 'bg-[#2563EB] text-white shadow-sm font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              )}
              title="हिंदी में बदलें"
            >
              हिं
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={cn(
                'rounded-full px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] transition-all',
                language === 'en'
                  ? isTraditional
                    ? 'bg-[#8B1D2C] text-white shadow-xs font-bold'
                    : isClay
                    ? 'bg-[#FA7C77] text-white shadow-xs font-bold'
                    : 'bg-[#2563EB] text-white shadow-sm font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              )}
              title="Switch to English"
            >
              En
            </button>
          </div>

          {/* Quick Add Shagun CTA Button */}
          <Link href="/gifts/new" className="hidden sm:inline-flex">
            <button
              className={cn(
                'flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 transition hover:scale-105 active:scale-95 shadow-sm rounded-xl',
                isTraditional
                  ? 'bg-[#8B1D2C] hover:bg-[#731522] text-white'
                  : isClay
                  ? 'clay-btn-coral'
                  : 'bg-[#2563EB] hover:bg-blue-600 text-white'
              )}
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>{isHi ? '+ नया शगुन' : '+ Add Shagun'}</span>
            </button>
          </Link>

          {/* Login / User Avatar */}
          {session?.user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border-2 border-[#8B1D2C] p-0.5 transition hover:opacity-80"
                aria-label="User account menu"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarFallback
                    style={{ backgroundColor: stringToColor(session.user.name || 'User') }}
                    className="text-white font-bold text-xs"
                  >
                    {getInitials(session.user.name || 'User')}
                  </AvatarFallback>
                </Avatar>
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl z-50 text-stone-800 animate-in fade-in zoom-in-95"
                >
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="font-bold text-xs truncate">{session.user.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs hover:bg-stone-50 font-medium"
                  >
                    <User className="h-3.5 w-3.5 text-stone-500" />
                    <span>{isHi ? 'खाता व प्रोफ़ाइल' : 'Profile & Account'}</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs hover:bg-stone-50 font-medium"
                  >
                    <Settings className="h-3.5 w-3.5 text-stone-500" />
                    <span>{isHi ? 'प्राथमिकताएं व सेटिंग्स' : 'Preferences & Settings'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{isHi ? 'लॉग आउट (Sign Out)' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-[#8B1D2C]/40 text-[#8B1D2C] hover:bg-[#8B1D2C]/10 text-xs font-bold transition flex items-center gap-1"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>{isHi ? 'लॉगिन' : 'Sign In'}</span>
              </button>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-stone-300 text-stone-700"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-stone-800 hover:bg-stone-100"
            >
              <link.icon className="h-4 w-4 text-[#8B1D2C]" />
              <span>{link.label}</span>
            </Link>
          ))}
          <Link
            href="/gifts/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#8B1D2C] text-white text-xs font-bold"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{isHi ? '+ नया शगुन दर्ज करें' : '+ Record New Shagun'}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
