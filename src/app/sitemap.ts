import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { TOP_30_TICKERS } from "@/lib/top-tickers";
import fs from "fs";
import path from "path";

const BASE = "https://dhlm-studio.com";

function getReportSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), 'src/content/reports');
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(/\.md$/, ''));
  } catch { return []; }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Top 30 tickers — only these have /markets/[ticker] pages
  const topStocks = TOP_30_TICKERS.map(t => t.toLowerCase());

  const qualityBlogs = blogPosts.filter(p => !p.noindex);

  return [
    // Core editorial pages (highest priority)
    { url: BASE,                         lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/markets`,            lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/daily`,              lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/reports`,            lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/blog`,               lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/learn`,              lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/learn/crypto-101`,   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/learn/investing-101`,lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/learn/paper-vs-profit`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/rankings/crypto`,    lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/lottery`,            lastModified: now, changeFrequency: "daily",   priority: 0.8 },

    // Rankings
    { url: `${BASE}/rankings`,           lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/rankings/billionaires`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/rankings/companies`, lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/rankings/gdp`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/rankings/population`,lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/rankings/sports`,    lastModified: now, changeFrequency: "weekly",  priority: 0.6 },

    // Markets sub-pages
    { url: `${BASE}/markets/fear-and-greed`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/markets/gainers`,    lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE}/markets/losers`,     lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE}/markets/most-active`,lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE}/markets/crypto`,      lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE}/markets/search`,     lastModified: now, changeFrequency: "weekly",  priority: 0.6 },

    // Top 30 stock pages — analysis-focused, daily close data
    ...topStocks.map(t => ({
      url: `${BASE}/markets/${t}`,
      lastModified: now, changeFrequency: "daily" as const, priority: 0.7,
    })),

    // Lottery sub-pages
    { url: `${BASE}/lottery/powerball`,         lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${BASE}/lottery/mega-millions`,     lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${BASE}/lottery/jackpot-tracker`,   lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${BASE}/lottery/number-generator`,  lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/lottery/powerball/stats`,   lastModified: now, changeFrequency: "daily",  priority: 0.7 },
    { url: `${BASE}/lottery/mega-millions/stats`, lastModified: now, changeFrequency: "daily", priority: 0.7 },

    // Reports (all slugs from content/reports/)
    ...getReportSlugs().map(slug => ({
      url: `${BASE}/reports/${slug}`,
      lastModified: now, changeFrequency: "monthly" as const, priority: 0.8,
    })),

    // Blog posts (quality filter: no noindex flag)
    ...qualityBlogs.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: now, changeFrequency: "monthly" as const, priority: 0.7,
    })),

    // Wisdom list page only (individual pages are noindex)
    { url: `${BASE}/blog/wisdom`,         lastModified: now, changeFrequency: "daily",   priority: 0.6 },

    // Calculators (search-driven, no nav)
    { url: `${BASE}/calculators/compound-interest`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculators/dca`,              lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculators/position-size`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Tools
    { url: `${BASE}/tools`,               lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/qr-generator`,  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/password-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/creators`,            lastModified: now, changeFrequency: "weekly",  priority: 0.6 },

    // Static / Legal
    { url: `${BASE}/about`,               lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/editorial`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`,             lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`,               lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
