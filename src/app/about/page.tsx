import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About DHLM Studio",
  description: "DHLM Studio is a data-driven insights platform. We make the world's data accessible, visual, and actionable.",
};

const YEAR = new Date().getFullYear();

export default function AboutPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>ABOUT</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 900, color: '#F1F5F9', margin: '0 0 8px' }}>DHLM Studio</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', margin: '0 0 40px' }}>Data-Driven Insights · Est. {YEAR}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', marginBottom: 8 }}>What We Do</h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#94A3B8', lineHeight: 1.8 }}>
              DHLM Studio makes the world&apos;s data accessible, visual, and actionable. We track stock market movers, trending creators, global rankings, and cost of living across 200+ cities — updated daily.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', marginBottom: 8 }}>Our Name</h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#94A3B8', lineHeight: 1.8 }}>
              DHLM stands for <strong style={{ color: '#E2E8F0' }}>Dream · Human · Link · Make</strong>. We dream big, connect people through data, and make tools that matter.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', marginBottom: 8 }}>What We Build</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📈', title: 'Market Movers', desc: 'Daily US stock top gainers with catalysts and company profiles' },
                { icon: '🔥', title: 'Creator Trends', desc: 'Fastest growing YouTube, TikTok, Instagram, and X creators' },
                { icon: '🏆', title: 'Global Rankings', desc: 'Billionaires, companies, GDP, population, and sports salaries' },
                { icon: '⚖️', title: 'Cost of Living', desc: 'City-by-city cost comparison across 50+ categories' },
                { icon: '🎯', title: 'Lotto PRO', desc: 'Data-driven lottery analysis with chat interface' },
                { icon: '🧮', title: 'Free Tools', desc: 'QR code generator, password generator, and more' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #1E293B' }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{item.title}</div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B', marginTop: 2 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 800, color: '#E2E8F0', marginBottom: 8 }}>Contact</h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: '#94A3B8', lineHeight: 1.8 }}>
              Email: <a href="mailto:tw.kim@dhlm.co.kr" style={{ color: '#60A5FA' }}>tw.kim@dhlm.co.kr</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
