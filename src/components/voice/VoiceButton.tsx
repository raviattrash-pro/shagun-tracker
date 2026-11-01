'use client';

import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing?: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isProcessing = false,
  onToggle,
  disabled = false,
  className,
  size = 'lg',
}) => {
  const sizeClasses = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-base',
    lg: 'h-20 w-20 text-lg',
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-10 w-10',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      {/* Animated glowing ripple rings when listening */}
      {isListening && (
        <>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="absolute inline-flex h-[130%] w-[130%] animate-pulse rounded-full bg-red-500/20" />
        </>
      )}

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled || isProcessing}
        aria-label={isListening ? 'Stop recording voice' : 'Start recording voice'}
        className={cn(
          'relative flex items-center justify-center rounded-full shadow-xl transition-all duration-300 focus:outline-none focus:ring-4',
          isListening
            ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 scale-105 shadow-red-500/50'
            : 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600 focus:ring-amber-300 shadow-amber-600/30 hover:scale-105 active:scale-95',
          disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
          sizeClasses[size]
        )}
      >
        {isProcessing ? (
          <Loader2 className={cn('animate-spin', iconSizes[size])} />
        ) : isListening ? (
          <Mic className={cn('animate-bounce', iconSizes[size])} />
        ) : (
          <Mic className={iconSizes[size]} />
        )}
      </button>
    </div>
  );
};
