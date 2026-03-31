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

/* ═══ Fortune Buddha — Full Bezier Path SVG (zero circle/ellipse) ═══ */
function FortuneBuddha({ glowing, blessing, sticks = 1 }: { glowing: boolean; blessing: boolean; sticks: number }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 320, margin: '0 auto', aspectRatio: '320/420' }}>
      {/* Glow backdrop */}
      <div style={{
        position: 'absolute', top: '5%', left: '10%', right: '10%', bottom: '20%',
        background: `radial-gradient(ellipse, ${glowing ? '#D4A84345' : '#D4A84315'} 0%, transparent 70%)`,
        borderRadius: '50%', transition: 'all 1s ease',
        filter: glowing ? 'blur(24px)' : 'blur(12px)',
      }} />

      {/* Particles during blessing */}
      {blessing && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="particle" style={{
              position: 'absolute',
              left: `${15 + Math.random() * 70}%`,
              bottom: '28%',
              width: 3 + Math.random() * 5,
              height: 3 + Math.random() * 5,
              background: `radial-gradient(circle, ${['#E8C86A', '#F5E6A3', '#D4A843', '#FFD700'][i % 4]}, transparent)`,
              borderRadius: '50%',
              animationDelay: `${i * 0.12}s`,
              animationDuration: `${2 + Math.random() * 2.5}s`,
            }} />
          ))}
        </div>
      )}

      {/* Floating coins during blessing */}
      {blessing && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} className="coin" style={{
              position: 'absolute', left: `${12 + i * 17}%`, bottom: '22%',
              fontSize: 18, animationDelay: `${i * 0.25}s`,
            }}>🪙</div>
          ))}
        </div>
      )}

      <svg viewBox="0 0 320 420" width="100%" height="100%" style={{ position: 'relative', zIndex: 2 }}>
        <defs>
          <radialGradient id="gHead" cx="42%" cy="32%" r="60%">
            <stop offset="0%" stopColor="#F5E6A3"/><stop offset="40%" stopColor="#D4A843"/><stop offset="100%" stopColor="#8B6914"/>
          </radialGradient>
          <radialGradient id="gBody" cx="44%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#EEDFA0"/><stop offset="30%" stopColor="#D4A843"/><stop offset="70%" stopColor="#A07D2E"/><stop offset="100%" stopColor="#7A5F1A"/>
          </radialGradient>
          <linearGradient id="gLotus" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C86A"/><stop offset="50%" stopColor="#D4A843"/><stop offset="100%" stopColor="#8B6914"/>
          </linearGradient>
          <radialGradient id="gFlame" cx="50%" cy="25%" r="55%">
            <stop offset="0%" stopColor="#FFD060"/><stop offset="50%" stopColor="#FF8030"/><stop offset="100%" stopColor="#CC3300"/>
          </radialGradient>
          <linearGradient id="gHalo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A843"/><stop offset="100%" stopColor="#E8C86A"/>
          </linearGradient>
          <filter id="fGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="fShadow"><feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#00000050"/></filter>
        </defs>

        {/* ── Halo / Mandala (path arcs, no circle) ── */}
        <g className="halo" style={{ transformOrigin: '160px 170px' }}>
          <path d="M160,45 A115,115 0 1,1 159.9,45" fill="none" stroke="url(#gHalo)" strokeWidth="0.7" opacity={glowing ? 0.55 : 0.15} strokeDasharray="3 7"/>
          <path d="M160,60 A100,100 0 1,1 159.9,60" fill="none" stroke="url(#gHalo)" strokeWidth="0.5" opacity={glowing ? 0.45 : 0.12} strokeDasharray="6 4 2 4"/>
          <path d="M160,78 A82,82 0 1,1 159.9,78" fill="none" stroke="#D4A843" strokeWidth="1" opacity={glowing ? 0.35 : 0.08}/>
          {/* Radiating rays (path lines) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * 22.5) * Math.PI / 180;
            const cx = 160, cy = 170;
            return <path key={i} d={`M${cx + Math.cos(a)*84},${cy + Math.sin(a)*84} L${cx + Math.cos(a)*113},${cy + Math.sin(a)*113}`}
              stroke="#D4A843" strokeWidth="0.3" opacity={glowing ? 0.3 : 0.06}/>;
          })}
        </g>

        {/* ── Lotus Pedestal (all path) ── */}
        <g filter="url(#fShadow)">
          {/* Shadow base */}
          <path d="M88,342 C88,336 130,330 160,330 C190,330 232,336 232,342 C232,348 190,354 160,354 C130,354 88,348 88,342Z" fill="#0D111780"/>
          {/* Outer petals — 7 petals fanning out */}
          <path d="M160,318 C140,312 100,316 92,328 C98,332 130,330 160,330Z" fill="url(#gLotus)" opacity="0.55" stroke="#8B6914" strokeWidth="0.3"/>
          <path d="M160,318 C145,310 112,310 108,324 C114,329 138,328 160,328Z" fill="url(#gLotus)" opacity="0.6" stroke="#8B6914" strokeWidth="0.3"/>
          <path d="M160,318 C152,308 128,306 126,318 C130,324 148,325 160,325Z" fill="url(#gLotus)" opacity="0.65" stroke="#8B6914" strokeWidth="0.3"/>
          <path d="M160,318 C180,312 220,316 228,328 C222,332 190,330 160,330Z" fill="url(#gLotus)" opacity="0.55" stroke="#8B6914" strokeWidth="0.3"/>
          <path d="M160,318 C175,310 208,310 212,324 C206,329 182,328 160,328Z" fill="url(#gLotus)" opacity="0.6" stroke="#8B6914" strokeWidth="0.3"/>
          <path d="M160,318 C168,308 192,306 194,318 C190,324 172,325 160,325Z" fill="url(#gLotus)" opacity="0.65" stroke="#8B6914" strokeWidth="0.3"/>
          <path d="M160,316 C155,306 148,304 160,302 C172,304 165,306 160,316Z" fill="#E8C86A" opacity="0.7" stroke="#A07D2E" strokeWidth="0.3"/>
          {/* Cushion top */}
          <path d="M124,316 C124,310 140,306 160,306 C180,306 196,310 196,316 C196,322 180,326 160,326 C140,326 124,322 124,316Z" fill="#B8922E"/>
          <path d="M126,314 C126,309 141,305 160,305 C179,305 194,309 194,314 C194,319 179,323 160,323 C141,323 126,319 126,314Z" fill="#D4A843"/>
        </g>

        {/* ── Buddha Body (Budai — big belly, all bezier) ── */}
        <g filter={glowing ? 'url(#fGlow)' : undefined}>
          {/* Torso + belly */}
          <path d="M118,312 C114,295 106,262 110,238 C113,220 120,206 130,196
                   C138,189 148,186 160,186 C172,186 182,189 190,196
                   C200,206 207,220 210,238 C214,262 206,295 202,312
                   C192,316 172,318 160,318 C148,318 128,316 118,312Z"
            fill="url(#gBody)" stroke="#7A5F1A" strokeWidth="0.5"/>
          {/* Belly button area — soft highlight */}
          <path d="M135,255 C140,248 155,244 160,244 C165,244 180,248 185,255
                   C188,268 182,282 175,288 C168,292 152,292 145,288 C138,282 132,268 135,255Z"
            fill="#E8C86A" opacity="0.18"/>
          {/* Robe drape left */}
          <path d="M125,204 C130,215 128,235 124,260 C122,275 126,295 130,308"
            fill="none" stroke="#8B6914" strokeWidth="0.8" opacity="0.35"/>
          {/* Robe drape right */}
          <path d="M195,204 C190,215 192,235 196,260 C198,275 194,295 190,308"
            fill="none" stroke="#8B6914" strokeWidth="0.8" opacity="0.35"/>
          {/* Belly crease */}
          <path d="M142,268 C150,278 170,278 178,268" fill="none" stroke="#A07D2E" strokeWidth="0.6" opacity="0.3"/>
          {/* Robe V-collar */}
          <path d="M134,198 C142,206 155,212 160,214 C165,212 178,206 186,198"
            fill="none" stroke="#8B6914" strokeWidth="1.2" opacity="0.45"/>
          {/* Chest line */}
          <path d="M145,210 C152,218 160,220 160,220 C160,220 168,218 175,210"
            fill="none" stroke="#A07D2E" strokeWidth="0.5" opacity="0.25"/>
        </g>

        {/* ── Head (all bezier path) ── */}
        <g filter={glowing ? 'url(#fGlow)' : undefined}>
          {/* Head — egg-ish shape */}
          <path d="M160,118 C130,118 122,138 122,158 C122,178 132,198 160,198
                   C188,198 198,178 198,158 C198,138 190,118 160,118Z"
            fill="url(#gHead)"/>
          {/* Ushnisha (topknot) — organic bump */}
          <path d="M160,118 C148,118 142,108 144,98 C146,88 152,82 160,80
                   C168,82 174,88 176,98 C178,108 172,118 160,118Z"
            fill="url(#gHead)"/>
          {/* Topknot jewel */}
          <path d="M155,84 C155,78 165,78 165,84 C165,90 155,90 155,84Z" fill="#F5E6A3" stroke="#B8922E" strokeWidth="0.4"/>
          {/* Hair curls — small bumps via path arcs */}
          {[
            'M138,115 C134,110 140,106 144,110 C148,114 142,118 138,115Z',
            'M150,108 C147,103 153,99 157,103 C160,107 154,111 150,108Z',
            'M164,108 C161,103 167,99 171,103 C174,107 168,111 164,108Z',
            'M178,115 C174,110 180,106 184,110 C188,114 182,118 178,115Z',
            'M130,128 C126,123 132,119 136,123 C140,127 134,131 130,128Z',
            'M144,120 C141,115 147,112 150,116 C153,120 147,123 144,120Z',
            'M160,116 C157,112 163,108 166,112 C169,116 163,119 160,116Z',
            'M176,120 C173,115 179,112 182,116 C185,120 179,123 176,120Z',
            'M190,128 C186,123 192,119 196,123 C200,127 194,131 190,128Z',
            'M126,145 C122,140 128,136 132,140 C136,144 130,148 126,145Z',
            'M194,145 C190,140 196,136 200,140 C204,144 198,148 194,145Z',
            'M134,136 C131,131 137,128 140,132 C143,136 137,139 134,136Z',
            'M186,136 C183,131 189,128 192,132 C195,136 189,139 186,136Z',
          ].map((d, i) => <path key={`curl${i}`} d={d} fill="#B8922E" opacity="0.6"/>)}

          {/* Left ear (long, drooping) */}
          <path d="M122,148 C116,140 114,150 115,165 C116,178 120,186 125,183
                   C129,180 128,168 127,158 C126,150 124,144 122,148Z"
            fill="url(#gHead)" stroke="#A07D2E" strokeWidth="0.3"/>
          {/* Right ear */}
          <path d="M198,148 C204,140 206,150 205,165 C204,178 200,186 195,183
                   C191,180 192,168 193,158 C194,150 196,144 198,148Z"
            fill="url(#gHead)" stroke="#A07D2E" strokeWidth="0.3"/>

          {/* ── Face ── */}
          {/* Urna (forehead dot) */}
          <path d="M157.5,147 C157.5,144.5 162.5,144.5 162.5,147 C162.5,149.5 157.5,149.5 157.5,147Z"
            fill="#F5E6A3" stroke="#B8922E" strokeWidth="0.4"/>
          {/* Left eye (closed, curved happy arc) */}
          <path d="M142,161 C145,155 151,155 155,161" fill="none" stroke="#6B5210" strokeWidth="2" strokeLinecap="round"/>
          {/* Right eye */}
          <path d="M165,161 C168,155 174,155 178,161" fill="none" stroke="#6B5210" strokeWidth="2" strokeLinecap="round"/>
          {/* Left eyebrow */}
          <path d="M140,155 C144,150 152,150 157,154" fill="none" stroke="#8B6914" strokeWidth="0.6" opacity="0.4"/>
          {/* Right eyebrow */}
          <path d="M163,154 C168,150 176,150 180,155" fill="none" stroke="#8B6914" strokeWidth="0.6" opacity="0.4"/>
          {/* Nose */}
          <path d="M157,168 C158,171 160,172 162,171 C163,168 163,168 163,168" fill="none" stroke="#A07D2E" strokeWidth="0.7" strokeLinecap="round"/>
          {/* Big happy smile (Budai signature) */}
          <path d="M143,176 C148,185 155,189 160,190 C165,189 172,185 177,176"
            fill="none" stroke="#6B5210" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Smile dimples */}
          <path d="M141,176 C139,178 140,180 142,179" fill="none" stroke="#8B6914" strokeWidth="0.6" opacity="0.5"/>
          <path d="M179,176 C181,178 180,180 178,179" fill="none" stroke="#8B6914" strokeWidth="0.6" opacity="0.5"/>
          {/* Cheek blush (soft paths) */}
          <path d="M136,174 C136,170 144,170 144,174 C144,178 136,178 136,174Z" fill="#E8C86A" opacity="0.15"/>
          <path d="M176,174 C176,170 184,170 184,174 C184,178 176,178 176,174Z" fill="#E8C86A" opacity="0.15"/>
        </g>

        {/* ── Left Arm + Hand (blessing gesture — Abhaya Mudra) ── */}
        <path d="M128,208 C120,202 112,192 108,178 C106,168 108,162 113,165 C116,168 115,175 114,184"
          fill="url(#gHead)" stroke="#8B6914" strokeWidth="0.4"/>
        {/* Open palm with fingers */}
        <path d="M108,178 C105,170 103,162 106,157 C109,153 113,155 114,160
                 C115,156 118,153 121,156 C123,159 121,164 119,168
                 C121,165 124,162 126,165 C127,169 124,174 120,178
                 C116,181 112,182 108,178Z"
          fill="url(#gHead)" stroke="#8B6914" strokeWidth="0.3"/>
        {/* Palm line detail */}
        <path d="M110,170 C114,168 118,170 120,173" fill="none" stroke="#A07D2E" strokeWidth="0.3" opacity="0.4"/>

        {/* ── Right Arm + Hand + Gold Yuanbao ── */}
        <path d="M192,208 C200,214 210,226 214,242 C216,250 213,256 209,254
                 C206,252 208,245 210,238"
          fill="url(#gHead)" stroke="#8B6914" strokeWidth="0.4"/>
        {/* Right hand cupped */}
        <path d="M210,244 C214,240 218,242 218,248 C218,254 212,256 208,254
                 C204,252 206,246 210,244Z"
          fill="url(#gHead)" stroke="#8B6914" strokeWidth="0.3"/>
        {/* Gold Yuanbao (ingot) */}
        <path d="M200,238 C202,232 208,228 215,226 C222,228 228,232 230,238
                 C228,244 222,248 215,248 C208,248 202,244 200,238Z"
          fill="#E8C86A" stroke="#B8922E" strokeWidth="0.6"/>
        {/* Yuanbao top curve */}
        <path d="M206,230 C210,224 220,224 224,230" fill="none" stroke="#F5E6A3" strokeWidth="0.8"/>
        {/* $ symbol */}
        <path d="M213,234 L213,244 M210,236 C210,234 216,233 216,236 C216,238 210,239 210,241 C210,243 216,244 216,242"
          fill="none" stroke="#8B6914" strokeWidth="0.8" strokeLinecap="round"/>

        {/* ── Incense System (all path) ── */}
        {sticks >= 1 && (
          <g>
            {/* Bowl (path, no ellipse) */}
            <path d="M50,340 C50,336 56,332 65,332 C74,332 80,336 80,340 C80,344 74,348 65,348 C56,348 50,344 50,340Z" fill="#4A3520"/>
            <path d="M52,338 C53,332 58,330 65,330 C72,330 77,332 78,338" fill="#5C4633" stroke="#3A2815" strokeWidth="0.5"/>
            {/* Stick */}
            <path d="M65,330 L65,278" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Flame */}
            <path d="M65,278 C62,274 61,270 63,266 C64,264 66,264 67,266 C69,270 68,274 65,278Z"
              fill="url(#gFlame)" className="flame"/>
            {/* Smoke */}
            <path className="smoke smoke1" d="M65,264 C60,248 70,232 62,216 C56,202 68,188 63,172"
              fill="none" stroke="#D4A84320" strokeWidth="3" strokeLinecap="round"/>
          </g>
        )}
        {sticks >= 2 && (
          <g>
            <path d="M160,342 L160,296" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M160,296 C157,292 156,288 158,284 C159,282 161,282 162,284 C164,288 163,292 160,296Z"
              fill="url(#gFlame)" className="flame"/>
            <path className="smoke smoke2" d="M160,282 C155,266 165,250 158,234 C152,220 164,206 158,190"
              fill="none" stroke="#D4A84318" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        )}
        {sticks >= 3 && (
          <g>
            <path d="M240,340 C240,336 246,332 255,332 C264,332 270,336 270,340 C270,344 264,348 255,348 C246,348 240,344 240,340Z" fill="#4A3520"/>
            <path d="M242,338 C243,332 248,330 255,330 C262,330 267,332 268,338" fill="#5C4633" stroke="#3A2815" strokeWidth="0.5"/>
            <path d="M255,330 L255,278" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M255,278 C252,274 251,270 253,266 C254,264 256,264 257,266 C259,270 258,274 255,278Z"
              fill="url(#gFlame)" className="flame"/>
            <path className="smoke smoke3" d="M255,264 C250,248 260,232 252,216 C246,202 258,188 253,172"
              fill="none" stroke="#D4A84320" strokeWidth="3" strokeLinecap="round"/>
          </g>
        )}

        {/* ── Sparkle stars (path-based 4-point stars) ── */}
        {glowing && (
          <g>
            <path className="twinkle1" d="M48,95 L50,90 L52,95 L57,97 L52,99 L50,104 L48,99 L43,97Z" fill="#D4A843" opacity="0.7"/>
            <path className="twinkle2" d="M270,88 L271.5,84 L273,88 L277,89.5 L273,91 L271.5,95 L270,91 L266,89.5Z" fill="#E8C86A" opacity="0.6"/>
            <path className="twinkle3" d="M82,135 L83,132 L84,135 L87,136 L84,137 L83,140 L82,137 L79,136Z" fill="#F5E6A3" opacity="0.5"/>
            <path className="twinkle1" d="M238,148 L239.5,144 L241,148 L245,149.5 L241,151 L239.5,155 L238,151 L234,149.5Z" fill="#D4A843" opacity="0.5"/>
            <path className="twinkle2" d="M157,52 L159,46 L161,52 L167,54 L161,56 L159,62 L157,56 L151,54Z" fill="#E8C86A" opacity="0.8"/>
            <path className="twinkle3" d="M52,196 L53,193 L54,196 L57,197 L54,198 L53,201 L52,198 L49,197Z" fill="#D4A843" opacity="0.4"/>
            <path className="twinkle1" d="M266,205 L267.5,201 L269,205 L273,206.5 L269,208 L267.5,212 L266,208 L262,206.5Z" fill="#E8C86A" opacity="0.5"/>
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
