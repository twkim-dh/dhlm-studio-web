import type { Metadata } from 'next';
import Link from 'next/link';
import { koreaPosts, getKoreaPostBySlug } from '@/data/blog/korea-posts';

const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

export function generateStaticParams() {
  return koreaPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getKoreaPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | DHLM Studio`,
      description: post.description,
      images: [{ url: post.image, width: 800, height: 400 }],
      locale: 'en_US',
    },
    alternates: { canonical: `https://dhlm-studio.com/korea/${slug}` },
  };
}

export default async function KoreaPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getKoreaPostBySlug(slug);

  if (!post) {
    return <div className="px-6 py-20 text-center"><p style={{ color: '#1A1A1A' }}>Post not found.</p></div>;
  }

  const related = koreaPosts.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  return (
    <div style={{ background: '#FFFFFF' }}>
      <article className="mx-auto px-6" style={{ maxWidth: '720px', paddingTop: '48px', paddingBottom: '80px' }}>
        {/* Meta */}
        <p className="text-[12px] mb-6" style={{ color: '#BCBCBC' }}>
          {post.emoji} {post.category} · {post.readTime} read
        </p>

        {/* Title */}
        <h1 className="text-[clamp(24px,4vw,36px)] font-normal leading-[1.5]"
          style={{ fontFamily: serif, color: '#1A1A1A', letterSpacing: '0.02em' }}>
          {post.title}
        </h1>

        <div className="mt-6 mb-10" style={{ width: '32px', height: '1px', background: '#E5E7EB' }} />

        {/* Intro */}
        <p className="text-base leading-[1.9]" style={{ color: '#4B5563' }}>
          {post.intro}
        </p>

        {/* Sections */}
        {post.sections.map((sec) => (
          <div key={sec.heading} className="mt-10">
            {sec.image && (
              <div className="mb-6 overflow-hidden" style={{ borderRadius: '4px' }}>
                <img src={sec.image} alt={sec.imageAlt || sec.heading}
                  className="w-full h-auto" loading="lazy"
                  style={{ maxHeight: '400px', objectFit: 'cover' }} />
                {sec.imageAlt && (
                  <p className="text-[11px] mt-2 italic" style={{ color: '#9CA3AF' }}>{sec.imageAlt}</p>
                )}
              </div>
            )}
            <h2 className="text-lg font-medium mb-4" style={{ fontFamily: serif, color: '#1A1A1A' }}>
              {sec.heading}
            </h2>
            {sec.body.split('\n').map((para, i) => (
              <p key={i} className="text-[15px] leading-[1.9] mb-4" style={{ color: '#4B5563' }}>
                {para}
              </p>
            ))}
          </div>
        ))}

        {/* Fun Fact */}
        <div className="mt-10 border-l-2 pl-5 py-3" style={{ borderColor: '#C73E3A', background: '#FAFAFA' }}>
          <p className="text-[12px] tracking-[0.1em] mb-2" style={{ color: '#C73E3A' }}>FUN FACT</p>
          <p className="text-[15px] leading-relaxed" style={{ color: '#4B5563' }}>{post.funFact}</p>
        </div>

        {/* Korean Word */}
        <div className="mt-8 p-5" style={{ background: '#111111', borderRadius: '4px' }}>
          <p className="text-[11px] tracking-[0.15em] mb-2" style={{ color: '#9CA3AF' }}>KOREAN WORD</p>
          <p className="text-xl font-medium" style={{ fontFamily: serif, color: '#FFFFFF' }}>{post.koreanWord.word}</p>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            {post.koreanWord.romanized} — {post.koreanWord.meaning}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[11px] border px-2.5 py-1" style={{ borderColor: '#E5E7EB', color: '#9CA3AF', borderRadius: '2px' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14 pt-10" style={{ borderTop: '1px solid #E5E7EB' }}>
            <p className="text-[11px] tracking-[0.2em] mb-6" style={{ color: '#BCBCBC' }}>RELATED</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/korea/${r.slug}`}
                  className="block border overflow-hidden transition-colors duration-200 hover:border-[#C73E3A]"
                  style={{ borderColor: '#E5E7EB', borderRadius: '4px' }}>
                  <div className="h-24 overflow-hidden bg-[#F3F4F6]">
                    <img src={r.image} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div style={{ padding: '12px' }}>
                    <p className="text-[13px] font-medium leading-snug" style={{ fontFamily: serif, color: '#1A1A1A' }}>{r.title}</p>
                    <p className="text-[11px] mt-1" style={{ color: '#9CA3AF' }}>{r.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #E5E7EB' }}>
          <Link href="/korea" className="text-[13px] transition-colors hover:text-[#C73E3A]" style={{ color: '#BCBCBC' }}>
            ← All Korea articles
          </Link>
        </div>
      </article>
    </div>
  );
}
