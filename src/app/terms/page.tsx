import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DHLM Studio",
  description: "DHLM Studio Terms of Service — rules and guidelines for using our platform.",
};

const YEAR = new Date().getFullYear();

export default function TermsPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 3, marginBottom: 8 }}>LEGAL</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: '0 0 8px' }}>Terms of Service</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#475569', marginBottom: 40 }}>Last updated: April {YEAR}</p>

        {[
          { h: '1. Acceptance of Terms', b: 'By accessing and using DHLM Studio (dhlm-studio.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.' },
          { h: '2. Description of Service', b: 'DHLM Studio provides financial analysis content and educational resources, including Brutal Edge™ Deep Dive stock reports, Investing 101 and Crypto 101 curricula, The Mental Game research series, and free investment calculators (compound interest, DCA, position sizing). All content is provided for informational and educational purposes only.' },
          { h: '3. No Investment Advice', b: 'Market data, stock prices, and financial information on this site do NOT constitute investment advice. We are not a registered investment advisor. Always consult a qualified financial professional before making investment decisions. Past performance is not indicative of future results.' },
          { h: '4. Data Accuracy', b: 'While we strive for accuracy, we cannot guarantee that all data is current, complete, or error-free. Data is sourced from publicly available sources and may have delays. Users should verify critical information from primary sources.' },
          { h: '5. Intellectual Property', b: 'All content, design, and code on DHLM Studio is the property of DHLM Studio. You may not reproduce, distribute, or create derivative works without explicit permission.' },
          { h: '6. User Conduct', b: 'You agree not to: misuse the service, attempt to access unauthorized areas, interfere with service operation, or use automated systems to scrape content without permission.' },
          { h: '7. User-Generated Comments', b: 'Comments on DHLM Studio are powered by a third-party discussion system (Giscus / GitHub Discussions) and are user-generated content. DHLM Studio reserves the right to remove any comment that violates our community guidelines without prior notice. Prohibited content includes but is not limited to: investment advice (buy/sell/hold recommendations), spam and promotional links, profanity and offensive content, sexually explicit material, hate speech, and personal information. Automated filtering removes obvious violations. Manual review handles edge cases. User-generated comments do not represent the views of DHLM Studio and do not constitute investment advice. Users who repeatedly violate the guidelines may be banned from commenting.' },
          { h: '8. Trademarks and Logos', b: 'All company names, logos, ticker symbols, and trademarks displayed on DHLM Studio are the property of their respective owners. They are used here for identification and editorial purposes only. DHLM Studio is not affiliated with, sponsored by, or endorsed by any company analyzed on this site. Logo display via the Clearbit Logo API does not imply any commercial relationship.' },
          { h: '9. Limitation of Liability', b: 'DHLM Studio is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our service, including but not limited to financial losses from acting on information provided.' },
          { h: '10. Changes to Terms', b: 'We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.' },
          { h: '11. Contact', b: 'For questions about these terms: dhlmstudio2026@gmail.com' },
        ].map(s => (
          <div key={s.h} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 700, color: '#E2E8F0', marginBottom: 8 }}>{s.h}</h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#94A3B8', lineHeight: 1.8, margin: 0 }}>{s.b}</p>
          </div>
        ))}
      </article>
    </div>
  );
}
