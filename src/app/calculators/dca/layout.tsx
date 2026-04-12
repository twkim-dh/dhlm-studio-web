import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DCA Calculator — Dollar Cost Averaging for Bitcoin, Stocks & Crypto | DHLM Studio',
  description: 'Free DCA calculator. Simulate dollar cost averaging into Bitcoin, Ethereum, S&P 500, or any asset. Compare DCA vs lump sum investing with real-time charts.',
  alternates: { canonical: 'https://dhlm-studio.com/calculators/dca' },
  openGraph: {
    title: 'DCA Calculator — Dollar Cost Averaging Simulator | DHLM Studio',
    description: 'Simulate dollar cost averaging into BTC, ETH, S&P 500, or any asset. Compare DCA vs lump sum investing.',
    url: 'https://dhlm-studio.com/calculators/dca',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
