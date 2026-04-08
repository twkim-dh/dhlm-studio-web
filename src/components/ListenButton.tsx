'use client';

// Web Speech API "Listen" button — Phase 1 of TTS rollout per master directive PART 11.
// Cost: $0. Browser-native. Falls back to a disabled state if the API is unavailable
// (older browsers, in-app webviews, certain mobile contexts).
//
// Usage:
//   <ListenButton text="Full report body to read aloud..." minutes={14} />

import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  /** The text to read aloud. Markdown/HTML stripping happens here. */
  text: string;
  /** Optional pre-computed estimate; otherwise derived from word count at ~180 wpm. */
  minutes?: number;
}

type Status = 'idle' | 'playing' | 'paused';

function stripContent(s: string): string {
  // Remove markdown headings, bold, italic, links, code, tables — keep prose only.
  return s
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export default function ListenButton({ text, minutes }: Props) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cleanText = stripContent(text);
  const mins = minutes ?? estimateMinutes(cleanText);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const play = useCallback(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = 'en-US';
    u.rate = 1.0;
    u.pitch = 1.0;
    u.onend = () => setStatus('idle');
    u.onerror = () => setStatus('idle');
    utterRef.current = u;
    synth.speak(u);
    setStatus('playing');
  }, [supported, cleanText]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setStatus('paused');
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setStatus('playing');
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setStatus('idle');
  }, [supported]);

  if (!supported) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: '#0D1117', border: '1px solid #1E293B', fontSize: 11, color: '#475569', fontFamily: 'var(--mono)' }}>
        🔊 Listen unavailable
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px 6px 12px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B' }}>
      <span style={{ fontSize: 12 }}>🔊</span>
      {status === 'idle' && (
        <button onClick={play} style={{ background: 'none', border: 'none', color: '#E2E8F0', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: '4px 6px' }}>
          Listen <span style={{ color: '#475569', marginLeft: 4 }}>~{mins} min</span>
        </button>
      )}
      {status === 'playing' && (
        <>
          <button onClick={pause} style={{ background: 'none', border: 'none', color: '#00D474', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: '4px 6px' }} aria-label="Pause">⏸ Pause</button>
          <button onClick={stop} style={{ background: 'none', border: 'none', color: '#FF4545', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: '4px 6px' }} aria-label="Stop">⏹</button>
        </>
      )}
      {status === 'paused' && (
        <>
          <button onClick={resume} style={{ background: 'none', border: 'none', color: '#00D474', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: '4px 6px' }} aria-label="Resume">▶ Resume</button>
          <button onClick={stop} style={{ background: 'none', border: 'none', color: '#FF4545', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: '4px 6px' }} aria-label="Stop">⏹</button>
        </>
      )}
    </div>
  );
}
