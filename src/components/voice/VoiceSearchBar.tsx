'use client';

import React, { useState } from 'react';
import { Search, Mic, MicOff, X, Sparkles, Volume2, Globe } from 'lucide-react';
import { useVoiceCommand, VoiceLanguage } from '@/hooks/useVoiceCommand';
import { cn } from '@/utils/cn';

interface VoiceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  resultCount?: number;
  resultLabel?: string;
}

/**
 * Clean up common conversational filler prefixes/suffixes in Hindi & English
 * e.g., "search for Ramesh" -> "Ramesh", "मामाजी को ढूँढो" -> "मामाजी"
 */
function cleanVoiceQuery(raw: string): string {
  let cleaned = raw.trim();

  // Remove English filler prefixes
  cleaned = cleaned.replace(/^(search for|find|look for|show me|search relative|search|where is|filter by|filter)\s+/i, '');

  // Remove Hindi filler phrases
  cleaned = cleaned.replace(/^(रिश्तेदार|खोजो|ढूँढो|दिखाओ|कहाँ है)\s+/i, '');
  cleaned = cleaned.replace(/\s+(को ढूँढो|को खोजो|दिखाओ|ढूँढिए|कहाँ है)$/i, '');

  // Strip trailing punctuation
  cleaned = cleaned.replace(/[?.!,।]+$/, '').trim();

  return cleaned || raw.trim();
}

export const VoiceSearchBar: React.FC<VoiceSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search relative (बोलकर ढूँढें या टाइप करें)...',
  className,
  resultCount,
  resultLabel = 'envelopes',
}) => {
  const [selectedLang, setSelectedLang] = useState<VoiceLanguage>('hi-IN');
  const [lastHeard, setLastHeard] = useState<string | null>(null);

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    setLanguage,
  } = useVoiceCommand({
    language: selectedLang,
    onResult: (spokenText) => {
      const cleaned = cleanVoiceQuery(spokenText);
      setLastHeard(spokenText);
      onChange(cleaned);
    },
  });

  const handleLanguageChange = (lang: VoiceLanguage) => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const handleClear = () => {
    onChange('');
    setLastHeard(null);
  };

  const quickFilterPresets = [
    { label: 'चाचाजी', value: 'चाचा' },
    { label: 'मामाजी', value: 'मामा' },
    { label: 'बुआजी', value: 'बुआ' },
    { label: 'मौसी', value: 'मौसी' },
    { label: 'Family Friends', value: 'friend' },
  ];

  return (
    <div className={cn('w-full space-y-2.5', className)}>
      {/* Main Search Bar Container */}
      <div
        className={cn(
          'relative flex items-center gap-2 rounded-2xl border bg-card p-1.5 shadow-sm transition-all duration-300',
          isListening
            ? 'border-red-500 ring-4 ring-red-500/20 shadow-red-500/10'
            : 'border-amber-300/60 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/30'
        )}
      >
        {/* Left Search Icon */}
        <div className="pl-3 text-amber-600">
          <Search className="h-5 w-5" />
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isListening ? 'बोलिए... Listening for relative name...' : placeholder}
          className="flex-1 bg-transparent px-2 py-2 text-sm md:text-base outline-none placeholder:text-muted-foreground font-medium"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Language Switcher Pill (Hindi first, then English) */}
        <div className="hidden sm:flex items-center gap-1 rounded-full bg-muted/60 p-0.5 border text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => handleLanguageChange('hi-IN')}
            className={cn(
              'rounded-full px-2 py-0.5 transition-all',
              selectedLang === 'hi-IN'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="Search in Hindi (हिंदी)"
          >
            🇮🇳 हिंदी
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en-IN')}
            className={cn(
              'rounded-full px-2 py-0.5 transition-all',
              selectedLang === 'en-IN'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="Search in English"
          >
            🇬🇧 Eng
          </button>
        </div>

        {/* Audio Mic Button */}
        <div className="relative">
          {isListening && (
            <>
              <span className="absolute -inset-1 animate-ping rounded-full bg-red-400 opacity-60 pointer-events-none" />
              <span className="absolute -inset-2 animate-pulse rounded-full bg-red-500/20 pointer-events-none" />
            </>
          )}

          <button
            type="button"
            onClick={toggleListening}
            className={cn(
              'relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl font-bold shadow-sm transition-all duration-300 active:scale-95',
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700 animate-bounce'
                : 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600 hover:scale-105'
            )}
            title={
              !isSupported
                ? 'Voice search not supported in this browser'
                : isListening
                ? 'Stop listening'
                : 'Tap to speak relative name (बोलकर ढूँढें)'
            }
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Listening State Banner / Feedback */}
      {isListening && (
        <div className="flex items-center justify-between rounded-xl bg-red-500/10 border border-red-300 dark:border-red-800 px-3.5 py-2 text-xs animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span>
              {selectedLang === 'hi-IN'
                ? 'सुन रहे हैं... रिश्तेदार का नाम बोलिए (जैसे "रमेश चाचा", "सुनीता बुआ")'
                : 'Listening... Speak relative name (e.g. "Uncle Ramesh", "Sunita")'}
            </span>
          </div>

          <button
            type="button"
            onClick={stopListening}
            className="text-[11px] font-bold text-red-600 hover:underline"
          >
            Done (रुकें)
          </button>
        </div>
      )}

      {/* Interim / Real-time speech display */}
      {isListening && interimTranscript && (
        <div className="text-xs text-muted-foreground italic px-2">
          Hearing: &ldquo;{interimTranscript}&rdquo;...
        </div>
      )}

      {/* Status Bar: Last Heard badge + Result count + Quick filter presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        {/* Left: Quick relation tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Quick:
          </span>
          {quickFilterPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              className={cn(
                'rounded-lg px-2 py-0.5 text-[11px] font-medium transition-colors border',
                value.toLowerCase().includes(preset.value.toLowerCase())
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-muted/40 hover:bg-accent text-foreground border-border/60'
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Right: Matches found */}
        {value && typeof resultCount === 'number' && (
          <div className="text-muted-foreground font-medium">
            Found <strong>{resultCount}</strong> {resultCount === 1 ? resultLabel.replace(/s$/, '') : resultLabel} for &ldquo;<strong>{value}</strong>&rdquo;
          </div>
        )}
      </div>
    </div>
  );
};
