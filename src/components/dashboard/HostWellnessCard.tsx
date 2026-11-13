'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';

const MOODS = [
  { emoji: '😌', labelEn: 'Calm', labelHi: 'शांत' },
  { emoji: '😊', labelEn: 'Happy', labelHi: 'प्रसन्न' },
  { emoji: '🥳', labelEn: 'Party', labelHi: 'उत्साहित' },
  { emoji: '🥰', labelEn: 'Joyful', labelHi: 'आनंदित' },
  { emoji: '🙏', labelEn: 'Blessed', labelHi: 'कृतज्ञ' },
];

export const HostWellnessCard: React.FC = () => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [glasses, setGlasses] = useState(6);
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(3); // Joyful 🥰

  // Load from localStorage
  useEffect(() => {
    try {
      const savedGlasses = localStorage.getItem('shagun_host_hydration');
      if (savedGlasses !== null) setGlasses(Number(savedGlasses));

      const savedMood = localStorage.getItem('shagun_host_mood');
      if (savedMood !== null) setSelectedMoodIndex(Number(savedMood));
    } catch (e) {}
  }, []);

  const handleSetGlasses = (count: number) => {
    setGlasses(count);
    try {
      localStorage.setItem('shagun_host_hydration', String(count));
    } catch (e) {}
  };

  const handleSelectMood = (idx: number) => {
    setSelectedMoodIndex(idx);
    try {
      localStorage.setItem('shagun_host_mood', String(idx));
    } catch (e) {}
  };

  const currentMood = MOODS[selectedMoodIndex] || MOODS[3];

  return (
    <div className="aether-card p-4 sm:p-5 select-none transition-all">
      {/* Top Header Pill matching uploaded screenshot */}
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 shadow-xs">
          <span className="text-xs">❤️</span>
          <span className="text-xs font-black tracking-wider text-rose-600 dark:text-rose-400 uppercase">
            {isHi ? 'मेजबान स्वास्थ्य' : 'HOST WELLNESS'}
          </span>
        </div>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {isHi ? currentMood.labelHi : currentMood.labelEn}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        {/* Hydration Section */}
        <div className="space-y-2 sm:pr-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <span>💧</span>
              <span>{isHi ? 'जलपान (Hydration)' : 'Hydration'}</span>
            </span>
            <span className="text-slate-500 font-semibold">{glasses} / 8 glasses</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from({ length: 8 }).map((_, i) => {
              const isFilled = i < glasses;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSetGlasses(i + 1 === glasses ? i : i + 1)}
                  className="p-1 text-base hover:scale-125 transition-transform cursor-pointer"
                  title={`${i + 1} glass`}
                >
                  {isFilled ? '💧' : '🤍'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mood Section */}
        <div className="space-y-2 pt-3 sm:pt-0 sm:pl-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <span>✨</span>
              <span>{isHi ? 'मनोदशा (Mood)' : 'Mood'}</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {isHi ? currentMood.labelHi : currentMood.labelEn}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {MOODS.map((m, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectMood(idx)}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-lg transition-transform cursor-pointer',
                  selectedMoodIndex === idx
                    ? 'scale-125 bg-amber-100 dark:bg-amber-900/50 shadow-sm ring-2 ring-amber-400'
                    : 'opacity-70 hover:opacity-100 hover:scale-110'
                )}
                title={isHi ? m.labelHi : m.labelEn}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
