import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DHLM Studio",
  description: "DHLM Studio Privacy Policy — how we collect, use, and protect your data.",
};

const YEAR = new Date().getFullYear();

export default function PrivacyPage() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: 3, marginBottom: 8 }}>LEGAL</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: '0 0 8px' }}>Privacy Policy</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#475569', marginBottom: 40 }}>Last updated: April {YEAR}</p>

        {[
          { h: '1. Information We Collect', b: 'We collect minimal data: anonymous usage analytics (page views, device type) through Google Analytics, and any information you voluntarily provide through contact forms. We do not collect personal identification information unless you explicitly provide it.' },
          { h: '2. How We Use Information', b: 'Usage data is used to improve our service, understand traffic patterns, and optimize content. We do not sell, trade, or share personal information with third parties except as required by law.' },
          { h: '3. Cookies & Tracking', b: 'We use cookies for Google Analytics and Google AdSense. These help us understand how visitors use the site and serve relevant advertisements. You can disable cookies in your browser settings.' },
          { h: '4. Third-Party Services', b: 'Google Analytics: Traffic analysis. Google AdSense: Display advertising. Vercel: Hosting and deployment. These services may collect data according to their own privacy policies.' },
          { h: '5. Data Security', b: 'We implement reasonable security measures to protect data. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.' },
          { h: '6. Children\'s Privacy', b: 'Our service is not directed to children under 13. We do not knowingly collect personal information from children.' },
          { h: '7. Changes to This Policy', b: 'We may update this policy from time to time. Changes will be posted on this page with an updated revision date.' },
          { h: '8. Contact', b: 'For privacy-related inquiries: dhlmstudio2026@gmail.com' },
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
