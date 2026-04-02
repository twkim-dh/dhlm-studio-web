import type { Metadata } from 'next';
import Link from 'next/link';
import { JACKPOT_INFO, POWERBALL_DRAWS, MEGAMILLIONS_DRAWS } from '@/data/lottery';

export const metadata: Metadata = {
  title: 'US Lottery — Powerball & Mega Millions Results | DHLM Studio',
  description: 'Live Powerball and Mega Millions jackpot tracker, winning numbers, statistics, and number generator. Updated after every draw.',
};

const YEAR = new Date().getFullYear();
const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };
const lotteryJsonLd = { "@context": "https://schema.org", "@type": "WebPage", name: "US Lottery — Powerball & Mega Millions", url: "https://dhlm-studio.com/lottery", description: "Live Powerball and Mega Millions jackpot tracker, results, and number generator." };
const fmtJackpot = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : `$${Math.round(n / 1e6)}M`;

function BallPB({ num, special }: { num: number; special?: boolean }) {
  return (
    <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 14, color: '#fff', fontFamily: 'var(--mono)',
      background: special ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #F1F5F9, #CBD5E1)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      ...(special ? {} : { color: '#0F172A' }),
    }}>{num}</div>
  );
}

function BallMM({ num, special }: { num: number; special?: boolean }) {
  return (
    <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 14, color: special ? '#fff' : '#0F172A', fontFamily: 'var(--mono)',
      background: special ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #F1F5F9, #CBD5E1)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    }}>{num}</div>
  );
}

// BallPB, BallMM are local to this page — not exported (Next.js route constraint)

export default function LotteryHub() {
  const pb = POWERBALL_DRAWS[0];
  const mm = MEGAMILLIONS_DRAWS[0];

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lotteryJsonLd) }} />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>🎰 US LOTTERY · {YEAR}</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Powerball & Mega Millions</h1>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 6 }}>Live jackpots, winning numbers, statistics & number generator</p>
        </div>

        {/* Jackpot Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
          {/* Powerball */}
          <Link href="/lottery/powerball" style={{ ...card, padding: 24, textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#EF4444' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>PB</div>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>Powerball</span>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 900, color: '#EF4444' }}>{fmtJackpot(JACKPOT_INFO.powerball.current)}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Next Draw: {JACKPOT_INFO.powerball.nextDay}, {JACKPOT_INFO.powerball.nextDraw}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
              {pb.numbers.map(n => <BallPB key={n} num={n} />)}
              <span style={{ color: '#374151', margin: '0 2px', alignSelf: 'center', fontSize: 10 }}>+</span>
              <BallPB num={pb.specialBall} special />
            </div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 6 }}>{pb.date} · Power Play {pb.multiplier}x</div>
          </Link>

          {/* Mega Millions */}
          <Link href="/lottery/mega-millions" style={{ ...card, padding: 24, textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#F59E0B' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>MM</div>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>Mega Millions</span>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 900, color: '#F59E0B' }}>{fmtJackpot(JACKPOT_INFO.megamillions.current)}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Next Draw: {JACKPOT_INFO.megamillions.nextDay}, {JACKPOT_INFO.megamillions.nextDraw}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
              {mm.numbers.map(n => <BallMM key={n} num={n} />)}
              <span style={{ color: '#374151', margin: '0 2px', alignSelf: 'center', fontSize: 10 }}>+</span>
              <BallMM num={mm.specialBall} special />
            </div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 6 }}>{mm.date} · Megaplier {mm.multiplier}x</div>
          </Link>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 24 }}>
          {[
            { href: '/lottery/jackpot-tracker', icon: '💰', title: 'Jackpot Tracker', desc: 'Real-time jackpot amounts', color: '#00D474' },
            { href: '/lottery/number-generator', icon: '🎲', title: 'Number Generator', desc: 'Generate your lucky numbers', color: '#A78BFA' },
            { href: '/lottery/powerball', icon: '🔴', title: 'Powerball Results', desc: 'Latest winning numbers', color: '#EF4444' },
            { href: '/lottery/mega-millions', icon: '🟡', title: 'Mega Millions', desc: 'Latest winning numbers', color: '#F59E0B' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ ...card, padding: '16px 18px', textDecoration: 'none' }}>
              <span style={{ fontSize: 20 }}>{l.icon}</span>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700, color: l.color, marginTop: 6 }}>{l.title}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{l.desc}</div>
            </Link>
          ))}
        </div>

        {/* Odds info */}
        <div style={{ ...card, padding: '18px 22px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 10 }}>JACKPOT ODDS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12, color: '#94A3B8' }}>
            <div><strong style={{ color: '#EF4444' }}>Powerball:</strong> 1 in 292,201,338</div>
            <div><strong style={{ color: '#F59E0B' }}>Mega Millions:</strong> 1 in 302,575,350</div>
          </div>
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 16 }}>
          Lottery results are for informational purposes only. Always verify with official lottery websites.
        </p>
      </div>
    </div>
  );
}
