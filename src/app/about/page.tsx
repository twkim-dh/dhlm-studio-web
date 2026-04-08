import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About DHLM Studio — Dream · Horizon · Link · Media",
  description: "DHLM Studio transforms complex financial data into clear, engaging insights. Learn about our mission, data sources, and charity commitment.",
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

          {/* Mission */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 10 }}>OUR MISSION</div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.5, margin: '0 0 12px' }}>
              We transform complex financial data into clear, engaging insights for everyone.
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>
              DHLM Studio tracks 500+ stocks, 100+ cryptocurrencies, global rankings, and lottery data — updated in real-time. Our Brutal AI commentary makes financial data entertaining while our tools help you explore the world in numbers.
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
                <li>Directs AI analysis framework (BAAF)</li>
                <li>Final approval on all Deep Dive reports</li>
                <li>Cross-verifies analysis using multiple AI models</li>
              </ul>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 800, color: '#F1F5F9', marginBottom: 6 }}>Brutal AI&trade; Analysis Engine</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#94A3B8', lineHeight: 1.9 }}>
                <li>AI-powered data collection and initial analysis</li>
                <li>Trained on institutional equity research standards</li>
                <li>Operates under human editorial oversight</li>
                <li>Never publishes without editor approval</li>
              </ul>
            </div>
          </div>

          {/* BAAF Framework */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#C73E3A30' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 10 }}>OUR FRAMEWORK</div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.5, margin: '0 0 10px' }}>
              BAAF — Brutal AI Analysis Framework
            </p>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.8, margin: '0 0 14px' }}>
              Every Brutal AI&trade; Deep Dive uses our proprietary <strong style={{ color: '#E2E8F0' }}>BAAF scoring system</strong> — a standardized 100-point methodology built to bring institutional-grade rigor to retail-friendly analysis. Stocks are scored across six axes, then assigned a letter grade (A through F) so readers can compare any two companies on the same scale.
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
              <strong style={{ color: '#94A3B8' }}>Grade scale:</strong> 90+ = A (Brutal AI Approved) · 80–89 = B+/A− · 70–79 = B/B− · 60–69 = C/C+ · &lt; 60 = D/F. <Link href="/editorial" style={{ color: '#C73E3A' }}>Read full methodology →</Link>
            </p>
          </div>

          {/* Update Frequency */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 10 }}>UPDATE FREQUENCY</div>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, margin: '0 0 12px' }}>
              How often each part of DHLM Studio refreshes:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { what: 'Stock Market Movers', when: 'Real-time (15-min delayed)', color: '#00D474' },
                { what: 'Cryptocurrency Prices', when: 'Real-time via CoinGecko', color: '#F59E0B' },
                { what: 'Brutal AI Deep Dive Reports', when: 'New report weekly', color: '#C73E3A' },
                { what: 'Wall Street Wisdom Blog', when: 'Daily quote rotation', color: '#D4A843' },
                { what: 'Global Rankings (GDP, billionaires)', when: 'Quarterly refresh', color: '#A78BFA' },
                { what: 'US Lottery Results', when: 'Within hours of each draw', color: '#EF4444' },
                { what: 'Editorial Policy & Methodology', when: 'Reviewed monthly', color: '#3B82F6' },
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
              Our data comes from officially licensed sources. All APIs are used within their commercial license terms.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Financial Modeling Prep', desc: 'Stock profiles, financials, company data', color: '#60A5FA' },
                { name: 'Alpha Vantage', desc: 'Real-time market movers (gainers, losers, most active)', color: '#00D474' },
                { name: 'CoinGecko', desc: 'Cryptocurrency prices, market cap, 24h changes', color: '#F59E0B' },
                { name: 'World Bank Open Data', desc: 'GDP, population, and economic indicators', color: '#D4A843' },
                { name: 'NY Open Data', desc: 'Powerball & Mega Millions lottery results (2,200+ draws)', color: '#EF4444' },
              ].map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #1E293B' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{s.name}</span>
                    <span style={{ fontSize: 12, color: '#64748B', marginLeft: 8 }}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Disclaimer */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#C73E3A30' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#C73E3A', letterSpacing: 2, marginBottom: 10 }}>AI DISCLAIMER</div>
            <p style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.8, margin: '0 0 8px' }}>
              <strong>Brutal AI&trade;</strong> generates informational and educational commentary based on publicly available financial data.
            </p>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>
              It is <strong style={{ color: '#C73E3A' }}>NOT investment advice</strong>. The AI character expresses exaggerated opinions that do not reflect the views of DHLM Studio. Always do your own research and consult a qualified financial advisor before making investment decisions.
            </p>
          </div>

          {/* Charity */}
          <div style={{ ...card, padding: '24px 22px', borderColor: '#00D47430' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#00D474', letterSpacing: 2, marginBottom: 10 }}>CHARITY COMMITMENT</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>❤️</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', margin: 0 }}>Fortune Buddha — 100% to Charity</p>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>DHLM Studio takes zero profit from donations</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>
              All donations made through our <Link href="/markets/bless" style={{ color: '#D4A843' }}>Bless My Stock</Link> feature go directly to <strong style={{ color: '#E2E8F0' }}>St. Jude Children&apos;s Research Hospital</strong> — where families never receive a bill for treatment, travel, housing, or food.
            </p>
          </div>

          {/* What We Build */}
          <div style={{ ...card, padding: '24px 22px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: '#A78BFA', letterSpacing: 2, marginBottom: 10 }}>WHAT WE BUILD</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {[
                { icon: '📈', title: 'Market Movers', desc: 'Daily gainers, losers & most active', href: '/markets' },
                { icon: '🔥', title: 'Brutal AI', desc: 'Data-driven stock analysis', href: '/markets' },
                { icon: '🏆', title: 'World Rankings', desc: 'Billionaires, GDP, companies', href: '/rankings' },
                { icon: '🪙', title: 'Crypto Rankings', desc: 'Live prices & analysis', href: '/rankings/crypto' },
                { icon: '🎰', title: 'US Lottery', desc: 'Powerball & Mega Millions', href: '/lottery' },
                { icon: '🪷', title: 'Bless My Stock', desc: 'Fortune Buddha charity', href: '/markets/bless' },
                { icon: '💡', title: 'Wall Street Wisdom', desc: '100 investing quotes', href: '/blog/wisdom' },
                { icon: '🧮', title: 'Free Tools', desc: 'QR & password generators', href: '/tools' },
              ].map(item => (
                <Link key={item.title} href={item.href} style={{ padding: '12px 14px', borderRadius: 10, background: '#0D1117', border: '1px solid #1E293B', textDecoration: 'none' }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', marginTop: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Editorial Policy Link */}
          <Link href="/editorial" style={{ display: 'block', ...card, padding: '16px 20px', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#C73E3A' }}>Editorial Policy</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>How Brutal AI analyzes stocks — methodology, data sources, disclaimers</div>
              </div>
              <span style={{ color: '#475569', fontSize: 12 }}>→</span>
            </div>
          </Link>

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
