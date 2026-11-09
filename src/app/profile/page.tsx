'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Gift,
  Users,
  Settings,
  LogOut,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Key,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { stringToColor, getInitials, formatCurrency } from '@/utils/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalGuests: 0,
    totalGifts: 0,
    totalCashReceived: 0,
    pendingReciprocity: 0,
  });
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  const isTraditional = theme === 'traditional';

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
          setIsDemo(data.isDemo);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const userName = session?.user?.name || (isDemo ? 'Sharma Family (शर्मा परिवार)' : 'Guest User');
  const userEmail = session?.user?.email || (isDemo ? 'demo@shagun.app' : 'Not logged in');

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
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-[#1E2638]">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
            <Link href="/dashboard" className="text-[#8B1D2C] hover:underline font-semibold flex items-center gap-1">
              <span>🏠 बही-खाता (Dashboard)</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900 dark:text-white">उपयोगकर्ता खाता (Profile)</span>
          </div>

          <Link href="/settings">
            <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl gap-1.5">
              <Settings className="h-3.5 w-3.5" />
              <span>सेटिंग्स (Settings)</span>
            </Button>
          </Link>
        </div>

        {/* Profile Card Header */}
        <div
          className={cn(
            'rounded-3xl p-6 sm:p-8 relative overflow-hidden transition',
            isTraditional
              ? 'bg-white border-2 border-stone-200/90 shadow-sm'
              : 'border border-[#1E2638] bg-[#0F1523] text-white shadow-2xl'
          )}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
            <Avatar className="h-24 w-24 rounded-3xl border-4 border-amber-400/80 shadow-md flex-shrink-0">
              {session?.user?.image && <AvatarImage src={session.user.image} alt={userName} />}
              <AvatarFallback
                style={{ backgroundColor: isTraditional ? '#8B1D2C' : stringToColor(userName) }}
                className="text-white text-3xl font-serif font-black rounded-3xl"
              >
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                  {userName}
                </h1>
                <Badge
                  variant="outline"
                  className={
                    isDemo
                      ? 'bg-amber-500/10 text-amber-800 border-amber-400/40 text-[11px] font-bold'
                      : 'bg-emerald-500/10 text-emerald-800 border-emerald-400/40 text-[11px] font-bold'
                  }
                >
                  {isDemo ? '🟡 डेमो खाता (Demo Account)' : '🟢 व्यक्तिगत बही-खाता'}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#8B1D2C]" />
                <span>{userEmail}</span>
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 flex-wrap text-xs text-stone-600">
                <span className="text-[11px] px-3 py-1 rounded-full bg-stone-100 border border-stone-200">
                  खाता: <strong>पारंपरिक शादी बही-खाता</strong>
                </span>
                <span className="text-[11px] px-3 py-1 rounded-full bg-stone-100 border border-stone-200">
                  गोपनीयता: <strong>100% सुरक्षित व निजी</strong>
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {session?.user ? (
                <Button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  variant="destructive"
                  size="sm"
                  className="rounded-xl text-xs gap-1.5 h-9 font-bold bg-rose-600 hover:bg-rose-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>लॉग आउट</span>
                </Button>
              ) : (
                <Link href="/login" className="w-full">
                  <Button
                    size="sm"
                    className="w-full rounded-xl text-xs gap-1.5 h-9 font-bold bg-[#8B1D2C] hover:bg-[#731522] text-white shadow-sm"
                  >
                    <span>लॉगिन करें (Sign In)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Ledger Statistics for this User */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif flex items-center gap-2 text-[#8B1D2C] dark:text-white">
              <BookOpen className="h-4 w-4" />
              <span>बही-खाता सारांश (Ledger Summary)</span>
            </h2>
            {isDemo && (
              <span className="text-xs text-amber-700 dark:text-amber-300">
                अपने व्यक्तिगत बही-खाते हेतु ईमेल से लॉगिन करें
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border-2 border-stone-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                कुल नकद शगुन
              </span>
              <span className="text-xl sm:text-2xl font-serif font-black text-emerald-800 mt-1 block">
                {formatCurrency(stats.totalCashReceived)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-stone-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                विवाह समारोह
              </span>
              <span className="text-xl sm:text-2xl font-serif font-black text-stone-900 mt-1 block">
                {stats.totalEvents}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-stone-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                रिश्तेदार दर्ज
              </span>
              <span className="text-xl sm:text-2xl font-serif font-black text-amber-900 mt-1 block">
                {stats.totalGuests}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-stone-200/80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                भविष्य वापसी देय
              </span>
              <span className="text-xl sm:text-2xl font-serif font-black text-rose-700 mt-1 block">
                {stats.pendingReciprocity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
