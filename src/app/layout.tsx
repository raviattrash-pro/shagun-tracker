import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/providers';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Shagun Tracker',
    template: '%s | Shagun Tracker',
  },
  description:
    'Digital Wedding Gift & Cash Registry — Track shagun, manage guests, and never forget to reciprocate.',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/currency/inr-500.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#C41E3A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-[#0B0F19] text-white flex flex-col`}
      >
        <Providers>
          {/* Top Sticky Header Navigation */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 pb-20 md:pb-8 w-full bg-[#0B0F19]">
            {children}
          </main>

          {/* Bottom Mobile Tab Navigation */}
          <MobileNav />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
