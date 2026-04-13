import { permanentRedirect } from 'next/navigation';

// /research → /learn/paper-vs-profit (301)
// Canonical URL moved to Brutal Edge Academy.
export default function ResearchRedirect() {
  permanentRedirect('/learn/paper-vs-profit');
}
