import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DHLM Studio",
  description: "DHLM Studio Terms of Service — rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 3, marginBottom: 8 }}>LEGAL</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: '0 0 8px' }}>Terms of Service</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#475569', marginBottom: 40 }}>Last Updated: May 1, 2026</p>

        {[
          { h: '1. Acceptance of Terms', b: 'By accessing or using DHLM Studio (dhlm-studio.com), you agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not access or use our service.' },
          { h: '2. Description of Service', b: 'DHLM Studio provides financial analysis content and educational resources, including DHLM Studio Deep Dive stock reports, Investing 101 and Crypto 101 curricula, The Mental Game research series, and free investment calculators (compound interest, DCA, position sizing). All content is provided for informational and educational purposes only.' },
          { h: '3. Financial Disclaimer — No Investment Advice', b: 'DHLM Studio content is educational and informational only. Nothing on this site constitutes financial, investment, legal, or tax advice. We are not registered investment advisors. Market data, stock prices, research reports, and analysis published on this site do NOT constitute personalized investment recommendations. All investment decisions are made at the user\'s own risk. DHLM Studio / DHLM Studio shall not be liable for any losses, damages, or adverse outcomes arising from investment decisions made based on content published on this site. Past performance does not guarantee future results.' },
          { h: '4. Data Accuracy', b: 'While we strive for accuracy, we cannot guarantee that all data is current, complete, or error-free. Data is sourced from publicly available sources and licensed APIs and may have delays. Users should verify critical information from primary sources before acting on it.' },
          { h: '5. Intellectual Property', b: 'All content on this site, including reports, research, frameworks (including the Analysis Framework), editorial materials, design, and code, is the intellectual property of DHLM Studio / DHLM Studio. Unauthorized reproduction, distribution, or creation of derivative works is prohibited without explicit written permission.' },
          { h: '6. User Conduct', b: 'You agree not to: misuse the service, attempt to access unauthorized areas, interfere with service operation, or use automated systems to scrape content without permission.' },
          { h: '7. User-Generated Comments', b: 'Comments on DHLM Studio are powered by Giscus / GitHub Discussions and are user-generated content. DHLM Studio reserves the right to remove any comment that violates our community guidelines. User-generated comments do not represent the views of DHLM Studio and do not constitute investment advice.' },
          { h: '8. External Links', b: 'This site may contain links to external websites. DHLM Studio / DHLM Studio is not responsible for the content, privacy practices, or accuracy of any external sites. Links to external sites do not constitute endorsement of those sites or their content.' },
          { h: '9. Trademarks and Logos', b: 'All company names, logos, ticker symbols, and trademarks displayed on DHLM Studio are the property of their respective owners. They are used here for identification and editorial purposes only. DHLM Studio is not affiliated with, sponsored by, or endorsed by any company analyzed on this site.' },
          { h: '10. Limitation of Liability', b: 'DHLM Studio is provided "as is" without warranties of any kind, express or implied. To the maximum extent permitted by applicable law, DHLM Studio / DHLM Studio shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use or inability to use this service, including financial losses incurred from investment decisions made based on this content.' },
          { h: '11. Governing Law', b: 'These Terms of Service are governed by and construed in accordance with the laws of the Republic of Korea, without regard to conflict of law principles.' },
          { h: '12. Changes to Terms', b: 'We reserve the right to modify these Terms of Service at any time. Changes take effect upon posting. Your continued use of the site after changes constitutes acceptance of the modified Terms.' },
          { h: '13. Contact', b: 'For questions about these Terms of Service, contact us at: dhlmstudio2026@gmail.com' },
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
