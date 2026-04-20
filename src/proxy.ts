// Explicit redirect mapping table for Deep Dive reports.
//
// Rules:
// - Individual entries only. No catch-all patterns.
// - When adding a new Deep Dive, add one line here.
// - Mirrors the /blog/ → /reports/ entries in next.config.ts.
//   next.config.ts handles the primary 301; proxy is the safety net.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REDIRECTS: Record<string, string> = {
  // ── Deep Dive: /blog/deep-dive-{ticker}-april-2026 → /reports/ ──────────
  '/blog/deep-dive-aapl-april-2026':          '/reports/deep-dive-aapl-april-2026',
  '/blog/deep-dive-amd-april-2026':           '/reports/deep-dive-amd-april-2026',
  '/blog/deep-dive-amzn-april-2026':          '/reports/deep-dive-amzn-april-2026',
  '/blog/deep-dive-btc-april-2026':           '/reports/deep-dive-btc-april-2026',
  '/blog/deep-dive-eth-april-2026':           '/reports/deep-dive-eth-april-2026',
  '/blog/deep-dive-googl-april-2026':         '/reports/deep-dive-googl-april-2026',
  '/blog/deep-dive-meta-april-2026':          '/reports/deep-dive-meta-april-2026',
  '/blog/deep-dive-msft-april-2026':          '/reports/deep-dive-msft-april-2026',
  '/blog/deep-dive-nflx-april-2026':          '/reports/deep-dive-nflx-april-2026',
  '/blog/deep-dive-nvda-april-2026':          '/reports/deep-dive-nvda-april-2026',
  '/blog/deep-dive-pltr-april-2026':          '/reports/deep-dive-pltr-april-2026',
  '/blog/deep-dive-tsla-april-2026':          '/reports/deep-dive-tsla-april-2026',
  '/blog/deep-dive-crcl-circle-april-2026':   '/reports/deep-dive-crcl-circle-april-2026',
  '/blog/deep-dive-rdw-redwire-april-2026':   '/reports/deep-dive-rdw-redwire-april-2026',
  // ── Deep Dive: alternate slug formats ───────────────────────────────────
  '/blog/bitcoin-deep-dive-april-2026':       '/reports/deep-dive-btc-april-2026',
  '/blog/ethereum-deep-dive-april-2026':      '/reports/deep-dive-eth-april-2026',
};

// 410 Gone: permanently deleted pages (no content, no redirect elsewhere)
// Note: /blog/bitcoin-deep-dive-april-2026 is excluded — next.config.ts 301 takes priority
const GONE_PATHS = new Set([
  '/blog/lotto-statistics',
  '/blog/powerball-vs-mega-millions-better-odds',
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (GONE_PATHS.has(pathname)) {
    return new NextResponse('Gone', { status: 410 });
  }

  const destination = REDIRECTS[pathname];
  if (destination) {
    return NextResponse.redirect(new URL(destination, request.url), 301);
  }
}

export const config = {
  matcher: ['/blog/:path*'],
};
