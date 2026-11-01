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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { stringToColor, getInitials, formatCurrency } from '@/utils/format';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalGuests: 0,
    totalGifts: 0,
    totalCashReceived: 0,
    pendingReciprocity: 0,
  });
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-[#2563EB] selection:text-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-60 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1">
              <span>🏠 Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-white font-medium">User Profile</span>
          </div>

          <Link href="/settings">
            <Button variant="outline" size="sm" className="text-xs h-8 rounded-xl bg-[#0F1523] border-[#1E2638] text-slate-300 hover:text-white gap-1.5">
              <Settings className="h-3.5 w-3.5" />
              <span>Settings</span>
            </Button>
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="rounded-3xl border border-[#1E2638] bg-[#0F1523] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
            <Avatar className="h-24 w-24 rounded-3xl border-4 border-amber-400/80 shadow-2xl flex-shrink-0">
              {session?.user?.image && <AvatarImage src={session.user.image} alt={userName} />}
              <AvatarFallback
                style={{ backgroundColor: stringToColor(userName) }}
                className="text-white text-3xl font-serif font-black rounded-3xl"
              >
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white truncate">
                  {userName}
                </h1>
                <Badge
                  variant="outline"
                  className={
                    isDemo
                      ? 'bg-amber-500/10 text-[#E6CA65] border-amber-400/40 text-[11px] font-bold'
                      : 'bg-emerald-500/10 text-[#4EECD3] border-emerald-400/40 text-[11px] font-bold'
                  }
                >
                  {isDemo ? '🟡 Demo Account' : '🟢 Personal Account'}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>{userEmail}</span>
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="text-[11px] px-3 py-1 rounded-full bg-[#131B2E] border border-[#1E2638] text-slate-300">
                  Account Type: <strong>Fintech Ledger</strong>
                </span>
                <span className="text-[11px] px-3 py-1 rounded-full bg-[#131B2E] border border-[#1E2638] text-slate-300">
                  Data Isolation: <strong>100% Encrypted & Private</strong>
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
                  <span>Sign Out</span>
                </Button>
              ) : (
                <Link href="/login" className="w-full">
                  <Button
                    size="sm"
                    className="w-full rounded-xl text-xs gap-1.5 h-9 font-bold bg-[#2563EB] hover:bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  >
                    <span>Sign In to Your Account</span>
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
            <h2 className="text-lg font-bold font-sans text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#4EECD3]" />
              <span>{isDemo ? 'Sample Demo Ledger Metrics' : 'Your Personal Ledger Metrics'}</span>
            </h2>
            {isDemo && (
              <span className="text-xs text-amber-300">
                Sign in with your email to create your private ledger
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0F1523] border border-[#1E2638] shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Cash Received
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#4EECD3] mt-1 block">
                {formatCurrency(stats.totalCashReceived)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F1523] border border-[#1E2638] shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Wedding Events
              </span>
              <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
                {stats.totalEvents}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F1523] border border-[#1E2638] shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Guests Logged
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#E6CA65] mt-1 block">
                {stats.totalGuests}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F1523] border border-[#1E2638] shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Pending Reciprocity
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 mt-1 block">
                {stats.pendingReciprocity}
              </span>
            </div>
          </div>
        </div>

        {/* Account Settings Shortcut Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Link href="/settings" className="block group">
            <div className="p-5 rounded-2xl bg-[#0F1523] border border-[#1E2638] hover:border-[#2563EB]/60 transition shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-[#4EECD3] transition">
                  Theme & Visual Appearance
                </h4>
                <p className="text-xs text-slate-400">
                  Switch between Wix Fintech Dark and Neomorphic Soft UI Light
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#4EECD3] group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link href="/events/new" className="block group">
            <div className="p-5 rounded-2xl bg-[#0F1523] border border-[#1E2638] hover:border-[#4EECD3]/60 transition shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-[#4EECD3] transition">
                  Add Wedding Ceremony
                </h4>
                <p className="text-xs text-slate-400">
                  Create a new event (Wedding, Haldi, Sangeet, Reception)
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#4EECD3] group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
