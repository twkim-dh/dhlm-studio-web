import Link from 'next/link';

export default function ContentDisclaimer() {
  return (
    <div style={{
      marginTop: 40,
      padding: '16px 20px',
      borderRadius: 10,
      background: '#0D1117',
      border: '1px solid #1E293B',
    }}>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 9,
        fontWeight: 800,
        color: '#C73E3A',
        letterSpacing: 2,
        marginBottom: 8,
      }}>
        ⚠ DISCLAIMER
      </div>
      <p style={{
        fontSize: 11,
        color: '#64748B',
        lineHeight: 1.7,
        margin: '0 0 6px',
        fontStyle: 'italic',
      }}>
        <strong style={{ color: '#94A3B8', fontStyle: 'normal' }}>Disclosure:</strong>{' '}
        This analysis is written by an active investor who manages a real portfolio based on this research.
        The author holds or may hold positions in the securities, sectors, or digital assets discussed.
        Specific holdings material to a report are disclosed within that report.
      </p>
      <p style={{
        fontSize: 11,
        color: '#475569',
        lineHeight: 1.7,
        margin: '0 0 8px',
      }}>
        This content is for educational and informational purposes only. It does not constitute
        financial advice, investment advice, or any recommendation to buy or sell securities.
        Investment decisions should be made based on your own research and consultation with
        qualified financial advisors. Past performance does not guarantee future results.
        DHLM Studio does not assume any liability for losses incurred from
        investment decisions made based on this content.
      </p>
      <Link href="/disclaimer" style={{ fontSize: 11, color: '#60A5FA', textDecoration: 'none' }}>
        Read full Financial Disclaimer →
      </Link>
    </div>
  );
}
