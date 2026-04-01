import type { Metadata } from 'next';
import { RANKINGS } from '@/data/rankings';
import RankingPage from '@/components/RankingPage';

const Y = new Date().getFullYear();
export const metadata: Metadata = {
  title: `World's Richest People ${Y} — Billionaire Rankings | DHLM Studio`,
  description: `${Y} billionaire rankings: Elon Musk #1 at $287B. Complete list of the world's wealthiest people with net worth, companies, and year-over-year changes.`,
};

export default function BillionairesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ItemList', name: `Billionaire Rankings ${Y}`,
        itemListElement: RANKINGS.billionaires.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: `${r.name} — ${r.value}` })),
      })}} />
      <RankingPage tag="🏆 BILLIONAIRE RANKINGS" tagColor="#D4A843" title="World's Richest People" description={`Net worth rankings of the world's billionaires — ${Y}`} items={RANKINGS.billionaires} pageId="rankings-billionaires" valueLabel="NET WORTH" />
    </>
  );
}
