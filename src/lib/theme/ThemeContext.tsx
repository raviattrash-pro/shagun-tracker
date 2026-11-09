'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppTheme = 'traditional' | 'clay' | 'dark' | 'light';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'traditional',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>('traditional');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('shagun_theme') as AppTheme | null;
    if (saved === 'traditional' || saved === 'clay' || saved === 'light' || saved === 'dark') {
      setThemeState(saved);
      applyTheme(saved);
    } else {
      // Default to Traditional Bahi-Khata (offline notebook look)
      setThemeState('traditional');
      applyTheme('traditional');
    }
  }, []);

  const applyTheme = (t: AppTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'theme-neomorphic', 'theme-clay', 'theme-traditional');

    if (t === 'traditional') {
      root.classList.add('light', 'theme-traditional');
      root.style.colorScheme = 'light';
      root.style.backgroundColor = '#FDFCF7';
    } else if (t === 'clay') {
      root.classList.add('light', 'theme-clay');
      root.style.colorScheme = 'light';
      root.style.backgroundColor = '#FBF0EE';
    } else if (t === 'light') {
      root.classList.add('light', 'theme-neomorphic');
      root.style.colorScheme = 'light';
      root.style.backgroundColor = '#E8EEF5';
    } else {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      root.style.backgroundColor = '#0B0F19';
    }
  };

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem('shagun_theme', t);
    applyTheme(t);
  };

  const toggleTheme = () => {
    const next: AppTheme = theme === 'traditional' ? 'dark' : theme === 'dark' ? 'clay' : 'traditional';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
