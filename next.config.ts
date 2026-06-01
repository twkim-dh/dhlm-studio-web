import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [375, 640, 750, 828, 1080],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'coin-images.coingecko.com' },
      { protocol: 'https', hostname: 'assets.coingecko.com' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      // Unsplash CDN — hero images served via fetch-unsplash-images.js manifest
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      // Canonical host: www → non-www. All traffic consolidates on
      // dhlm-studio.com so Google does not split signals across two hosts.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.dhlm-studio.com' }],
        destination: 'https://dhlm-studio.com/:path*',
        permanent: true,
      },
      // Subdomain shutdowns — all redirect to main domain.
      // lotto: highest priority (gambling = AdSense instant rejection)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'lotto.dhlm-studio.com' }],
        destination: 'https://dhlm-studio.com',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'guessme.dhlm-studio.com' }],
        destination: 'https://dhlm-studio.com',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'tools.dhlm-studio.com' }],
        destination: 'https://dhlm-studio.com',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'mwomuk.dhlm-studio.com' }],
        destination: 'https://dhlm-studio.com',
        permanent: true,
      },
      // Deleted utilities — 410 Gone handled in proxy.ts (startsWith /tools)
      // Deleted compare
      { source: '/compare/:path*', destination: '/', permanent: true },
      // Deleted Korea/blog content
      { source: '/korea/:path*', destination: '/', permanent: true },
      { source: '/blog/korea/:path*', destination: '/blog', permanent: true },
      { source: '/blog/en/:path*', destination: '/blog', permanent: true },
      { source: '/blog/events/:path*', destination: '/blog', permanent: true },
      { source: '/events/:path*', destination: '/blog', permanent: true },
      // Deleted viral services
      { source: '/ttok/:path*', destination: '/', permanent: true },
      { source: '/mwomuk/:path*', destination: '/', permanent: true },
      { source: '/guessme/:path*', destination: '/', permanent: true },
      { source: '/balance/:path*', destination: '/', permanent: true },
      { source: '/spin/:path*', destination: '/', permanent: true },
      { source: '/fortune/:path*', destination: '/', permanent: true },
      // Sectors page removed — redirect to home (markets also deleted)
      { source: '/markets/sectors', destination: '/', permanent: true },
      { source: '/markets/sectors/:path*', destination: '/', permanent: true },
      // /crypto shortcut → home (markets deleted)
      { source: '/crypto', destination: '/', permanent: true },
      { source: '/crypto/:path*', destination: '/', permanent: true },
      // Rankings deleted → home
      { source: '/rankings', destination: '/', permanent: true },
      { source: '/rankings/:path*', destination: '/', permanent: true },
      // Markets deleted → home
      { source: '/markets', destination: '/', permanent: true },
      { source: '/markets/:path*', destination: '/', permanent: true },
      // Daily brief deleted → home
      { source: '/daily', destination: '/', permanent: true },
      { source: '/daily/:path*', destination: '/', permanent: true },
      { source: '/daily-brief', destination: '/', permanent: true },
      { source: '/daily-brief/:path*', destination: '/', permanent: true },
      { source: '/weekly-recap', destination: '/', permanent: true },
      { source: '/weekly-recap/:path*', destination: '/', permanent: true },
      { source: '/monthly-report', destination: '/', permanent: true },
      { source: '/monthly-report/:path*', destination: '/', permanent: true },
      // Korean Lotto → home (lottery section deleted)
      { source: '/lotto', destination: '/', permanent: true },
      { source: '/lotto/:path*', destination: '/', permanent: true },
      // Search Console redirects (lottery section deleted)
      // /blog/lotto-statistics → 410 Gone (middleware.ts)
      { source: '/blog/lotto/:path*', destination: '/', permanent: true },
      { source: '/korea/no-tipping-korea', destination: '/', permanent: true },
      { source: '/today/:path*', destination: '/', permanent: true },
      { source: '/services', destination: '/', permanent: true },
      { source: '/blog/salary-calculator', destination: '/blog', permanent: true },
      // Old Investing 101 W1 → new beginner series canonical URL
      { source: '/blog/investing-101-week1-what-is-a-stock', destination: '/learn/investing-101-beginner-w1-what-is-a-stock-really', permanent: true },
      { source: '/blog/bmi-guide', destination: '/blog', permanent: true },
      { source: '/blog/typing-speed-test', destination: '/blog', permanent: true },
      // ── Deep Dive / Special Reports: /blog/ → /reports/ (301 SEO rescue)
      // Google indexed these at /blog/. Redirect preserves all link equity.
      { source: '/blog/deep-dive-aapl-april-2026',         destination: '/reports/deep-dive-aapl-april-2026',         permanent: true },
      { source: '/blog/deep-dive-amd-april-2026',          destination: '/reports/deep-dive-amd-april-2026',          permanent: true },
      { source: '/blog/deep-dive-amzn-april-2026',         destination: '/reports/deep-dive-amzn-april-2026',         permanent: true },
      { source: '/blog/deep-dive-btc-april-2026',          destination: '/reports/deep-dive-btc-april-2026',          permanent: true },
      { source: '/blog/deep-dive-googl-april-2026',        destination: '/reports/deep-dive-googl-april-2026',        permanent: true },
      { source: '/blog/deep-dive-meta-april-2026',         destination: '/reports/deep-dive-meta-april-2026',         permanent: true },
      { source: '/blog/deep-dive-msft-april-2026',         destination: '/reports/deep-dive-msft-april-2026',         permanent: true },
      { source: '/blog/deep-dive-nvda-april-2026',         destination: '/reports/deep-dive-nvda-april-2026',         permanent: true },
      { source: '/blog/deep-dive-pltr-april-2026',         destination: '/reports/deep-dive-pltr-april-2026',         permanent: true },
      { source: '/blog/deep-dive-tsla-april-2026',         destination: '/reports/deep-dive-tsla-april-2026',         permanent: true },
      { source: '/blog/deep-dive-eth-april-2026',          destination: '/reports/deep-dive-eth-april-2026',          permanent: true },
      { source: '/blog/deep-dive-nflx-april-2026',         destination: '/reports/deep-dive-nflx-april-2026',         permanent: true },
      { source: '/blog/btc-crossroads-april-2026',         destination: '/reports/btc-crossroads-april-2026',         permanent: true },
      { source: '/blog/hot-sector-energy-april-2026',      destination: '/reports/hot-sector-energy-april-2026',      permanent: true },
      // SpaceX: blog/ → reports/ + old -2026 suffix → clean canonical URL
      { source: '/blog/spacex-ipo-special-report-2026',    destination: '/reports/spacex-ipo-special-report',         permanent: true },
      { source: '/blog/spacex-ipo-special-report',         destination: '/reports/spacex-ipo-special-report',         permanent: true },
      { source: '/reports/spacex-ipo-special-report-2026', destination: '/reports/spacex-ipo-special-report',         permanent: true },
      { source: '/blog/eth-special-report-april-2026',         destination: '/reports/ethereum-special-report-april-2026', permanent: true },
      { source: '/blog/ethereum-special-report-april-2026',   destination: '/reports/ethereum-special-report-april-2026', permanent: true },
      // /crypto-101 → /learn/crypto-101 (content moved to Brutal Edge Academy)
      { source: '/crypto-101', destination: '/learn/crypto-101', permanent: true },
      // /research/the-mental-game → /research (safety net for external links/bookmarks)
      { source: '/research/the-mental-game', destination: '/research', permanent: true },
      // Tools section deleted — 410 Gone handled in proxy.ts
      // Lottery section deleted — 410 Gone handled in proxy.ts
      // Off-brand pages → 301 (Option C: noindex already set + redirect)
      { source: '/creators', destination: '/', permanent: true },
      { source: '/creators/:path*', destination: '/', permanent: true },
      { source: '/blog/wisdom', destination: '/blog', permanent: true },
      { source: '/blog/wisdom/:path*', destination: '/blog', permanent: true },
      // /fortune used to redirect to /lottery — now goes home
      // Paper vs. Profit deleted — redirect to /research (The Mental Game)
      { source: '/learn/paper-vs-profit', destination: '/research', permanent: true },
      { source: '/learn/paper-vs-profit/:slug', destination: '/research/:slug', permanent: true },
      // /research/paper-vs-profit/* (old path) → /research
      { source: '/research/paper-vs-profit', destination: '/research', permanent: true },
      { source: '/research/paper-vs-profit/:path*', destination: '/research', permanent: true },
      // ── Brutal Edge cleanup: 36 off-brand posts removed 2026-04-16 ──────────
      // Group A: Cost of Living → home
      { source: '/blog/nyc-vs-la-cost-of-living',           destination: '/', permanent: true },
      { source: '/blog/cheapest-cities-digital-nomads',     destination: '/', permanent: true },
      { source: '/blog/tokyo-vs-seoul-cost',                destination: '/', permanent: true },
      { source: '/blog/best-cities-tech-workers',           destination: '/', permanent: true },
      // Group B: Creators → home
      { source: '/blog/most-subscribed-youtube-channels-2026-rankings',       destination: '/', permanent: true },
      { source: '/blog/tiktok-vs-youtube-vs-instagram-creator-earnings-2026', destination: '/', permanent: true },
      { source: '/blog/how-mrbeast-makes-money-business-behind-382m-subscribers', destination: '/', permanent: true },
      { source: '/blog/youtube-vs-tiktok-creator-economy',  destination: '/', permanent: true },
      { source: '/blog/fastest-growing-creators-march',     destination: '/', permanent: true },
      { source: '/blog/mrbeast-growth-analysis',            destination: '/', permanent: true },
      { source: '/blog/tiktok-vs-youtube-creators',         destination: '/', permanent: true },
      { source: '/blog/youtube-subscriber-milestones',      destination: '/', permanent: true },
      // Group C: Sports/Lifestyle Rankings → home
      { source: '/blog/highest-paid-nba-players-2025-26',           destination: '/', permanent: true },
      { source: '/blog/best-countries-to-live-in-2026-quality-of-life', destination: '/', permanent: true },
      { source: '/blog/highest-paid-athletes-2026-sports-salary-rankings', destination: '/', permanent: true },
      { source: '/blog/world-population-8-billion',         destination: '/', permanent: true },
      { source: '/blog/global-happiness-index',             destination: '/', permanent: true },
      { source: '/blog/richest-self-made-women',            destination: '/', permanent: true },
      // /blog/powerball-vs-mega-millions-better-odds → 410 Gone (middleware.ts)
      // Group D: Weekly Recaps → /blog
      { source: '/blog/wall-street-weekly-2026-04-13',      destination: '/blog', permanent: true },
      { source: '/blog/wall-street-weekly-2026-04-06',      destination: '/blog', permanent: true },
      { source: '/blog/crypto-weekly-2026-04-13',           destination: '/blog', permanent: true },
      { source: '/blog/crypto-weekly-2026-04-06',           destination: '/blog', permanent: true },
      // Group E: Old noindex duplicates → canonical versions
      { source: '/blog/tariff-impact-markets-2026',         destination: '/blog/how-tariffs-affect-stock-prices-data-driven-analysis', permanent: true },
      { source: '/blog/crypto-market-recovery-2026',        destination: '/blog/best-performing-crypto-2026', permanent: true },
      { source: '/blog/ai-stocks-bubble-or-boom',           destination: '/blog/top-5-ai-stocks-to-watch-2026', permanent: true },
      { source: '/blog/top-stock-movers-explained',         destination: '/blog/top-stock-gainers-today-how-to-spot-winners-2026', permanent: true },
      { source: '/blog/quantum-computing-stocks',           destination: '/reports/quantum-sector-special-report-april-2026', permanent: true },
      { source: '/blog/ai-stocks-to-watch',                 destination: '/blog/top-5-ai-stocks-to-watch-2026', permanent: true },
      { source: '/blog/data-visualization-trends',          destination: '/', permanent: true },
      { source: '/blog/nvidia-3-trillion',                  destination: '/reports/deep-dive-nvda-april-2026', permanent: true },
      { source: '/blog/sp500-vs-bitcoin',                   destination: '/reports/deep-dive-btc-april-2026',  permanent: true },
      { source: '/blog/crypto-regulation-2026',             destination: '/reports/crypto-treasury-sector-report-april-2026', permanent: true },
      { source: '/blog/global-gdp-rankings-shift-2026',     destination: '/blog/top-10-countries-gdp-world-economy-2026', permanent: true },
      { source: '/blog/billionaire-rankings-2026',          destination: '/blog/worlds-richest-people-2026-billionaire-rankings', permanent: true },
      { source: '/blog/gdp-rankings-2026',                  destination: '/blog/top-10-countries-gdp-world-economy-2026', permanent: true },
      // ── Deep Dive canonical fix: bitcoin/ethereum had different /blog/ slug formats ──
      { source: '/blog/bitcoin-deep-dive-april-2026',      destination: '/reports/deep-dive-btc-april-2026',          permanent: true },
      { source: '/blog/ethereum-deep-dive-april-2026',     destination: '/reports/deep-dive-eth-april-2026',          permanent: true },
      // Missing explicit deep-dive redirects
      { source: '/blog/deep-dive-crcl-circle-april-2026', destination: '/reports/deep-dive-crcl-circle-april-2026',  permanent: true },
      { source: '/blog/deep-dive-rdw-redwire-april-2026', destination: '/reports/deep-dive-rdw-redwire-april-2026',  permanent: true },
      // AdSense re-application: old GSC URLs → correct URLs (soft-404 fix, 2026-06-01)
      { source: '/blog/gdp-top10-countries-world-economy-2026',   destination: '/blog/top-10-countries-gdp-world-economy-2026',           permanent: true },
      { source: '/blog/worlds-richest-people-2026',               destination: '/blog/worlds-richest-people-2026-billionaire-rankings',    permanent: true },
      { source: '/blog/top-10-cryptocurrencies-2026',             destination: '/blog/top-10-cryptocurrencies-market-cap-2026-guide',      permanent: true },

    ];
  },
  async headers() {
    return [
      // PDF files: noindex to prevent duplicate/thin content in search index
      { source: '/pdf/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

export default nextConfig;
