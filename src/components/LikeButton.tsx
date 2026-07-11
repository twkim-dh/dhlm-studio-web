'use client';

import { useState, useEffect } from 'react';

function generateLikeCount(pageId: string): number {
  const today = new Date().toISOString().split('T')[0];
  const seed = `like-${pageId}-${today}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return 500 + Math.abs(hash % 5000);
}

function fmtCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export default function LikeButton({ pageId }: { pageId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`like-${pageId}`);
    if (saved) setLiked(true);
    setCount(generateLikeCount(pageId));
  }, [pageId]);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setCount(prev => prev + 1);
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
    localStorage.setItem(`like-${pageId}`, 'true');
  };

  return (
    <button onClick={handleLike}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: liked ? 'default' : 'pointer',
        background: liked ? '#FF454515' : '#FAFAF8',
        border: liked ? '1px solid #FF454530' : '1px solid #E8E8E4',
        color: liked ? '#FF6B6B' : '#5B6470',
        transition: 'all 0.3s',
      }}>
      <span style={{
        transition: 'transform 0.3s',
        transform: bounce ? 'scale(1.3)' : 'scale(1)',
        display: 'inline-block',
      }}>
        {liked ? '❤️' : '♡'}
      </span>
      <span style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{fmtCount(count)}</span>
    </button>
  );
}
