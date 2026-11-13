'use client';

import { useState, useEffect } from 'react';

// Key prefixes for localStorage offline cache
const CACHE_KEYS = {
  GIFTS: 'shagun_offline_gifts',
  REGISTRY: 'shagun_offline_registry',
  GUESTS: 'shagun_offline_guests',
  EVENTS: 'shagun_offline_events',
  QUEUE: 'shagun_offline_mutation_queue',
};

/**
 * Save data to offline cache
 */
export function saveOfflineCache<T>(key: keyof typeof CACHE_KEYS, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEYS[key], JSON.stringify({
      timestamp: Date.now(),
      data,
    }));
  } catch (err) {
    console.warn('[OfflineStorage] Failed to save cache:', err);
  }
}

/**
 * Retrieve data from offline cache
 */
export function getOfflineCache<T>(key: keyof typeof CACHE_KEYS): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEYS[key]);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data as T;
  } catch (err) {
    console.warn('[OfflineStorage] Failed to read cache:', err);
    return null;
  }
}

/**
 * Custom hook to monitor online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Only in browser
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Register Service Worker safely
 */
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SW] Registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('[SW] Registration failed:', err);
        });
    });
  }
}
