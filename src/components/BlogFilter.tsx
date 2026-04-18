'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/data/blog-posts';
import { fmtDateShort } from '@/lib/fmt-date';

const cats = [
  { label: 'All', color: '#F1F5F9' },
  { label: 'The Masters', color: '#BA7517' },
  { label: 'Markets', color: '#00D474' },
  { label: 'Rankings', color: '#D4A843' },
  { label: 'Crypto', color: '#F59E0B' },
  { label: 'Creators', color: '#A78BFA' },
];

export default function BlogFilter({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');

  const now = new Date();
  const filtered = posts.filter(p => {
    if (new Date(p.date) > now) return false;
    const matchCat = active === 'All' || p.category === active;
    const matchSearch = !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Search */}
      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts..."
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 10,
            background: '#111827', border: '1px solid #1E293B',
            color: '#F1F5F9', fontSize: 13, outline: 'none',
          }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #1E293B' }}>
        {cats.map(c => {
          const isActive = active === c.label;
          const count = c.label === 'All' ? posts.length : posts.filter(p => p.category === c.label).length;
          return (
            <button key={c.label} onClick={() => setActive(c.label)}
              style={{
                fontFamily: 'var(--sans)', fontSize: 12, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0B0F19' : c.color,
                padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: isActive ? c.color : `${c.color}10`,
              }}>
              {c.label} <span style={{ fontSize: 10, opacity: 0.7 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ fontSize: 13, color: '#475569' }}>No posts found{search ? ` for "${search}"` : ''}.</p>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>Popular posts:</div>
              {posts.slice(0, 3).map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: 'block', fontSize: 12, color: '#60A5FA', marginBottom: 4 }}>{p.title}</Link>
              ))}
            </div>
          </div>
        )}
        {filtered.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'block', borderBottom: '1px solid #1E293B', padding: '20px 0', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: post.catColor, padding: '2px 8px', borderRadius: 4, background: `${post.catColor}14` }}>{post.category}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569' }}>{fmtDateShort(post.date)} · {post.readTime} read</span>
            </div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#E2E8F0', margin: 0, lineHeight: 1.5 }}>{post.title}</p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B', margin: '6px 0 0', lineHeight: 1.6 }}>{post.description}</p>
          </Link>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#475569', textAlign: 'center', marginTop: 24 }}>
        {filtered.length} post{filtered.length !== 1 ? 's' : ''}{active !== 'All' ? ` in ${active}` : ''}{search ? ` matching "${search}"` : ''}
      </p>
    </>
  );
}
