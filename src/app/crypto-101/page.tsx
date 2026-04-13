import { permanentRedirect } from 'next/navigation';

// /crypto-101 has moved to /learn/crypto-101 (301 permanent redirect).
// Also configured in next.config.ts for edge-level redirect.
export default function Crypto101Redirect() {
  permanentRedirect('/learn/crypto-101');
}
