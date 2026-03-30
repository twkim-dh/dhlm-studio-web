'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

function FortuneBuddha({ glowing, sticks = 1 }: { glowing: boolean; sticks: number }) {
  return (
    <div style={{ position: 'relative', width: 200, height: 240, margin: '0 auto' }}>
      {glowing && <div style={{ position: 'absolute', top: 10, left: 0, right: 0, bottom: 30, background: 'radial-gradient(ellipse, #D4A84325 0%, transparent 70%)', borderRadius: '50%', animation: 'glow 2s ease-in-out infinite' }} />}
      <svg viewBox="0 0 200 240" width="200" height="240" style={{ position: 'relative', zIndex: 1 }}>
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#E8C86A"/><stop offset="100%" stopColor="#B8922E"/></linearGradient>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#B8922E"/><stop offset="100%" stopColor="#8B6914"/></linearGradient>
        </defs>
        {glowing && <circle cx="100" cy="90" r="80" fill="none" stroke="#D4A84312" strokeWidth="1" strokeDasharray="4 4" style={{animation:'spin 20s linear infinite',transformOrigin:'100px 90px'}}/>}
        <ellipse cx="100" cy="205" rx="55" ry="14" fill="#1E293B"/>
        <ellipse cx="100" cy="150" rx="40" ry="45" fill="url(#g1)"/>
        <circle cx="100" cy="80" r="30" fill="url(#g1)"/>
        {[72,85,100,115,128].map((x,i)=><circle key={i} cx={x} cy={55} r={5} fill="url(#g2)"/>)}
        {[80,95,110,120].map((x,i)=><circle key={i} cx={x} cy={48} r={4} fill="url(#g2)"/>)}
        <circle cx="100" cy="43" r={4} fill="url(#g2)"/>
        <path d="M87 78 Q92 82 98 78" fill="none" stroke="#8B6914" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M102 78 Q107 82 113 78" fill="none" stroke="#8B6914" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M91 92 Q100 99 109 92" fill="none" stroke="#8B6914" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="100" cy="68" r="2" fill="#E8C86A"/>
        <ellipse cx="68" cy="80" rx="4" ry="12" fill="url(#g1)"/>
        <ellipse cx="132" cy="80" rx="4" ry="12" fill="url(#g1)"/>
        <circle cx="100" cy="168" r="8" fill="#E8C86A" stroke="#B8922E" strokeWidth="0.8"/>
        <text x="100" y="172" textAnchor="middle" fontSize="9" fontWeight="900" fill="#8B6914" fontFamily="serif">$</text>
        {sticks>=1&&<><line x1="50" y1="195" x2="50" y2="160" stroke="#C4956A" strokeWidth="1.2"/><circle cx="50" cy="158" r="1.5" fill="#FF6B35"/>{glowing&&<path d="M50 155 Q46 142 50 128" fill="none" stroke="#94A3B850" strokeWidth="0.6"/>}</>}
        {sticks>=2&&<><line x1="100" y1="200" x2="100" y2="182" stroke="#C4956A" strokeWidth="1.2"/><circle cx="100" cy="180" r="1.5" fill="#FF6B35"/>{glowing&&<path d="M100 177 Q96 165 100 152" fill="none" stroke="#94A3B850" strokeWidth="0.6"/>}</>}
        {sticks>=3&&<><line x1="150" y1="195" x2="150" y2="160" stroke="#C4956A" strokeWidth="1.2"/><circle cx="150" cy="158" r="1.5" fill="#FF6B35"/>{glowing&&<path d="M150 155 Q146 142 150 128" fill="none" stroke="#94A3B850" strokeWidth="0.6"/>}</>}
        {glowing&&<><text x="30" y="50" fontSize="11" fill="#D4A843" style={{animation:'twinkle 1.5s ease infinite'}}>✦</text><text x="165" y="45" fontSize="9" fill="#E8C86A" style={{animation:'twinkle 2s ease infinite'}}>✧</text><text x="100" y="28" fontSize="13" fill="#D4A843" style={{animation:'twinkle 1.2s ease infinite'}}>✶</text></>}
      </svg>
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
  const [blessingText, setBlessingText] = useState('');
  const [fortune, setFortune] = useState('');
  const [totalDonated, setTotalDonated] = useState(18247);
  const [totalBlessings, setTotalBlessings] = useState(14892);
  const sticks = amount >= 10 ? 3 : amount >= 3 ? 2 : 1;

  useEffect(() => { const i = setInterval(() => { setTotalDonated(p => p + Math.floor(Math.random() * 3)); setTotalBlessings(p => p + Math.floor(Math.random() * 2)); }, 7000); return () => clearInterval(i); }, []);

  const bless = () => {
    if (!ticker.trim()) return;
    setStep('blessing'); setGlowing(true);
    setTimeout(() => {
      setBlessingText(BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)]);
      setFortune(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
      setTotalDonated(p => p + amount); setTotalBlessings(p => p + 1); setStep('done');
      setTimeout(() => setGlowing(false), 4000);
    }, 3000);
  };

  const reset = () => { setTicker(''); setName(''); setMessage(''); setAmount(1); setBlessingText(''); setFortune(''); setStep('input'); setGlowing(false); };

  return (
    <div style={{ background: '#0B0F19', color: '#F1F5F9', minHeight: '100vh' }}>
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

        <FortuneBuddha glowing={glowing} sticks={step === 'input' ? sticks : 3} />

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
            <button onClick={reset} style={{ marginTop: 8, padding: '10px 20px', borderRadius: 10, background: 'transparent', border: '1px solid #D4A84330', color: '#D4A843', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>🪷 Bless Another Stock</button>
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
        @keyframes glow{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.6;transform:scale(1.05)}}
        @keyframes twinkle{0%,100%{opacity:.2}50%{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes loading{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        input::placeholder{color:#475569}
      `}</style>
    </div>
  );
}
