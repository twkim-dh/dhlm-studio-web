import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About DHLM Studio — Data-Driven Financial Analysis for Serious Investors",
  description: "DHLM Studio: the tools and data serious investors check before making a move. Market analysis, Deep Dive reports, free calculators, and crypto education. Not financial advice.",
  alternates: { canonical: 'https://dhlm-studio.com/about' },
};

const card = { background: '#111827', borderRadius: 14, border: '1px solid #1E293B' };

export default function AboutPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px' }}>
        <Link href="/" style={{ fontSize: 12, color: '#64748B' }}>← Home</Link>

        <div style={{ marginTop: 20, marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>ABOUT US</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: '0 0 4px' }}>DHLM Studio</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: '#D4A843', fontWeight: 600, margin: 0 }}>Dream · Horizon · Link · Media</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Mission — new positioning copy */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 10 }}>WHAT WE ARE</div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#D4A843', lineHeight: 1.5, margin: '0 0 16px' }}>
              &ldquo;The tools and data serious investors check before making a move.&rdquo;
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.9, margin: '0 0 14px' }}>
              Brutal Edge is built for investors focused on AI, semiconductors, and quantum computing — aged 20–40, serious about long-term capital allocation in the technologies shaping the next decade.
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.9, margin: '0 0 14px' }}>
              We do not tell you what to buy. We show you what the data says.
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.9, margin: '0 0 16px' }}>
              Every week, we break down stocks and crypto with the depth of institutional research — without the paywall or the agenda. And we build the tools that let you run your own numbers before risking your own money.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 16px', background: '#0D1117', borderRadius: 10, border: '1px solid #1E293B' }}>
              {[
                { icon: '📊', text: 'Data before opinions' },
                { icon: '🔧', text: 'Tools before tips' },
                { icon: '🎯', text: 'Honesty before hype' },
              ].map(p => (
                <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>{p.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{p.text}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.8, margin: '14px 0 0' }}>
              Brutal Edge is our editorial voice. Sharp, direct, and allergic to hype. If the data says a stock is overvalued, we say so. If we do not know, we say that too. Built by DHLM Studio. Powered by data. <strong style={{ color: '#C73E3A' }}>Not financial advice.</strong>
            </p>
          </div>

          {/* Editorial Team */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#D4A84330' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#D4A843', letterSpacing: 2, marginBottom: 10 }}>EDITORIAL TEAM</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, color: '#F1F5F9', marginBottom: 6 }}>Editor-in-Chief</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#94A3B8', lineHeight: 1.9 }}>
                <li>Oversees all published content</li>
                <li>15+ years in manufacturing and business operations</li>
                <li>Directs the BEAF analysis framework</li>
                <li>Final approval on all Deep Dive reports</li>
                <li>Cross-verifies analysis against multiple independent data sources</li>
              </ul>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, color: '#F1F5F9', marginBottom: 6 }}>Brutal Edge&trade; Analytical Voice</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#94A3B8', lineHeight: 1.9 }}>
                <li>Built on institutional equity research standards</li>
                <li>Grounded in the BEAF 6-axis scoring framework</li>
                <li>Operates under editorial oversight</li>
                <li>Never publishes without editor approval</li>
              </ul>
            </div>
          </div>

          {/* BEAF Framework */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#C73E3A30' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 10 }}>OUR FRAMEWORK</div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.5, margin: '0 0 10px' }}>
              BEAF — Brutal Edge Analysis Framework
            </p>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.8, margin: '0 0 14px' }}>
              Every Brutal Edge&trade; Deep Dive uses our proprietary <strong style={{ color: '#E2E8F0' }}>BEAF scoring system</strong> — a standardized 100-point methodology built to bring institutional-grade rigor to retail-friendly analysis. Stocks are scored across six axes, then assigned a letter grade (A through F) so readers can compare any two companies on the same scale.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginBottom: 14 }}>
              {[
                { axis: 'GROWTH', pts: 25, color: '#00D474', desc: 'Revenue CAGR, earnings growth, TAM penetration, new markets' },
                { axis: 'PROFITABILITY', pts: 20, color: '#3B82F6', desc: 'Gross / operating / net margins, FCF generation' },
                { axis: 'MOAT', pts: 20, color: '#A78BFA', desc: 'Market share, switching costs, network effects, IP, brand' },
                { axis: 'VALUATION', pts: 15, color: '#D4A843', desc: 'PEG, P/E vs history, P/E vs peers, DCF upside' },
                { axis: 'RISK', pts: 10, color: '#EF4444', desc: 'Debt, concentration, regulatory, competitive threat' },
                { axis: 'MOMENTUM', pts: 10, color: '#F59E0B', desc: 'Earnings beats, analyst revisions, insider & institutional flow' },
              ].map(a => (
                <div key={a.axis} style={{ padding: '10px 12px', borderRadius: 8, background: '#0D1117', border: '1px solid #1E293B' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: a.color, letterSpacing: 1 }}>{a.axis}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#475569' }}>{a.pts}pts</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5, margin: '4px 0 0' }}>{a.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: '#94A3B8' }}>Grade scale:</strong> 90+ = A (Brutal Edge Approved) · 80–89 = B+/A− · 70–79 = B/B− · 60–69 = C/C+ · &lt; 60 = D/F. <Link href="/editorial" style={{ color: '#C73E3A' }}>Read full methodology →</Link>
            </p>
          </div>

          {/* Editorial Standards */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#60A5FA30' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#60A5FA', letterSpacing: 2 }}>EDITORIAL STANDARDS</div>
              <Link href="/editorial" style={{ fontSize: 10, color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>Full editorial page →</Link>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.6, margin: '0 0 12px' }}>
              Every Brutal Edge report follows four non-negotiable editorial standards:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Original Analysis', desc: 'We do not summarize or repackage existing content. Every report starts from primary sources — SEC filings, earnings transcripts, official disclosures.' },
                { label: 'Data-Driven', desc: 'Claims are supported by verified data. All figures are cross-referenced against at least two independent sources before publication.' },
                { label: 'Framework-First', desc: 'Analysis follows the BEAF framework before narrative is written. The data shapes the story — not the other way around.' },
                { label: 'Honest on Uncertainty', desc: 'Where data is ambiguous or the outcome is uncertain, we say so explicitly. We do not manufacture conviction we do not have.' },
              ].map(s => (
                <div key={s.label} style={{ padding: '10px 14px', borderRadius: 8, background: '#0D1117', border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#60A5FA', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Update Frequency */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 10 }}>UPDATE FREQUENCY</div>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, margin: '0 0 12px' }}>
              How often each part of DHLM Studio refreshes:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { what: 'Brutal Edge Deep Dive Reports', when: 'New report weekly', color: '#C73E3A' },
                { what: 'The Mental Game & Structural View', when: 'New essays weekly', color: '#A78BFA' },
                { what: 'Investing 101 Intermediate', when: 'New lesson weekly (W13–W24)', color: '#3B82F6' },
                { what: 'Investing 101 Beginner', when: '12-lesson curriculum (complete)', color: '#60A5FA' },
                { what: 'Crypto 101', when: '12-week curriculum (complete)', color: '#F59E0B' },
                { what: 'Wall Street Wisdom', when: '100 curated investing quotes', color: '#D4A843' },
                { what: 'Editorial Policy & Methodology', when: 'Reviewed monthly', color: '#64748B' },
              ].map(u => (
                <div key={u.what} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1E293B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: u.color }} />
                    <span style={{ fontSize: 13, color: '#E2E8F0' }}>{u.what}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: u.color, fontWeight: 600 }}>{u.when}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#3B82F6', letterSpacing: 2, marginBottom: 10 }}>DATA SOURCES</div>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 14 }}>
              Our data comes from officially licensed sources and authoritative public institutions. All figures are attributed to their primary source within each report.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Financial Modeling Prep (FMP)', desc: 'Stock profiles, financial statements, SEC filings (10-K, 10-Q, 8-K), earnings data', color: '#60A5FA', href: 'https://financialmodelingprep.com' },
                { name: 'CoinGecko', desc: 'Cryptocurrency prices, market cap, 24h volume, historical price data', color: '#F59E0B', href: 'https://www.coingecko.com' },
                { name: 'IEA — International Energy Agency', desc: 'Energy production, consumption, AI power demand forecasts (Energy and AI 2025 report)', color: '#00D474', href: 'https://www.iea.org' },
                { name: 'SEC EDGAR', desc: 'Official company filings, prospectuses, proxy statements, 13-F holdings', color: '#A78BFA', href: 'https://www.sec.gov/edgar' },
                { name: 'Federal Reserve (FRED)', desc: 'Macroeconomic data: interest rates, inflation, GDP, monetary policy', color: '#C73E3A', href: 'https://fred.stlouisfed.org' },
                { name: 'NIST — National Institute of Standards and Technology', desc: 'Quantum computing standards, post-quantum cryptography, technical frameworks', color: '#64748B', href: 'https://www.nist.gov' },
              ].map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid #1E293B' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', textDecoration: 'none' }}>{s.name} ↗</a>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#C73E3A30' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 10 }}>DISCLAIMER</div>
            <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.8, margin: '0 0 8px' }}>
              All <strong>Brutal Edge&trade;</strong> analysis is informational and educational commentary based on publicly available financial data, published under editorial oversight.
            </p>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>
              It is <strong style={{ color: '#C73E3A' }}>NOT investment advice</strong>. Opinions expressed are analytical observations, not personalized recommendations. Always do your own research and consult a qualified financial advisor before making investment decisions.
            </p>
          </div>

          {/* What We Build */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#A78BFA', letterSpacing: 2, marginBottom: 10 }}>WHAT WE BUILD</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {[
                { icon: '🔥', title: 'Deep Dive Reports', desc: 'Institutional-grade stock analysis (BEAF)', href: '/reports' },
                { icon: '🧠', title: 'The Mental Game', desc: 'Behavioral investing psychology series', href: '/research' },
                { icon: '🔭', title: 'The Structural View', desc: 'Quarterly macro & sector research', href: '/research' },
                { icon: '📚', title: 'Crypto 101', desc: '12-week beginner curriculum (complete)', href: '/learn/crypto-101' },
                { icon: '🎓', title: 'Investing 101 Beginner', desc: '12-lesson beginner curriculum (complete)', href: '/learn/investing-101-beginner' },
                { icon: '📈', title: 'Investing 101 Intermediate', desc: 'Advanced valuation, moat analysis, forensics', href: '/learn?tab=investing-101' },
                { icon: '📝', title: 'The Masters Blog', desc: 'Lessons from Lynch, Munger, Druckenmiller', href: '/blog' },
                { icon: '💡', title: 'Wall Street Wisdom', desc: '100 curated investing quotes', href: '/blog/wisdom' },
              ].map(item => (
                <Link key={item.title} href={item.href} style={{ padding: '12px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B', textDecoration: 'none' }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', marginTop: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Our Tools (Calculators) */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#F59E0B20' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#F59E0B', letterSpacing: 2, marginBottom: 10 }}>OUR TOOLS — FREE CALCULATORS</div>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: '0 0 14px' }}>
              Run the numbers yourself. No account, no paywall, no email required.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '📈', title: 'Compound Interest Calculator', desc: 'See how your money grows over time with monthly contributions and a year-by-year breakdown.', href: '/calculators/compound-interest', badge: 'LIVE' },
                { icon: '📊', title: 'DCA Calculator', desc: 'Simulate dollar cost averaging into BTC, ETH, S&P 500, or any asset. Compare against lump sum.', href: '/calculators/dca', badge: 'LIVE' },
                { icon: '🎯', title: 'Position Size Calculator', desc: 'How much should you invest per trade? Calculate based on your risk tolerance and stop loss.', href: '/calculators/position-size', badge: 'LIVE' },
              ].map(item => (
                <Link key={item.title} href={item.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{item.desc}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--mono)', flexShrink: 0, marginLeft: 8,
                    background: item.badge === 'LIVE' ? '#00D47418' : '#475569',
                    color: item.badge === 'LIVE' ? '#00D474' : '#94A3B8',
                  }}>{item.badge}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Content Curation Policy */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#00D47430' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 10 }}>CONTENT CURATION POLICY</div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.6, margin: '0 0 12px' }}>
              Every article on Brutal Edge is manually researched, written, and reviewed by a human editor before publication.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Deep Dive reports represent extensive original research, typically including 3,000+ words of substantive analysis with multiple data cross-references',
                'All financial data is independently verified against SEC filings and official company disclosures',
                'No content is auto-generated or published without editorial approval',
                'The Mental Game and Structural View series are original essays, not summaries or rewrites',
                'Investing 101 and Crypto 101 curricula are purpose-built for retail investors — not repurposed from other sources',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#00D474', fontWeight: 800, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Policy Link */}
          <Link href="/editorial" style={{ display: 'block', ...card, padding: '16px 20px', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#C73E3A' }}>Editorial Policy</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>How Brutal Edge analyzes stocks — methodology, data sources, disclaimers</div>
              </div>
              <span style={{ color: '#475569', fontSize: 12 }}>→</span>
            </div>
          </Link>

          {/* Editorial Process */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 14 }}>EDITORIAL PROCESS</div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, marginBottom: 16 }}>
              Every piece of analysis published under the Brutal Edge name is produced through a defined, human-led editorial process. Our editorial team sets the research agenda, draws the analytical conclusions, and takes responsibility for every published claim.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#C73E3A', marginBottom: 4 }}>Stage 1 — Research Agenda &amp; Hypothesis</div>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: 0 }}>Human editors select the topic, define the investment question, and establish the analytical thesis before any research begins. Topics are chosen based on market relevance and reader value — not algorithmic popularity signals.</p>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#C73E3A', marginBottom: 4 }}>Stage 2 — Data Collection &amp; Verification</div>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: 0 }}>Editors gather data directly from primary sources: company filings (SEC EDGAR), official earnings transcripts, regulatory publications, and authoritative market data providers. Every data point is cross-verified before inclusion. Sources are cited in each report.</p>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#C73E3A', marginBottom: 4 }}>Stage 3 — Analysis &amp; Writing</div>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: 0 }}>Human analysts develop the argument, apply the BEAF scoring framework, and write the full report. All analytical conclusions, risk assessments, and investment framings are produced and owned by our editorial team — not generated by automated systems.</p>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#C73E3A', marginBottom: 4 }}>Stage 4 — Editorial Review &amp; Publication</div>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: 0 }}>Before publication, each report is reviewed for factual accuracy, internal consistency, and compliance with our editorial standards. Publication decisions — including timing, framing, and emphasis — are made by human editors.</p>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: '12px 14px', background: '#0F172A', borderRadius: 6, borderLeft: '3px solid #334155' }}>
              <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#94A3B8' }}>AI Tool Disclosure:</strong> We use AI-assisted tools selectively for data formatting, proofreading, and structural organization. AI tools do not determine our research topics, write our analysis, or make editorial judgments. All content decisions are made by human editors.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#64748B', letterSpacing: 2, marginBottom: 10 }}>CONTACT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 13, color: '#94A3B8' }}>
                📧 Email: <a href="mailto:dhlmstudio2026@gmail.com" style={{ color: '#60A5FA' }}>dhlmstudio2026@gmail.com</a>
              </div>
              <div style={{ fontSize: 13, color: '#94A3B8' }}>
                𝕏 Twitter: <a href="https://x.com/dhlm_studio" target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>@dhlm_studio</a>
              </div>
              <div style={{ fontSize: 13, color: '#94A3B8' }}>
                🌐 Website: <a href="https://dhlm-studio.com" style={{ color: '#60A5FA' }}>dhlm-studio.com</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
