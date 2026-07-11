import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 80, fontWeight: 400, color: '#1E293B', lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 800, color: '#16161A', margin: '16px 0 8px' }}>Page Not Found</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#8A929C', marginBottom: 32 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '10px 24px', borderRadius: 8, background: '#C73E3A', color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'var(--sans)' }}>
            Go Home
          </Link>
          <Link href="/reports" style={{ padding: '10px 24px', borderRadius: 8, background: '#FAFAF8', color: '#5B6470', border: '1px solid #E8E8E4', fontWeight: 600, fontSize: 13, fontFamily: 'var(--sans)' }}>
            Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
