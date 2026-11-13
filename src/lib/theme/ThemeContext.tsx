'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppTheme =
  | 'traditional' // 1. Warm Peach (Aether Amber)
  | 'clay'        // 2. Cyan Sky (Aether Sky)
  | 'sage'        // 3. Lime / Sage (Aether Botanical)
  | 'dark'        // 4. Midnight Navy (Aether Midnight)
  | 'royal'       // 5. Lavender / Violet (Aether Velvet)
  | 'rose'        // 6. Blush Rose / Pink (Aether Bloom)
  | 'mint'        // 7. Aqua Teal (Aether Ocean)
  | 'cream'       // 8. Sand / Warm Gold (Aether Ivory)
  | 'light';      // Clean Slate alias

export interface ThemeDotConfig {
  id: AppTheme;
  gradient: string;
  glowColor: string;
  label: string;
}

export const AETHER_THEME_DOTS: ThemeDotConfig[] = [
  {
    id: 'traditional',
    gradient: 'linear-gradient(135deg, #FFAE70 0%, #F59E0B 100%)',
    glowColor: 'rgba(255, 174, 112, 0.8)',
    label: 'Warm Peach (Aether Gold)',
  },
  {
    id: 'clay',
    gradient: 'linear-gradient(135deg, #4DD0E1 0%, #00ACC1 100%)',
    glowColor: 'rgba(77, 208, 225, 0.8)',
    label: 'Cyan Sky (Aether Cyan)',
  },
  {
    id: 'sage',
    gradient: 'linear-gradient(135deg, #86EFAC 0%, #22C55E 100%)',
    glowColor: 'rgba(134, 239, 172, 0.8)',
    label: 'Lime Sage (Aether Garden)',
  },
  {
    id: 'dark',
    gradient: 'linear-gradient(135deg, #243B61 0%, #0E1B2E 100%)',
    glowColor: 'rgba(0, 229, 255, 0.8)',
    label: 'Midnight Navy (Aether Dark)',
  },
  {
    id: 'royal',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #6366F1 100%)',
    glowColor: 'rgba(167, 139, 250, 0.8)',
    label: 'Royal Lavender (Aether Violet)',
  },
  {
    id: 'rose',
    gradient: 'linear-gradient(135deg, #F472B6 0%, #FB7185 100%)',
    glowColor: 'rgba(244, 114, 182, 0.8)',
    label: 'Blush Rose (Aether Pink)',
  },
  {
    id: 'mint',
    gradient: 'linear-gradient(135deg, #2DD4BF 0%, #0D9488 100%)',
    glowColor: 'rgba(45, 212, 191, 0.8)',
    label: 'Aqua Mint (Aether Teal)',
  },
  {
    id: 'cream',
    gradient: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
    glowColor: 'rgba(253, 230, 138, 0.8)',
    label: 'Warm Ivory (Aether Cream)',
  },
];

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

const ALL_THEME_CLASSES = [
  'dark',
  'light',
  'theme-traditional',
  'theme-clay',
  'theme-sage',
  'theme-royal',
  'theme-rose',
  'theme-mint',
  'theme-cream',
  'theme-neomorphic',
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>('traditional');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('shagun_theme') as AppTheme | null;
    const validThemes: AppTheme[] = ['traditional', 'clay', 'sage', 'dark', 'royal', 'rose', 'mint', 'cream'];
    if (saved && validThemes.includes(saved)) {
      setThemeState(saved);
      applyTheme(saved);
    } else {
      setThemeState('traditional');
      applyTheme('traditional');
    }
  }, []);

  const applyTheme = (t: AppTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove(...ALL_THEME_CLASSES);

    switch (t) {
      case 'traditional':
        root.classList.add('light', 'theme-traditional');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#F4CCA4';
        break;
      case 'clay':
        root.classList.add('light', 'theme-clay');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#8FE5F5';
        break;
      case 'sage':
        root.classList.add('light', 'theme-sage');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#C7E8CA';
        break;
      case 'dark':
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
        root.style.backgroundColor = '#0E1B2E';
        break;
      case 'royal':
        root.classList.add('light', 'theme-royal');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#DDD6FE';
        break;
      case 'rose':
        root.classList.add('light', 'theme-rose');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#FECDD3';
        break;
      case 'mint':
        root.classList.add('light', 'theme-mint');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#99F6E4';
        break;
      case 'cream':
        root.classList.add('light', 'theme-cream');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#FDE68A';
        break;
      case 'light':
        root.classList.add('light', 'theme-neomorphic');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#E8EEF5';
        break;
      default:
        root.classList.add('light', 'theme-traditional');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#F4CCA4';
    }
  };

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem('shagun_theme', t);
    applyTheme(t);
  };

  const toggleTheme = () => {
    const sequence: AppTheme[] = ['traditional', 'clay', 'sage', 'dark', 'royal', 'rose', 'mint', 'cream'];
    const currentIndex = sequence.indexOf(theme);
    const nextTheme = sequence[(currentIndex + 1) % sequence.length];
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
