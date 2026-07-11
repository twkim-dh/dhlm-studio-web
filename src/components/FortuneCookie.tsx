'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getTodaysWisdom } from '@/data/wisdom';

const IMG_STYLE = { width: 180, height: 180, maxWidth: 180, maxHeight: 180, objectFit: 'contain' as const };
const IMG_OPEN_STYLE = { width: 220, height: 220, maxWidth: 220, maxHeight: 220, objectFit: 'contain' as const, display: 'block' as const, margin: '0 auto' };
const IMG_SMALL_STYLE = { width: 60, height: 60, maxWidth: 60, maxHeight: 60, objectFit: 'contain' as const, opacity: 0.5 };

export default function FortuneCookie() {
  const [state, setState] = useState<'closed' | 'cracking' | 'open'>('closed');
  const w = getTodaysWisdom();

  const crack = () => {
    if (state !== 'closed') return;
    setState('cracking');
    setTimeout(() => setState('open'), 900);
  };

  const shareText = `🥠 "${w.quote}"\n— ${w.author}\n\nDaily Fortune Cookie\ndhlm-studio.com`;

  return (
    <div style={{ textAlign: 'center', position: 'relative', maxWidth: 300, margin: '0 auto' }}>
      {/* Closed */}
      {state === 'closed' && (
        <div>
          <button onClick={crack} className="cookie-idle" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Image src="/images/fortune-cookie-closed.webp" alt="Fortune Cookie — tap to crack" width={180} height={180} style={IMG_STYLE} priority />
          </button>
          <p style={{ fontSize: 12, color: '#8A929C', marginTop: 10 }}>Tap to crack your fortune 🥠</p>
        </div>
      )}

      {/* Cracking */}
      {state === 'cracking' && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div className="cookie-shake">
            <Image src="/images/fortune-cookie-closed.webp" alt="" width={180} height={180} style={IMG_STYLE} />
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="crack-particle" style={{
                position: 'absolute', left: `${35 + Math.random() * 30}%`, top: '35%',
                width: 3 + Math.random() * 5, height: 3 + Math.random() * 5,
                background: ['#E8C86A', '#D4A843', '#F5E6A3', '#FFD700'][i % 4],
                borderRadius: '50%', animationDelay: `${0.3 + i * 0.04}s`,
              }} />
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#D4A843', marginTop: 10, fontWeight: 600 }}>✨ Cracking...</p>
        </div>
      )}

      {/* Open */}
      {state === 'open' && (
        <div className="fortune-reveal">
          <Image src="/images/fortune-cookie-open.webp" alt="Fortune Cookie cracked" width={220} height={220} style={IMG_OPEN_STYLE} />
          <div style={{ padding: '18px 16px', borderRadius: 14, background: 'linear-gradient(135deg, #D4A84310, #D4A84305)', border: '1px solid #D4A84320', marginTop: 12 }}>
            <blockquote style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(14px, 2.5vw, 17px)', fontWeight: 700, color: '#16161A', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 10px' }}>
              &ldquo;{w.quote}&rdquo;
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 14 }}>{w.flag}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#D4A843' }}>{w.author}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"
                style={{ padding: '8px 14px', borderRadius: 8, background: '#1D9BF0', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Share on 𝕏</a>
              <button onClick={() => setState('closed')} style={{ padding: '8px 14px', borderRadius: 8, background: 'transparent', border: '1px solid #D4A84330', color: '#D4A843', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>🥠 Crack Another</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cookie-idle { animation: cookieFloat 3s ease-in-out infinite; }
        @keyframes cookieFloat { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-5px) rotate(1deg)} }
        .cookie-shake { animation: cookieShake 0.4s ease-in-out 0s 2, cookieFadeOut 0.3s ease-out 0.7s forwards; }
        @keyframes cookieShake { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
        @keyframes cookieFadeOut { to{opacity:0;transform:scale(0.8)} }
        .crack-particle { animation: particleBurst 0.8s ease-out forwards; opacity:0; }
        @keyframes particleBurst { 0%{opacity:0;transform:translate(0,0) scale(0)} 30%{opacity:1;transform:scale(1.2)} 100%{opacity:0;transform:translate(var(--tx,0),var(--ty,-50px)) scale(0.2)} }
        .crack-particle:nth-child(1){--tx:-40px;--ty:-60px} .crack-particle:nth-child(2){--tx:45px;--ty:-55px}
        .crack-particle:nth-child(3){--tx:-25px;--ty:-70px} .crack-particle:nth-child(4){--tx:30px;--ty:-65px}
        .crack-particle:nth-child(5){--tx:-50px;--ty:-35px} .crack-particle:nth-child(6){--tx:55px;--ty:-40px}
        .crack-particle:nth-child(7){--tx:-15px;--ty:-75px} .crack-particle:nth-child(8){--tx:20px;--ty:-70px}
        .crack-particle:nth-child(9){--tx:-35px;--ty:-45px} .crack-particle:nth-child(10){--tx:40px;--ty:-50px}
        .crack-particle:nth-child(11){--tx:-10px;--ty:-60px} .crack-particle:nth-child(12){--tx:15px;--ty:-55px}
        .crack-particle:nth-child(13){--tx:-45px;--ty:-25px} .crack-particle:nth-child(14){--tx:50px;--ty:-30px}
        .fortune-reveal { animation: revealUp 0.6s ease-out; }
        @keyframes revealUp { 0%{opacity:0;transform:translateY(15px)} 100%{opacity:1;transform:translateY(0)} }
        @media(prefers-reduced-motion:reduce){ .cookie-idle,.cookie-shake,.crack-particle,.fortune-reveal{animation:none!important} }
      `}</style>
    </div>
  );
}
