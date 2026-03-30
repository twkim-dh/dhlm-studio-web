import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Deleted utilities → home or relevant page
      { source: '/tools/calc/:path*', destination: '/', permanent: true },
      { source: '/tools/dev/:path*', destination: '/', permanent: true },
      { source: '/tools/life/:path*', destination: '/', permanent: true },
      { source: '/tools/mfg/:path*', destination: '/', permanent: true },
      { source: '/tools/msg/:path*', destination: '/', permanent: true },
      { source: '/tools/gen/:path*', destination: '/tools', permanent: true },
      { source: '/tools/image/:path*', destination: '/tools', permanent: true },
      { source: '/tools/compare/:path*', destination: '/compare', permanent: true },
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
      { source: '/fortune/:path*', destination: '/lotto', permanent: true },
      { source: '/today/:path*', destination: '/', permanent: true },
      { source: '/services', destination: '/', permanent: true },
      // Old blog posts → blog hub
      { source: '/blog/lotto/:path*', destination: '/lotto', permanent: true },
      { source: '/blog/salary-calculator', destination: '/blog', permanent: true },
      { source: '/blog/bmi-guide', destination: '/blog', permanent: true },
      { source: '/blog/typing-speed-test', destination: '/blog', permanent: true },
    ];
  },
};

export default nextConfig;
