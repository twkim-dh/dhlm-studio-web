'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getTodaysWisdom } from '@/data/wisdom';

export default function FortuneCookie() {
  const [state, setState] = useState<'closed' | 'cracking' | 'open'>('closed');
  const w = getTodaysWisdom();

  const crack = () => {
    if (state !== 'closed') return;
    setState('cracking');
    setTimeout(() => setState('open'), 800);
  };

  const shareText = `🥠 "${w.quote}"\n— ${w.author}\n\nDaily Fortune Cookie\ndhlm-studio.com`;

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      {/* Closed state — full cookie */}
      {state === 'closed' && (
        <div>
          <button onClick={crack} className="cookie-idle" style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <Image
              src="/images/fortune-cookie.webp"
              alt="Fortune Cookie — tap to crack"
              width={180}
              height={180}
              style={{ width: 180, height: 'auto' }}
              priority
            />
          </button>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 10 }}>
            Tap to crack your fortune 🥠
          </p>
        </div>
      )}

      {/* Cracking state — shake + particles */}
      {state === 'cracking' && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div className="cookie-crack" style={{ position: 'relative' }}>
            {/* Left half */}
            <div className="crack-left" style={{ display: 'inline-block', overflow: 'hidden', width: 90 }}>
              <Image
                src="/images/fortune-cookie.webp"
                alt=""
                width={180}
                height={180}
                style={{ width: 180, height: 'auto', marginLeft: 0 }}
              />
            </div>
            {/* Right half */}
            <div className="crack-right" style={{ display: 'inline-block', overflow: 'hidden', width: 90 }}>
              <Image
                src="/images/fortune-cookie.webp"
                alt=""
                width={180}
                height={180}
                style={{ width: 180, height: 'auto', marginLeft: -90 }}
              />
            </div>
          </div>
          {/* Gold particles */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="crack-particle" style={{
                position: 'absolute',
                left: `${40 + Math.random() * 20}%`,
                top: '40%',
                width: 4 + Math.random() * 4,
                height: 4 + Math.random() * 4,
                background: ['#E8C86A', '#D4A843', '#F5E6A3', '#FFD700'][i % 4],
                borderRadius: '50%',
                animationDelay: `${i * 0.05}s`,
              }} />
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#D4A843', marginTop: 10, fontWeight: 600 }}>
            Cracking... ✨
          </p>
        </div>
      )}

      {/* Open state — fortune revealed */}
      {state === 'open' && (
        <div className="fortune-reveal" style={{
          padding: '28px 20px', borderRadius: 16,
          background: 'linear-gradient(135deg, #D4A84310, #D4A84305)',
          border: '1px solid #D4A84320',
        }}>
          <Image
            src="/images/fortune-cookie.webp"
            alt="Fortune Cookie"
            width={64}
            height={64}
            style={{ width: 64, height: 'auto', margin: '0 auto 16px', opacity: 0.5, filter: 'grayscale(30%)' }}
          />
          <blockquote style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(15px, 2.5vw, 18px)', fontWeight: 700,
            color: '#F1F5F9', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 14px',
          }}>
            &ldquo;{w.quote}&rdquo;
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 14 }}>{w.flag}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#D4A843' }}>{w.author}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: '8px 16px', borderRadius: 8, background: '#1D9BF0', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
              Share on 𝕏
            </a>
            <button onClick={() => setState('closed')} style={{
              padding: '8px 16px', borderRadius: 8, background: 'transparent',
              border: '1px solid #D4A84330', color: '#D4A843', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}>🥠 Crack Another</button>
          </div>
        </div>
      )}

      <style>{`
        .cookie-idle {
          animation: cookieHover 3s ease-in-out infinite;
        }
        @keyframes cookieHover {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(1deg); }
        }

        .crack-left {
          animation: crackL 0.6s ease-out forwards;
        }
        .crack-right {
          animation: crackR 0.6s ease-out forwards;
        }
        @keyframes crackL {
          0% { transform: rotate(0) translateX(0); }
          40% { transform: rotate(-2deg) translateX(0); }
          100% { transform: rotate(-15deg) translateX(-20px) translateY(10px); opacity: 0.5; }
        }
        @keyframes crackR {
          0% { transform: rotate(0) translateX(0); }
          40% { transform: rotate(2deg) translateX(0); }
          100% { transform: rotate(15deg) translateX(20px) translateY(10px); opacity: 0.5; }
        }

        .crack-particle {
          animation: particleBurst 0.7s ease-out forwards;
        }
        @keyframes particleBurst {
          0% { opacity: 0; transform: translate(0, 0) scale(0); }
          20% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: translate(var(--tx, 30px), var(--ty, -40px)) scale(0.3); }
        }
        .crack-particle:nth-child(1) { --tx: -30px; --ty: -50px; }
        .crack-particle:nth-child(2) { --tx: 35px; --ty: -45px; }
        .crack-particle:nth-child(3) { --tx: -20px; --ty: -60px; }
        .crack-particle:nth-child(4) { --tx: 25px; --ty: -55px; }
        .crack-particle:nth-child(5) { --tx: -40px; --ty: -30px; }
        .crack-particle:nth-child(6) { --tx: 40px; --ty: -35px; }
        .crack-particle:nth-child(7) { --tx: -15px; --ty: -65px; }
        .crack-particle:nth-child(8) { --tx: 20px; --ty: -60px; }
        .crack-particle:nth-child(9) { --tx: -35px; --ty: -40px; }
        .crack-particle:nth-child(10) { --tx: 30px; --ty: -50px; }
        .crack-particle:nth-child(11) { --tx: -10px; --ty: -55px; }
        .crack-particle:nth-child(12) { --tx: 15px; --ty: -45px; }

        .fortune-reveal {
          animation: revealFade 0.5s ease-out;
        }
        @keyframes revealFade {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cookie-idle, .crack-left, .crack-right, .crack-particle, .fortune-reveal {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
