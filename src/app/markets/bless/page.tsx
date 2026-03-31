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

/* ═══ Fortune Buddha — Production Quality SVG ═══ */
function FortuneBuddha({ glowing, blessing, sticks = 1 }: { glowing: boolean; blessing: boolean; sticks: number }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 320, margin: '0 auto', aspectRatio: '320/420' }}>
      {/* Glow backdrop */}
      <div style={{
        position: 'absolute', top: '5%', left: '10%', right: '10%', bottom: '20%',
        background: `radial-gradient(ellipse, ${glowing ? '#D4A84340' : '#D4A84315'} 0%, transparent 70%)`,
        borderRadius: '50%',
        transition: 'background 0.8s ease',
        filter: glowing ? 'blur(20px)' : 'blur(10px)',
      }} />

      {/* Particles — active during blessing */}
      {blessing && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="particle" style={{
              position: 'absolute',
              left: `${20 + Math.random() * 60}%`,
              bottom: '30%',
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
              background: `radial-gradient(circle, ${['#E8C86A', '#F5E6A3', '#D4A843', '#FFD700'][i % 4]}, transparent)`,
              borderRadius: '50%',
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }} />
          ))}
        </div>
      )}

      {/* Floating coins — during blessing */}
      {blessing && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="coin" style={{
              position: 'absolute',
              left: `${15 + i * 16}%`,
              bottom: '25%',
              fontSize: 16,
              animationDelay: `${i * 0.3}s`,
            }}>🪙</div>
          ))}
        </div>
      )}

      <svg viewBox="0 0 320 420" width="100%" height="100%" style={{ position: 'relative', zIndex: 2 }}>
        <defs>
          {/* Gold gradients — 3 levels */}
          <radialGradient id="bGold" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F5E6A3"/>
            <stop offset="40%" stopColor="#D4A843"/>
            <stop offset="100%" stopColor="#8B6914"/>
          </radialGradient>
          <radialGradient id="bGoldBody" cx="45%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#EEDFA0"/>
            <stop offset="35%" stopColor="#D4A843"/>
            <stop offset="75%" stopColor="#A07D2E"/>
            <stop offset="100%" stopColor="#7A5F1A"/>
          </radialGradient>
          <linearGradient id="bGoldLotus" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C86A"/>
            <stop offset="50%" stopColor="#D4A843"/>
            <stop offset="100%" stopColor="#8B6914"/>
          </linearGradient>
          <linearGradient id="bHalo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A843"/>
            <stop offset="100%" stopColor="#E8C86A"/>
          </linearGradient>
          <radialGradient id="bFlame" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FFA040"/>
            <stop offset="60%" stopColor="#FF6B35"/>
            <stop offset="100%" stopColor="#CC3300"/>
          </radialGradient>
          {/* Glow filter */}
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000060"/>
          </filter>
        </defs>

        {/* ── Mandala / Halo ── */}
        <g className="halo" style={{ transformOrigin: '160px 165px' }}>
          {/* Outer ring */}
          <circle cx="160" cy="165" r="120" fill="none" stroke="url(#bHalo)"
            strokeWidth="0.8" opacity={glowing ? 0.6 : 0.2} strokeDasharray="3 6"/>
          {/* Middle ring with lotus pattern */}
          <circle cx="160" cy="165" r="105" fill="none" stroke="url(#bHalo)"
            strokeWidth="0.5" opacity={glowing ? 0.5 : 0.15} strokeDasharray="8 4 2 4"/>
          {/* Inner glow ring */}
          <circle cx="160" cy="165" r="88" fill="none" stroke="#D4A843"
            strokeWidth="1.2" opacity={glowing ? 0.4 : 0.1}/>
          {/* Radiating lines */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5) * Math.PI / 180;
            const x1 = 160 + Math.cos(angle) * 90;
            const y1 = 165 + Math.sin(angle) * 90;
            const x2 = 160 + Math.cos(angle) * 118;
            const y2 = 165 + Math.sin(angle) * 118;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#D4A843" strokeWidth="0.3" opacity={glowing ? 0.35 : 0.08}/>;
          })}
        </g>

        {/* ── Lotus Pedestal ── */}
        <g filter="url(#softShadow)">
          {/* Base */}
          <ellipse cx="160" cy="340" rx="70" ry="12" fill="#1E293B"/>
          {/* Lower petals */}
          {[-45, -25, -8, 8, 25, 45].map((angle, i) => (
            <path key={`lp${i}`}
              d={`M160,320 Q${160 + angle * 1.8},${310 - Math.abs(angle) * 0.3} ${160 + angle * 2.2},330 Q${160 + angle * 1.2},335 160,332`}
              fill="url(#bGoldLotus)" opacity={0.6 + i * 0.05}
              stroke="#8B6914" strokeWidth="0.3"/>
          ))}
          {/* Upper petals */}
          {[-30, -12, 12, 30].map((angle, i) => (
            <path key={`up${i}`}
              d={`M160,315 Q${160 + angle * 1.6},305 ${160 + angle * 1.8},322 Q${160 + angle * 0.8},328 160,325`}
              fill="url(#bGoldLotus)" opacity={0.7 + i * 0.05}
              stroke="#A07D2E" strokeWidth="0.3"/>
          ))}
          {/* Center cushion */}
          <ellipse cx="160" cy="318" rx="35" ry="8" fill="#B8922E"/>
          <ellipse cx="160" cy="316" rx="33" ry="7" fill="#D4A843"/>
        </g>

        {/* ── Buddha Body ── */}
        <g filter={glowing ? 'url(#goldGlow)' : undefined}>
          {/* Body (big belly Budai style) */}
          <path d="M120,310 C115,290 108,260 112,235 C116,215 125,200 135,192
                   C140,188 148,186 160,186
                   C172,186 180,188 185,192
                   C195,200 204,215 208,235
                   C212,260 205,290 200,310 Z"
            fill="url(#bGoldBody)" stroke="#8B6914" strokeWidth="0.5"/>

          {/* Belly highlight */}
          <ellipse cx="160" cy="270" rx="30" ry="25" fill="#E8C86A" opacity="0.25"/>

          {/* Robe folds */}
          <path d="M130,230 Q145,245 135,270" fill="none" stroke="#A07D2E" strokeWidth="0.8" opacity="0.5"/>
          <path d="M190,230 Q175,245 185,270" fill="none" stroke="#A07D2E" strokeWidth="0.8" opacity="0.5"/>
          <path d="M140,260 Q160,275 180,260" fill="none" stroke="#A07D2E" strokeWidth="0.6" opacity="0.4"/>
          {/* Robe collar */}
          <path d="M135,198 Q160,210 185,198" fill="none" stroke="#A07D2E" strokeWidth="1" opacity="0.6"/>
        </g>

        {/* ── Head ── */}
        <g filter={glowing ? 'url(#goldGlow)' : undefined}>
          {/* Head shape */}
          <ellipse cx="160" cy="158" rx="36" ry="40" fill="url(#bGold)"/>
          {/* Ushnisha (top bump) */}
          <circle cx="160" cy="120" r="12" fill="url(#bGold)"/>
          <circle cx="160" cy="114" r="6" fill="#E8C86A"/>
          {/* Hair bumps (curly) */}
          {[
            [140,128], [152,122], [168,122], [180,128],
            [135,140], [145,132], [160,128], [175,132], [185,140],
            [132,155], [140,148], [180,148], [188,155]
          ].map(([x, y], i) => (
            <circle key={`hb${i}`} cx={x} cy={y} r={4.5} fill="#B8922E" opacity="0.7"/>
          ))}

          {/* Ears (long, Buddha style) */}
          <path d="M123,150 C118,142 116,155 118,170 C120,180 124,182 126,175 C128,165 127,155 123,150Z"
            fill="url(#bGold)"/>
          <path d="M197,150 C202,142 204,155 202,170 C200,180 196,182 194,175 C192,165 193,155 197,150Z"
            fill="url(#bGold)"/>

          {/* Face */}
          {/* Urna (forehead dot) */}
          <circle cx="160" cy="148" r="2.5" fill="#E8C86A" stroke="#B8922E" strokeWidth="0.5"/>
          {/* Eyes (closed, happy) */}
          <path d="M145,160 Q150,156 156,160" fill="none" stroke="#7A5F1A" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M164,160 Q170,156 175,160" fill="none" stroke="#7A5F1A" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Nose */}
          <path d="M158,166 Q160,169 162,166" fill="none" stroke="#A07D2E" strokeWidth="0.8" strokeLinecap="round"/>
          {/* Smile (big, happy Budai smile) */}
          <path d="M146,174 Q153,182 160,183 Q167,182 174,174"
            fill="none" stroke="#7A5F1A" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Cheek highlights */}
          <circle cx="143" cy="172" r="4" fill="#E8C86A" opacity="0.2"/>
          <circle cx="177" cy="172" r="4" fill="#E8C86A" opacity="0.2"/>
        </g>

        {/* ── Arms ── */}
        {/* Left arm — raised in blessing (Abhaya Mudra) */}
        <path d="M126,210 C118,205 108,195 105,180 C103,170 106,165 110,168 C114,172 112,178 112,185"
          fill="url(#bGold)" stroke="#A07D2E" strokeWidth="0.5"/>
        {/* Left hand — open palm */}
        <path d="M105,180 C102,174 100,168 103,164 C106,160 110,162 112,166
                 C113,163 115,160 118,162 C120,164 119,168 117,172
                 C118,170 120,167 122,169 C123,172 121,176 118,179 Z"
          fill="url(#bGold)" stroke="#A07D2E" strokeWidth="0.3"/>

        {/* Right arm — holding gold ingot */}
        <path d="M194,210 C202,215 210,225 215,240 C218,250 214,255 210,252"
          fill="url(#bGold)" stroke="#A07D2E" strokeWidth="0.5"/>
        {/* Right hand */}
        <ellipse cx="212" cy="248" rx="8" ry="6" fill="url(#bGold)" stroke="#A07D2E" strokeWidth="0.3"/>
        {/* Gold ingot / yuanbao */}
        <path d="M202,240 L208,232 L222,232 L228,240 L222,244 L208,244 Z"
          fill="#E8C86A" stroke="#B8922E" strokeWidth="0.5"/>
        <path d="M208,232 L215,228 L222,232" fill="none" stroke="#F5E6A3" strokeWidth="0.5"/>
        <text x="215" y="241" textAnchor="middle" fontSize="8" fontWeight="900" fill="#8B6914" fontFamily="serif">$</text>

        {/* ── Incense Sticks ── */}
        {sticks >= 1 && (
          <g>
            {/* Bowl left */}
            <ellipse cx="65" cy="338" rx="14" ry="5" fill="#4A3520"/>
            <path d="M51,338 Q52,330 58,328 L72,328 Q78,330 79,338" fill="#5C4633" stroke="#3A2815" strokeWidth="0.5"/>
            {/* Stick */}
            <line x1="65" y1="328" x2="65" y2="278" stroke="#C4956A" strokeWidth="1.5"/>
            {/* Flame */}
            <ellipse cx="65" cy="276" rx="2.5" ry="3.5" fill="url(#bFlame)" className="flame"/>
            {/* Smoke */}
            <path className="smoke smoke1" d="M65,272 Q60,255 67,238 Q74,220 62,200"
              fill="none" stroke="#D4A84325" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        )}
        {sticks >= 2 && (
          <g>
            {/* Center stick (in lotus area) */}
            <line x1="160" y1="340" x2="160" y2="295" stroke="#C4956A" strokeWidth="1.5"/>
            <ellipse cx="160" cy="293" rx="2.5" ry="3.5" fill="url(#bFlame)" className="flame"/>
            <path className="smoke smoke2" d="M160,289 Q155,272 162,255 Q169,238 157,218"
              fill="none" stroke="#D4A84320" strokeWidth="2" strokeLinecap="round"/>
          </g>
        )}
        {sticks >= 3 && (
          <g>
            {/* Bowl right */}
            <ellipse cx="255" cy="338" rx="14" ry="5" fill="#4A3520"/>
            <path d="M241,338 Q242,330 248,328 L262,328 Q268,330 269,338" fill="#5C4633" stroke="#3A2815" strokeWidth="0.5"/>
            {/* Stick */}
            <line x1="255" y1="328" x2="255" y2="278" stroke="#C4956A" strokeWidth="1.5"/>
            <ellipse cx="255" cy="276" rx="2.5" ry="3.5" fill="url(#bFlame)" className="flame"/>
            <path className="smoke smoke3" d="M255,272 Q250,255 257,238 Q264,220 252,200"
              fill="none" stroke="#D4A84325" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        )}

        {/* ── Sparkle stars (glowing state) ── */}
        {glowing && (
          <g>
            <text x="45" y="100" fontSize="14" fill="#D4A843" className="twinkle1">✦</text>
            <text x="270" y="90" fontSize="11" fill="#E8C86A" className="twinkle2">✧</text>
            <text x="80" y="140" fontSize="8" fill="#F5E6A3" className="twinkle3">✦</text>
            <text x="240" y="150" fontSize="9" fill="#D4A843" className="twinkle1">✧</text>
            <text x="160" y="60" fontSize="16" fill="#E8C86A" className="twinkle2">✶</text>
            <text x="50" y="200" fontSize="7" fill="#D4A843" className="twinkle3">✦</text>
            <text x="268" y="210" fontSize="8" fill="#E8C86A" className="twinkle1">✧</text>
          </g>
        )}
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
    const text = `🪷 I just blessed $${ticker} with the Fortune Buddha on DHLM Studio.\n\n"${blessingText.replace(/[🐉✨🔥🪷🐲💰🪙🙏🔮🌏🛡️]/g, '').trim()}"\n\n$${amount} donated to St. Jude Children's Hospital ❤️\n\nBless your stock → dhlm-studio.com/markets/bless`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
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

        <FortuneBuddha glowing={glowing} blessing={blessing} sticks={step === 'input' ? sticks : 3} />

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

        /* Halo rotation */
        .halo { animation: haloSpin 30s linear infinite; }
        .halo { transition: opacity 0.5s; }

        @keyframes haloSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* Buddha subtle float */
        svg { animation: buddhaFloat 4s ease-in-out infinite; }
        @keyframes buddhaFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }

        /* Smoke animation */
        .smoke { animation: smokeWave 4s ease-in-out infinite; }
        .smoke1 { animation-delay: 0s; }
        .smoke2 { animation-delay: 1.2s; }
        .smoke3 { animation-delay: 0.6s; }
        @keyframes smokeWave {
          0% { d: path("M0,0 Q-4,-15 2,-30 Q8,-45 -2,-60 Q-8,-75 0,-90"); opacity: 0.15; }
          50% { d: path("M0,0 Q4,-15 -2,-30 Q-8,-45 2,-60 Q8,-75 0,-90"); opacity: 0.3; }
          100% { d: path("M0,0 Q-4,-15 2,-30 Q8,-45 -2,-60 Q-8,-75 0,-90"); opacity: 0.15; }
        }

        /* Flame flicker */
        .flame { animation: flamePulse 0.8s ease-in-out infinite alternate; }
        @keyframes flamePulse { 0%{opacity:0.7;transform:scale(0.9)} 100%{opacity:1;transform:scale(1.1)} }

        /* Twinkle stars */
        .twinkle1 { animation: twinkle 2s ease-in-out infinite; }
        .twinkle2 { animation: twinkle 2.5s ease-in-out 0.5s infinite; }
        .twinkle3 { animation: twinkle 1.8s ease-in-out 1s infinite; }
        @keyframes twinkle { 0%,100%{opacity:0.15} 50%{opacity:0.9} }

        /* Particles — float up */
        .particle { animation: particleUp 2.5s ease-out forwards; }
        @keyframes particleUp {
          0% { opacity:0; transform:translateY(0) scale(0); }
          15% { opacity:1; transform:translateY(-15px) scale(1); }
          100% { opacity:0; transform:translateY(-140px) scale(0.2); }
        }

        /* Coins — float up with wobble */
        .coin { animation: coinUp 3s ease-out forwards; }
        @keyframes coinUp {
          0% { opacity:0; transform:translateY(0) rotate(0deg); }
          20% { opacity:1; }
          100% { opacity:0; transform:translateY(-180px) rotate(360deg); }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .halo, svg, .smoke, .flame, .twinkle1, .twinkle2, .twinkle3, .particle, .coin {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
