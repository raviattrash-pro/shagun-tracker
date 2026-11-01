'use client';

import React, { useState, useEffect } from 'react';
import { VoiceButton } from './VoiceButton';
import { VoiceTranscript } from './VoiceTranscript';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';
import { parseVoiceInput } from '@/lib/voice-parser';
import { VoiceParseResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Globe, CheckCircle2 } from 'lucide-react';

interface VoiceCommandPanelProps {
  onParsedResult: (result: VoiceParseResult) => void;
  className?: string;
}

export const VoiceCommandPanel: React.FC<VoiceCommandPanelProps> = ({
  onParsedResult,
  className,
}) => {
  const [activeLang, setActiveLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [parsed, setParsed] = useState<VoiceParseResult | null>(null);
  const [autoApplied, setAutoApplied] = useState(false);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useVoiceCommand({
    language: activeLang,
    onResult: (finalText) => {
      if (finalText) {
        const result = parseVoiceInput(finalText, activeLang);
        setParsed(result);
        onParsedResult(result);
        setAutoApplied(true);
      }
    },
  });

  // Also parse whenever transcript changes
  useEffect(() => {
    if (transcript) {
      const result = parseVoiceInput(transcript, activeLang);
      setParsed(result);
      onParsedResult(result);
      setAutoApplied(true);
    }
  }, [transcript, activeLang]);

  const toggleLanguage = () => {
    const nextLang = activeLang === 'hi-IN' ? 'en-IN' : 'hi-IN';
    setActiveLang(nextLang);
    resetTranscript();
    setParsed(null);
    setAutoApplied(false);
  };

  const handleConfirm = () => {
    if (parsed) {
      onParsedResult(parsed);
      setAutoApplied(true);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Language selector toggle */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="rounded-full text-xs gap-1.5 border-amber-300 shadow-sm"
          >
            <Globe className="h-3.5 w-3.5 text-amber-600" />
            <span>
              Language: <strong>{activeLang === 'hi-IN' ? 'हिंदी (Hindi)' : 'English'}</strong>
            </span>
          </Button>
        </div>

        {/* Big voice mic button */}
        <div className="py-2">
          <VoiceButton
            isListening={isListening}
            onToggle={isListening ? stopListening : startListening}
            disabled={!isSupported}
          />
        </div>

        <p className="text-xs text-muted-foreground font-medium">
          {isListening ? (
            <span className="text-red-600 dark:text-red-400 font-semibold animate-pulse">
              Listening... Speak guest name & shagun amount
            </span>
          ) : (
            'Tap microphone to speak (e.g. "Vikram gave 5000" or "उसने 5000 दिए")'
          )}
        </p>

        {autoApplied && parsed?.cashAmount && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Auto-filled ₹{parsed.cashAmount.toLocaleString('en-IN')} into your envelope!</span>
          </div>
        )}

        {/* Live transcript + parsed card */}
        <div className="w-full text-left">
          <VoiceTranscript
            transcript={transcript}
            interimTranscript={interimTranscript}
            parsedResult={parsed}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};
