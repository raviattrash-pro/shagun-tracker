'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { EnvelopeStyleConfig } from '@/types';

interface EnvelopeBodyProps {
  styleConfig: EnvelopeStyleConfig;
  guestName: string;
  relation?: string | null;
  children?: React.ReactNode;
  className?: string;
  isOpen: boolean;
}

export const EnvelopeBody: React.FC<EnvelopeBodyProps> = ({
  styleConfig,
  guestName,
  relation,
  children,
  className,
  isOpen,
}) => {
  return (
    <div
      style={{
        background: isOpen ? undefined : (styleConfig.gradient || styleConfig.bodyColor),
        borderColor: styleConfig.borderColor || '#8B2134',
      }}
      className={cn(
        'relative w-full max-w-[380px] mx-auto rounded-3xl transition-all duration-500',
        isOpen ? 'p-1' : 'min-h-[480px] overflow-hidden border shadow-2xl',
        className
      )}
    >
      {/* Matte Linen Paper Texture Subtle Shimmer (only when sealed) */}
      {!isOpen && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-2 rounded-2xl border border-white/10 pointer-events-none" />
        </>
      )}

      {/* When OPENED: Slide out revealed cash & gift contents with smooth animation */}
      {isOpen ? (
        <div className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-6 duration-500 py-1">
          {children}
        </div>
      ) : (
        /* When SEALED: Front of Envelope matching Pinterest reference */
        <div className="relative z-10 flex min-h-[480px] flex-col items-center justify-end pb-8 px-5 text-center select-none">
          {/* Ornate Gold Lettered Dedication Plaque on Lower Envelope Front */}
          <div
            className="w-full max-w-[300px] rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-md border border-amber-300/40"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 5, 8, 0.85) 0%, rgba(35, 10, 16, 0.95) 100%)',
              color: '#FFF8DC',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="h-px w-6 bg-amber-400/60" />
              <span className="text-[10px] uppercase tracking-widest font-black text-amber-300">
                Shagun With Blessings
              </span>
              <span className="h-px w-6 bg-amber-400/60" />
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-amber-100 truncate">
              {guestName}
            </h3>

            {relation && (
              <p className="text-xs text-amber-200/80 capitalize mt-0.5">
                ({relation.replace('_', ' ')})
              </p>
            )}
          </div>

          <p className="mt-4 text-xs font-semibold text-amber-200/90 tracking-wide flex items-center gap-1.5 animate-pulse">
            <span>✨</span>
            <span>Tap gold wax seal to unseal & reveal</span>
          </p>
        </div>
      )}
    </div>
  );
};
