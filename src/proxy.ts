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

// ── Singapore geo-block (ACTIVE — bot confirmed: 0s engagement, 5.17% rate) ──
// Deactivate after AdSense review passes. To deactivate: remove the SG block below.
const BLOCK_COUNTRIES = new Set(['SG']);

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // Block confirmed bot-traffic countries
  const country = request.headers.get('x-vercel-ip-country') || '';
  if (BLOCK_COUNTRIES.has(country)) {
    return new NextResponse('Service temporarily unavailable', { status: 503 });
  }

  // 410 Gone for all /lottery paths (gambling content — permanently deleted)
  if (pathname.startsWith('/lottery')) {
    return new NextResponse('Gone', { status: 410 });
  }

  // Block Vercel preview URLs from being indexed as duplicate content
  if (host.endsWith('.vercel.app')) {
    const url = new URL(request.url);
    url.host = 'dhlm-studio.com';
    url.protocol = 'https:';
    url.port = '';
    const res = NextResponse.redirect(url.toString(), { status: 301 });
    res.headers.set('X-Robots-Tag', 'noindex');
    return res;
  }

  if (GONE_PATHS.has(pathname)) {
    return new NextResponse('Gone', { status: 410 });
  }

  const destination = REDIRECTS[pathname];
  if (destination) {
    return NextResponse.redirect(new URL(destination, request.url), 301);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
