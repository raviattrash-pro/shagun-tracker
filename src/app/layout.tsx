import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/providers';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import { JsonLd } from '@/components/seo/JsonLd';
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

const siteUrl = process.env.NEXTAUTH_URL || 'https://shagun-tracker.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Shagun Tracker — #1 Digital Wedding Gift Registry & Cash Bahi-Khata (विवाह बही-खाता)',
    template: '%s | Shagun Tracker',
  },
  description:
    'The #1 Indian Wedding Gift Registry & Cash Shagun Bahi-Khata ledger. Curate your wedding wishlist to prevent duplicate gifts, record cash shagun with +₹1 auspicious coin rules, manage guest lifafas, and organize sticky notes.',
  applicationName: 'Shagun Tracker',
  authors: [{ name: 'Shagun Tracker Team', url: siteUrl }],
  generator: 'Next.js',
  keywords: [
    'wedding gift registry',
    'shagun tracker',
    'digital bahi khata',
    'indian wedding registry',
    'vivah bahi khata',
    'शादी उपहार सूची',
    'विवाह बही खाता',
    'शगुन हिसाब',
    'wedding gift wishlist',
    'shagun lifafa tracker',
    'cash shagun ledger',
    '+1 coin rule wedding',
    'reciprocity ledger india',
    'prevent duplicate wedding gifts',
    'online shagun register',
    'wedding guest management india',
    'digital shagun diary',
    'wedding gift organizer',
  ],
  creator: 'Shagun Tracker',
  publisher: 'Shagun Tracker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'hi-IN': '/?lang=hi',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['hi_IN'],
    url: siteUrl,
    siteName: 'Shagun Tracker (विवाह बही-खाता)',
    title: 'Shagun Tracker — #1 Digital Wedding Gift Registry & Cash Bahi-Khata',
    description:
      'Curate your wedding gift wishlist, eliminate duplicate gifts with real-time guest booking, record sacred cash shagun with +₹1 rules, and manage lifafas with ease.',
    images: [
      {
        url: '/assets/currency/inr-500.png',
        width: 1200,
        height: 630,
        alt: 'Shagun Tracker — Digital Wedding Gift Registry & Bahi-Khata Ledger',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shagun Tracker — #1 Digital Wedding Gift Registry & Cash Bahi-Khata',
    description:
      'Curate wedding gift wishlists to prevent duplicates, track cash shagun with +₹1 rules, and manage guests with a traditional digital bahi-khata.',
    images: ['/assets/currency/inr-500.png'],
    creator: '@shaguntracker',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google00f9059f5265dae5',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-512.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#8B1D2C',
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
    <html lang="en" className="theme-traditional" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col transition-colors duration-300`}
      >
        <Providers>
          {/* Top Sticky Header Navigation */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 pb-20 md:pb-8 w-full">
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
