'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BookOpen, Users, Plus, Gift, RefreshCw, User, LogIn } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { getInitials } from '@/utils/format';

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isHi = language === 'hi';

  const accountHref = session?.user ? '/profile' : '/login';
  const accountLabel = session?.user
    ? (isHi ? 'खाता' : 'Profile')
    : (isHi ? 'लॉगिन' : 'Sign In');

  const tabs = [
    { href: '/dashboard', label: isHi ? 'बही-खाता' : 'Bahi-Khata', icon: BookOpen },
    { href: '/dashboard?tab=registry', label: isHi ? 'उपहार सूची' : 'Registry', icon: Gift },
    { href: '/gifts/new', label: isHi ? '+ शगुन' : '+ Shagun', icon: Plus, isCenter: true },
    { href: '/guests', label: isHi ? 'रिश्तेदार' : 'Guests', icon: Users },
    { href: accountHref, label: accountLabel, icon: session?.user ? User : LogIn, isAccount: true },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl safe-bottom md:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.08)] bg-white/90 dark:bg-[#101E32]/95 border-t border-white/80 dark:border-white/10 transition-colors duration-300 font-sans"
      aria-label="Mobile tab navigation"
    >
      <div className="mx-auto flex h-15 max-w-lg items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isRegistry = tab.href.includes('tab=registry');
          const isActive = isRegistry
            ? pathname === '/dashboard' && typeof window !== 'undefined' && window.location.search.includes('tab=registry')
            : tab.href === '/dashboard'
            ? (pathname === '/dashboard' || pathname === '/') && !(typeof window !== 'undefined' && window.location.search.includes('tab=registry'))
            : tab.href === '/gifts/new'
            ? pathname === '/gifts/new'
            : pathname.startsWith(tab.href);

          if (tab.isCenter) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative -mt-5 flex flex-col items-center"
                aria-label={tab.label}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#C0392B] to-[#E74C3C] text-white shadow-lg shadow-[#C0392B]/40 border-2 border-white dark:border-[#101E32] transition-transform active:scale-95">
                  <Icon className="h-6 w-6 stroke-[2.5]" />
                </div>
                <span className="mt-0.5 text-[9px] font-extrabold text-[#C0392B] dark:text-[#00E5FF]">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-1 px-2.5 py-1 transition-all',
                isActive
                  ? 'text-[#C0392B] dark:text-[#00E5FF] font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-[10px] font-bold leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
