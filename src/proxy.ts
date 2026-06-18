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
  // Previously deleted
  '/blog/lotto-statistics',
  '/blog/powerball-vs-mega-millions-better-odds',
  '/tools/dev/cron',
  // 2026-06-04: non-finance content purge (AdSense E-E-A-T consistency)
  '/creators',
  '/markets/roast-portfolio',
  '/markets/most-roasted',
  '/markets/most-blessed',
  '/blog/highest-paid-nba-players-2025-26',
  '/blog/us-dominates-global-wealth-billionaires-2026',
  '/blog/worlds-richest-people-2026-billionaire-rankings',
  '/blog/top-10-countries-gdp-world-economy-2026',
]);

// Country-based blocking: confirmed/suspected bot traffic
// SG: 69 users, 0s avg engagement, 4.29% rate = bot confirmed (GA4 2026-04-13~05-10)
// CN: 60 users, 7s avg engagement, 15.38% rate = bot suspected
const BLOCK_COUNTRIES = new Set(['SG', 'CN']);

// AdSense/Googlebot must NEVER be blocked — critical for ad review + SEO indexing
const ALLOWED_BOTS = /googlebot|adsbot-google|mediapartners-google|bingbot|applebot/i;

// Secondary UA block: catch bots that bypass geo-headers (no country = no country block)
const SUSPICIOUS_UA = /bot|crawler|spider|scraper|headless|python-requests/i;

export default function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const country = request.headers.get('x-vercel-ip-country') || '';

  // AdSense/Googlebot bypass ALL blocks unconditionally
  if (!ALLOWED_BOTS.test(userAgent)) {
    // Primary: geo-block (x-vercel-ip-country set by Vercel edge, client cannot spoof)
    if (BLOCK_COUNTRIES.has(country)) {
      return new NextResponse('Service temporarily unavailable', { status: 503 });
    }
    // Secondary: UA-based block (backup for bots with no/wrong country header)
    if (SUSPICIOUS_UA.test(userAgent)) {
      return new NextResponse('Service temporarily unavailable', { status: 503 });
    }
  }

  // 410 Gone: deleted sections
  // /blog removed 2026-06-18 (AdSense E-E-A-T cleanup — all blog content permanently gone)
  if (pathname === '/blog' || pathname.startsWith('/blog/') ||
      pathname.startsWith('/tools') || pathname.startsWith('/lottery') ||
      pathname.startsWith('/lotto') || pathname.startsWith('/rankings')) {
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
