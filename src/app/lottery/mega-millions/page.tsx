import type { Metadata } from 'next';
import Link from 'next/link';
import { MEGAMILLIONS_DRAWS, JACKPOT_INFO } from '@/data/lottery';

export const metadata: Metadata = {
  title: `Mega Millions Results & Winning Numbers ${new Date().getFullYear()} | DHLM Studio`,
  description: `Latest Mega Millions winning numbers, jackpot amount $${Math.round(JACKPOT_INFO.megamillions.current / 1e6)}M, past results, and statistics.`,
};

export default function MegaMillionsPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/lottery" style={{ fontSize: 12, color: '#64748B' }}>← Lottery</Link>
        <div style={{ marginTop: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>MM</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Mega Millions Results</h1>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 6 }}>Draws every Tue, Fri at 11:00 PM ET · Jackpot: <strong style={{ color: '#F59E0B' }}>${Math.round(JACKPOT_INFO.megamillions.current / 1e6)}M</strong></p>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          <Link href="/lottery/number-generator" style={{ fontSize: 11, color: '#A78BFA', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>🎲 Generate Numbers</Link>
          <Link href="/lottery/jackpot-tracker" style={{ fontSize: 11, color: '#00D474', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B' }}>💰 Jackpot Tracker</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MEGAMILLIONS_DRAWS.map((d, i) => (
            <div key={d.date} style={{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: i === 0 ? '#F59E0B' : '#94A3B8' }}>{d.date}{i === 0 ? ' (Latest)' : ''}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#64748B' }}>Jackpot: ${Math.round(d.jackpot / 1e6)}M</span>
              </div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {d.numbers.map(n => (
                  <div key={n} style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#0F172A', fontFamily: 'var(--mono)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{n}</div>
                ))}
                <span style={{ color: '#374151', fontSize: 10, margin: '0 2px' }}>+</span>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', fontFamily: 'var(--mono)', boxShadow: '0 2px 6px rgba(245,158,11,0.3)' }}>{d.specialBall}</div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#64748B', marginLeft: 8 }}>Megaplier {d.multiplier}x</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 16 }}>Verify results at megamillions.com · NOT financial advice</p>
      </div>
    </div>
  );
}
