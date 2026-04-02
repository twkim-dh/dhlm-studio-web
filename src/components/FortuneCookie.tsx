'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getTodaysWisdom } from '@/data/wisdom';

export default function FortuneCookie() {
  const [cracked, setCracked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const w = getTodaysWisdom();

  const crack = () => {
    if (cracked || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCracked(true);
      setAnimating(false);
    }, 600);
  };

  const shareText = `🥠 "${w.quote}"\n— ${w.author}\n\nDaily Fortune Cookie from DHLM Studio\ndhlm-studio.com`;

  return (
    <div style={{ textAlign: 'center' }}>
      {!cracked ? (
        <div>
          <button onClick={crack} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: animating ? 'rotate(15deg) scale(1.1)' : 'none',
            filter: animating ? 'brightness(1.3)' : 'none',
          }}>
            <Image
              src="/images/fortune-cookie.webp"
              alt="Fortune Cookie — tap to crack"
              width={160}
              height={160}
              style={{ width: 160, height: 'auto' }}
              priority
            />
          </button>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>
            {animating ? 'Cracking...' : 'Tap the cookie for today\'s fortune'}
          </p>
        </div>
      ) : (
        <div style={{
          padding: '24px 20px', borderRadius: 16,
          background: 'linear-gradient(135deg, #D4A84308, #D4A84303)',
          border: '1px solid #D4A84320',
        }}>
          <Image
            src="/images/fortune-cookie.webp"
            alt="Fortune Cookie cracked"
            width={80}
            height={80}
            style={{ width: 80, height: 'auto', margin: '0 auto 12px', opacity: 0.7 }}
          />
          <blockquote style={{
            fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 700,
            color: '#F1F5F9', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 12px',
          }}>
            &ldquo;{w.quote}&rdquo;
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{w.flag}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#D4A843' }}>{w.author}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: '6px 14px', borderRadius: 8, background: '#1D9BF0', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
              Share on 𝕏
            </a>
            <button onClick={() => { setCracked(false); }} style={{
              padding: '6px 14px', borderRadius: 8, background: 'transparent',
              border: '1px solid #D4A84330', color: '#D4A843', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}>🥠 Crack Another</button>
          </div>
        </div>
      )}
    </div>
  );
}
