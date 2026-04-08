import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "US Stock Market — Top Gainers, Losers & Most Active | DHLM Studio",
  description: "Live US stock market movers: top gainers, losers, most active. Brutal AI™ analysis, sector heatmap, and portfolio roast.",
};
const jsonLd = { "@context": "https://schema.org", "@type": "FinancialService", name: "DHLM Studio Markets", url: "https://dhlm-studio.com/markets", description: "Real-time US stock market data with Brutal AI™ analysis." };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>;
}
