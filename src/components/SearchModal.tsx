'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchItem {
  title: string;
  slug: string;
  category: 'Reports' | 'Blog' | 'Learn';
  subCategory: string;
  tags: string[];
  excerpt: string;
  publishDate: string;
  url: string;
}

interface SearchResult {
  item: SearchItem;
  score?: number;
}

interface GroupedResults {
  Reports: SearchResult[];
  Blog: SearchResult[];
  Learn: SearchResult[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  Reports: '📊',
  Blog:    '📝',
  Learn:   '🎓',
};

const CATEGORY_COLORS: Record<string, string> = {
  Reports: '#C73E3A',
  Blog:    '#00D474',
  Learn:   '#F59E0B',
};

const MAX_PER_CAT = 5;

const FUSE_OPTIONS = {
  keys: [
    { name: 'title',       weight: 3 },
    { name: 'tags',        weight: 2 },
    { name: 'subCategory', weight: 1.5 },
    { name: 'excerpt',     weight: 1 },
  ],
  threshold: 0.35,
  distance: 120,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

// ─── Highlight helper ─────────────────────────────────────────────────────────

function highlight(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#C73E3A30', color: '#F87171', padding: '0 1px', borderRadius: 2 }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const router  = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  const [query,   setQuery]   = useState('');
  const [index,   setIndex]   = useState<SearchItem[]>([]);
  const [results, setResults] = useState<GroupedResults>({ Reports: [], Blog: [], Learn: [] });
  const [cursor,  setCursor]  = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Flat ordered list for keyboard navigation
  const flatResults = [
    ...results.Reports,
    ...results.Blog,
    ...results.Learn,
  ];

  // Load search index once
  useEffect(() => {
    fetch('/search-index.json')
      .then(r => r.json())
      .then((data: SearchItem[]) => setIndex(data))
      .catch(() => {});
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 100);
    return () => clearTimeout(t);
  }, [query]);

  // Run search
  useEffect(() => {
    if (!debouncedQuery.trim() || index.length === 0) {
      setResults({ Reports: [], Blog: [], Learn: [] });
      setCursor(-1);
      return;
    }
    const fuse = new Fuse(index, FUSE_OPTIONS);
    const raw  = fuse.search(debouncedQuery) as SearchResult[];
    const grouped: GroupedResults = { Reports: [], Blog: [], Learn: [] };
    for (const r of raw) {
      const cat = r.item.category as keyof GroupedResults;
      if (grouped[cat] && grouped[cat].length < MAX_PER_CAT) {
        grouped[cat].push(r);
      }
    }
    setResults(grouped);
    setCursor(-1);
  }, [debouncedQuery, index]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, flatResults.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, -1));
    }
    if (e.key === 'Enter' && cursor >= 0 && flatResults[cursor]) {
      router.push(flatResults[cursor].item.url);
      onClose();
    }
  }, [cursor, flatResults, onClose, router]);

  // Scroll cursor into view
  useEffect(() => {
    if (cursor < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${cursor}"]`) as HTMLElement;
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const totalCount = flatResults.length;
  const hasResults = totalCount > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-label="Search"
        aria-modal="true"
        style={{
          position: 'fixed', top: '10vh', left: '50%', transform: 'translateX(-50%)',
          zIndex: 401, width: '100%', maxWidth: 620,
          background: '#FAFAF8',
          border: '1px solid #E8E8E4',
          borderRadius: 14,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '80vh',
          margin: '0 16px',
        }}
      >
        {/* Input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px',
          borderBottom: query ? '1px solid #E8E8E4' : 'none',
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
            <circle cx="6.5" cy="6.5" r="5" stroke="#5B6470" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="#5B6470" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search reports, blog, lessons..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#16161A', fontSize: 15, fontFamily: 'var(--sans)',
              caretColor: '#C73E3A',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A929C', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
              aria-label="Clear"
            >
              ×
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: '#FFFFFF', border: 'none', cursor: 'pointer',
              color: '#8A929C', fontSize: 11, padding: '4px 8px',
              borderRadius: 5, fontFamily: 'var(--mono)', letterSpacing: 0.5,
              flexShrink: 0,
            }}
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ overflowY: 'auto', flex: 1 }}>
          {/* Empty state */}
          {!query && (
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 13, color: '#8A929C', fontFamily: 'var(--sans)' }}>
                Search across {index.length} reports, blog posts, and lessons
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['nvidia', 'bitcoin', 'spacex', 'blockchain', 'fed'].map(hint => (
                  <button
                    key={hint}
                    onClick={() => setQuery(hint)}
                    style={{
                      background: '#FFFFFF', border: '1px solid #E8E8E4', borderRadius: 6,
                      padding: '4px 10px', fontSize: 11, color: '#8A929C',
                      fontFamily: 'var(--mono)', cursor: 'pointer', letterSpacing: 0.5,
                    }}
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query && !hasResults && debouncedQuery === query && (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#8A929C', fontFamily: 'var(--sans)' }}>
                No results found for{' '}
                <span style={{ color: '#5B6470', fontWeight: 600 }}>"{query}"</span>
              </div>
              <div style={{ fontSize: 11, color: '#8A929C', marginTop: 6 }}>Try a different keyword or check spelling.</div>
            </div>
          )}

          {/* Grouped results */}
          {(['Reports', 'Blog', 'Learn'] as const).map(cat => {
            const group = results[cat];
            if (group.length === 0) return null;
            const color = CATEGORY_COLORS[cat];
            const icon  = CATEGORY_ICONS[cat];
            return (
              <div key={cat}>
                {/* Group header */}
                <div style={{
                  padding: '10px 16px 6px',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 800, color, letterSpacing: 1.5 }}>
                    {cat.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700,
                    color: '#8A929C', background: '#FFFFFF', borderRadius: 4,
                    padding: '1px 5px',
                  }}>
                    {group.length}
                  </span>
                </div>

                {/* Items */}
                {group.map((r, i) => {
                  const globalIdx = (cat === 'Reports' ? 0 : cat === 'Blog' ? results.Reports.length : results.Reports.length + results.Blog.length) + i;
                  const isActive  = cursor === globalIdx;
                  return (
                    <button
                      key={r.item.slug}
                      data-idx={globalIdx}
                      onClick={() => { router.push(r.item.url); onClose(); }}
                      onMouseEnter={() => setCursor(globalIdx)}
                      style={{
                        width: '100%', textAlign: 'left', background: isActive ? '#1E293B' : 'none',
                        border: 'none', borderRadius: 0, cursor: 'pointer',
                        padding: '10px 16px',
                        borderLeft: isActive ? `2px solid ${color}` : '2px solid transparent',
                        transition: 'background 0.1s',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 600, color: isActive ? '#16161A' : '#374151',
                          fontFamily: 'var(--sans)', lineHeight: 1.3,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {highlight(r.item.title, debouncedQuery)}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
                          <span style={{
                            fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700,
                            color, letterSpacing: 0.8,
                          }}>
                            {r.item.subCategory}
                          </span>
                          {r.item.publishDate && (
                            <span style={{ fontSize: 9, color: '#8A929C', fontFamily: 'var(--mono)' }}>
                              {r.item.publishDate}
                            </span>
                          )}
                        </div>
                        {r.item.excerpt && (
                          <div style={{
                            fontSize: 11, color: '#8A929C', marginTop: 3,
                            overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                            fontFamily: 'var(--sans)',
                          }}>
                            {highlight(r.item.excerpt, debouncedQuery)}
                          </div>
                        )}
                      </div>
                      {isActive && (
                        <span style={{ fontSize: 9, color: '#8A929C', fontFamily: 'var(--mono)', flexShrink: 0, marginTop: 3 }}>↵</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Footer */}
          {hasResults && (
            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid #E8E8E4',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 9, color: '#8A929C', fontFamily: 'var(--mono)' }}>
                {totalCount} result{totalCount !== 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 9, color: '#8A929C', fontFamily: 'var(--mono)', display: 'flex', gap: 10 }}>
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc close</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
