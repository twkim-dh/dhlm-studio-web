'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BLESSINGS = [
  "The Fortune Buddha smiles upon your ticker. Golden qi flows into the market. Your patience will be rewarded. 🐉✨",
  "Three incense sticks burn for your stock. The ancient spirits of prosperity have taken notice. Wealth energy activated. 🔥🪷",
  "The Buddha has consulted the cosmic ledger. Your stock carries the energy of a rising dragon. Hold with faith. 🐲✨",
  "A golden lotus blooms in your portfolio. The Fortune Buddha whispers: 'The wise investor waits.' 🪷💰",
  "Your offering pleases the spirits. Ten thousand golden coins spiral toward your ticker. ✨🪙",
  "The sacred smoke carries your prayer to the Heavenly Exchange. The Buddha nods: 'It shall rise.' 🙏🔮",
  "Karma flows in your favor. The Buddha has placed a celestial buy order on your behalf. The universe is long. 🌏✨",
  "Ancient fortune energy surrounds your stock like a protective dragon. Bears cannot touch what the Buddha guards. 🐲🛡️",
];

const FORTUNES = [
  "A wise trader once said: 'Buy fear, sell greed.' The Buddha says: 'Buy dip, eat ramen.' 🍜",
  "Your lucky numbers today: your stock price, but higher. ⬆️",
  "Confucius say: 'Man who buys at the top must have very strong hands.' 💎🙌",
  "The bamboo that bends is stronger than the oak. So too is the portfolio that diversifies. 🎋",
  "Ancient proverb: 'The best time to invest was yesterday. Second best is after reading this.' 📜",
  "The crane stands on one leg, balanced and patient. Your stock will also stand. Eventually. 🦩",
];

const RECENT = [
  { name: 'Mike T.', ticker: 'TSLA', amount: 1, time: '2m', msg: 'Elon needs Buddha energy 🙏' },
  { name: 'Sarah K.', ticker: 'NVDA', amount: 5, time: '5m', msg: 'Jensen bless my GPU gains' },
  { name: 'Anonymous', ticker: 'GME', amount: 1, time: '8m', msg: 'Apes seek enlightenment' },
  { name: 'David R.', ticker: 'AAPL', amount: 3, time: '12m', msg: 'One more thing... profits' },
  { name: 'Jenny L.', ticker: 'PLTR', amount: 1, time: '18m', msg: 'Karp needs inner peace' },
  { name: 'Chris P.', ticker: 'IONQ', amount: 2, time: '25m', msg: 'Quantum karma please' },
];

/* ═══ Incense Smoke Overlay ═══ */
function IncenseSmoke({ intensity = 1 }: { intensity?: number }) {
  const baseSmoke = [
    { left: '14%', delay: '0s', dur: '4s', drift: '-8px' },
    { left: '17%', delay: '1.5s', dur: '5s', drift: '6px' },
    { left: '12%', delay: '3s', dur: '4.5s', drift: '-12px' },
    { left: '16%', delay: '0.8s', dur: '5.5s', drift: '10px' },
    { left: '83%', delay: '0.5s', dur: '4.5s', drift: '8px' },
    { left: '86%', delay: '2s', dur: '5s', drift: '-6px' },
    { left: '81%', delay: '3.5s', dur: '4s', drift: '12px' },
    { left: '84%', delay: '1.2s', dur: '5.5s', drift: '-10px' },
  ];
  const extra = [
    { left: '15%', delay: '0.3s', dur: '3.8s', drift: '-15px' },
    { left: '19%', delay: '2.5s', dur: '4.2s', drift: '14px' },
    { left: '80%', delay: '1s', dur: '3.5s', drift: '15px' },
    { left: '87%', delay: '2.8s', dur: '4.8s', drift: '-14px' },
  ];
  const particles = intensity >= 2 ? [...baseSmoke, ...extra] : baseSmoke;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 20 }}>
      {particles.map((p, i) => (
        <div key={i} className="smoke-strand" style={{
          position: 'absolute', bottom: '22%', left: p.left,
          width: 12, height: 32, borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(212,168,67,${0.12 * intensity}), rgba(180,160,120,${0.06 * intensity}), transparent)`,
          filter: `blur(${3 + intensity}px)`,
          animationDelay: p.delay,
          animationDuration: p.dur,
          // @ts-expect-error CSS custom property
          '--drift': p.drift,
        }} />
      ))}
    </div>
  );
}

/* ═══ Fortune Buddha — High-Quality PNG Image ═══ */
function FortuneBuddha({ glowing, blessing, smokeIntensity = 1 }: { glowing: boolean; blessing: boolean; smokeIntensity?: number }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 320, margin: '0 auto' }}>
      {/* Outer glow — blessing state */}
      {glowing && (
        <div className="buddha-glow" style={{
          position: 'absolute', inset: '-20%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,67,0.3) 0%, rgba(212,168,67,0.1) 40%, transparent 70%)',
        }} />
      )}

      {/* Incense smoke overlay — always visible */}
      <IncenseSmoke intensity={blessing ? smokeIntensity * 2 : smokeIntensity} />

      {/* Gold particles — blessing animation */}
      {blessing && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="particle" style={{
              position: 'absolute',
              left: `${15 + Math.random() * 70}%`,
              bottom: '15%',
              width: 3 + Math.random() * 5,
              height: 3 + Math.random() * 5,
              background: `radial-gradient(circle, ${['#E8C86A', '#F5E6A3', '#D4A843', '#FFD700'][i % 4]}, transparent)`,
              borderRadius: '50%',
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${2 + Math.random() * 2.5}s`,
            }} />
          ))}
        </div>
      )}

      {/* Floating coins — blessing */}
      {blessing && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} className="coin" style={{
              position: 'absolute', left: `${10 + i * 18}%`, bottom: '10%',
              fontSize: 18, animationDelay: `${i * 0.3}s`,
            }}>🪙</div>
          ))}
        </div>
      )}

      {/* Buddha Image */}
      <Image
        src="/images/fortune-buddha.webp"
        alt="Fortune Buddha - Bless your stock"
        width={640}
        height={640}
        className="buddha-float"
        style={{
          position: 'relative', zIndex: 2, width: '100%', height: 'auto',
          transition: 'all 0.7s ease',
          transform: blessing ? 'scale(1.04)' : 'scale(1)',
          filter: blessing
            ? 'brightness(1.15) saturate(1.2) drop-shadow(0 0 40px rgba(212,168,67,0.5))'
            : glowing
              ? 'brightness(1.08) drop-shadow(0 0 25px rgba(212,168,67,0.3))'
              : 'brightness(1) drop-shadow(0 0 15px rgba(212,168,67,0.15))',
        }}
        priority
      />

      {/* Bottom light reflection — blessing */}
      {blessing && (
        <div style={{
          position: 'absolute', bottom: '2%', left: '15%', right: '15%', height: 20,
          borderRadius: '50%', zIndex: 3,
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.35) 0%, transparent 70%)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      )}
    </div>
  );
}

export default function BlessMyStock() {
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(1);
  const [step, setStep] = useState<'input'|'blessing'|'done'>('input');
  const [glowing, setGlowing] = useState(false);
  const [blessing, setBlessing] = useState(false);
  const [blessingText, setBlessingText] = useState('');
  const [fortune, setFortune] = useState('');
  const [totalDonated, setTotalDonated] = useState(18247);
  const [totalBlessings, setTotalBlessings] = useState(14892);
  const sticks = amount >= 10 ? 3 : amount >= 3 ? 2 : 1;

  useEffect(() => { const i = setInterval(() => { setTotalDonated(p => p + Math.floor(Math.random() * 3)); setTotalBlessings(p => p + Math.floor(Math.random() * 2)); }, 7000); return () => clearInterval(i); }, []);

  const bless = () => {
    if (!ticker.trim()) return;
    setStep('blessing'); setGlowing(true); setBlessing(true);
    setTimeout(() => {
      setBlessingText(BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)]);
      setFortune(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
      setTotalDonated(p => p + amount); setTotalBlessings(p => p + 1);
      setStep('done'); setBlessing(false);
      setTimeout(() => setGlowing(false), 5000);
    }, 3000);
  };

  const share = () => {
    const text = `🪷 I just blessed $${ticker} with the Fortune Buddha on DHLM Studio.\n\n$${amount} donated to St. Jude Children's Hospital ❤️\n\nBless your stock →`;
    const url = `https://dhlm-studio.com/markets/bless`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const reset = () => { setTicker(''); setName(''); setMessage(''); setAmount(1); setBlessingText(''); setFortune(''); setStep('input'); setGlowing(false); setBlessing(false); };

  return (
    <div style={{ background: '#0C1222', color: '#F1F5F9', minHeight: '100vh' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '80px 16px 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <Link href="/markets" style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>DHLM</Link>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#C73E3A', letterSpacing: 2, marginLeft: 4 }}>STUDIO</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 4, marginBottom: 8 }}>🪷 ANCIENT WALL STREET RITUAL 🪷</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 900, color: '#F1F5F9', margin: '0 0 4px' }}>Bless My <span style={{ color: '#D4A843' }}>Stock</span></h1>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: '6px 0 0' }}>Light incense before the <span style={{ color: '#D4A843' }}>Fortune Buddha</span>.<br/>Your offering goes <strong style={{ color: '#00D474' }}>100% to charity</strong>.</p>
        </div>

        <FortuneBuddha glowing={glowing} blessing={blessing} smokeIntensity={amount >= 10 ? 3 : amount >= 5 ? 2.5 : amount >= 3 ? 1.8 : 1} />

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '8px 0 20px' }}>
          <div style={{ padding: '8px 16px', borderRadius: 10, background: '#111827', border: '1px solid #D4A84320', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 900, color: '#D4A843' }}>${totalDonated.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: '#6B7280' }}>Donated to Charity</div>
          </div>
          <div style={{ padding: '8px 16px', borderRadius: 10, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 900, color: '#E2E8F0' }}>{totalBlessings.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: '#6B7280' }}>Stocks Blessed</div>
          </div>
        </div>

        {/* Input Step */}
        {step === 'input' && (
          <div style={{ background: '#111827', borderRadius: 18, padding: 22, border: '1px solid #1E293B' }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: '#D4A843', fontFamily: 'var(--mono)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>STOCK TICKER *</label>
              <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="AAPL, TSLA, NVDA..." maxLength={6}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B', color: '#F1F5F9', fontSize: 20, fontWeight: 800, fontFamily: 'var(--mono)', outline: 'none', letterSpacing: 3, boxSizing: 'border-box', textAlign: 'center' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--mono)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>YOUR NAME</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Anonymous"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B', color: '#E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--mono)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>YOUR PRAYER</label>
              <input value={message} onChange={e => setMessage(e.target.value)} placeholder="To the moon! 🚀" maxLength={80}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B', color: '#E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: '#D4A843', fontFamily: 'var(--mono)', letterSpacing: 1, display: 'block', marginBottom: 5 }}>INCENSE OFFERING</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ a: 1, l: '1 Stick', e: '🪔' }, { a: 3, l: '3 Sticks', e: '🪔🪔' }, { a: 5, l: '5 Sticks', e: '🪔🪔🪔' }, { a: 10, l: 'Bundle', e: '🔥' }].map(x => (
                  <button key={x.a} onClick={() => setAmount(x.a)} style={{ flex: 1, padding: '10px 4px', borderRadius: 10, background: amount === x.a ? '#D4A84318' : '#0D1117', border: amount === x.a ? '2px solid #D4A843' : '1px solid #1E293B', color: amount === x.a ? '#D4A843' : '#6B7280', cursor: 'pointer' }}>
                    <div style={{ fontSize: 14 }}>{x.e}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, fontFamily: 'var(--mono)', marginTop: 2 }}>${x.a}</div>
                    <div style={{ fontSize: 8, marginTop: 1 }}>{x.l}</div>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 9, color: '#475569', marginTop: 6, textAlign: 'center' }}>More incense = stronger blessing energy (probably)</div>
            </div>
            <button onClick={bless} disabled={!ticker.trim()} style={{ width: '100%', padding: '16px 0', borderRadius: 14, background: ticker.trim() ? 'linear-gradient(135deg,#D4A843,#E8C86A)' : '#1E293B', color: ticker.trim() ? '#0D1117' : '#475569', border: 'none', fontWeight: 900, fontSize: 16, cursor: ticker.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: ticker.trim() ? '0 4px 20px #D4A84340' : 'none' }}>
              🪷 Light Incense for {ticker || '...'} — ${amount}
            </button>
          </div>
        )}

        {/* Blessing animation */}
        {step === 'blessing' && (
          <div style={{ background: '#111827', borderRadius: 18, padding: '48px 24px', border: '1px solid #D4A84330', textAlign: 'center' }}>
            <div style={{ fontSize: 16, color: '#D4A843', fontFamily: 'var(--mono)', letterSpacing: 3, marginBottom: 8, animation: 'pulse 1.5s ease infinite' }}>🪷 · 🪷 · 🪷</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#D4A843', marginBottom: 6 }}>The Fortune Buddha meditates...</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>Channeling prosperity energy to <span style={{ color: '#60A5FA', fontWeight: 700, fontFamily: 'var(--mono)' }}>{ticker}</span></div>
            <div style={{ marginTop: 20, width: 80, height: 3, borderRadius: 2, background: '#1E293B', margin: '20px auto 0', overflow: 'hidden' }}><div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#D4A843,#E8C86A)', animation: 'loading 2.5s ease-in-out' }} /></div>
          </div>
        )}

        {/* Result */}
        {step === 'done' && (
          <div style={{ background: '#D4A84308', borderRadius: 18, padding: '28px 22px', border: '1px solid #D4A84325', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✨🪷✨</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900, color: '#D4A843', marginBottom: 4 }}>BLESSING COMPLETE</div>
            <div style={{ padding: '14px 16px', borderRadius: 12, margin: '12px 0', background: '#0D111780', border: '1px solid #D4A84315' }}>
              <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>"{blessingText}"</p>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 10, margin: '0 0 14px', background: '#1E293B50', border: '1px dashed #D4A84330' }}>
              <div style={{ fontSize: 9, color: '#D4A843', fontFamily: 'var(--mono)', letterSpacing: 2, marginBottom: 4 }}>🥠 FORTUNE COOKIE</div>
              <p style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{fortune}"</p>
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '14px 0' }}>
              <div style={{ padding: '8px 12px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}><div style={{ fontSize: 8, color: '#6B7280', fontFamily: 'var(--mono)' }}>TICKER</div><div style={{ fontSize: 16, fontWeight: 800, color: '#60A5FA', fontFamily: 'var(--mono)' }}>{ticker}</div></div>
              <div style={{ padding: '8px 12px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}><div style={{ fontSize: 8, color: '#6B7280', fontFamily: 'var(--mono)' }}>DONATED</div><div style={{ fontSize: 16, fontWeight: 800, color: '#D4A843', fontFamily: 'var(--mono)' }}>${amount}</div></div>
              <div style={{ padding: '8px 12px', borderRadius: 8, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}><div style={{ fontSize: 8, color: '#6B7280', fontFamily: 'var(--mono)' }}>BY</div><div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{name || 'Anonymous'}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={share} style={{ padding: '10px 20px', borderRadius: 10, background: '#1D9BF0', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                Share on 𝕏
              </button>
              <button onClick={reset} style={{ padding: '10px 20px', borderRadius: 10, background: 'transparent', border: '1px solid #D4A84330', color: '#D4A843', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>🪷 Bless Another</button>
            </div>
          </div>
        )}

        {/* Live Feed */}
        <div style={{ marginTop: 18, background: '#111827', borderRadius: 14, border: '1px solid #1E293B', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2 }}>RECENT BLESSINGS</span>
            <span style={{ fontSize: 9, color: '#00D474', fontFamily: 'var(--mono)' }}>● LIVE</span>
          </div>
          <div style={{ maxHeight: 200, overflow: 'auto' }}>
            {RECENT.map((b, i) => (
              <div key={i} style={{ padding: '8px 16px', borderBottom: '1px solid #1E293B15', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>🪷</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#E2E8F0' }}>{b.name}</span>
                  <span style={{ fontSize: 10, color: '#475569' }}> blessed </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#60A5FA', fontFamily: 'var(--mono)' }}>{b.ticker}</span>
                  <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{b.msg}"</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#D4A843', fontFamily: 'var(--mono)' }}>${b.amount}</div>
                  <div style={{ fontSize: 8, color: '#475569' }}>{b.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charity */}
        <div style={{ marginTop: 14, padding: '16px 18px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>❤️</span>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>100% Goes to Charity</div><div style={{ fontSize: 10, color: '#6B7280' }}>DHLM Studio keeps zero profit</div></div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 8, background: '#0D1117', fontSize: 11, color: '#94A3B8', lineHeight: 1.6 }}>
            All donations go directly to <strong style={{ color: '#E2E8F0' }}>St. Jude Children&apos;s Research Hospital</strong> — families never receive a bill.
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#00D47412', color: '#00D474', fontFamily: 'var(--mono)' }}>✓ 501(c)(3)</span>
            <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#3B82F612', color: '#3B82F6', fontFamily: 'var(--mono)' }}>✓ Tax Deductible</span>
            <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: '#D4A84312', color: '#D4A843', fontFamily: 'var(--mono)' }}>✓ 0% to DHLM</span>
          </div>
          <a href="https://www.stjude.org/donate" target="_blank" rel="noopener noreferrer"
            style={{ display: 'block', marginTop: 10, padding: '10px 0', borderRadius: 10, background: '#C73E3A', color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>
            ❤️ Donate Directly to St. Jude
          </a>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: '#C73E3A06', border: '1px solid #C73E3A10' }}>
          <p style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.7, textAlign: 'center', margin: 0 }}>
            🪷 <strong style={{ color: '#94A3B8' }}>Bless My Stock</strong> is satirical entertainment. The Fortune Buddha cannot actually influence markets (we think). <strong style={{ color: '#C73E3A' }}>NOT investment advice.</strong>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes loading{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        input::placeholder{color:#475569}

        /* Buddha subtle float */
        .buddha-float { animation: buddhaFloat 4s ease-in-out infinite; }
        @keyframes buddhaFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

        /* Outer glow pulse */
        .buddha-glow { animation: glowPulse 2s ease-in-out infinite; }
        @keyframes glowPulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }

        /* Particles — float up */
        .particle { animation: particleUp 2.5s ease-out infinite; }
        @keyframes particleUp {
          0% { opacity:0; transform:translateY(0) scale(0); }
          15% { opacity:1; transform:translateY(-30px) scale(1); }
          100% { opacity:0; transform:translateY(-160px) scale(0.2); }
        }

        /* Coins — float up with wobble */
        .coin { animation: coinUp 3s ease-out forwards; }
        @keyframes coinUp {
          0% { opacity:0; transform:translateY(0) rotate(0deg); }
          20% { opacity:1; }
          100% { opacity:0; transform:translateY(-200px) rotate(360deg); }
        }

        /* Incense smoke — S-curve rise */
        .smoke-strand { animation: smokeRise var(--dur, 4s) ease-out infinite; }
        @keyframes smokeRise {
          0% { opacity:0; transform:translateY(0) translateX(0) scale(0.5); }
          15% { opacity:0.7; transform:translateY(-20px) translateX(calc(var(--drift) * 0.3)) scale(0.8); }
          40% { opacity:0.45; transform:translateY(-55px) translateX(calc(var(--drift) * -0.5)) scale(1); }
          70% { opacity:0.2; transform:translateY(-95px) translateX(calc(var(--drift) * 0.8)) scale(1.3); }
          100% { opacity:0; transform:translateY(-140px) translateX(var(--drift)) scale(1.5); }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .buddha-float, .buddha-glow, .particle, .coin, .smoke-strand {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
