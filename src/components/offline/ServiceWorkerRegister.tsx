'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/offline/offlineStorage';

export function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
