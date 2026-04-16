import type { Metadata } from 'next';
import Link from 'next/link';
import unsplashManifest from '@/data/unsplash-manifest.json';

type ManifestEntry = { src: string; alt: string; credit: { author: string; authorUrl: string; unsplashUrl: string } | null };
const manifest = unsplashManifest as Record<string, ManifestEntry>;

export const metadata: Metadata = {
  title: 'Brutal Edge Academy — Learn Investing | DHLM Studio',
  description: 'Learn investing the way it actually works. Crypto 101 and Investing 101 — data-driven, zero hype, Brutal Edge style.',
  alternates: { canonical: 'https://dhlm-studio.com/learn' },
};

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

const COURSES = [
  {
    href: '/learn/crypto-101',
    emoji: '🪙',
    label: 'CRYPTO 101',
    color: '#8B5CF6',
    title: 'Crypto From Scratch',
    description: 'From "What is blockchain?" to DeFi, staking, and portfolio strategy. 12 lessons. No jargon, no hype.',
    lessons: 12,
    published: 8,
    status: 'live' as const,
    detail: 'Phase 1–3 · Foundations → DeFi → Strategy',
    imageKey: 'learn-card-crypto',
  },
  {
    href: '/learn/investing-101',
    emoji: '📈',
    label: 'INVESTING 101',
    color: '#00D474',
    title: 'Stock Market Fundamentals',
    description: 'How markets actually work. Financial statements, valuation, earnings analysis, and building an investment framework.',
    lessons: 12,
    published: 0,
    status: 'coming' as const,
    detail: 'Coming April 21, 2026',
    imageKey: 'learn-card-investing',
  },
];

export default function LearnPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 10 }}>🎓 BRUTAL EDGE ACADEMY</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, color: '#F1F5F9', margin: '0 0 12px', lineHeight: 1.15 }}>
            Learn investing the way<br />it actually works.
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
            No courses that sell you false hope. No "get rich quick" narratives. Every lesson is data-driven, opinionated, and built around what investors actually need to know.
          </p>
        </div>

        {/* Section header: Courses */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 14 }}>COURSES</div>

        {/* Course Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          {COURSES.map(course => (
            <Link
              key={course.href}
              href={course.href}
              style={{
                ...card,
                padding: '0',
                textDecoration: 'none',
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
                borderColor: course.status === 'live' ? `${course.color}30` : '#1E293B',
                background: course.status === 'live' ? `linear-gradient(135deg, ${course.color}08, #111827)` : '#111827',
                opacity: course.status === 'coming' ? 0.75 : 1,
                pointerEvents: course.status === 'coming' ? 'none' : 'auto',
              }}
            >
              {course.status === 'live' && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: course.color, zIndex: 2 }} />
              )}
              <div style={{ padding: '20px 28px 24px' }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {/* Icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: `${course.color}18`, border: `1px solid ${course.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                }}>
                  {course.emoji}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: `${course.color}18`, color: course.color, letterSpacing: 1 }}>
                      {course.label}
                    </span>
                    {course.status === 'live' ? (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#00D47414', color: '#00D474' }}>
                        ● LIVE · {course.published}/{course.lessons} LESSONS
                      </span>
                    ) : (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#D4A84314', color: '#D4A843' }}>
                        ⏳ {course.detail}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: '0 0 8px', lineHeight: 1.2 }}>
                    {course.title}
                  </h2>
                  <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 10px', lineHeight: 1.6 }}>
                    {course.description}
                  </p>
                  {course.status === 'live' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, maxWidth: 200 }}>
                        <div style={{ height: 4, background: '#1E293B', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(course.published / course.lessons) * 100}%`, background: `linear-gradient(90deg, ${course.color}, ${course.color}99)`, borderRadius: 2 }} />
                        </div>
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: course.color, fontWeight: 700 }}>
                        Start Course →
                      </span>
                    </div>
                  )}
                  {course.status === 'coming' && (
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#475569' }}>
                      {course.detail} · 12 lessons · 3 phases
                    </div>
                  )}
                </div>
              </div>
              </div>{/* end padding wrapper */}
            </Link>
          ))}
        </div>

        {/* Section header: Research */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 3, marginBottom: 14 }}>RESEARCH</div>

        {/* Research Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
          <Link
            href="/learn/paper-vs-profit"
            style={{
              ...card,
              padding: '0',
              textDecoration: 'none',
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
              borderColor: '#3B82F630',
              background: 'linear-gradient(135deg, #3B82F608, #111827)',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#3B82F6', zIndex: 2 }} />
            <div style={{ padding: '20px 28px 24px' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: '#3B82F618', border: '1px solid #3B82F630',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>📚</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: '#3B82F618', color: '#3B82F6', letterSpacing: 1 }}>
                    PAPER VS. PROFIT
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#00D47414', color: '#00D474' }}>
                    ● LIVE · WEEKLY
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: '#F1F5F9', margin: '0 0 8px', lineHeight: 1.2 }}>
                  Academic Papers Meet Real Markets
                </h2>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 12px', lineHeight: 1.6 }}>
                  We read the papers. We judge them. We tell you if they will make you money. Every issue dissects one academic finance paper with a single question: would this actually work in practice?
                </p>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#3B82F6', fontWeight: 700 }}>
                  Read Research →
                </span>
              </div>
            </div>
            </div>{/* end padding wrapper */}
          </Link>
        </div>

        {/* Philosophy */}
        <div style={{ padding: '24px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 2, marginBottom: 10 }}>THE BRUTAL EDGE APPROACH</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { icon: '📊', label: 'Data First', desc: 'Every claim backed by numbers, not vibes.' },
              { icon: '🚫', label: 'Zero Hype', desc: 'We say what won\'t work, not just what will.' },
              { icon: '⚡', label: 'Opinionated', desc: 'We give verdicts. Not just "it depends."' },
            ].map(p => (
              <div key={p.label}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{p.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0', marginBottom: 3 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 9, color: '#334155', textAlign: 'center' }}>
          Educational content only. Not investment advice. Always do your own research.
        </p>
      </div>
    </div>
  );
}
