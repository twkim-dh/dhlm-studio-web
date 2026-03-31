'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LikeButton from '@/components/LikeButton';

const YEAR = new Date().getFullYear();

type TabId = 'billionaires' | 'companies' | 'gdp' | 'population' | 'sports';

const tabs: { id: TabId; label: string }[] = [
  { id: 'billionaires', label: 'Billionaires' },
  { id: 'companies', label: 'Companies' },
  { id: 'gdp', label: 'GDP' },
  { id: 'population', label: 'Population' },
  { id: 'sports', label: 'Sports' },
];

const data: Record<TabId, { rank: number; name: string; value: string; flag: string; delta: string; sub?: string }[]> = {
  billionaires: [
    { rank: 1, name: 'Elon Musk', value: '$287B', flag: '🇺🇸', delta: '+12%', sub: 'Tesla, SpaceX, X' },
    { rank: 2, name: 'Bernard Arnault', value: '$241B', flag: '🇫🇷', delta: '-3%', sub: 'LVMH' },
    { rank: 3, name: 'Jeff Bezos', value: '$218B', flag: '🇺🇸', delta: '+8%', sub: 'Amazon' },
    { rank: 4, name: 'Mark Zuckerberg', value: '$198B', flag: '🇺🇸', delta: '+22%', sub: 'Meta' },
    { rank: 5, name: 'Larry Ellison', value: '$176B', flag: '🇺🇸', delta: '+15%', sub: 'Oracle' },
    { rank: 6, name: 'Warren Buffett', value: '$143B', flag: '🇺🇸', delta: '+5%', sub: 'Berkshire Hathaway' },
    { rank: 7, name: 'Bill Gates', value: '$138B', flag: '🇺🇸', delta: '+3%', sub: 'Microsoft' },
    { rank: 8, name: 'Mukesh Ambani', value: '$122B', flag: '🇮🇳', delta: '+18%', sub: 'Reliance' },
    { rank: 9, name: 'Steve Ballmer', value: '$118B', flag: '🇺🇸', delta: '+10%', sub: 'Microsoft, LA Clippers' },
    { rank: 10, name: 'Jensen Huang', value: '$112B', flag: '🇺🇸', delta: '+45%', sub: 'NVIDIA' },
  ],
  companies: [
    { rank: 1, name: 'NVIDIA', value: '$4.2T', flag: '🇺🇸', delta: '+45%', sub: 'NVDA' },
    { rank: 2, name: 'Apple', value: '$3.8T', flag: '🇺🇸', delta: '+8%', sub: 'AAPL' },
    { rank: 3, name: 'Alphabet', value: '$3.6T', flag: '🇺🇸', delta: '+18%', sub: 'GOOGL' },
    { rank: 4, name: 'Microsoft', value: '$3.0T', flag: '🇺🇸', delta: '+10%', sub: 'MSFT' },
    { rank: 5, name: 'Amazon', value: '$2.3T', flag: '🇺🇸', delta: '+15%', sub: 'AMZN' },
    { rank: 6, name: 'Broadcom', value: '$1.7T', flag: '🇺🇸', delta: '+38%', sub: 'AVGO' },
    { rank: 7, name: 'Meta', value: '$1.7T', flag: '🇺🇸', delta: '+28%', sub: 'META' },
    { rank: 8, name: 'TSMC', value: '$1.5T', flag: '🇹🇼', delta: '+22%', sub: 'TSM' },
    { rank: 9, name: 'Tesla', value: '$1.5T', flag: '🇺🇸', delta: '+12%', sub: 'TSLA' },
    { rank: 10, name: 'JPMorgan Chase', value: '$850B', flag: '🇺🇸', delta: '+9%', sub: 'JPM' },
  ],
  gdp: [
    { rank: 1, name: 'United States', value: '$28.8T', flag: '🇺🇸', delta: '+2.8%' },
    { rank: 2, name: 'China', value: '$18.5T', flag: '🇨🇳', delta: '+4.6%' },
    { rank: 3, name: 'Germany', value: '$4.6T', flag: '🇩🇪', delta: '+0.8%' },
    { rank: 4, name: 'Japan', value: '$4.2T', flag: '🇯🇵', delta: '+1.2%' },
    { rank: 5, name: 'India', value: '$3.9T', flag: '🇮🇳', delta: '+6.5%' },
    { rank: 6, name: 'United Kingdom', value: '$3.4T', flag: '🇬🇧', delta: '+1.5%' },
    { rank: 7, name: 'France', value: '$3.1T', flag: '🇫🇷', delta: '+1.1%' },
    { rank: 8, name: 'Brazil', value: '$2.2T', flag: '🇧🇷', delta: '+2.9%' },
    { rank: 9, name: 'Italy', value: '$2.2T', flag: '🇮🇹', delta: '+0.9%' },
    { rank: 10, name: 'Canada', value: '$2.1T', flag: '🇨🇦', delta: '+1.8%' },
  ],
  population: [
    { rank: 1, name: 'India', value: '1.44B', flag: '🇮🇳', delta: '+0.8%' },
    { rank: 2, name: 'China', value: '1.41B', flag: '🇨🇳', delta: '-0.2%' },
    { rank: 3, name: 'United States', value: '340M', flag: '🇺🇸', delta: '+0.5%' },
    { rank: 4, name: 'Indonesia', value: '279M', flag: '🇮🇩', delta: '+0.8%' },
    { rank: 5, name: 'Pakistan', value: '240M', flag: '🇵🇰', delta: '+1.7%' },
    { rank: 6, name: 'Nigeria', value: '230M', flag: '🇳🇬', delta: '+2.4%' },
    { rank: 7, name: 'Brazil', value: '217M', flag: '🇧🇷', delta: '+0.5%' },
    { rank: 8, name: 'Bangladesh', value: '173M', flag: '🇧🇩', delta: '+1.0%' },
    { rank: 9, name: 'Russia', value: '144M', flag: '🇷🇺', delta: '-0.3%' },
    { rank: 10, name: 'Mexico', value: '130M', flag: '🇲🇽', delta: '+0.7%' },
  ],
  sports: [
    { rank: 1, name: 'Cristiano Ronaldo', value: '$260M', flag: '🇵🇹', delta: '', sub: 'Al Nassr · Football' },
    { rank: 2, name: 'Lionel Messi', value: '$135M', flag: '🇦🇷', delta: '', sub: 'Inter Miami · Football' },
    { rank: 3, name: 'Neymar Jr', value: '$110M', flag: '🇧🇷', delta: '', sub: 'Al Hilal · Football' },
    { rank: 4, name: 'Stephen Curry', value: '$52M', flag: '🇺🇸', delta: '', sub: 'Warriors · NBA' },
    { rank: 5, name: 'LeBron James', value: '$48M', flag: '🇺🇸', delta: '', sub: 'Lakers · NBA' },
    { rank: 6, name: 'Kylian Mbappé', value: '$90M', flag: '🇫🇷', delta: '', sub: 'Real Madrid · Football' },
    { rank: 7, name: 'Shohei Ohtani', value: '$70M', flag: '🇯🇵', delta: '', sub: 'Dodgers · MLB' },
    { rank: 8, name: 'Patrick Mahomes', value: '$53M', flag: '🇺🇸', delta: '', sub: 'Chiefs · NFL' },
    { rank: 9, name: 'Giannis Antetokounmpo', value: '$46M', flag: '🇬🇷', delta: '', sub: 'Bucks · NBA' },
    { rank: 10, name: 'Erling Haaland', value: '$44M', flag: '🇳🇴', delta: '', sub: 'Man City · Football' },
  ],
};

const card = { background: '#111827', borderRadius: 18, border: '1px solid #1E293B', overflow: 'hidden' as const };

export default function RankingsPage() {
  const [tab, setTab] = useState<TabId>('billionaires');
  const [liveData, setLiveData] = useState<Record<string, typeof data['billionaires']>>({});
  const [loading, setLoading] = useState(false);

  // Fetch live data from World Bank API for country tabs
  useEffect(() => {
    if (liveData[tab]) return;

    // World Bank tabs
    if (tab === 'gdp' || tab === 'population') {
      setLoading(true);
      fetch(`/api/rankings?type=${tab}`)
        .then(r => r.json())
        .then(res => {
          if (res.rankings) {
            const mapped = res.rankings.map((r: { rank: number; name: string; flag: string; value: string }) => ({
              rank: r.rank, name: r.name, value: r.value, flag: r.flag, delta: '', sub: `Source: World Bank · ${res.lastUpdated?.split('T')[0] || ''}`,
            }));
            setLiveData(prev => ({ ...prev, [tab]: mapped }));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    // Companies tab — Financial Modeling Prep
    if (tab === 'companies') {
      setLoading(true);
      fetch('/api/companies')
        .then(r => r.json())
        .then(res => {
          if (res.companies) {
            const mapped = res.companies.map((c: { rank: number; ticker: string; name: string; flag: string; marketCapFmt: string; change: number; sector: string }) => ({
              rank: c.rank, name: `${c.name} (${c.ticker})`, value: c.marketCapFmt, flag: c.flag,
              delta: c.change ? `${c.change >= 0 ? '+' : ''}${Number(c.change).toFixed(1)}%` : '',
              sub: `${c.sector} · Source: FMP · ${res.lastUpdated?.split('T')[0] || ''}`,
            }));
            setLiveData(prev => ({ ...prev, companies: mapped }));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }
  }, [tab, liveData]);

  const items = liveData[tab] || data[tab];

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#D4A843', letterSpacing: 3, marginBottom: 6 }}>🏆 GLOBAL RANKINGS · {YEAR}</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>World Rankings</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', marginTop: 4 }}>Real-time data on wealth, companies, countries, and sports</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LikeButton pageId={`rankings-${tab}`} />
            <Link href="/" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Home</Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#111827', borderRadius: 10, padding: 3, border: '1px solid #1E293B', marginBottom: 24, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: tab === t.id ? '#1E293B' : 'transparent',
              color: tab === t.id ? '#F1F5F9' : '#64748B',
              fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              cursor: 'pointer', fontFamily: 'var(--sans)',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Live data indicator */}
        {liveData[tab] && (
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#00D474', marginBottom: 8 }}>
            ● LIVE DATA — World Bank API
          </p>
        )}
        {loading && (
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B', marginBottom: 16 }}>
            Loading live data...
          </p>
        )}

        {/* Table */}
        <div style={card}>
          {items.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px',
              borderBottom: i < items.length - 1 ? '1px solid #1E293B' : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: i < 3 ? '#D4A84315' : '#111827',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 800,
                color: i < 3 ? '#D4A843' : '#475569',
                border: i < 3 ? '1px solid #D4A84330' : 'none',
              }}>{r.rank}</div>
              <span style={{ fontSize: 18 }}>{r.flag}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600, color: '#E2E8F0' }}>{r.name}</span>
                {r.sub && <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569', marginTop: 2 }}>{r.sub}</div>}
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>{r.value}</span>
              {r.delta && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, minWidth: 48, textAlign: 'right' as const,
                  color: r.delta.startsWith('+') ? '#00D474' : r.delta.startsWith('-') ? '#FF4545' : '#64748B' }}>{r.delta}</span>
              )}
            </div>
          ))}
        </div>

        {/* Country Breakdown — bar chart */}
        <CountryBreakdown items={items} tab={tab} />
      </div>
    </div>
  );
}

/* ═══ Country Breakdown Bar Chart ═══ */
function CountryBreakdown({ items, tab }: { items: typeof data.billionaires; tab: TabId }) {
  // GDP / Population → value-based bar chart
  if (tab === 'gdp' || tab === 'population') {
    const parseVal = (v: string) => {
      const n = parseFloat(v.replace(/[^0-9.]/g, ''));
      if (v.includes('T')) return n * 1000;
      if (v.includes('B')) return n;
      if (v.includes('M')) return n / 1000;
      return n;
    };
    const maxVal = Math.max(...items.map(r => parseVal(r.value)));
    return (
      <div style={{ marginTop: 20, padding: '18px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 14 }}>
          {tab === 'gdp' ? 'GDP COMPARISON' : 'POPULATION COMPARISON'} — TOP {items.length}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map(r => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 15, width: 22, textAlign: 'center' }}>{r.flag}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#94A3B8', width: 90, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
              <div style={{ flex: 1, height: 16, borderRadius: 4, background: '#1E293B', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  width: `${(parseVal(r.value) / maxVal) * 100}%`,
                  background: r.flag === '🇺🇸' ? 'linear-gradient(90deg, #3B82F6, #60A5FA)' : '#D4A84360',
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 800, color: r.flag === '🇺🇸' ? '#60A5FA' : '#E2E8F0', width: 50, textAlign: 'right' }}>{r.value}</span>
            </div>
          ))}
        </div>
        {tab === 'gdp' && items[0]?.flag === '🇺🇸' && (
          <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: '#3B82F608', border: '1px solid #3B82F615', textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: '#60A5FA', fontWeight: 600 }}>🇺🇸 #1 GDP in the world — {items[0].value}</span>
          </div>
        )}
      </div>
    );
  }

  // Billionaires / Companies / Sports → country count breakdown
  const counts: Record<string, { flag: string; count: number }> = {};
  items.forEach(r => {
    const key = r.flag;
    if (!counts[key]) counts[key] = { flag: key, count: 0 };
    counts[key].count++;
  });
  const sorted = Object.values(counts).sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count || 1;

  const labels: Record<string, string> = {
    '🇺🇸': 'United States', '🇫🇷': 'France', '🇮🇳': 'India', '🇹🇼': 'Taiwan',
    '🇵🇹': 'Portugal', '🇦🇷': 'Argentina', '🇧🇷': 'Brazil', '🇯🇵': 'Japan',
    '🇬🇷': 'Greece', '🇳🇴': 'Norway', '🇬🇧': 'United Kingdom', '🇩🇪': 'Germany',
    '🇨🇳': 'China', '🇰🇷': 'South Korea', '🇮🇩': 'Indonesia', '🇵🇰': 'Pakistan',
    '🇳🇬': 'Nigeria', '🇧🇩': 'Bangladesh', '🇷🇺': 'Russia', '🇲🇽': 'Mexico',
    '🇮🇹': 'Italy', '🇨🇦': 'Canada',
  };

  return (
    <div style={{ marginTop: 20, padding: '18px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 14 }}>
        COUNTRY BREAKDOWN — {tab.toUpperCase()} TOP {items.length}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(c => (
          <div key={c.flag} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{c.flag}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#94A3B8', width: 100, flexShrink: 0 }}>{labels[c.flag] || c.flag}</span>
            <div style={{ flex: 1, height: 16, borderRadius: 4, background: '#1E293B', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${(c.count / max) * 100}%`,
                background: c.flag === '🇺🇸' ? 'linear-gradient(90deg, #3B82F6, #60A5FA)' : '#D4A84360',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 800, color: c.flag === '🇺🇸' ? '#60A5FA' : '#E2E8F0', width: 20, textAlign: 'right' }}>{c.count}</span>
          </div>
        ))}
      </div>
      {sorted[0]?.flag === '🇺🇸' && sorted[0]?.count >= items.length * 0.6 && (
        <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: '#3B82F608', border: '1px solid #3B82F615', textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: '#60A5FA', fontWeight: 600 }}>🇺🇸 {sorted[0].count} of {items.length} are American — data speaks for itself.</span>
        </div>
      )}
    </div>
  );
}
