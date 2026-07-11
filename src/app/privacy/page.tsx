import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DHLM Studio",
  description: "DHLM Studio Privacy Policy — how we collect, use, and protect your data, including Google AdSense and Analytics cookie disclosures.",
};

export default function PrivacyPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <article style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#8A929C', letterSpacing: 3, marginBottom: 8 }}>LEGAL</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 400, color: '#16161A', margin: '0 0 8px' }}>Privacy Policy</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#8A929C', marginBottom: 40 }}>Last Updated: May 1, 2026</p>

        {[
          {
            h: '1. Information We Collect',
            b: 'We collect minimal data: anonymous usage analytics (page views, session duration, device type, geographic region) through Google Analytics 4, and any information you voluntarily provide through contact or subscription forms (name, email address). We do not collect personal identification information unless you explicitly provide it.',
          },
          {
            h: '2. How We Use Information',
            b: 'Usage data is used to improve our service, understand traffic patterns, and optimize content delivery. Email addresses collected through our newsletter subscription are used solely to send DHLM Studio Weekly research updates. We do not sell, trade, or rent personal information to third parties.',
          },
          {
            h: '3. Cookies & Advertising (Google AdSense)',
            b: 'This site uses cookies. Google and third-party advertising vendors use cookies to serve ads based on your prior visits to this website or other websites. Google\'s use of advertising cookies enables it and its partners to serve personalized ads based on your visits to dhlm-studio.com and other sites on the Internet. You may opt out of personalized advertising by visiting Google Ad Settings at https://adssettings.google.com. Alternatively, you may opt out of third-party vendor use of cookies for personalized advertising by visiting www.aboutads.info. We also use Google Analytics to analyze usage of this site. Google Analytics uses cookies to collect data about how visitors use the site. This data is anonymous and does not identify individual users.',
          },
          {
            h: '4. Third-Party Services',
            b: 'This site uses the following third-party services, each of which may collect data according to their own privacy policies: (1) Google AdSense — display advertising; (2) Google Analytics 4 — traffic analysis; (3) Vercel — website hosting and deployment; (4) Financial Modeling Prep — market data. We are not responsible for the privacy practices of these third-party services.',
          },
          {
            h: '5. Data Security',
            b: 'We implement reasonable technical and organizational security measures to protect data in our control. However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.',
          },
          {
            h: '6. Children\'s Privacy',
            b: 'This website is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at dhlmstudio2026@gmail.com and we will promptly remove that information.',
          },
          {
            h: '7. Your Rights (GDPR & CCPA)',
            b: 'If you are located in the European Union or California, you have certain rights regarding your personal data: (1) Right to Access — you may request a copy of the personal data we hold about you; (2) Right to Deletion — you may request that we delete your personal data; (3) Right to Opt-Out — California residents may opt out of the sale of personal information (we do not sell personal information); (4) Right to Correct — you may request that we correct inaccurate data. To exercise these rights, contact us at dhlmstudio2026@gmail.com.',
          },
          {
            h: '8. Changes to This Policy',
            b: 'We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. When we make material changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.',
          },
          {
            h: '9. Contact',
            b: 'For privacy-related inquiries or to exercise your data rights, contact us at: dhlmstudio2026@gmail.com. We will respond to all legitimate requests within 30 days.',
          },
        ].map(s => (
          <div key={s.h} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 700, color: '#16161A', marginBottom: 8 }}>{s.h}</h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#5B6470', lineHeight: 1.8, margin: 0 }}>{s.b}</p>
          </div>
        ))}
      </article>
    </div>
  );
}
