import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Position Size Calculator — How Much Should You Invest Per Trade | DHLM Studio',
  description: 'Free position size calculator for stocks and crypto. Enter your portfolio, risk percentage, entry, and stop loss to calculate exact position size and risk/reward ratio.',
  alternates: { canonical: 'https://dhlm-studio.com/calculators/position-size' },
  openGraph: {
    title: 'Position Size Calculator — DHLM Studio',
    description: 'Calculate exact position size based on your risk tolerance. Enter entry, stop loss, and portfolio size.',
    url: 'https://dhlm-studio.com/calculators/position-size',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
