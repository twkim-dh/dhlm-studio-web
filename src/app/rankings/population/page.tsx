import type { Metadata } from 'next';
import { RANKINGS } from '@/data/rankings';
import RankingPage from '@/components/RankingPage';

const Y = new Date().getFullYear();
export const metadata: Metadata = {
  title: `World Population Rankings ${Y} — Most Populated Countries | DHLM Studio`,
  description: `${Y} population rankings: India #1 at 1.44B. Complete list of the world's most populated countries with growth rates.`,
};

export default function PopulationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ItemList', name: `Population Rankings ${Y}`,
        itemListElement: RANKINGS.population.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: `${r.name} — ${r.value}` })),
      })}} />
      <RankingPage tag="👥 POPULATION RANKINGS" tagColor="#A78BFA" title="World Population by Country" description={`Most populated countries in the world — ${Y}`} items={RANKINGS.population} pageId="rankings-population" valueLabel="POPULATION" />
    </>
  );
}
