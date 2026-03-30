import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, getBlogPostBySlug } from '@/data/blog-posts';

export function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div style={{ background: '#0B0F19', minHeight: '100vh', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#F1F5F9', fontFamily: 'var(--serif)', fontSize: 28 }}>Post Not Found</h1>
        <Link href="/blog" style={{ color: '#64748B', fontSize: 14, marginTop: 16, display: 'inline-block' }}>← Back to Blog</Link>
      </div>
    );
  }

  const related = blogPosts.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/blog" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Blog</Link>

        {/* Header */}
        <div style={{ marginTop: 24, marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${post.catColor}14`, color: post.catColor }}>{post.category}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569' }}>{post.date} · {post.readTime} read</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.3, margin: 0 }}>
            {post.title}
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#64748B', lineHeight: 1.7, marginTop: 16 }}>
            {post.description}
          </p>
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

        {/* Disclaimer */}
        <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', marginTop: 40, lineHeight: 1.6, textAlign: 'center' }}>
          Content is for informational purposes only. Always verify data from primary sources.
        </p>
      </article>
    </div>
  );
}
