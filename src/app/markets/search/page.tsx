'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface SearchResult {
  symbol: string;
  name: string;
  currency?: string;
  exchangeShortName?: string;
}

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/markets/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Link href="/markets" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Markets</Link>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#3B82F6', letterSpacing: 3, marginBottom: 4 }}>🔍 STOCK SEARCH</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Search Stocks</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Search by ticker symbol or company name</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
            placeholder="e.g. AAPL, Tesla, NVDA..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 10, border: '1px solid #1E293B',
              background: '#111827', color: '#F1F5F9', fontSize: 14, fontFamily: 'var(--sans)',
              outline: 'none',
            }}
          />
          <button
            onClick={doSearch}
            disabled={loading || !query.trim()}
            style={{
              padding: '12px 24px', borderRadius: 10, border: 'none',
              background: '#C73E3A', color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !query.trim() ? 0.5 : 1,
              fontFamily: 'var(--sans)',
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map(r => (
            <Link key={r.symbol} href={`/markets/${r.symbol}`} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', textDecoration: 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: '#0D1117', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#60A5FA', fontFamily: 'var(--mono)', flexShrink: 0 }}>
                {r.symbol.slice(0, 4)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                  {r.symbol}{r.exchangeShortName ? ` · ${r.exchangeShortName}` : ''}{r.currency ? ` · ${r.currency}` : ''}
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#475569', fontFamily: 'var(--mono)' }}>→</span>
            </Link>
          ))}
          {searched && !loading && results.length === 0 && (
            <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: 40 }}>No results found for &ldquo;{query}&rdquo;. Try a different search term.</p>
          )}
        </div>

        {!searched && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 13, color: '#475569' }}>Enter a ticker symbol or company name to search</p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
              {['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL'].map(t => (
                <button key={t} onClick={() => { setQuery(t); }} style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid #1E293B',
                  background: '#111827', color: '#60A5FA', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--mono)',
                }}>{t}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
