import Link from 'next/link';

interface Props {
  sources: string[];
}

export default function ContentSources({ sources }: Props) {
  if (!sources || sources.length === 0) return null;

  return (
    <div style={{
      marginTop: 40,
      padding: '20px 22px',
      borderRadius: 10,
      background: '#0D1117',
      border: '1px solid #1E293B',
    }}>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 9,
        fontWeight: 800,
        color: '#3B82F6',
        letterSpacing: 2,
        marginBottom: 12,
      }}>
        PRIMARY SOURCES
      </div>
      <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.6, margin: '0 0 12px' }}>
        All quantitative claims in this report are verifiable against the following primary sources.
        All claims are verified against primary sources, not secondary aggregators.
      </p>
      <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sources.map((src, i) => {
          // Format: "Label — Source — URL" or "Label — URL" or plain text
          const urlMatch = src.match(/^(.+?)\s*—\s*(.+?)\s*—\s*(https?:\/\/\S+)$/);
          const urlShort = src.match(/^(.+?)\s*—\s*(https?:\/\/\S+)$/);
          if (urlMatch) {
            return (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#3B82F6', fontSize: 10, flexShrink: 0, marginTop: 2 }}>▸</span>
                <span style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6 }}>
                  <strong style={{ color: '#94A3B8' }}>{urlMatch[1]}</strong>
                  {' — '}{urlMatch[2]}
                  {' — '}
                  <a href={urlMatch[3]} target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', textDecoration: 'none' }}>
                    {urlMatch[3].replace(/^https?:\/\//, '').split('/')[0]}
                  </a>
                </span>
              </li>
            );
          }
          if (urlShort) {
            return (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#3B82F6', fontSize: 10, flexShrink: 0, marginTop: 2 }}>▸</span>
                <span style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6 }}>
                  <strong style={{ color: '#94A3B8' }}>{urlShort[1]}</strong>
                  {' — '}
                  <a href={urlShort[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', textDecoration: 'none' }}>
                    {urlShort[2].replace(/^https?:\/\//, '').split('/')[0]}
                  </a>
                </span>
              </li>
            );
          }
          return (
            <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#3B82F6', fontSize: 10, flexShrink: 0, marginTop: 2 }}>▸</span>
              <span style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.6 }}>{src}</span>
            </li>
          );
        })}
      </ul>
      <p style={{ fontSize: 10, color: '#334155', lineHeight: 1.6, margin: '12px 0 0' }}>
        See also:{' '}
        <Link href="/editorial#beaf" style={{ color: '#3B82F6', textDecoration: 'none' }}>Analysis Framework methodology</Link>
        {' · '}
        <Link href="/disclaimer" style={{ color: '#3B82F6', textDecoration: 'none' }}>Financial Disclaimer</Link>
      </p>
    </div>
  );
}
