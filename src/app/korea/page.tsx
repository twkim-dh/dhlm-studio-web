'use client';

import { useState } from 'react';
import Link from 'next/link';
import { koreaPosts } from '@/data/blog/korea-posts';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';
const cats = ['All', 'Beliefs', 'Food', 'K-Culture', 'Travel', 'Language', 'Work', 'Tech', 'Comparison', 'Lifestyle'];

export default function KoreaListPage() {
  const [activeCat, setActiveCat] = useState('All');
  const filtered = activeCat === 'All' ? koreaPosts : koreaPosts.filter(p => p.category === activeCat);

  return (
    <div style={{ background: '#FFFFFF' }}>
      <div className="px-6" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
          <p className="text-[11px] tracking-[0.4em] mb-8" style={{ color: '#BCBCBC' }}>DHLM STUDIO</p>
          <h1 className="text-[clamp(28px,4vw,40px)] font-normal leading-[1.6]"
            style={{ fontFamily: serif, color: '#1A1A1A', letterSpacing: '0.04em' }}>
            Discover Korea
          </h1>
          <p className="text-[14px] mt-4 italic" style={{ fontFamily: 'var(--font-playfair), serif', color: '#B0B0B0' }}>
            {koreaPosts.length} stories about Korean culture
          </p>
        </div>
      </div>

      <div className="mx-auto px-6" style={{ maxWidth: '960px', paddingBottom: '80px' }}>
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-x-1 gap-y-1 mb-10" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
          {cats.map((cat) => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className="text-[13px] px-3 py-1.5 rounded transition-colors duration-200"
              style={{
                color: activeCat === cat ? '#1A1A1A' : '#9CA3AF',
                background: activeCat === cat ? '#F3F4F6' : 'transparent',
                fontWeight: activeCat === cat ? 600 : 400,
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/korea/${post.slug}`}
              className="block group border transition-colors duration-200 hover:border-[#C73E3A] overflow-hidden"
              style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
              {/* Image */}
              <div className="w-full h-40 overflow-hidden bg-[#F3F4F6]">
                <img src={post.image} alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy" />
              </div>
              {/* Content */}
              <div style={{ padding: '20px' }}>
                <p className="text-[11px] mb-2" style={{ color: '#9CA3AF' }}>
                  {post.emoji} {post.category} · {post.readTime}
                </p>
                <p className="text-[15px] font-medium leading-snug transition-colors duration-200 group-hover:text-[#C73E3A]"
                  style={{ fontFamily: serif, color: '#1A1A1A' }}>
                  {post.title}
                </p>
                <p className="text-[13px] mt-2 leading-relaxed line-clamp-2" style={{ color: '#6B7280' }}>
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
