'use client';

import React from 'react';
import { useTheme, AETHER_THEME_DOTS, AppTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';

interface AetherThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function AetherThemeSwitcher({ className, size = 'md' }: AetherThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Aether Theme Color Palette"
      className={cn(
        'inline-flex items-center gap-1 sm:gap-1.5 rounded-full transition-all duration-300',
        'bg-black/6 dark:bg-black/35 backdrop-blur-md flex-shrink-0',
        'border border-white/70 dark:border-white/10',
        'shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),inset_0_-1px_1.5px_rgba(255,255,255,0.7),0_1px_2px_rgba(255,255,255,0.3)]',
        'dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.5),inset_0_-1px_1px_rgba(255,255,255,0.08)]',
        size === 'sm' ? 'px-1.5 py-0.5' : 'px-1.5 sm:px-2.5 py-0.5 sm:py-1',
        className
      )}
    >
      {AETHER_THEME_DOTS.map((dot) => {
        const isSelected = theme === dot.id;

        return (
          <button
            key={dot.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={dot.label}
            title={dot.label}
            onClick={() => setTheme(dot.id)}
            className={cn(
              'group relative rounded-full transition-all duration-200 ease-out cursor-pointer focus:outline-hidden flex-shrink-0',
              size === 'sm'
                ? 'w-2.5 h-2.5 sm:w-3 sm:h-3'
                : 'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4',
              isSelected
                ? 'scale-120 z-10'
                : 'hover:scale-110 opacity-90 hover:opacity-100'
            )}
          >
            {/* 3D Glossy Gemstone Orb */}
            <span
              className={cn(
                'absolute inset-0 rounded-full block transition-all duration-200',
                isSelected
                  ? 'ring-2 ring-white dark:ring-[#00E5FF] shadow-[0_0_8px_rgba(255,255,255,0.95),0_2px_4px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(0,229,255,0.8)]'
                  : 'shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7),inset_0_-1.5px_2px_rgba(0,0,0,0.25),0_1.5px_3px_rgba(0,0,0,0.15)]'
              )}
              style={{
                background: dot.gradient,
              }}
            >
              {/* Specular curved gloss reflection */}
              <span
                className="absolute inset-0 rounded-full pointer-events-none opacity-80"
                style={{
                  background:
                    'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 35%, transparent 65%)',
                }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default AetherThemeSwitcher;
