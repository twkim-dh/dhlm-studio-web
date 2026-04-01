import type { Metadata } from 'next';
import { RANKINGS } from '@/data/rankings';
import RankingPage from '@/components/RankingPage';

const Y = new Date().getFullYear();
export const metadata: Metadata = {
  title: `GDP Rankings by Country ${Y} — Largest Economies | DHLM Studio`,
  description: `${Y} GDP rankings: United States #1 at $28.8T. Complete ranking of the world's largest economies by gross domestic product.`,
};

export default function GdpPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ItemList', name: `GDP Rankings ${Y}`,
        itemListElement: RANKINGS.gdp.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: `${r.name} — ${r.value}` })),
      })}} />
      <RankingPage tag="🌍 GDP RANKINGS" tagColor="#00D474" title="GDP Rankings by Country" description={`World's largest economies by GDP — ${Y}`} items={RANKINGS.gdp} pageId="rankings-gdp" valueLabel="GDP (NOMINAL)" />
    </>
  );
}
