'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Pin,
  Copy,
  Check,
  Share2,
  Sparkles,
  Palette,
  Search,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/utils/cn';

export type NoteColor = 'yellow' | 'blue' | 'pink' | 'purple' | 'green' | 'orange';

export interface StickyNote {
  id: number;
  title?: string;
  content: string;
  color: NoteColor;
  emoji: string;
  date: string;
  isPinned?: boolean;
}

const COLOR_CONFIGS: Record<NoteColor, { label: string; bgClass: string; borderClass: string; dot: string; glow: string }> = {
  yellow: {
    label: 'Yellow / पीला',
    bgClass: 'from-amber-100/90 via-amber-50/70 to-white/60 dark:from-amber-950/40 dark:via-amber-900/20 dark:to-slate-900/70',
    borderClass: 'border-amber-300/80 dark:border-amber-600/30',
    dot: '#FBBF24',
    glow: 'rgba(251, 191, 36, 0.4)',
  },
  blue: {
    label: 'Blue / नीला',
    bgClass: 'from-sky-100/90 via-sky-50/70 to-white/60 dark:from-sky-950/40 dark:via-sky-900/20 dark:to-slate-900/70',
    borderClass: 'border-sky-300/80 dark:border-sky-600/30',
    dot: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.4)',
  },
  pink: {
    label: 'Pink / गुलाबी',
    bgClass: 'from-pink-100/90 via-pink-50/70 to-white/60 dark:from-pink-950/40 dark:via-pink-900/20 dark:to-slate-900/70',
    borderClass: 'border-pink-300/80 dark:border-pink-600/30',
    dot: '#F472B6',
    glow: 'rgba(244, 114, 182, 0.4)',
  },
  purple: {
    label: 'Purple / बैंगनी',
    bgClass: 'from-purple-100/90 via-purple-50/70 to-white/60 dark:from-purple-950/40 dark:via-purple-900/20 dark:to-slate-900/70',
    borderClass: 'border-purple-300/80 dark:border-purple-600/30',
    dot: '#C084FC',
    glow: 'rgba(192, 132, 252, 0.4)',
  },
  green: {
    label: 'Green / हरा',
    bgClass: 'from-emerald-100/90 via-emerald-50/70 to-white/60 dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-slate-900/70',
    borderClass: 'border-emerald-300/80 dark:border-emerald-600/30',
    dot: '#4ADE80',
    glow: 'rgba(74, 222, 128, 0.4)',
  },
  orange: {
    label: 'Peach / नारंगी',
    bgClass: 'from-orange-100/90 via-orange-50/70 to-white/60 dark:from-orange-950/40 dark:via-orange-900/20 dark:to-slate-900/70',
    borderClass: 'border-orange-300/80 dark:border-orange-600/30',
    dot: '#FB923C',
    glow: 'rgba(251, 146, 60, 0.4)',
  },
};

const EMOJI_PALETTE = ['📝', '🪔', '💍', '⚡', '💡', '🔥', '🎯', '🌺', '⭐', '🛍️', '📦', '🥗'];

const DEFAULT_NOTES: StickyNote[] = [
  {
    id: 1,
    title: 'पंडित जी सामग्री व दक्षिणा',
    content: '• हवन सामग्री - २ पैकेट\n• सूखा नारियल (गोला) - ५ नग\n• कलावा व रोली\n• पीला वस्त्र (सवा मीटर)\n• दक्षिणा लिफ़ाफ़ा तैयार रखना',
    color: 'yellow',
    emoji: '🪔',
    date: 'आज, 11:30 AM',
    isPinned: true,
  },
  {
    id: 2,
    title: 'कैटरर व हलवाई फाइनल निर्देश',
    content: '• वेलकम ड्रिंक्स: ठंडाई व केसर लस्सी\n• शाम ७:३० बजे स्टार्टर सर्विस शुरू\n• मुख्य भोजन में लाइव जलेबी व रबड़ी काउंटर\n• पैकिंग बॉक्सेज ४० तैयार रखने हैं',
    color: 'blue',
    emoji: '🥗',
    date: 'कल, 04:15 PM',
  },
  {
    id: 3,
    title: 'हल्दी व संगीत ड्रेस कोड',
    content: '• हल्दी सुबह १० बजे (पीला / मस्टर्ड कुर्ता व साड़ी)\n• संगीत शाम ६ बजे (इंडो-वेस्टर्न / चमकीला एथनिक)\n• माला व पुष्प वर्षा की व्यवस्था चेक करना',
    color: 'pink',
    emoji: '🌺',
    date: '12 Nov',
  },
];

export function GlassyStickyBoard() {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | NoteColor>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('glass-pro-notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed);
          return;
        }
      }
      // If empty, seed with initial wedding planning templates
      setNotes(DEFAULT_NOTES);
      localStorage.setItem('glass-pro-notes', JSON.stringify(DEFAULT_NOTES));
    } catch (e) {
      console.error('Failed to load sticky notes:', e);
      setNotes(DEFAULT_NOTES);
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updated: StickyNote[]) => {
    setNotes(updated);
    try {
      localStorage.setItem('glass-pro-notes', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist sticky notes:', e);
    }
  };

  // Add new note
  const addNote = (presetColor?: NoteColor, presetEmoji?: string, initialTitle = '', initialContent = '') => {
    const colors: NoteColor[] = ['yellow', 'blue', 'pink', 'purple', 'green', 'orange'];
    const randomColor = presetColor || colors[Math.floor(Math.random() * colors.length)];
    const randomEmoji = presetEmoji || EMOJI_PALETTE[Math.floor(Math.random() * EMOJI_PALETTE.length)];

    const now = new Date();
    const dateStr = now.toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newNote: StickyNote = {
      id: Date.now(),
      title: initialTitle,
      content: initialContent,
      color: randomColor,
      emoji: randomEmoji,
      date: dateStr,
      isPinned: false,
    };

    saveNotes([newNote, ...notes]);
  };

  // Update note content
  const updateNote = (id: number, fields: Partial<StickyNote>) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, ...fields } : n));
    saveNotes(updated);
  };

  // Delete note
  const deleteNote = (id: number) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  // Toggle pin
  const togglePin = (id: number) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    saveNotes(updated);
  };

  // Copy note text
  const copyNote = (note: StickyNote) => {
    const text = `${note.emoji} ${note.title ? note.title + '\n' : ''}${note.content}\n— Shagun Tracker Note (${note.date})`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter notes
  const filteredNotes = notes
    .filter((n) => {
      const matchesColor = selectedFilter === 'all' || n.color === selectedFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesColor && matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.id - a.id;
    });

  return (
    <div className="aether-card p-4 sm:p-6 space-y-4">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HEADER: Title, Preset Quick Adds & New Note Button          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="aether-header-badge text-amber-600 dark:text-amber-400">
              ✨ {isHi ? 'महत्वपूर्ण नोट्स व सूचियां' : 'GlassyBoard Sticky Notes'}
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
              {notes.length} {isHi ? 'पर्चियां' : 'Notes'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? 'डिजिटल स्टिकी नोट्स व चेकलिस्ट' : 'Quick Sticky Notes & Checklists'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isHi
              ? 'शादी के जरूरी काम, खरीदारी सूची, दक्षिणा व रिमाइंडर दर्ज करें — 3D ग्लास कार्ड्स में सुरक्षित।'
              : 'Record important tasks, wedding shopping lists, pandit ji items, and reminders with live autosave.'}
          </p>
        </div>

        {/* Action Button: Add Note */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => addNote()}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-gradient-to-r from-[#C0392B] to-[#E67E22] hover:from-[#A93226] hover:to-[#D35400] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{isHi ? '+ नया नोट जोड़ें' : '+ Add Note'}</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. CONTROLS BAR: Search & Color Filter Pills                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'नोट्स खोजें (जैसे: कैटरर, पूजा, लिस्ट)...' : 'Search sticky notes...'}
            className="w-full aether-inset pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 outline-hidden font-medium"
          />
        </div>

        {/* Color Palette Filter */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-extrabold transition-all cursor-pointer',
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-white'
            )}
          >
            {isHi ? 'सभी' : 'All'} ({notes.length})
          </button>

          {(['yellow', 'blue', 'pink', 'purple', 'green', 'orange'] as NoteColor[]).map((c) => {
            const count = notes.filter((n) => n.color === c).length;
            const cfg = COLOR_CONFIGS[c];
            const isSel = selectedFilter === c;

            return (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedFilter(c)}
                className={cn(
                  'rounded-full px-2 py-1 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                  isSel
                    ? 'ring-2 ring-slate-800 dark:ring-white scale-105 shadow-xs bg-white dark:bg-slate-800'
                    : 'bg-white/40 dark:bg-white/5 hover:bg-white/70'
                )}
              >
                <span className="w-2.5 h-2.5 rounded-full inline-block shadow-xs" style={{ backgroundColor: cfg.dot }} />
                <span className="text-[10px] text-slate-600 dark:text-slate-300">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. 3D GLASS STICKY NOTES GRID                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-10 aether-inset space-y-2 rounded-2xl">
          <span className="text-3xl block">📋</span>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {isHi ? 'कोई स्टिकी नोट नहीं मिला' : 'No sticky notes found'}
          </p>
          <button
            type="button"
            onClick={() => addNote()}
            className="text-xs font-extrabold text-[#C0392B] hover:underline cursor-pointer"
          >
            + {isHi ? 'पहला नोट बनाएं' : 'Create a note'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {filteredNotes.map((note) => {
            const colorCfg = COLOR_CONFIGS[note.color] || COLOR_CONFIGS.yellow;

            return (
              <div
                key={note.id}
                className={cn(
                  'group relative rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300',
                  'bg-gradient-to-br backdrop-blur-xl border shadow-lg',
                  'hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl',
                  colorCfg.bgClass,
                  colorCfg.borderClass
                )}
                style={{
                  minHeight: '260px',
                  boxShadow: `0 12px 30px -4px ${colorCfg.glow}, inset 0 1px 3px rgba(255,255,255,0.9)`,
                }}
              >
                {/* Note Header: Emoji, Color Switcher, Pin & Delete */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/5 dark:border-white/10">
                  <div className="flex items-center gap-1.5">
                    {/* Emoji badge with quick picker */}
                    <button
                      type="button"
                      title={isHi ? 'इमोजी बदलें' : 'Change emoji'}
                      onClick={() => {
                        const nextIdx = (EMOJI_PALETTE.indexOf(note.emoji) + 1) % EMOJI_PALETTE.length;
                        updateNote(note.id, { emoji: EMOJI_PALETTE[nextIdx] });
                      }}
                      className="text-xl hover:scale-125 transition-transform cursor-pointer filter drop-shadow-xs"
                    >
                      {note.emoji}
                    </button>

                    {/* Quick Color Swatches */}
                    <div className="hidden group-hover:flex items-center gap-1 pl-1 transition-opacity">
                      {(['yellow', 'blue', 'pink', 'purple', 'green', 'orange'] as NoteColor[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateNote(note.id, { color: c })}
                          className={cn(
                            'w-2.5 h-2.5 rounded-full transition-transform hover:scale-130',
                            note.color === c ? 'ring-1 ring-slate-800 dark:ring-white scale-110' : 'opacity-70'
                          )}
                          style={{ backgroundColor: COLOR_CONFIGS[c].dot }}
                          title={COLOR_CONFIGS[c].label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions: Pin, Copy & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => togglePin(note.id)}
                      title={note.isPinned ? (isHi ? 'पिन हटाएं' : 'Unpin') : (isHi ? 'शीर्ष पर पिन करें' : 'Pin to top')}
                      className={cn(
                        'h-7 w-7 rounded-full flex items-center justify-center transition-all cursor-pointer',
                        note.isPinned
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white/60 dark:bg-black/30 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      )}
                    >
                      <Pin className={cn('h-3.5 w-3.5', note.isPinned && 'fill-white')} />
                    </button>

                    <button
                      type="button"
                      onClick={() => copyNote(note)}
                      title={isHi ? 'नोट कॉपी करें' : 'Copy note content'}
                      className="h-7 w-7 rounded-full bg-white/60 dark:bg-black/30 hover:bg-white text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                    >
                      {copiedId === note.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      title={isHi ? 'नोट हटाएं' : 'Delete note'}
                      className="h-7 w-7 rounded-full bg-white/60 dark:bg-black/30 hover:bg-rose-500 hover:text-white text-slate-500 flex items-center justify-center transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Note Body: Editable Title & Textarea */}
                <div className="space-y-1.5 py-2 flex-grow flex flex-col">
                  <input
                    type="text"
                    value={note.title || ''}
                    onChange={(e) => updateNote(note.id, { title: e.target.value })}
                    placeholder={isHi ? 'शीर्षक (वैकल्पिक)...' : 'Title (optional)...'}
                    className="w-full bg-transparent font-extrabold text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden tracking-tight border-none p-0"
                  />

                  <textarea
                    rows={6}
                    value={note.content}
                    onChange={(e) => updateNote(note.id, { content: e.target.value })}
                    placeholder={isHi ? 'यहाँ अपना नोट या सूची लिखें...' : 'Write your note or list here...'}
                    className="w-full flex-grow bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400/80 outline-hidden resize-none leading-relaxed border-none p-0 scrollbar-hide"
                  />
                </div>

                {/* Note Footer: Date Tag & Share Shortcut */}
                <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                  <span className="font-mono">{note.date}</span>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${note.emoji} ${note.title ? '*' + note.title + '*\n' : ''}${note.content}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-emerald-600 transition"
                    title={isHi ? 'व्हाट्सएप पर शेयर करें' : 'Share note via WhatsApp'}
                  >
                    <Share2 className="h-3 w-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GlassyStickyBoard;
