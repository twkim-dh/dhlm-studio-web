'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/data/blog-posts';

const cats = [
  { label: 'All', color: '#F1F5F9' },
  { label: 'Markets', color: '#00D474' },
  { label: 'Rankings', color: '#D4A843' },
  { label: 'Cost of Living', color: '#3B82F6' },
  { label: 'Creators', color: '#A78BFA' },
  { label: 'Data', color: '#64748B' },
];

export default function BlogFilter({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? posts : posts.filter(p => p.category === active);

  return (
    <>
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '24px 0 32px', paddingBottom: 16, borderBottom: '1px solid #1E293B' }}>
        {cats.map(c => {
          const isActive = active === c.label;
          return (
            <button
              key={c.label}
              onClick={() => setActive(c.label)}
              style={{
                fontFamily: 'var(--sans)', fontSize: 12, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0B0F19' : c.color,
                padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: isActive ? c.color : `${c.color}10`,
                transition: 'all 0.2s',
              }}
            >
              {c.label}
              {c.label !== 'All' && <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.7 }}>({posts.filter(p => p.category === c.label).length})</span>}
            </button>
          );
        })}
      </div>

      {/* Filtered Posts */}
      <div>
        {filtered.length === 0 && (
          <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: 40 }}>No posts in this category yet.</p>
        )}
        {filtered.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'block', borderBottom: '1px solid #1E293B', padding: '20px 0', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: post.catColor, padding: '2px 8px', borderRadius: 4, background: `${post.catColor}14` }}>{post.category}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569' }}>{post.date} · {post.readTime} read</span>
            </div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#E2E8F0', margin: 0, lineHeight: 1.5 }}>
              {post.title}
            </p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B', margin: '6px 0 0', lineHeight: 1.6 }}>
              {post.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Post count */}
      <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#475569', textAlign: 'center', marginTop: 24 }}>
        {filtered.length} post{filtered.length !== 1 ? 's' : ''}{active !== 'All' ? ` in ${active}` : ' total'}
      </p>
    </>
  );
}
