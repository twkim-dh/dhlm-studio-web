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
const GONE_PATHS = new Set([
  '/blog/lotto-statistics',
  '/blog/powerball-vs-mega-millions-better-odds',
]);

// Country-based blocking: confirmed/suspected bot traffic
// SG: 69 users, 0s avg engagement, 4.29% rate = bot confirmed (GA4 2026-04-13~05-10)
// CN: 60 users, 7s avg engagement, 15.38% rate = bot suspected
const BLOCK_COUNTRIES = new Set(['SG', 'CN']);

// Whitelist: must never be blocked — AdSense review + SEO indexing
const ALLOWED_BOTS = /googlebot|adsbot-google|mediapartners-google|bingbot|applebot/i;

export default function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Google/Bing bots bypass all geo-blocks — AdSense + SEO must not be interrupted
  if (!ALLOWED_BOTS.test(userAgent)) {
    const country = request.headers.get('x-vercel-ip-country') || '';
    if (BLOCK_COUNTRIES.has(country)) {
      return new NextResponse('Service temporarily unavailable', { status: 503 });
    }
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
