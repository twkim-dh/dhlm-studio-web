'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/data/blog-posts';
import { fmtDateShort } from '@/lib/fmt-date';

const cats = [
  { label: 'All', color: '#16161A' },
  { label: 'The Masters', color: '#BA7517' },
  { label: 'Markets', color: '#00D474' },
  { label: 'Rankings', color: '#D4A843' },
  { label: 'Crypto', color: '#F59E0B' },
];

const card = { background: '#FAFAF8', borderRadius: 14, border: '1px solid #E8E8E4' };

export default function BlogFilter({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');

  const now = new Date();
  const filtered = posts.filter(p => {
    if (p.noindex) return false;
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
      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 560px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .blog-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      {/* Search */}
      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts..."
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 10,
            background: '#FAFAF8', border: '1px solid #E8E8E4',
            color: '#16161A', fontSize: 13, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #E8E8E4' }}>
        {cats.map(c => {
          const isActive = active === c.label;
          const validPosts = posts.filter(p => !p.noindex && new Date(p.date) <= now);
          const count = c.label === 'All' ? validPosts.length : validPosts.filter(p => p.category === c.label).length;
          return (
            <button key={c.label} onClick={() => setActive(c.label)}
              style={{
                fontFamily: 'var(--sans)', fontSize: 12, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : c.color,
                padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: isActive ? c.color : `${c.color}10`,
              }}>
              {c.label} <span style={{ fontSize: 10, opacity: 0.7 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Results — card grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: 13, color: '#8A929C' }}>No posts found{search ? ` for "${search}"` : ''}.</p>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: '#8A929C', marginBottom: 8 }}>Popular posts:</div>
            {posts.slice(0, 3).map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: 'block', fontSize: 12, color: '#2D2F8F', marginBottom: 4 }}>{p.title}</Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="blog-grid">
          {filtered.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ ...card, padding: 0, textDecoration: 'none', display: 'block', overflow: 'hidden' }}>
              {post.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.heroImage} alt={post.title} style={{ width: '100%', height: 'auto', display: 'block', background: '#FAFAF8' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '16/9', background: `${post.catColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: `${post.catColor}80`, letterSpacing: 1 }}>{post.category.toUpperCase()}</span>
                </div>
              )}
              <div style={{ padding: '14px 16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: post.catColor, padding: '2px 8px', borderRadius: 4, background: `${post.catColor}14` }}>{post.category}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#8A929C', marginLeft: 'auto' }}>{fmtDateShort(post.date)} · {post.readTime}</span>
                </div>
                <p style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#16161A', margin: 0, lineHeight: 1.4 }}>{post.title}</p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#8A929C', margin: '8px 0 0', lineHeight: 1.5 }}>{post.description?.length > 90 ? post.description.slice(0, 90) + '...' : post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#8A929C', textAlign: 'center', marginTop: 24 }}>
        {filtered.length} post{filtered.length !== 1 ? 's' : ''}{active !== 'All' ? ` in ${active}` : ''}{search ? ` matching "${search}"` : ''}
      </p>
    </>
  );
}
