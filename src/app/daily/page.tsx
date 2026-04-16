import type { Metadata } from 'next';
import Link from 'next/link';
import { getRedis } from '@/lib/redis';
import TodayMarket from '@/components/TodayMarket';
import { fmtDateShort, fmtDateLong } from '@/lib/fmt-date';
import InlineSubscribe from '@/components/InlineSubscribe';
import type { DailyBriefData } from '@/app/api/cron/daily-brief/route';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Daily Brief — Brutal Edge Market Analysis | DHLM Studio',
  description: 'Daily market briefing with index snapshots, signals, key observations, and a Brutal Edge verdict. Auto-generated every weekday at 4:05 PM ET from verified market data.',
  alternates: { canonical: 'https://dhlm-studio.com/daily' },
};

// ─── Redis loader ──────────────────────────────────────────────────────────────
interface BriefMeta {
  slug: string;
  date: string;
  status: 'ok' | 'maintenance';
  headline: string;
  description: string;
}

async function getAllBriefMetas(): Promise<BriefMeta[]> {
  try {
    const redis = getRedis();
    // SCAN for all daily-brief:* keys
    const keys: string[] = [];
    let cursor = '0';
    do {
      const [nextCursor, found] = await redis.scan(cursor, 'MATCH', 'daily-brief:*', 'COUNT', 100);
      cursor = nextCursor;
      keys.push(...found);
    } while (cursor !== '0');

    if (keys.length === 0) return [];

    // Fetch all entries in parallel
    const raws = await Promise.all(keys.map(k => redis.get(k)));
    const metas: BriefMeta[] = [];

    for (let i = 0; i < keys.length; i++) {
      const raw = raws[i];
      if (!raw) continue;
      try {
        const d = JSON.parse(raw) as DailyBriefData;
        const slug = keys[i].replace('daily-brief:', '');

        let headline = `Daily Brief — ${fmtDateLong(d.date)}`;
        let description = 'Brutal Edge daily market brief.';

        if (d.status === 'ok' && d.indices.length > 0) {
          const sp  = d.indices.find(q => q.symbol === '^GSPC');
          const vix = d.macro?.find(q => q.symbol === '^VIX');
          const btc = d.crypto?.find(c => c.id === 'bitcoin');
          const fg  = d.fearGreed;
          if (sp) {
            const dir = sp.changesPercentage >= 0 ? '+' : '';
            headline = `Daily Brief — ${fmtDateLong(d.date)}`;
            description = [
              sp  ? `S&P 500 ${dir}${sp.changesPercentage.toFixed(2)}%` : '',
              vix ? `VIX ${vix.price.toFixed(1)}` : '',
              btc ? `BTC ${btc.change24h >= 0 ? '+' : ''}${btc.change24h.toFixed(2)}%` : '',
              fg  ? fg.label : '',
            ].filter(Boolean).join(' · ');
          }
        }

        metas.push({ slug, date: d.date, status: d.status, headline, description });
      } catch { /* skip malformed entries */ }
    }

    // Sort newest first
    return metas.sort((a, b) => (b.date > a.date ? 1 : -1));
  } catch { return []; }
}

// ─── UI ────────────────────────────────────────────────────────────────────────
const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default async function DailyIndexPage() {
  const briefs = await getAllBriefMetas();
  const okBriefs = briefs.filter(b => b.status === 'ok');

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 24px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>● BRUTAL EDGE&trade; DAILY</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: '#F1F5F9', lineHeight: 1.1, margin: '0 0 16px' }}>
          Daily Brief
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#64748B', lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
          Auto-generated every weekday at 4:05 PM ET from verified closing market data. Five sections: The Number, Market Snapshot, Key Observations, Signals, and Brutal Edge Verdict.
        </p>
      </section>

      {/* Live Today's Market widget */}
      <TodayMarket />

      {/* Archive */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 3, marginBottom: 4 }}>ARCHIVE</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Past Briefs</h2>
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#475569' }}>
            {okBriefs.length} {okBriefs.length === 1 ? 'issue' : 'issues'}
          </span>
        </div>

        {briefs.length === 0 ? (
          <div style={{ ...card, padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#94A3B8', margin: '0 0 8px' }}>
              The first Daily Brief is auto-generated every weekday at 4:05 PM ET.
            </p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#475569', margin: 0 }}>
              Subscribe to receive it in your inbox the moment it publishes.
            </p>
            <Link href="/#newsletter" style={{ display: 'inline-block', marginTop: 14, padding: '10px 18px', borderRadius: 10, background: '#C73E3A', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Get Notified →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {briefs.map(b => (
              <Link
                key={b.slug}
                href={`/daily/${b.slug}`}
                style={{
                  ...card,
                  display: 'block', padding: '18px 22px', textDecoration: 'none',
                  opacity: b.status === 'maintenance' ? 0.5 : 1,
                  pointerEvents: b.status === 'maintenance' ? 'none' : 'auto',
                } as React.CSSProperties}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 2 }}>
                    {fmtDateShort(b.date)}
                  </span>
                  <span style={{ fontSize: 11, color: b.status === 'maintenance' ? '#475569' : '#475569' }}>
                    {b.status === 'maintenance' ? '🔧 Under Maintenance' : 'Read →'}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, color: '#F1F5F9', margin: '0 0 4px' }}>
                  {b.headline}
                </h3>
                {b.description && (
                  <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    {b.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <InlineSubscribe
            source="daily"
            headline="Get every Daily Brief in your inbox"
            description="One email per weekday at 4:05 PM ET. Free. CAN-SPAM compliant unsubscribe."
          />
        </div>

        <div style={{ marginTop: 24, padding: '18px 22px', borderRadius: 14, background: '#0D1117', border: '1px solid #1E293B' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 6 }}>HOW IT WORKS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, fontSize: 12, color: '#94A3B8', fontFamily: 'var(--sans)', lineHeight: 1.6 }}>
            <div>
              <strong style={{ color: '#E2E8F0' }}>4:05 PM ET</strong><br />
              Market data fetched at NYSE close
            </div>
            <div>
              <strong style={{ color: '#E2E8F0' }}>3-Stage Validation</strong><br />
              Range checks + volatility thresholds
            </div>
            <div>
              <strong style={{ color: '#E2E8F0' }}>Auto-Generated</strong><br />
              No manual authoring — data drives every section
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
