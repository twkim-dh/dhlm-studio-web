import { permanentRedirect } from 'next/navigation';

// /research/[slug] → /learn/paper-vs-profit/[slug] (301)
// All article pages moved to Brutal Edge Academy.
export default async function ResearchSlugRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/learn/paper-vs-profit/${slug}`);
}
