import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator — See How Your Money Grows | DHLM Studio',
  description: 'Free compound interest calculator with monthly contributions, year-by-year breakdown, and growth chart. Enter your numbers and see the power of compounding.',
  alternates: { canonical: 'https://dhlm-studio.com/calculators/compound-interest' },
  openGraph: {
    title: 'Compound Interest Calculator — DHLM Studio',
    description: 'See exactly how your money grows with compound interest and monthly contributions.',
    url: 'https://dhlm-studio.com/calculators/compound-interest',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
