import type { Metadata } from 'next';
import { RANKINGS } from '@/data/rankings';
import RankingPage from '@/components/RankingPage';

const Y = new Date().getFullYear();
export const metadata: Metadata = {
  title: `Highest Paid Athletes ${Y} — Sports Salary Rankings | DHLM Studio`,
  description: `${Y} highest paid athletes: Cristiano Ronaldo #1 at $260M. Complete sports salary rankings across Football, NBA, MLB, and NFL.`,
};

export default function SportsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ItemList', name: `Highest Paid Athletes ${Y}`,
        itemListElement: RANKINGS.sports.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: `${r.name} — ${r.value}` })),
      })}} />
      <RankingPage tag="⚽ SPORTS SALARY RANKINGS" tagColor="#EF4444" title="Highest Paid Athletes" description={`Top earning athletes across all sports — ${Y}`} items={RANKINGS.sports} pageId="rankings-sports" valueLabel="ANNUAL SALARY" />
    </>
  );
}
