import type { Metadata } from 'next';

// SEO metadata for /lottery/powerball/stats — also serves the legacy
// /blog/lotto-statistics URL via the 301 redirect in next.config.ts.
// GSC currently shows 233 impressions / 4 clicks for the legacy URL,
// so the destination page metadata directly affects that traffic.

export const metadata: Metadata = {
  title: 'Powerball & Mega Millions Stats — Numbers That Hit Most in 2026',
  description: 'Live Powerball and Mega Millions number frequency analysis. Hot numbers, cold numbers, overdue picks. Data from 2,200+ historical draws. Updated after every drawing.',
  alternates: { canonical: 'https://dhlm-studio.com/lottery/powerball/stats' },
  openGraph: {
    title: 'Powerball Stats — Hot, Cold, and Overdue Numbers (2026)',
    description: 'Live frequency analysis from 2,200+ Powerball draws. See which numbers hit most, which are cold, and which are overdue.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Powerball Number Stats 2026', description: 'Hot, cold, and overdue Powerball numbers from 2,200+ historical draws.' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
