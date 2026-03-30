'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    { rank: 1, name: 'Apple', value: '$3.8T', flag: '🇺🇸', delta: '+8%', sub: 'AAPL' },
    { rank: 2, name: 'NVIDIA', value: '$3.4T', flag: '🇺🇸', delta: '+42%', sub: 'NVDA' },
    { rank: 3, name: 'Microsoft', value: '$3.2T', flag: '🇺🇸', delta: '+12%', sub: 'MSFT' },
    { rank: 4, name: 'Amazon', value: '$2.3T', flag: '🇺🇸', delta: '+18%', sub: 'AMZN' },
    { rank: 5, name: 'Alphabet', value: '$2.2T', flag: '🇺🇸', delta: '+15%', sub: 'GOOGL' },
    { rank: 6, name: 'Saudi Aramco', value: '$1.8T', flag: '🇸🇦', delta: '-5%', sub: '2222.SR' },
    { rank: 7, name: 'Meta', value: '$1.6T', flag: '🇺🇸', delta: '+28%', sub: 'META' },
    { rank: 8, name: 'TSMC', value: '$1.0T', flag: '🇹🇼', delta: '+22%', sub: 'TSM' },
    { rank: 9, name: 'Broadcom', value: '$980B', flag: '🇺🇸', delta: '+35%', sub: 'AVGO' },
    { rank: 10, name: 'Tesla', value: '$920B', flag: '🇺🇸', delta: '+10%', sub: 'TSLA' },
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

    // Companies tab — Yahoo Finance
    if (tab === 'companies') {
      setLoading(true);
      fetch('/api/companies')
        .then(r => r.json())
        .then(res => {
          if (res.companies) {
            const mapped = res.companies.map((c: { rank: number; ticker: string; name: string; flag: string; price: number; change: number }) => ({
              rank: c.rank, name: `${c.name} (${c.ticker})`, value: `$${c.price.toLocaleString()}`, flag: c.flag,
              delta: `${c.change >= 0 ? '+' : ''}${c.change}%`,
              sub: `Source: Yahoo Finance · ${res.lastUpdated?.split('T')[0] || ''}`,
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
          <Link href="/" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Home</Link>
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
      </div>
    </div>
  );
}
