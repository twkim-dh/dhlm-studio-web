import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Editorial Policy — How Brutal AI Analyzes Stocks | DHLM Studio',
  description: 'Our methodology: how Brutal AI generates stock analysis, data sources we use, quality standards, and important disclaimers.',
};

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function EditorialPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/about" style={{ fontSize: 12, color: '#64748B' }}>← About</Link>

        <div style={{ marginTop: 20, marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>EDITORIAL POLICY</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>How Brutal AI Analyzes Stocks</h1>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 6 }}>Our methodology, data sources, and commitment to accuracy</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Our Approach */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', margin: '0 0 12px' }}>Our Approach</h2>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>
              DHLM Studio combines real-time financial data with AI-generated commentary to make market analysis accessible and engaging. Our analysis follows a structured methodology: we collect data from licensed APIs, apply quantitative analysis frameworks, and present findings in a conversational tone through our Brutal AI character.
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, marginTop: 12 }}>
              Every Deep Dive report follows a consistent structure: company overview with key metrics, a unique analytical angle that goes beyond surface-level data, bull vs bear case presentation, and a Brutal AI verdict that synthesizes the analysis. We aim to present both sides of every argument, never recommending specific investment actions.
            </p>
          </div>

          {/* Data Sources */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', margin: '0 0 12px' }}>Data Sources</h2>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 14 }}>
              All data is sourced from commercially licensed APIs. We do not scrape, fabricate, or estimate data points.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Financial Modeling Prep (FMP)', use: 'Stock profiles, financial statements, company fundamentals, market cap data. Licensed for commercial use with 250 requests/day on free tier.', color: '#60A5FA' },
                { name: 'Alpha Vantage', use: 'Real-time market movers (top gainers, losers, most active), intraday quotes. Data delayed up to 15 minutes on free tier. Licensed for commercial use.', color: '#00D474' },
                { name: 'CoinGecko', use: 'Cryptocurrency prices, market capitalization, 24-hour volume, historical data. Free API with 30 requests/minute. No API key required.', color: '#F59E0B' },
                { name: 'World Bank Open Data', use: 'GDP rankings, population data, economic indicators. Public domain data, unlimited access.', color: '#D4A843' },
                { name: 'NY Open Data (data.ny.gov)', use: 'Powerball and Mega Millions lottery results. Public government data via Socrata API. Updated after each draw.', color: '#EF4444' },
              ].map(s => (
                <div key={s.name} style={{ padding: '12px 14px', borderRadius: 8, background: '#0D1117', border: '1px solid #1E293B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>{s.name}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, margin: 0 }}>{s.use}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Methodology */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', margin: '0 0 12px' }}>Analysis Methodology</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { step: '1', title: 'Data Collection', desc: 'We pull real-time data from our licensed API sources. Stock prices, financial statements, market cap, P/E ratios, revenue growth, and sector performance are collected automatically.' },
                { step: '2', title: 'Quantitative Analysis', desc: 'Key metrics are compared against sector averages, historical trends, and peer companies. We analyze P/E ratios, revenue growth rates, profit margins, debt levels, and cash flow generation.' },
                { step: '3', title: 'Qualitative Context', desc: 'We research recent news, earnings reports, product launches, regulatory actions, and competitive dynamics that affect the company\'s outlook.' },
                { step: '4', title: 'Bull vs Bear Framework', desc: 'Every analysis presents both the optimistic and pessimistic case. We never present a one-sided view. Readers see the strongest arguments for and against.' },
                { step: '5', title: 'Brutal AI Commentary', desc: 'Our AI character adds informational and educational commentary that makes complex analysis accessible. The conversational tone is designed to engage readers while the underlying analysis remains rigorously data-driven.' },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#C73E3A15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#C73E3A', flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{s.title}</div>
                    <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: '4px 0 0' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Standards */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', margin: '0 0 12px' }}>Quality Standards</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'All financial data is sourced from licensed, commercially approved APIs',
                'Data is clearly attributed to its source on every page',
                'Market data delay (up to 15 minutes) is disclosed on all relevant pages',
                'We present bull AND bear cases — never one-sided analysis',
                'We never recommend buying, selling, or holding any security',
                'All AI commentary is clearly labeled as informational and educational content',
                'NOT investment advice disclaimers appear on every analysis page',
                'We correct factual errors immediately upon discovery',
                'Our content is original — we do not copy from other financial sites',
                'Deep Dive reports are minimum 3,000 words of substantive analysis (BAAF Framework)',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#00D474', fontSize: 12, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Verification Process */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', margin: '0 0 12px' }}>Data Verification Process</h2>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, margin: '0 0 14px' }}>
              Every data point that appears in a Deep Dive report is verified through a multi-step process before publication.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { step: '1', title: 'Primary Source Pull', desc: 'Financial figures (revenue, margins, EPS, debt) are pulled from Financial Modeling Prep, sourced directly from SEC filings (10-K, 10-Q, 8-K).' },
                { step: '2', title: 'Cross-Reference', desc: 'Key metrics are cross-checked against a second source — typically the company\'s official Investor Relations page or Alpha Vantage.' },
                { step: '3', title: 'Historical Sanity Check', desc: 'Growth rates and margins are compared to 3-year and 5-year trends. Outliers (>3 standard deviations) are flagged and re-verified manually.' },
                { step: '4', title: 'Peer Validation', desc: 'Competitor metrics are pulled at the same timestamp to ensure apples-to-apples comparison in the BAAF comparison table.' },
                { step: '5', title: 'Timestamp Disclosure', desc: 'Every report includes a "Data as of" date. Real-time prices on market pages disclose the 15-minute delay.' },
                { step: '6', title: 'Correction Protocol', desc: 'If a verified error is found post-publication, the report is updated within 24 hours and a correction note is appended at the bottom.' },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#3B82F615', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#3B82F6', flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{s.title}</div>
                    <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: '4px 0 0' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What We Are NOT */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#EF4444', margin: '0 0 12px' }}>What We Are NOT</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'NOT a financial advisor — we do not provide personalized investment advice',
                'NOT a broker or dealer — we do not execute trades or hold customer funds',
                'NOT providing investment recommendations — we never say "buy" or "sell"',
                'NOT a registered investment company — all content is educational/entertainment',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#EF4444', fontSize: 12, flexShrink: 0, marginTop: 2 }}>✕</span>
                  <span style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Independence */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', margin: '0 0 12px' }}>Editorial Independence</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'No sponsored content — we do not accept payment to write about any stock or crypto',
                'No paid stock promotions — every analysis is editorially independent',
                'No affiliate trading links — we do not earn commissions on trades',
                'Revenue from display advertising only — Google AdSense is our sole revenue model',
                'No conflicts of interest — DHLM Studio does not hold positions in stocks we analyze',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#00D474', fontSize: 12, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Corrections Policy */}
          <div style={{ ...card, padding: '18px 22px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#E2E8F0', margin: '0 0 8px' }}>Corrections Policy</h2>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>
              Data errors are corrected within 24 hours of discovery. If you find an error, please contact us at <a href="mailto:dhlmstudio2026@gmail.com" style={{ color: '#60A5FA' }}>dhlmstudio2026@gmail.com</a>. Corrections are noted at the bottom of the affected article.
            </p>
          </div>

          {/* Important Disclaimers */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#C73E3A30' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#C73E3A', margin: '0 0 12px' }}>Important Disclaimers</h2>
            <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 12 }}>
                <strong style={{ color: '#E2E8F0' }}>Not Investment Advice:</strong> DHLM Studio provides data-driven analysis for educational and entertainment purposes only. Nothing on this website constitutes investment advice, a recommendation to buy or sell any security, or an offer to participate in any investment strategy. Always consult a qualified financial advisor before making investment decisions.
              </p>
              <p style={{ marginBottom: 12 }}>
                <strong style={{ color: '#E2E8F0' }}>Brutal AI Character:</strong> &ldquo;Brutal AI&rdquo; is an informational and educational analytical voice that provides data-driven commentary on market data. Its observations are generated to make financial concepts accessible and do not represent personalized investment advice. The character&apos;s BAAF scores and grades are quantitative analytical outputs, NOT buy/sell signals.
              </p>
              <p style={{ marginBottom: 12 }}>
                <strong style={{ color: '#E2E8F0' }}>Data Accuracy:</strong> While we strive for accuracy, financial data may be delayed, incomplete, or subject to revision. Market data on this site is delayed up to 15 minutes. Always verify critical data points with official sources before making decisions.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#E2E8F0' }}>No Affiliation:</strong> DHLM Studio is not affiliated with any broker, exchange, or financial institution. We do not receive compensation for mentioning any specific security or cryptocurrency.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div style={{ ...card, padding: '18px 22px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#E2E8F0', margin: '0 0 8px' }}>Questions About Our Editorial Process?</h2>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
              Contact us at <a href="mailto:dhlmstudio2026@gmail.com" style={{ color: '#60A5FA' }}>dhlmstudio2026@gmail.com</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
