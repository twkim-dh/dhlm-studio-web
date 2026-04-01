import type { Metadata } from 'next';
import { RANKINGS } from '@/data/rankings';
import RankingPage from '@/components/RankingPage';

const Y = new Date().getFullYear();
export const metadata: Metadata = {
  title: `Largest Companies by Market Cap ${Y} — Top 10 | DHLM Studio`,
  description: `${Y} market cap rankings: NVIDIA #1 at $4.2T. Complete list of the world's most valuable companies by market capitalization.`,
};

export default function CompaniesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ItemList', name: `Companies by Market Cap ${Y}`,
        itemListElement: RANKINGS.companies.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: `${r.name} — ${r.value}` })),
      })}} />
      <RankingPage tag="🏢 COMPANY RANKINGS" tagColor="#3B82F6" title="Largest Companies by Market Cap" description={`The world's most valuable companies by market capitalization — ${Y}`} items={RANKINGS.companies} pageId="rankings-companies" valueLabel="MARKET CAP" />
    </>
  );
}
