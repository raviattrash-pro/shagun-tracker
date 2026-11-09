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
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  const isTraditional = theme === 'traditional';
  const isClay = theme === 'clay';

  const accountHref = session?.user ? '/profile' : '/login';
  const accountLabel = session?.user
    ? (language === 'hi' ? 'खाता' : 'Account')
    : (language === 'hi' ? 'लॉगिन' : 'Sign In');

  const tabs = [
    { href: '/dashboard', label: language === 'hi' ? 'बही-खाता' : 'Bahi-Khata', icon: BookOpen },
    { href: '/guests', label: language === 'hi' ? 'रिश्तेदार' : 'Guests', icon: Users },
    { href: '/gifts/new', label: language === 'hi' ? '+ नया शगुन' : '+ Add Shagun', icon: Plus, isCenter: true },
    { href: '/gifts', label: language === 'hi' ? 'उपहार' : 'Gifts', icon: Gift },
    { href: accountHref, label: accountLabel, icon: session?.user ? User : LogIn, isAccount: true },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl safe-bottom md:hidden shadow-2xl transition-colors duration-300 font-sans',
        isTraditional
          ? 'bg-[#FFFDF9]/95 border-t border-[#8B1D2C]/20'
          : isClay
          ? 'bg-[#FBF0EE]/95 border-t border-[#F2D7D3]'
          : 'border-t border-[#1E2638] bg-[#0F1523]/95'
      )}
      aria-label="Mobile tab navigation"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === '/dashboard'
              ? pathname === '/dashboard' || pathname === '/'
              : tab.href === '/gifts/new'
              ? pathname === '/gifts/new'
              : pathname.startsWith(tab.href);

          if (tab.isCenter) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative -mt-6 flex flex-col items-center"
                aria-label={tab.label}
              >
                <div
                  className={cn(
                    'flex h-13 w-13 items-center justify-center rounded-2xl text-white shadow-xl transition-transform active:scale-95',
                    isTraditional
                      ? 'bg-gradient-to-tr from-[#7A1522] to-[#8B1D2C] border-2 border-amber-300 shadow-rose-950/40 text-amber-50'
                      : isClay
                      ? 'bg-gradient-to-tr from-[#FA837F] to-[#FA726C] border-2 border-white shadow-rose-500/40'
                      : 'bg-[#2563EB] border-2 border-[#4EECD3]/40 shadow-blue-600/40'
                  )}
                >
                  <Icon className="h-6 w-6 stroke-[3]" />
                </div>
                <span
                  className={cn(
                    'mt-1 text-[10px] font-bold',
                    isTraditional ? 'text-[#8B1D2C]' : isClay ? 'text-[#FA7C77]' : 'text-[#4EECD3]'
                  )}
                >
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
                'flex flex-col items-center gap-1 px-3 py-1 transition-all',
                isTraditional
                  ? isActive
                    ? 'text-[#8B1D2C] font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                  : isClay
                  ? isActive
                    ? 'text-[#FA7C77] font-black'
                    : 'text-slate-500 hover:text-slate-800'
                  : isActive
                  ? 'text-[#4EECD3] font-bold'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
