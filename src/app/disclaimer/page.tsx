import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Financial Disclaimer | DHLM Studio',
  description: 'Full financial disclaimer for DHLM Studio. All content is educational and informational only. Not investment advice.',
  alternates: { canonical: 'https://dhlm-studio.com/disclaimer' },
};

const sections = [
  {
    h: '1. Educational and Informational Purposes Only',
    b: 'DHLM Studio (the "Site") is a publisher of financial market research and educational content. All content on this Site, including but not limited to Deep Dive reports, Special Reports, Sector Reports, Academy lessons, blog posts, and any other published material, is provided for educational and informational purposes only.',
  },
  {
    h: '2. Not Investment Advice',
    b: null,
    list: [
      'Personalized investment advice',
      'A recommendation to buy, sell, or hold any security',
      'Tax advice',
      'Legal advice',
      'Accounting advice',
      'A guarantee of any investment outcome',
      'An offer or solicitation of any security',
    ],
    prefix: 'Nothing on this Site constitutes:',
  },
  {
    h: '3. Not a Registered Advisor',
    b: 'DHLM Studio is not registered as an investment advisor, broker-dealer, or financial planner under any jurisdiction. We do not provide personalized financial advice. Readers seeking such advice should consult appropriately licensed professionals.',
  },
  {
    h: '4. Investment Risk',
    b: 'All investments carry risk, including the potential loss of principal. Past performance does not guarantee or predict future results. Market conditions change rapidly and historical analysis may not reflect current or future market behavior.',
  },
  {
    h: '5. Reader Responsibility',
    b: null,
    list: [
      'Conducting independent research before making any investment decision',
      'Consulting licensed financial advisors regarding personal financial situations',
      'Considering personal risk tolerance, investment goals, and financial circumstances',
      'Verifying information presented on this Site against primary sources',
      'Never investing funds they cannot afford to lose',
    ],
    prefix: 'Each reader is solely responsible for:',
  },
  {
    h: '6. Information Accuracy',
    b: 'While DHLM Studio strives to publish accurate, well-researched content, we make no warranties or representations as to the accuracy, completeness, or timeliness of any content. Information may become outdated. Readers should verify all data against primary sources before relying on it.',
  },
  {
    h: '7. Analysis Framework Disclosure',
    b: 'The Analysis Framework is a proprietary qualitative and quantitative framework developed for DHLM Studio for the purpose of consistent comparative analysis. scores are analytical opinions, not predictions. They reflect framework-based judgment as of the publication date and may change as new information becomes available.',
  },
  {
    h: '8. Forward-Looking Statements',
    b: 'Some content may contain forward-looking statements regarding companies, sectors, markets, or economic conditions. These statements reflect analysis based on currently available information and assumptions. Actual outcomes may differ materially from these statements. Forward-looking statements should not be relied upon as factual.',
  },
  {
    h: '9. Third-Party Content and Links',
    b: 'This Site may reference or link to third-party content, including news sources, regulatory filings, and external websites. DHLM Studio does not endorse and is not responsible for the accuracy or content of third-party sources.',
  },
  {
    h: '10. No Conflicts of Interest',
    b: null,
    list: [
      'Does not accept payment for coverage',
      'Does not solicit investment management business through content',
      'Does not engage in pump-and-dump schemes or coordinated promotion',
      'Discloses any material relationships with covered entities (currently: none)',
    ],
    prefix: 'DHLM Studio:',
  },
  {
    h: '11. Limitation of Liability',
    b: 'By accessing this Site, you acknowledge that DHLM Studio, its editors, contributors, and affiliates shall not be liable for any damages, losses, or adverse outcomes arising from investment decisions made based on content published on this Site.',
  },
  {
    h: '12. Acceptance',
    b: 'By continuing to access or use this Site, you acknowledge that you have read, understood, and accept the terms of this Financial Disclaimer.',
  },
  {
    h: '13. Contact',
    b: null,
    contact: true,
  },
];

export default function DisclaimerPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/" style={{ fontSize: 12, color: '#8A929C', textDecoration: 'none' }}>← Home</Link>

        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#8A929C', letterSpacing: 3, marginBottom: 8 }}>LEGAL</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 400, color: '#16161A', margin: '0 0 8px' }}>Financial Disclaimer</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#8A929C', marginBottom: 32 }}>Last Updated: May 1, 2026</p>
        </div>

        {/* Highlighted summary */}
        <div style={{ background: '#C73E3A10', border: '1px solid #C73E3A30', borderRadius: 10, padding: '16px 20px', marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, marginBottom: 8 }}>⚠ IMPORTANT NOTICE</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#5B6470', lineHeight: 1.7, margin: 0 }}>
            All content published on this site is for <strong style={{ color: '#16161A' }}>educational and informational purposes only</strong>.
            Nothing constitutes investment advice, a recommendation to buy or sell any security, or personalized financial guidance.
            All investment decisions are made at the reader&apos;s own risk.
          </p>
        </div>

        {sections.map(s => (
          <div key={s.h} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 700, color: '#16161A', marginBottom: 8, marginTop: 0 }}>{s.h}</h2>
            {'prefix' in s && s.prefix && (
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#5B6470', lineHeight: 1.8, marginBottom: 8, marginTop: 0 }}>{s.prefix}</p>
            )}
            {s.b && (
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#5B6470', lineHeight: 1.8, margin: 0 }}>{s.b}</p>
            )}
            {'list' in s && s.list && (
              <ul style={{ margin: 0, paddingLeft: 22 }}>
                {s.list.map(item => (
                  <li key={item} style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#5B6470', lineHeight: 1.8, marginBottom: 4 }}>{item}</li>
                ))}
              </ul>
            )}
            {'contact' in s && s.contact && (
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#5B6470', lineHeight: 1.8, margin: 0 }}>
                For questions regarding this Financial Disclaimer, contact us through our{' '}
                <Link href="/contact" style={{ color: '#2D2F8F', textDecoration: 'none' }}>Contact page</Link>.
              </p>
            )}
          </div>
        ))}

        <div style={{ marginTop: 40, padding: '14px 18px', borderRadius: 8, border: '1px solid #E8E8E4', background: '#FAFAF8' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#8A929C', margin: 0, lineHeight: 1.7 }}>
            This Financial Disclaimer is effective as of May 1, 2026, and may be updated from time to time. The most recent version is always available at this URL.
            See also: <Link href="/editorial" style={{ color: '#2D2F8F', textDecoration: 'none' }}>Editorial Standards</Link> · <Link href="/terms" style={{ color: '#2D2F8F', textDecoration: 'none' }}>Terms of Service</Link> · <Link href="/privacy" style={{ color: '#2D2F8F', textDecoration: 'none' }}>Privacy Policy</Link>
          </p>
        </div>
      </article>
    </div>
  );
}
