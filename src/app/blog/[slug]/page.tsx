import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, getBlogPostBySlug } from '@/data/blog-posts';
import AdUnit from '@/components/AdUnit';
import LikeButton from '@/components/LikeButton';
import GiscusComments from '@/components/GiscusComments';

export function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Not Found', robots: { index: false, follow: false } };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://dhlm-studio.com/blog/${slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
    robots: post.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    // Find similar posts by partial slug match
    const similar = blogPosts.filter(p => {
      const words = slug.split('-').filter(w => w.length > 3);
      return words.some(w => p.slug.includes(w));
    }).slice(0, 5);

    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 28, textAlign: 'center' }}>Post Not Found</h1>
        <p style={{ color: '#64748B', fontSize: 14, textAlign: 'center', marginTop: 8 }}>The URL may have changed. Try one of these:</p>
        {similar.length > 0 && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {similar.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: 'block', padding: '12px 16px', borderRadius: 10, background: '#111827', border: '1px solid #1E293B', textDecoration: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{p.title}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{p.category} · {p.date}</div>
              </Link>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/blog" style={{ color: '#C73E3A', fontSize: 14 }}>← View All Posts</Link>
        </div>
      </div>
    );
  }

  const isDeepDive = slug.startsWith('deep-dive-');
  const related = blogPosts.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'DHLM Studio', url: 'https://dhlm-studio.com' },
    publisher: { '@type': 'Organization', name: 'DHLM Studio', url: 'https://dhlm-studio.com', logo: { '@type': 'ImageObject', url: 'https://dhlm-studio.com/favicon.svg' } },
    mainEntityOfPage: `https://dhlm-studio.com/blog/${slug}`,
    articleSection: post.category,
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dhlm-studio.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://dhlm-studio.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://dhlm-studio.com/blog/${slug}` },
    ],
  };

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <Link href={isDeepDive ? '/reports' : '/blog'} style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← {isDeepDive ? 'Reports' : 'Blog'}</Link>

        {/* Brutal AI Header (deep-dive only) */}
        {isDeepDive && (
          <div style={{ marginTop: 20, padding: '20px 22px', borderRadius: 14, background: 'linear-gradient(135deg, #C73E3A08, #C73E3A03)', border: '1px solid #C73E3A20', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: '#C73E3A', letterSpacing: 2 }}>BRUTAL AI&trade; DEEP DIVE</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic' }}>Data-driven analysis. Zero feelings.</div>
          </div>
        )}

        {/* Header */}
        <div style={{ marginTop: isDeepDive ? 0 : 24, marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${post.catColor}14`, color: post.catColor }}>{post.category}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569' }}>Published {post.date} · {post.readTime} read</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.3, margin: 0 }}>
            {post.title}
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#64748B', lineHeight: 1.7, marginTop: 16 }}>
            {post.description}
          </p>
          <div style={{ marginTop: 16 }}><LikeButton pageId={`blog-${slug}`} /></div>
        </div>

        {/* Sections */}
        {post.sections.map((sec) => (
          <div key={sec.heading} style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', marginBottom: 12 }}>
              {sec.heading}
            </h2>
            {sec.body.split('\n').map((p, i) => (
              <p key={i} style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#94A3B8', lineHeight: 1.9, marginBottom: 12 }}>
                {p}
              </p>
            ))}
          </div>
        ))}

        {/* Ad Unit */}
        <AdUnit format="horizontal" />

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #1E293B' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 16 }}>RELATED</div>
            {related.map(r => (
              <Link key={r.slug} href={`/blog/${r.slug}`} style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #1E293B', textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: r.catColor, marginRight: 8 }}>{r.category}</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{r.title}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Brutal AI Footer (deep-dive only) */}
        {isDeepDive && (
          <div style={{ marginTop: 40, padding: '20px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 6 }}>🔥 ANALYZED BY BRUTAL AI&trade;</div>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>DHLM Studio Analysis Engine</div>
            <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.6 }}>
              Data: Financial Modeling Prep, Alpha Vantage, CoinGecko<br />
              NOT investment advice. Always do your own research.
            </div>
          </div>
        )}

        {/* Comments — Giscus / GitHub Discussions */}
        <GiscusComments slug={`blog:${slug}`} />

        {/* Disclaimer */}
        <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', marginTop: isDeepDive ? 16 : 40, lineHeight: 1.6, textAlign: 'center' }}>
          Content is for informational purposes only. Always verify data from primary sources.
        </p>
      </article>
    </div>
  );
}
