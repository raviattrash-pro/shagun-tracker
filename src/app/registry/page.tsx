'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ModernWeddingRegistry } from '@/components/dashboard/ModernWeddingRegistry';

function RegistryContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  return <ModernWeddingRegistry forcedUserId={userId} />;
}

export default function PublicRegistryPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 font-sans">
      <Suspense
        fallback={
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#C0392B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">उपहार सूची लोड हो रही है...</p>
          </div>
        }
      >
        <RegistryContent />
      </Suspense>
    </div>
  );
}
