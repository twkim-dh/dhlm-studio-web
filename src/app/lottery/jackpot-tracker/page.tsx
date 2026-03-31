import type { Metadata } from 'next';
import Link from 'next/link';
import { JACKPOT_INFO, POWERBALL_DRAWS, MEGAMILLIONS_DRAWS } from '@/data/lottery';

export const metadata: Metadata = {
  title: 'Lottery Jackpot Tracker — Powerball & Mega Millions | DHLM Studio',
  description: 'Live Powerball and Mega Millions jackpot amounts. Track jackpot growth, next draw dates, and estimated cash values.',
};

const fmtJackpot = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : `$${Math.round(n / 1e6)}M`;

function JackpotRoast({ amount }: { amount: number }) {
  if (amount >= 1e9) return <p style={{ fontSize: 12, color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.7, margin: '12px 0 0' }}>&ldquo;ONE BILLION DOLLARS. Even I&apos;m impressed. The whole country is buying tickets. You know what that means? Even WORSE odds because of splits. VERY SAD. But the dream is worth $2, I suppose.&rdquo;</p>;
  if (amount >= 500e6) return <p style={{ fontSize: 12, color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.7, margin: '12px 0 0' }}>&ldquo;HALF A BILLION. Now we&apos;re talking. This is the kind of money that makes SMART people do STUPID things. The odds are still 1 in 292 million, but your HEART says &apos;maybe.&apos; Your heart is WRONG. Probably.&rdquo;</p>;
  if (amount >= 300e6) return <p style={{ fontSize: 12, color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.7, margin: '12px 0 0' }}>&ldquo;{fmtJackpot(amount)}? Not bad. Not GREAT, but not bad. You have a better chance of being struck by lightning TWICE. But someone&apos;s gotta win, right? NOT YOU. Statistically. But I&apos;d play anyway.&rdquo;</p>;
  return <p style={{ fontSize: 12, color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.7, margin: '12px 0 0' }}>&ldquo;{fmtJackpot(amount)}. BORING jackpot. Call me when it hits $500 million. THEN we&apos;ll talk. Right now this is barely enough to buy a DECENT yacht.&rdquo;</p>;
}

export default function JackpotTracker() {
  const pbHistory = POWERBALL_DRAWS.slice(0, 5);
  const mmHistory = MEGAMILLIONS_DRAWS.slice(0, 5);
  const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#00D474', letterSpacing: 3, marginBottom: 6 }}>💰 JACKPOT TRACKER · LIVE</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Jackpot Tracker</h1>
          </div>
          <Link href="/lottery" style={{ fontSize: 12, color: '#64748B' }}>← Lottery</Link>
        </div>

        {/* Jackpot Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
          {/* Powerball */}
          <div style={{ ...card, padding: 28, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#EF4444' }} />
            <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700, color: '#EF4444', marginBottom: 4 }}>🔴 POWERBALL</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 900, color: '#F1F5F9' }}>{fmtJackpot(JACKPOT_INFO.powerball.current)}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Est. Cash Value: {fmtJackpot(JACKPOT_INFO.powerball.current * 0.47)}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>Next: {JACKPOT_INFO.powerball.nextDay}, {JACKPOT_INFO.powerball.nextDraw}</div>
            <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: '#C73E3A08', border: '1px solid #C73E3A15' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#C73E3A', letterSpacing: 1, marginBottom: 4 }}>🔥 BRUTAL AI TAKE</div>
              <JackpotRoast amount={JACKPOT_INFO.powerball.current} />
            </div>
          </div>

          {/* Mega Millions */}
          <div style={{ ...card, padding: 28, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#F59E0B' }} />
            <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>🟡 MEGA MILLIONS</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 900, color: '#F1F5F9' }}>{fmtJackpot(JACKPOT_INFO.megamillions.current)}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Est. Cash Value: {fmtJackpot(JACKPOT_INFO.megamillions.current * 0.47)}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>Next: {JACKPOT_INFO.megamillions.nextDay}, {JACKPOT_INFO.megamillions.nextDraw}</div>
            <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: '#C73E3A08', border: '1px solid #C73E3A15' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#C73E3A', letterSpacing: 1, marginBottom: 4 }}>🔥 BRUTAL AI TAKE</div>
              <JackpotRoast amount={JACKPOT_INFO.megamillions.current} />
            </div>
          </div>
        </div>

        {/* Recent Draws */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <div style={{ ...card, padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#EF4444', letterSpacing: 2, marginBottom: 12 }}>RECENT POWERBALL</div>
            {pbHistory.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < pbHistory.length - 1 ? '1px solid #1E293B' : 'none' }}>
                <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--mono)', width: 80 }}>{d.date}</span>
                <span style={{ fontSize: 11, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{d.numbers.join('-')} <span style={{ color: '#EF4444', fontWeight: 700 }}>PB:{d.specialBall}</span></span>
              </div>
            ))}
          </div>
          <div style={{ ...card, padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#F59E0B', letterSpacing: 2, marginBottom: 12 }}>RECENT MEGA MILLIONS</div>
            {mmHistory.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < mmHistory.length - 1 ? '1px solid #1E293B' : 'none' }}>
                <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--mono)', width: 80 }}>{d.date}</span>
                <span style={{ fontSize: 11, color: '#E2E8F0', fontFamily: 'var(--mono)' }}>{d.numbers.join('-')} <span style={{ color: '#F59E0B', fontWeight: 700 }}>MB:{d.specialBall}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
