'use client';

// Web Speech API "Listen" button — Phase 1 of TTS rollout per master directive PART 11.
// Cost: $0. Browser-native. Falls back to a disabled state if the API is unavailable
// (older browsers, in-app webviews, certain mobile contexts).
//
// Mobile / iOS Safari fixes (2026-04-09):
//   1. Touch target ≥ 44×44px (Apple HIG / WCAG AAA)
//   2. Sentence chunking — iOS Safari silently stops after ~15s of any single
//      utterance. Splitting into ~150-character chunks and chaining via onend
//      keeps long reports playing through to the end.
//   3. NO synth.cancel() before the first speak() inside the user gesture —
//      cancel is async on iOS and breaks the gesture binding required for
//      autoplay. We track utterances we created so cancel only runs on stop.
//   4. iOS pause/resume is unreliable — pause is implemented as full stop and
//      restart from the next chunk on resume to avoid the buggy state path.

import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  text: string;
  minutes?: number;
}

type Status = 'idle' | 'playing' | 'paused';

function stripContent(s: string): string {
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

// Split text into ~200 character chunks at sentence boundaries.
// iOS Safari silently truncates utterances longer than ~15 seconds, which
// at default rate is roughly 200 characters. Sentence-aware chunking keeps
// the cadence natural and avoids mid-word cuts.
function chunkText(text: string, maxChars = 200): string[] {
  if (!text) return [];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let current = '';
  for (const s of sentences) {
    const sentence = s.trim();
    if (!sentence) continue;
    if (current.length + sentence.length + 1 <= maxChars) {
      current = current ? `${current} ${sentence}` : sentence;
    } else {
      if (current) chunks.push(current);
      // If a single sentence is longer than maxChars, hard-split it on word boundaries
      if (sentence.length > maxChars) {
        const words = sentence.split(' ');
        let buf = '';
        for (const w of words) {
          if (buf.length + w.length + 1 <= maxChars) {
            buf = buf ? `${buf} ${w}` : w;
          } else {
            if (buf) chunks.push(buf);
            buf = w;
          }
        }
        current = buf;
      } else {
        current = sentence;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export default function ListenButton({ text, minutes }: Props) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const cleanText = stripContent(text);
  const mins = minutes ?? estimateMinutes(cleanText);
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  // Stop flag — iOS onend fires after cancel(), this guards the chain.
  const stoppedRef = useRef(false);
  // Chrome keep-alive: Chrome pauses speechSynthesis after ~15s on background tabs.
  // Calling pause()+resume() every 14s resets its internal timer.
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveRef.current !== null) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const startKeepAlive = useCallback(() => {
    stopKeepAlive();
    keepAliveRef.current = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 14000);
  }, [stopKeepAlive]);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      stopKeepAlive();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
      }
    };
  }, [stopKeepAlive]);

  // Speak a single chunk and chain onend → next chunk. Defined as ref so
  // the onend callback always sees the latest version after rebuild.
  const speakNext = useCallback(() => {
    if (stoppedRef.current) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const i = indexRef.current;
    if (i >= chunksRef.current.length) {
      stopKeepAlive();
      setStatus('idle');
      return;
    }
    const u = new SpeechSynthesisUtterance(chunksRef.current[i]);
    u.lang = 'en-US';
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    u.onend = () => {
      // Guard: if user pressed stop, the cancel() will trigger onend; do not advance.
      if (stoppedRef.current) return;
      indexRef.current = i + 1;
      // Schedule the next chunk in a microtask to keep the iOS event loop happy.
      setTimeout(speakNext, 30);
    };
    u.onerror = () => {
      // Move to next chunk on error rather than aborting — single bad chunk
      // should not kill the entire reading.
      if (stoppedRef.current) return;
      indexRef.current = i + 1;
      setTimeout(speakNext, 30);
    };
    synth.speak(u);
  // stopKeepAlive is stable (useCallback []), safe to include
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopKeepAlive]);

  // Play handler — must be called DIRECTLY from the click event so iOS
  // honors the user gesture. No await, no setTimeout before the first speak.
  const play = useCallback(() => {
    if (!supported || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    // Build chunks once
    chunksRef.current = chunkText(cleanText);
    indexRef.current = 0;
    stoppedRef.current = false;

    if (chunksRef.current.length === 0) return;

    // CRITICAL: do NOT call synth.cancel() before the first speak() on iOS.
    // cancel() is async and the gesture binding required for autoplay is
    // lost between cancel and speak. Instead, mark stopped and call speak
    // directly. The previous run's onend chain will see stoppedRef and exit.
    stoppedRef.current = false;

    // Start the first chunk synchronously (gesture-bound)
    const first = new SpeechSynthesisUtterance(chunksRef.current[0]);
    first.lang = 'en-US';
    first.rate = 1.0;
    first.pitch = 1.0;
    first.volume = 1.0;
    first.onend = () => {
      if (stoppedRef.current) return;
      indexRef.current = 1;
      setTimeout(speakNext, 30);
    };
    first.onerror = () => {
      if (stoppedRef.current) return;
      indexRef.current = 1;
      setTimeout(speakNext, 30);
    };
    synth.speak(first);
    startKeepAlive();
    setStatus('playing');
  }, [supported, cleanText, speakNext, startKeepAlive]);

  // Stop handler — sets the guard then calls cancel.
  const stop = useCallback(() => {
    if (!supported) return;
    stoppedRef.current = true;
    stopKeepAlive();
    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    setStatus('idle');
  }, [supported, stopKeepAlive]);

  if (!supported) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        minHeight: 44, padding: '0 16px', borderRadius: 10,
        background: '#FAFAF8', border: '1px solid #E8E8E4',
        fontSize: 12, color: '#8A929C', fontFamily: 'var(--mono)',
      }}>
        🔊 Listen unavailable
      </div>
    );
  }

  // Idle state: render the entire card as a single button so the touch
  // target is the full visible area, not a small inner text node.
  if (status === 'idle') {
    return (
      <button
        type="button"
        onClick={play}
        aria-label={`Listen to article, approximately ${mins} minutes`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          minHeight: 44, padding: '0 18px',
          borderRadius: 12,
          background: '#FAFAF8',
          border: '1px solid #E8E8E4',
          color: '#16161A',
          fontFamily: 'var(--mono)',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{ fontSize: 16 }} aria-hidden="true">🔊</span>
        <span>Listen</span>
        <span style={{ color: '#8A929C', fontWeight: 600 }}>~{mins} min</span>
      </button>
    );
  }

  // Playing state: stop button alone (full-width touch target)
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      borderRadius: 12,
      background: '#FAFAF8',
      border: '1px solid #00D47440',
      padding: '0 6px',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        minHeight: 44, padding: '0 12px',
        fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: '#00D474',
      }}>
        <span aria-hidden="true">●</span>
        <span>Playing</span>
      </span>
      <button
        type="button"
        onClick={stop}
        aria-label="Stop reading"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          minWidth: 44, minHeight: 44, padding: '0 14px',
          borderRadius: 10,
          background: '#FF454515',
          border: '1px solid #FF454540',
          color: '#FF4545',
          fontFamily: 'var(--mono)',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span aria-hidden="true">⏹</span>
        <span>Stop</span>
      </button>
    </div>
  );
}
