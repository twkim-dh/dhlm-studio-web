import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fastest Growing Creators This Week | DHLM Studio",
  description: "Trending creators across YouTube, TikTok, Instagram, and X. Updated weekly.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const CREATORS = [
  { rank: 1, name: 'MrBeast', handle: '@MrBeast', platform: 'YouTube', metric: '+2.4M subs', total: '382M', tags: ['Entertainment'], color: '#FF0000', flag: '🇺🇸' },
  { rank: 2, name: 'Khaby Lame', handle: '@khaborlame', platform: 'TikTok', metric: '+1.8M followers', total: '163M', tags: ['Comedy'], color: '#00F2EA', flag: '🇮🇹' },
  { rank: 3, name: 'Cristiano Ronaldo', handle: '@cristiano', platform: 'Instagram', metric: '+1.2M followers', total: '648M', tags: ['Sports'], color: '#E4405F', flag: '🇵🇹' },
  { rank: 4, name: 'Elon Musk', handle: '@elonmusk', platform: 'X', metric: '+890K followers', total: '218M', tags: ['Tech', 'Business'], color: '#F5F5F5', flag: '🇺🇸' },
  { rank: 5, name: 'IShowSpeed', handle: '@IShowSpeed', platform: 'YouTube', metric: '+680K subs', total: '42M', tags: ['Gaming', 'Entertainment'], color: '#FF0000', flag: '🇺🇸' },
  { rank: 6, name: 'Charli D\'Amelio', handle: '@charlidamelio', platform: 'TikTok', metric: '+520K followers', total: '155M', tags: ['Dance', 'Lifestyle'], color: '#00F2EA', flag: '🇺🇸' },
  { rank: 7, name: 'Kai Cenat', handle: '@KaiCenat', platform: 'YouTube', metric: '+480K subs', total: '18M', tags: ['Streaming', 'Entertainment'], color: '#FF0000', flag: '🇺🇸' },
  { rank: 8, name: 'Taylor Swift', handle: '@taylorswift', platform: 'Instagram', metric: '+450K followers', total: '283M', tags: ['Music'], color: '#E4405F', flag: '🇺🇸' },
  { rank: 9, name: 'Jenna Ortega', handle: '@jennaortega', platform: 'Instagram', metric: '+380K followers', total: '51M', tags: ['Acting'], color: '#E4405F', flag: '🇺🇸' },
  { rank: 10, name: 'Mark Rober', handle: '@MarkRober', platform: 'YouTube', metric: '+350K subs', total: '58M', tags: ['Science', 'Engineering'], color: '#FF0000', flag: '🇺🇸' },
];

const card = { background: '#FAFAF8', borderRadius: 14, border: '1px solid #E8E8E4' };

export default function CreatorsPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: "Fastest Growing Creators", url: "https://dhlm-studio.com/creators", description: "Trending creators across YouTube, TikTok, Instagram, and X." }) }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#A78BFA', letterSpacing: 3, marginBottom: 6 }}>TRENDING CREATORS · THIS WEEK</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 400, color: '#16161A', margin: 0 }}>Fastest Growing</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#8A929C', marginTop: 4 }}>Biggest gains across YouTube, TikTok, Instagram & X</p>
          </div>
          <Link href="/" style={{ fontSize: 12, color: '#8A929C', fontFamily: 'var(--sans)' }}>← Home</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CREATORS.map((c) => (
            <div key={c.handle} style={{ ...card, display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 14, padding: '18px 20px', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 800, color: c.rank <= 3 ? '#D4A843' : '#8A929C', textAlign: 'center' }}>#{c.rank}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, marginRight: 2 }}>{c.flag}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, color: '#16161A' }}>{c.name}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#8A929C' }}>{c.handle}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: `${c.color}18`, color: c.color, fontFamily: 'var(--mono)' }}>{c.platform}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  {c.tags.map(t => <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: '#6B728014', color: '#8A929C', fontFamily: 'var(--mono)' }}>{t}</span>)}
                  <span style={{ fontSize: 10, color: '#8A929C', fontFamily: 'var(--sans)', marginLeft: 4 }}>· {c.total} total</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 700, color: '#00D474' }}>{c.metric}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#8A929C', marginTop: 2 }}>this week</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
