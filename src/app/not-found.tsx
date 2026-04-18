import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 80, fontWeight: 900, color: '#1E293B', lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 800, color: '#F1F5F9', margin: '16px 0 8px' }}>Page Not Found</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', marginBottom: 32 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '10px 24px', borderRadius: 8, background: '#C73E3A', color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'var(--sans)' }}>
            Go Home
          </Link>
          <Link href="/markets" style={{ padding: '10px 24px', borderRadius: 8, background: '#111827', color: '#94A3B8', border: '1px solid #1E293B', fontWeight: 600, fontSize: 13, fontFamily: 'var(--sans)' }}>
            Markets
          </Link>
          <Link href="/rankings" style={{ padding: '10px 24px', borderRadius: 8, background: '#111827', color: '#94A3B8', border: '1px solid #1E293B', fontWeight: 600, fontSize: 13, fontFamily: 'var(--sans)' }}>
            Rankings
          </Link>
        </div>
      </div>
    </div>
  );
}
