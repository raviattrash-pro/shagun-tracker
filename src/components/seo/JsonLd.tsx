import React from 'react';

export function JsonLd() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://shagun-tracker.vercel.app';

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Shagun Tracker (डिजिटल विवाह बही-खाता)',
    alternateName: ['Shagun Tracker', 'Digital Bahi Khata', 'Wedding Gift Registry India', 'Vivah Bahi Khata'],
    url: baseUrl,
    applicationCategory: 'FinanceApplication, LifestyleApplication, EventManagement',
    operatingSystem: 'All, Web, PWA, Android, iOS, Windows, macOS',
    description:
      'Digital wedding gift registry, cash shagun bahi-khata ledger, +₹1 auspicious coin calculator, anti-spam verified gifter tracking, and offline PWA notebook for Indian weddings.',
    inLanguage: ['en-IN', 'hi-IN'],
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    featureList: [
      'Live Wedding Gift Wishlist with duplicate gift prevention',
      'Anti-Spam Verified Gifter identity tracking with Google OAuth',
      'Real-time Cash Shagun Bahi-Khata ledger with denomination breakdown',
      'Automatic +₹1 auspicious coin rule calculator (₹501, ₹1101, ₹2101, ₹5101)',
      'Reciprocity tracker for timely return gifts to relatives',
      'Offline PWA mode with instant local caching',
      '3D Glassmorphic Sticky Notes & checklists (GlassyBoard Pro)',
      'Bilingual interface in Hindi and English',
      'One-click WhatsApp sharing for guest invitations and lists',
    ],
    author: {
      '@type': 'Organization',
      name: 'Shagun Tracker',
      url: baseUrl,
      logo: `${baseUrl}/assets/currency/inr-500.png`,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Shagun Tracker (डिजिटल विवाह बही-खाता)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Shagun Tracker is an all-in-one digital Indian wedding platform combining a traditional red diary bahi-khata cash ledger with a live interactive wedding gift registry, +₹1 coin reciprocity tracker, and 3D glassy notes to organize shagun gifts without duplicate items.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the digital wedding gift registry prevent duplicate gifts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The couple creates a curated wedding wishlist. Relatives and friends access the live public URL without needing an account, select the item they want to gift, and mark it as claimed. The item instantly updates to Reserved across all devices with real-time sync, so multiple guests never bring duplicate mixer-grinders, air fryers, or dinner sets.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the +₹1 auspicious coin rule in Indian weddings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In Indian wedding tradition, shagun is never given in round figures ending in zero. An auspicious ₹1 coin is added (e.g. ₹501, ₹1,101, ₹2,101, ₹5,101) representing endless prosperity, growth, and indissoluble relationship bonds. Shagun Tracker automatically calculates and tracks this traditional +₹1 rule.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Shagun Tracker work offline without internet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Shagun Tracker is built as a progressive web app (PWA) with offline capabilities. If wedding halls or banquet venues have poor cellular connectivity, all notes, registries, and entries remain accessible and sync once reconnected.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does anti-spam protection work for claimed gifts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To prevent fake bookings or spam claims, Shagun Tracker provides 1-click Google OAuth verification and captures verified claimant details (name, email, and WhatsApp contact). The wedding host can view the gifter proof details or release claims anytime from their dashboard.',
        },
      },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Shagun Tracker',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/registry?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

export default JsonLd;
