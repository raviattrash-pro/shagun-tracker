'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Calendar,
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
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { getInitials, stringToColor } from '@/utils/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: language === 'hi' ? 'होम' : 'Home', icon: LayoutDashboard },
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/guests', label: t('guests'), icon: Users },
    { href: '/gifts', label: t('gifts'), icon: Gift },
    { href: '/reciprocity', label: t('reciprocity'), icon: RefreshCw },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E2638] bg-[#0B0F19]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4EECD3] text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform flex-shrink-0">
            <span className="text-lg sm:text-xl" role="img" aria-label="ring">
              💍
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base sm:text-lg font-black tracking-tight text-white leading-none">
              SHAGUN TRACKER
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#4EECD3] mt-0.5 sm:mt-1">
              FINTECH BAHI-KHATA
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'text-[#4EECD3] font-bold bg-[#131B2E]'
                    : 'text-slate-300 hover:text-white hover:bg-[#131B2E]/60'
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-[#4EECD3]' : 'text-slate-400')} />
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#4EECD3] shadow-sm shadow-[#4EECD3]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Menu, Theme Switcher, Language Switcher & Quick Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (Dark Fintech vs Neomorphic Soft UI) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#131B2E] border border-[#1E2638] text-slate-300 hover:text-white transition shadow-sm"
            title={theme === 'dark' ? 'Switch to Neomorphic Light UI' : 'Switch to Fintech Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[#E6CA65]" />
            ) : (
              <Moon className="h-4 w-4 text-[#4EECD3]" />
            )}
          </button>

          {/* Global i18n Language Toggle (Compact on Mobile) */}
          <div className="flex items-center gap-0.5 sm:gap-1 rounded-full bg-[#131B2E] p-0.5 sm:p-1 border border-[#1E2638] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={cn(
                'rounded-full px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] transition-all',
                language === 'hi'
                  ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
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
                  ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              )}
              title="Switch to English"
            >
              En
            </button>
          </div>

          <Link href="/gifts/new" className="hidden lg:inline-flex">
            <button className="flex items-center gap-1.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 shadow-lg shadow-blue-600/30 transition hover:scale-105 active:scale-95">
              <span className="text-sm font-black leading-none">+</span>
              <span>{t('addShagun')}</span>
            </button>
          </Link>

          {/* Login / User Avatar - VISIBLE ON BOTH MOBILE AND DESKTOP! */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 rounded-full p-0.5 border border-[#1E2638] bg-[#131B2E] transition-all hover:scale-105"
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      backgroundColor: stringToColor(
                        session.user.name ?? 'U'
                      ),
                    }}
                  >
                    {getInitials(session.user.name ?? 'User')}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-[#1E2638] bg-[#0F1523] p-1.5 shadow-2xl animate-in fade-in zoom-in-95">
                    <div className="border-b border-[#1E2638] px-3 py-2.5">
                      <p className="text-xs font-bold text-white truncate">
                        {session.user.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-[#131B2E] transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 text-[#4EECD3]" />
                      <span>Profile (प्रोफ़ाइल)</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-[#131B2E] transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-[#2563EB]" />
                      <span>Settings (सेटिंग्स)</span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out (लॉगआउट)</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full bg-[#131B2E] border border-[#1E2638] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#2563EB] hover:border-[#2563EB] transition shadow-md flex-shrink-0"
              title="Sign in to your account"
            >
              <LogIn className="h-3.5 w-3.5 text-[#4EECD3]" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="rounded-xl p-2 text-slate-300 hover:text-white hover:bg-[#131B2E] border border-[#1E2638] transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#1E2638] bg-[#0F1523]/95 backdrop-blur-2xl md:hidden animate-in slide-in-from-top-2 duration-200 p-4 space-y-4">
          {/* User Account Quick Card on Mobile */}
          <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-[#1E2638] flex items-center justify-between">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl border border-amber-400">
                  <AvatarFallback className="bg-amber-600 text-white font-bold text-xs">
                    {getInitials(session.user.name ?? 'User')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-bold text-white">{session.user.name}</p>
                  <p className="text-[10px] text-slate-400">{session.user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-xs font-bold text-white">Guest Account</p>
                  <p className="text-[10px] text-slate-400">Sign in to save your wedding data</p>
                </div>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-[#2563EB] text-white px-3 py-1.5 text-xs font-bold"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-[#131B2E] text-[#4EECD3]'
                      : 'text-slate-300 hover:bg-[#131B2E]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}

            {/* Profile & Settings inside mobile menu */}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-[#131B2E]"
            >
              <User className="h-4 w-4 text-[#4EECD3]" />
              <span>User Profile (प्रोफ़ाइल)</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-[#131B2E]"
            >
              <Settings className="h-4 w-4 text-[#2563EB]" />
              <span>Settings & Appearance</span>
            </Link>

            {session?.user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/login' });
                }}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
