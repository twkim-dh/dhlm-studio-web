import type { Metadata } from 'next';
import { eventPosts, getEventBySlug } from '@/data/event-posts';
import Link from 'next/link';
import ShareButton from './ShareButton';

export function generateStaticParams() {
  return eventPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getEventBySlug(slug);
  if (!post) return { title: 'Event Not Found' };
  return {
    title: `${post.title} — Korean Events`,
    description: post.intro,
    openGraph: {
      title: `${post.title} | DHLM Studio`,
      description: post.intro,
      images: [{ url: post.image, width: 1200, height: 630 }],
      locale: 'en_US',
      alternateLocale: 'ko_KR',
    },
    alternates: {
      canonical: `https://dhlm-studio.com/events/${slug}`,
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getEventBySlug(slug);

  if (!post) {
    return (
      <div className="px-6 py-20 text-center" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <p className="text-lg" style={{ color: '#1A1A1A' }}>Event not found.</p>
      </div>
    );
  }

  const serif = 'var(--font-noto-serif-kr), var(--font-playfair), serif';

  return (
    <div style={{ background: '#FFFFFF' }}>
      {/* Content */}
      <article className="mx-auto px-6" style={{ maxWidth: '720px', paddingTop: '60px', paddingBottom: '80px' }}>
        <span className="text-3xl">{post.emoji}</span>
        <h1 className="text-[clamp(24px,4vw,36px)] font-normal leading-[1.5] mt-4"
          style={{ fontFamily: serif, color: '#1A1A1A', letterSpacing: '0.03em' }}>
          {post.title}
        </h1>
        <p className="text-base mt-1" style={{ fontFamily: serif, color: '#BCBCBC' }}>
          {post.titleKr}
        </p>
        <p className="text-[13px] mt-3" style={{ color: '#9CA3AF' }}>{post.period} · {post.location}</p>

        <div className="mt-4 mb-8" style={{ width: '32px', height: '1px', background: '#E5E7EB' }} />

        {/* Intro */}
        <p className="text-base leading-[1.9]" style={{ color: '#4B5563' }}>
          {post.intro}
        </p>

        {/* Body */}
        <div className="mt-8 space-y-6">
          {post.body.split('\n\n').map((para, i) => (
            <p key={i} className="text-[15px] leading-[1.9]" style={{ color: '#4B5563' }}>
              {para}
            </p>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-10 border-t pt-8" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-[13px] tracking-[0.15em] mb-4" style={{ color: '#BCBCBC' }}>TIPS</p>
          <ul className="space-y-3">
            {post.tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: '#4B5563' }}>
                <span style={{ color: '#C73E3A' }}>·</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Share */}
        <div className="mt-10 flex gap-4">
          <ShareButton
            title={post.title}
            text={`${post.emoji} ${post.title} (${post.titleKr})\n${post.period}\n${post.intro}\n\nhttps://dhlm-studio.com/events/${post.slug}`}
          />
        </div>

        {/* Back */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: '#E5E7EB' }}>
          <Link href="/" className="text-[13px] transition-colors hover:text-[#C73E3A]" style={{ color: '#BCBCBC' }}>
            ← Back to home
          </Link>
        </div>
      </article>
    </div>
  );
}
