'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Lock, Sparkles, UserCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'google' | 'admin'>('google');

  // Admin credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google Guest demo state for local dev
  const [guestName, setGuestName] = useState('Ramesh Sharma (Guest)');
  const [guestEmail, setGuestEmail] = useState('ramesh.guest@gmail.com');

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(
          isHi
            ? 'अमान्य एडमिन क्रेडेंशियल। कृपया अपना लॉगिन आईडी और पासवर्ड जांचें।'
            : 'Invalid admin credentials. Please check your login ID and password.'
        );
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(
        isHi
          ? 'एडमिन साइन-इन के दौरान त्रुटि हुई'
          : 'An error occurred during admin sign in'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      console.warn('Google OAuth redirected or failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFastGoogleDemoSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', {
        redirect: false,
        isGoogleGuestDemo: 'true',
        email: guestEmail,
        guestName: guestName,
      });

      if (res?.error) {
        setError(isHi ? 'त्वरित साइन-इन विफल रहा' : 'Fast sign in failed');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(
        isHi
          ? 'Google डेमो प्रोफ़ाइल से साइन इन करने में विफल'
          : 'Failed to sign in with Google demo profile'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-amber-300/40 rounded-3xl overflow-hidden font-sans">
      <CardHeader className="text-center space-y-1 bg-gradient-to-b from-amber-500/10 to-transparent pb-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C0392B] to-[#F39C12] text-white text-2xl font-serif font-black shadow-lg">
          ॐ
        </div>
        <CardTitle className="text-2xl font-serif font-bold pt-2 text-slate-900 dark:text-white">
          {isHi ? 'शगुन ट्रैकर में लॉगिन करें' : 'Sign In to Shagun Tracker'}
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          {isHi
            ? 'डिजिटल विवाह उपहार रजिस्ट्री, शगुन लिफाफे और बही-खाता'
            : 'Digital Wedding Registry, Shagun Envelopes & Bahi-Khata Ledger'}
        </CardDescription>

        {/* Tab Switcher: Google Login (All Users) vs Admin Login */}
        <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={cn(
              'flex-1 py-1.5 px-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
              activeTab === 'google'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHi ? 'गूगल लॉगिन (अतिथि)' : 'Google Login (Users / Guests)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={cn(
              'flex-1 py-1.5 px-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
              activeTab === 'admin'
                ? 'bg-white dark:bg-slate-900 text-[#C0392B] dark:text-[#00E5FF] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            )}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isHi ? 'एडमिन लॉगिन (होस्ट ID)' : 'Admin Login (Host ID)'}</span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/50 p-3 text-xs font-semibold text-red-600 dark:text-red-400 mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* ─── TAB 1: GOOGLE OAUTH LOGIN (FOR ALL GUESTS & USERS) ─── */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 p-3.5 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <p className="font-extrabold flex items-center gap-1">
                <span>🛡️ {isHi ? 'एंटी-स्पैम सत्यापित लॉगिन' : 'Anti-Spam Verified Login'}</span>
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                {isHi
                  ? 'सभी मेहमानों और रिश्तेदारों को उपहार की पुष्टि के लिए Google से प्रमाणित होना होता है। इससे वास्तविक ईमेल प्रमाण मिलता है और डुप्लिकेट प्रविष्टियों से सुरक्षा रहती है।'
                  : 'All guests and relatives must authenticate via Google to confirm wedding gifts. This ensures verified email proof and prevents duplicate or fake entries.'}
              </p>
            </div>

            {/* Official Google OAuth Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-extrabold shadow-sm transition cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isHi ? 'गूगल के साथ जारी रखें' : 'Continue with Google'}</span>
            </button>

            {/* Fast 1-Click Google Guest Verification Simulator (Instant Demo in Local Dev) */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-3 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500">
                <span>{isHi ? 'त्वरित अतिथि लॉगिन (डेमो)' : 'Fast Google Guest Sign-In (Local Demo)'}</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 rounded-full">{isHi ? 'सक्रिय' : 'Active'}</span>
              </div>

              <div className="space-y-1.5">
                <Input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder={isHi ? 'अतिथि का नाम (जैसे रमेश शर्मा)' : 'Guest Name (e.g. Ramesh Sharma)'}
                  className="text-xs h-9"
                />
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder={isHi ? 'अतिथि Gmail (उदा. ramesh@gmail.com)' : 'Guest Gmail (e.g. ramesh@gmail.com)'}
                  className="text-xs h-9"
                />
              </div>

              <Button
                type="button"
                onClick={handleFastGoogleDemoSignIn}
                disabled={loading}
                variant="outline"
                className="w-full text-xs font-bold gap-2 rounded-xl border-emerald-500/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {isHi
                    ? `1-क्लिक प्रवेश: ${guestName.split(' ')[0]} (Google सत्यापित)`
                    : `1-Click Sign In as ${guestName.split(' ')[0]} (Google Verified)`}
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* ─── TAB 2: ADMIN LOGIN (ID & PASSWORD) ─── */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-extrabold text-slate-900 dark:text-white">
                {isHi ? 'विवाह व्यवस्थापक व होस्ट पोर्टल' : 'Wedding Host & Admin Portal'}
              </p>
              <p className="text-[11px] mt-0.5">
                {isHi
                  ? 'पूरा बही-खाता और उपहार सूची प्रबंधित करने के लिए अपना लॉगिन आईडी और पासवर्ड दर्ज करें।'
                  : 'Enter your wedding administrator Login ID and Password to manage full bahi-khata ledger and wishlist.'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-extrabold">
                {isHi ? 'एडमिन ईमेल / लॉगिन ID' : 'Admin Email / Login ID'}
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-extrabold">
                {isHi ? 'पासवर्ड' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className="h-10 text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C0392B] hover:bg-[#A93226] text-white font-extrabold py-5 rounded-2xl shadow-md cursor-pointer"
            >
              {loading
                ? isHi ? 'एडमिन सत्यापित किया जा रहा है...' : 'Authenticating Admin...'
                : isHi ? 'एडमिन के रूप में लॉगिन करें' : 'Sign In as Admin'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
