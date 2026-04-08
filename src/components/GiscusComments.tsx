'use client';

// Giscus-based comments backed by GitHub Discussions.
//
// Setup (one-time, performed by editor):
//   1. Enable Discussions on twkim-dh/dhlm-studio-web
//   2. Visit https://giscus.app
//   3. Repository: twkim-dh/dhlm-studio-web
//   4. Page mapping: pathname
//   5. Discussion category: Comments (or Announcements)
//   6. Copy the data-repo-id and data-category-id values from the
//      generated <script> tag
//   7. Add to Vercel env vars (and .env.local for dev):
//        NEXT_PUBLIC_GISCUS_REPO_ID=...
//        NEXT_PUBLIC_GISCUS_CATEGORY=Comments  (or Announcements)
//        NEXT_PUBLIC_GISCUS_CATEGORY_ID=...
//
// If the env vars are not set, the component renders a disabled placeholder
// that explains setup is pending — never crashes the page.

import { useEffect, useRef, useState } from 'react';

const REPO = 'twkim-dh/dhlm-studio-web';

interface Props {
  /** Stable identifier for this discussion. Defaults to current pathname. */
  slug?: string;
}

export default function GiscusComments({ slug }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '';
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Comments';
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '';
  const isConfigured = Boolean(repoId && categoryId);

  useEffect(() => {
    if (!isConfigured || !ref.current || mounted) return;

    // Build the giscus script element exactly as giscus.app emits it.
    // Re-running this effect after navigation is fine because giscus
    // accepts a single mount per container.
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', REPO);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', slug ? 'specific' : 'pathname');
    if (slug) script.setAttribute('data-term', slug);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'transparent_dark');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');

    ref.current.appendChild(script);
    setMounted(true);
  }, [isConfigured, repoId, category, categoryId, slug, mounted]);

  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#60A5FA', letterSpacing: 2, marginBottom: 6 }}>
          💬 DISCUSSION
        </div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#E2E8F0', margin: '0 0 6px' }}>
          Share your analysis
        </h2>
        <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
          Keep it data-driven. No investment advice.
        </p>
      </div>

      {/* Discussion rules + user-content disclaimer */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 10,
        background: '#0D1117',
        border: '1px solid #1E293B',
        marginBottom: 16,
        fontSize: 11,
        color: '#64748B',
        lineHeight: 1.8,
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, marginBottom: 6 }}>💬 DISCUSSION RULES</div>
        <ul style={{ margin: '0 0 10px', paddingLeft: 16 }}>
          <li>Keep it data-driven and respectful</li>
          <li>No investment advice (buy / sell / hold)</li>
          <li>No spam, promotion, or solicitation</li>
          <li>No profanity or offensive content</li>
          <li>Violations are automatically removed</li>
        </ul>
        Comments are user-generated and do not represent DHLM Studio&apos;s views. This is not investment advice. GitHub login is required to comment.
      </div>

      {isConfigured ? (
        <div ref={ref} className="giscus" />
      ) : (
        <div style={{
          padding: '20px 18px',
          borderRadius: 12,
          background: '#0D1117',
          border: '1px dashed #1E293B',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>💬</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>Comments coming soon</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
            Discussion will open once the integration is configured.
          </div>
        </div>
      )}
    </section>
  );
}
