import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPostBySlug } from '@/data/blog-posts';
import { fmtDateLong, fmtDateShort } from '@/lib/fmt-date';
import AdUnit from '@/components/AdUnit';

import unsplashManifest from '@/data/unsplash-manifest.json';

export const dynamicParams = true;

function todayKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function generateStaticParams() {
  const today = todayKST();
  return blogPosts.filter(p => p.date <= today).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Not Found', robots: { index: false, follow: false } };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://dhlm-studio.com/blog/${slug}` },
    ...(() => {
      const manifest = unsplashManifest as Record<string, { src: string }>;
      const src = post.heroImage || manifest[slug]?.src;
      const BASE = 'https://dhlm-studio.com';
      const imgUrl = src ? (src.startsWith('/') ? `${BASE}${src}` : src) : `${BASE}/opengraph-image`;
      const [w, h] = src?.endsWith('.png') ? [1792, 1024] : [1200, 630];
      return {
        openGraph: {
          title: post.title, description: post.description, type: 'article' as const,
          publishedTime: post.date, modifiedTime: post.lastUpdated || post.date,
          images: [{ url: imgUrl, width: w, height: h }],
        },
        twitter: { card: 'summary_large_image' as const, title: post.title, description: post.description, images: [imgUrl] },
      };
    })(),
    robots: post.noindex ? { index: false, follow: false } : undefined,
  };
}

/** Parse Q:/A: pairs out of a section body string. */
function parseFaqPairs(body: string): { question: string; answer: string }[] {
  const pairs: { question: string; answer: string }[] = [];
  let currentQ = '';
  let currentA = '';

  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('Q:')) {
      if (currentQ && currentA) pairs.push({ question: currentQ, answer: currentA });
      currentQ = line.slice(2).trim();
      currentA = '';
    } else if (line.startsWith('A:')) {
      currentA = line.slice(2).trim();
    } else if (currentA && line) {
      currentA += ' ' + line;
    }
  }
  if (currentQ && currentA) pairs.push({ question: currentQ, answer: currentA });
  return pairs;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  // Block future-dated posts from direct URL access
  if (post && post.date > todayKST()) notFound();

  if (!post) notFound();

  const isDeepDive = slug.startsWith('deep-dive-');
  const isMasters  = slug.startsWith('masters-');
  const related = blogPosts.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  // Resolve hero image: explicit heroImage > Unsplash manifest
  const unsplashEntry = (unsplashManifest as Record<string, { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null }>)[slug];
  const heroSrc    = post.heroImage || unsplashEntry?.src || null;
  const heroCredit = !post.heroImage ? unsplashEntry?.credit : null;

  // Build FAQ pairs from any section whose heading contains "FAQ" (case-insensitive)
  const faqSection = post.sections.find(s => s.heading.toLowerCase().includes('faq'));
  const faqPairs = faqSection ? parseFaqPairs(faqSection.body) : [];

  // Non-FAQ sections used for TOC and main body
  const contentSections = post.sections.filter(s => !s.heading.toLowerCase().includes('faq'));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.lastUpdated || post.date,
    author: { '@type': 'Organization', name: 'DHLM Studio', url: 'https://dhlm-studio.com' },
    publisher: {
      '@type': 'Organization', name: 'DHLM Studio', url: 'https://dhlm-studio.com',
      logo: { '@type': 'ImageObject', url: 'https://dhlm-studio.com/favicon.svg' },
    },
    mainEntityOfPage: `https://dhlm-studio.com/blog/${slug}`,
    articleSection: post.category,
    ...(heroSrc ? { image: heroSrc.startsWith('/') ? `https://dhlm-studio.com${heroSrc}` : heroSrc } : {}),
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

  const faqLd = faqPairs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqPairs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } : null;

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <Link href={isDeepDive ? '/reports' : '/blog'} style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← {isDeepDive ? 'Reports' : 'Blog'}</Link>

        {/* Brutal Edge Header (deep-dive only) */}
        {isDeepDive && (
          <div style={{ marginTop: 20, padding: '20px 22px', borderRadius: 14, background: 'linear-gradient(135deg, #C73E3A08, #C73E3A03)', border: '1px solid #C73E3A20', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: '#C73E3A', letterSpacing: 2 }}>BRUTAL EDGE&trade; DEEP DIVE</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic' }}>Data-driven analysis. Zero feelings.</div>
          </div>
        )}

        {/* The Masters Header */}
        {isMasters && (
          <div style={{ marginTop: 20, padding: '20px 22px', borderRadius: 14, background: 'linear-gradient(135deg, #BA751710, #BA751705)', border: '1px solid #BA751730', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 4, background: '#BA751720', color: '#BA7517', letterSpacing: 2 }}>THE MASTERS</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600, color: '#64748B', letterSpacing: 1 }}>SERIES · VOL. 1</span>
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.6 }}>Methodology, not mythology. One legendary investor per month — studied for what actually explains their edge, not what makes a good quote.</div>
          </div>
        )}

        {/* Header */}
        <div style={{ marginTop: isDeepDive ? 0 : 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${post.catColor}14`, color: post.catColor }}>{post.category}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569' }}>Published {fmtDateLong(post.date)} · {post.readTime} read</span>
            {post.lastUpdated && (
              <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569' }}>· Updated {post.lastUpdated}</span>
            )}
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.3, margin: 0 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#475569' }}>By</span>
            <Link href="/editorial" style={{ fontSize: 12, color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>Brutal Edge Team</Link>
            <span style={{ fontSize: 12, color: '#334155' }}>·</span>
            <Link href="/editorial#beaf" style={{ fontSize: 11, color: '#64748B', textDecoration: 'none' }}>BEAF Framework →</Link>
          </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#64748B', lineHeight: 1.7, marginTop: 16 }}>
            {post.description}
          </p>
        </div>

        {/* Hero image */}
        {heroSrc && (
          <div style={{ margin: '24px 0' }}>
            <div style={{ background: '#0f172a', borderRadius: 12, overflow: 'hidden', border: '1px solid #1E293B' }}>
              <Image
                src={heroSrc}
                alt={unsplashEntry?.alt || post.title}
                width={1200}
                height={800}
                priority
                unoptimized={heroSrc.startsWith('https://images.unsplash.com')}
                sizes="(max-width: 768px) 100vw, 800px"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            {heroCredit && (
              <div style={{ padding: '3px 8px', textAlign: 'right' }}>
                <span style={{ fontSize: 9, color: '#334155' }}>
                  Photo by <a href={heroCredit.authorUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'none' }}>{heroCredit.author}</a> on <a href={heroCredit.unsplashUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#475569', textDecoration: 'none' }}>Unsplash</a>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Table of Contents */}
        {contentSections.length > 2 && (
          <details style={{ marginBottom: 32, borderRadius: 10, border: '1px solid #1E293B', overflow: 'hidden' }}>
            <summary style={{ padding: '10px 16px', background: '#111827', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 2, listStyle: 'none', userSelect: 'none' }}>
              TABLE OF CONTENTS ▸
            </summary>
            <ol style={{ margin: 0, padding: '12px 16px 12px 36px', background: '#0D1117', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {contentSections.map((sec, i) => (
                <li key={i} style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B' }}>
                  <a href={`#section-${i}`} style={{ color: '#94A3B8', textDecoration: 'none' }}>{sec.heading}</a>
                </li>
              ))}
              {faqPairs.length > 0 && (
                <li style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B' }}>
                  <a href="#faq" style={{ color: '#94A3B8', textDecoration: 'none' }}>FAQ</a>
                </li>
              )}
            </ol>
          </details>
        )}

        {/* Content sections */}
        {contentSections.map((sec, i) => (
          <div key={sec.heading} id={`section-${i}`} style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', marginBottom: 12 }}>
              {sec.heading}
            </h2>
            {sec.body.split('\n').map((p, j) => (
              <p key={j} style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#94A3B8', lineHeight: 1.9, marginBottom: 12 }}>
                {p}
              </p>
            ))}
          </div>
        ))}

        {/* Calculator CTA block */}
        {post.calculatorLinks && post.calculatorLinks.length > 0 && (
          <div style={{ margin: '32px 0', padding: '20px 22px', borderRadius: 12, background: '#111827', border: '1px solid #1E293B' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 14 }}>FREE TOOLS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {post.calculatorLinks.map(c => (
                <Link key={c.href} href={c.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', borderRadius: 8, background: '#0D1117', border: '1px solid #1E293B', textDecoration: 'none' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>{c.text}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', whiteSpace: 'nowrap', flexShrink: 0 }}>{c.ctaText} →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ section */}
        {faqPairs.length > 0 && (
          <div id="faq" style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', marginBottom: 16 }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {faqPairs.map(({ question, answer }, i) => (
                <details key={i} style={{ borderBottom: '1px solid #1E293B' }}>
                  <summary style={{ padding: '14px 0', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: '#E2E8F0', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
                    <span>{question}</span>
                    <span style={{ color: '#475569', fontSize: 16, flexShrink: 0, marginLeft: 12 }}>+</span>
                  </summary>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#94A3B8', lineHeight: 1.8, padding: '0 0 14px 0', margin: 0 }}>
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Ad Unit — skip on noindex (thin content) posts */}
        {!post.noindex && <AdUnit format="horizontal" />}

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

        {/* The Masters Footer */}
        {isMasters && (
          <div style={{ marginTop: 40, padding: '20px 22px', borderRadius: 14, background: '#111827', border: '1px solid #BA751730', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#BA7517', letterSpacing: 2, marginBottom: 6 }}>THE MASTERS SERIES</div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Monthly deep-dives on the methodology of legendary investors</div>
            <div style={{ fontSize: 10, color: '#475569' }}>Next up: Warren Buffett — why doing nothing was the strategy</div>
          </div>
        )}

        {/* Brutal Edge Footer (deep-dive only) */}
        {isDeepDive && (
          <div style={{ marginTop: 40, padding: '20px 22px', borderRadius: 14, background: '#111827', border: '1px solid #1E293B', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 6 }}>🔥 ANALYZED BY BRUTAL EDGE&trade;</div>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>DHLM Studio Analysis Engine</div>
            <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.6 }}>
              Data: Financial Modeling Prep, Alpha Vantage, CoinGecko<br />
              NOT investment advice. Always do your own research.
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#334155', marginTop: isDeepDive ? 16 : 40, lineHeight: 1.6, textAlign: 'center' }}>
          Content is for informational purposes only. Always verify data from primary sources.
        </p>
      </article>
    </div>
  );
}
