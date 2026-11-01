'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Users, Plus, Mail, RefreshCw, User, LogIn } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getInitials } from '@/utils/format';

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t, language } = useLanguage();

  const accountHref = session?.user ? '/profile' : '/login';
  const accountLabel = session?.user
    ? (language === 'hi' ? 'खाता' : 'Account')
    : (language === 'hi' ? 'लॉगिन' : 'Sign In');

  const tabs = [
    { href: '/dashboard', label: t('dashboard'), icon: Home },
    { href: '/guests', label: t('guests'), icon: Users },
    { href: '/gifts/new', label: t('addShagun'), icon: Plus, isCenter: true },
    { href: '/gifts', label: t('gifts'), icon: Mail },
    { href: accountHref, label: accountLabel, icon: session?.user ? User : LogIn, isAccount: true },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1E2638] bg-[#0F1523]/95 backdrop-blur-xl safe-bottom md:hidden shadow-2xl"
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
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-xl shadow-blue-600/40 border-2 border-[#4EECD3]/40 transition-transform active:scale-95">
                  <Icon className="h-6 w-6 stroke-[3]" />
                </div>
                <span className="mt-1 text-[10px] font-bold text-[#4EECD3]">
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
                isActive ? 'text-[#4EECD3] font-bold' : 'text-slate-400 hover:text-white'
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.isAccount && session?.user ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-[9px] font-bold text-white">
                  {getInitials(session.user.name || 'U')}
                </div>
              ) : (
                <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5px]')} />
              )}
              <span className="text-[10px] font-semibold">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 h-0.5 w-6 rounded-full bg-[#4EECD3] shadow-sm shadow-[#4EECD3]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
