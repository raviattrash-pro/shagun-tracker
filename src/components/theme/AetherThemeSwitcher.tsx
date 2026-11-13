'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, AETHER_THEME_DOTS, AppTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/utils/cn';
import { Palette, Check, Sparkles } from 'lucide-react';

interface AetherThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function AetherThemeSwitcher({ className, size = 'md' }: AetherThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the currently active theme dot (default to first if not matched)
  const activeDot = AETHER_THEME_DOTS.find((d) => d.id === theme) || AETHER_THEME_DOTS[0];

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectTheme = (themeId: AppTheme) => {
    setTheme(themeId);
    setIsOpen(false); // Collapses back to the single picked dot!
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block flex-shrink-0', className)}>
      {/* 
        TRIGGER BUTTON:
        Displays the ONE picked dot color (or icon) representing the selected theme.
        Ultra-compact to prevent collision with logo / text.
      */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Current theme: ${activeDot.label}. Click to choose theme.`}
        title={`Theme: ${activeDot.label} (Click to change)`}
        className={cn(
          'group flex items-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer focus:outline-hidden',
          'bg-black/6 dark:bg-black/35 hover:bg-black/10 dark:hover:bg-black/50 backdrop-blur-md',
          'border border-white/70 dark:border-white/10',
          'shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),inset_0_-1px_1.5px_rgba(255,255,255,0.7),0_2px_5px_rgba(0,0,0,0.08)]',
          'dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.5),inset_0_-1px_1px_rgba(255,255,255,0.08)]',
          size === 'sm' ? 'p-1' : 'p-1 sm:px-2 sm:py-1',
          isOpen && 'ring-2 ring-primary/50 scale-105'
        )}
      >
        {/* The ONE picked 3D Gemstone Dot */}
        <div
          className={cn(
            'relative rounded-full transition-transform duration-200 group-hover:scale-110 flex-shrink-0',
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 sm:w-4.5 sm:h-4.5'
          )}
        >
          <span
            className="absolute inset-0 rounded-full block shadow-[0_1px_3px_rgba(0,0,0,0.3)] ring-1.5 ring-white/95 dark:ring-white/40"
            style={{
              background: activeDot.gradient,
              boxShadow: `0 0 10px ${activeDot.glowColor}`,
            }}
          >
            {/* Specular curved gloss reflection */}
            <span
              className="absolute inset-0 rounded-full pointer-events-none opacity-90"
              style={{
                background:
                  'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 35%, transparent 65%)',
              }}
            />
          </span>
        </div>

        {/* Companion Palette Icon for clear affordance on tablet/desktop */}
        <Palette className="w-3 h-3 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors hidden sm:inline-block" />
      </button>

      {/* 
        EXPANDED PALETTE POPOVER:
        Shows the 8-dot Aether palette + friendly labels.
        Once clicked, it updates the theme and collapses immediately back to 1 dot.
      */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Theme Selector"
          className={cn(
            'absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl p-3.5',
            'bg-white/95 dark:bg-[#0E1B2E]/95 backdrop-blur-2xl',
            'border border-white/80 dark:border-white/15',
            'shadow-[0_20px_50px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.1)]',
            'animate-in fade-in zoom-in-95 duration-150 origin-top-right font-sans'
          )}
        >
          {/* Header row */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Theme Palette (रंग थीम)</span>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/10"
              style={{ background: `${activeDot.glowColor}25` }}
            >
              {activeDot.label.split('(')[0].trim()}
            </span>
          </div>

          {/* The authentic 8-dot capsule bar */}
          <div
            role="radiogroup"
            aria-label="Aether Theme Color Palette"
            className="flex items-center justify-between gap-1.5 p-2 rounded-full bg-black/6 dark:bg-black/40 backdrop-blur-md border border-white/70 dark:border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] mb-3"
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
                  onClick={() => handleSelectTheme(dot.id)}
                  className={cn(
                    'group relative rounded-full transition-all duration-200 cursor-pointer focus:outline-hidden flex-shrink-0',
                    'w-5 h-5 sm:w-6 sm:h-6',
                    isSelected ? 'scale-120 z-10' : 'hover:scale-115 opacity-85 hover:opacity-100'
                  )}
                >
                  <span
                    className={cn(
                      'absolute inset-0 rounded-full block transition-all duration-200',
                      isSelected
                        ? 'ring-2 ring-white dark:ring-[#00E5FF] shadow-[0_0_10px_rgba(255,255,255,0.95),0_2px_5px_rgba(0,0,0,0.35)]'
                        : 'shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7),inset_0_-1.5px_2px_rgba(0,0,0,0.25),0_1.5px_3px_rgba(0,0,0,0.15)]'
                    )}
                    style={{
                      background: dot.gradient,
                      boxShadow: isSelected ? `0 0 12px ${dot.glowColor}` : undefined,
                    }}
                  >
                    {/* Curved specular highlight */}
                    <span
                      className="absolute inset-0 rounded-full pointer-events-none opacity-90"
                      style={{
                        background:
                          'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 35%, transparent 65%)',
                      }}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick List / Grid of theme names */}
          <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
            {AETHER_THEME_DOTS.map((dot) => {
              const isSelected = theme === dot.id;

              return (
                <button
                  key={dot.id}
                  type="button"
                  onClick={() => handleSelectTheme(dot.id)}
                  className={cn(
                    'flex items-center gap-2 p-1.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer',
                    isSelected
                      ? 'bg-primary/10 dark:bg-white/15 text-primary dark:text-[#00E5FF] shadow-xs'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                  )}
                >
                  {/* Dot preview */}
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-xs ring-1 ring-white/60"
                    style={{ background: dot.gradient }}
                  />
                  <span className="truncate text-[11px] font-medium flex-1">
                    {dot.label.split('(')[0].trim()}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-primary dark:text-[#00E5FF] flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AetherThemeSwitcher;
