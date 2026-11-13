'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { ServiceWorkerRegister } from '@/components/offline/ServiceWorkerRegister';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ServiceWorkerRegister />
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
