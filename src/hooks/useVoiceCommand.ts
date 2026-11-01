'use client';

/**
 * useVoiceCommand — Custom hook wrapping the Web Speech API
 *
 * Supports hi-IN and en-IN languages, continuous recognition,
 * auto-stop on 10s silence, and interim transcript.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type VoiceLanguage = 'hi-IN' | 'en-IN';

export interface UseVoiceCommandOptions {
  language?: VoiceLanguage;
  onResult?: (finalText: string) => void;
}

export interface UseVoiceCommandReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  language: VoiceLanguage;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  setLanguage: (lang: VoiceLanguage) => void;
  resetTranscript: () => void;
}

const SILENCE_TIMEOUT_MS = 10_000;

export function useVoiceCommand(
  config?: UseVoiceCommandOptions | VoiceLanguage
): UseVoiceCommandReturn {
  const options: UseVoiceCommandOptions =
    typeof config === 'string'
      ? { language: config }
      : config || {};

  const initialLanguage = options.language || 'hi-IN';
  const onResultCallback = options.onResult;

  const SpeechRecognitionCtor = getSpeechRecognition();
  const isSupported = SpeechRecognitionCtor !== null;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguageState] = useState<VoiceLanguage>(initialLanguage);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResultRef = useRef(onResultCallback);
  onResultRef.current = onResultCallback;

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      recognitionRef.current?.stop();
    }, SILENCE_TIMEOUT_MS);
  }, [clearSilenceTimer]);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimTranscript('');
  }, [clearSilenceTimer]);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionCtor) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    setError(null);

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      resetSilenceTimer();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      resetSilenceTimer();

      let finalText = '';
      let interimText = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript.trim();
        if (result.isFinal) {
          finalText += (finalText ? ' ' : '') + text;
        } else {
          interimText += text;
        }
      }

      // Deduplicate consecutive repeated phrases (prevents "He gave 5000. He gave 5000.")
      const cleanFinal = finalText
        .split(/(?<=[.!?])\s+/)
        .filter(Boolean)
        .filter((sentence, idx, arr) => arr.indexOf(sentence) === idx)
        .join(' ');

      if (cleanFinal) {
        setTranscript(cleanFinal.trim());
        onResultRef.current?.(cleanFinal.trim());
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      setError(
        event.error === 'not-allowed'
          ? 'Microphone permission was denied. Please enable it in browser settings.'
          : `Speech recognition error: ${event.error}`
      );
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      clearSilenceTimer();
    };

    try {
      recognition.start();
    } catch (e: any) {
      setError(e.message || 'Failed to start microphone');
    }
  }, [SpeechRecognitionCtor, language, resetSilenceTimer, clearSilenceTimer]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const setLanguage = useCallback((lang: VoiceLanguage) => {
    setLanguageState(lang);
    if (recognitionRef.current && isListening) {
      recognitionRef.current.lang = lang;
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [clearSilenceTimer]);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    language,
    startListening,
    stopListening,
    toggleListening,
    setLanguage,
    resetTranscript,
  };
}
