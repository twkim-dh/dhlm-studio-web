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
              <strong>Brutal AI&trade;</strong> generates satirical commentary for entertainment purposes only.
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
                { icon: '🔥', title: 'Brutal AI', desc: 'Satirical stock commentary', href: '/markets' },
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
