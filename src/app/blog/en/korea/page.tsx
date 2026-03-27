import type { Metadata } from 'next';
import Link from 'next/link';
import { koreaPosts } from '@/data/blog/korea-posts';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

export const metadata: Metadata = {
  title: 'Discover Korea — Korean Culture, Food, Travel & More',
  description: 'Explore 200+ articles about Korean culture: superstitions, food, K-Pop, travel, language, work culture, and more.',
  openGraph: {
    title: 'Discover Korea | DHLM Studio',
    description: 'Your guide to Korean culture, food, K-Pop, travel, and daily life.',
    locale: 'en_US',
  },
};

const cats = ['All', 'Beliefs', 'Food', 'K-Culture', 'Travel', 'Language', 'Work', 'Tech'];

export default function KoreaListPage() {
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
        {/* Category links */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-10" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
          {cats.map((cat) => (
            <span key={cat} className="text-[13px]" style={{ color: cat === 'All' ? '#1A1A1A' : '#9CA3AF' }}>
              {cat}
            </span>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-0">
          {koreaPosts.map((post) => (
            <Link key={post.slug} href={`/blog/en/korea/${post.slug}`}
              className="block group" style={{ borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ padding: '24px 0' }}>
                <div className="flex items-start gap-4">
                  <span className="text-[12px] mt-1 shrink-0" style={{ color: '#BCBCBC' }}>{post.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[clamp(15px,2vw,17px)] font-medium leading-relaxed transition-colors duration-200 group-hover:text-[#C73E3A]"
                      style={{ fontFamily: serif, color: '#1A1A1A' }}>
                      {post.title}
                    </p>
                    <p className="text-[12px] mt-1" style={{ color: '#9CA3AF' }}>
                      {post.category} · {post.readTime} read
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
