import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.financialmodelingprep.com' },
      { protocol: 'https', hostname: 'financialmodelingprep.com' },
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
      // Deleted utilities → home or relevant page
      { source: '/tools/calc/:path*', destination: '/', permanent: true },
      { source: '/tools/dev/:path*', destination: '/', permanent: true },
      { source: '/tools/life/:path*', destination: '/', permanent: true },
      { source: '/tools/mfg/:path*', destination: '/', permanent: true },
      { source: '/tools/msg/:path*', destination: '/', permanent: true },
      { source: '/tools/gen/:path*', destination: '/tools', permanent: true },
      { source: '/tools/image/:path*', destination: '/tools', permanent: true },
      { source: '/tools/compare/:path*', destination: '/rankings', permanent: true },
      // Deleted compare
      { source: '/compare/:path*', destination: '/rankings', permanent: true },
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
      { source: '/fortune/:path*', destination: '/lottery', permanent: true },
      // Sectors page removed — redirect to markets
      { source: '/markets/sectors', destination: '/markets', permanent: true },
      { source: '/markets/sectors/:path*', destination: '/markets', permanent: true },
      // /crypto shortcut → canonical /rankings/crypto
      { source: '/crypto', destination: '/rankings/crypto', permanent: true },
      { source: '/crypto/:path*', destination: '/rankings/crypto/:path*', permanent: true },
      // Korean Lotto → US Lottery redirect
      { source: '/lotto', destination: '/lottery', permanent: true },
      { source: '/lotto/:path*', destination: '/lottery', permanent: true },
      // Search Console top pages → redirect to new locations
      { source: '/blog/lotto-statistics', destination: '/lottery/powerball/stats', permanent: true },
      { source: '/blog/lotto/:path*', destination: '/lottery', permanent: true },
      { source: '/korea/no-tipping-korea', destination: '/', permanent: true },
      { source: '/today/:path*', destination: '/', permanent: true },
      { source: '/services', destination: '/', permanent: true },
      // Old blog posts → blog hub
      { source: '/blog/lotto/:path*', destination: '/lottery', permanent: true },
      { source: '/blog/salary-calculator', destination: '/blog', permanent: true },
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
      { source: '/blog/btc-crossroads-april-2026',         destination: '/reports/btc-crossroads-april-2026',         permanent: true },
      { source: '/blog/hot-sector-energy-april-2026',      destination: '/reports/hot-sector-energy-april-2026',      permanent: true },
      { source: '/blog/spacex-ipo-special-report-2026',    destination: '/reports/spacex-ipo-special-report-2026',    permanent: true },
      { source: '/blog/eth-special-report-april-2026',         destination: '/reports/ethereum-special-report-april-2026', permanent: true },
      { source: '/blog/ethereum-special-report-april-2026',   destination: '/reports/ethereum-special-report-april-2026', permanent: true },
    ];
  },
};

export default nextConfig;
