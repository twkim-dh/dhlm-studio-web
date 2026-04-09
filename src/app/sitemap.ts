import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { WISDOM } from "@/data/wisdom";

const BASE = "https://dhlm-studio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Top 50 stocks with meaningful content (hardcoded + popular tickers)
  const topStocks = [
    'nvda','aapl','msft','googl','amzn','meta','tsla','avgo','jpm','v',
    'unh','xom','ma','orcl','cost','hd','pg','jnj','nflx','bac',
    'abbv','crm','amd','cvx','ko','mrk','csco','pep','tmo','acn',
    'mcd','wfc','ibm','ge','adbe','now','ms','axp','qcom','gs',
    'dis','txn','intu','cat','pypl','pltr','coin','gme','sofi','rivn',
  ];

  // Blog posts: exclude anything explicitly marked noindex.
  // (Thin-content filter is no longer needed — we noindex at the post level.)
  const qualityBlogs = blogPosts.filter(p => !p.noindex);

  return [
    // Main pages
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/markets`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/creators`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/rankings`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/rankings/crypto`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/rankings/billionaires`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/rankings/companies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/rankings/gdp`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/rankings/population`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/rankings/sports`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },

    // Markets sub-pages
    { url: `${BASE}/markets/gainers`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/markets/losers`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/markets/most-active`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/markets/sectors`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/markets/search`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/markets/bless`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/markets/roast-portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/markets/most-roasted`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/markets/most-blessed`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/markets/fear-and-greed`, lastModified: now, changeFrequency: "daily", priority: 0.8 },

    // Top 50 stocks only (with content)
    ...topStocks.map(t => ({
      url: `${BASE}/markets/${t}`,
      lastModified: now, changeFrequency: "daily" as const, priority: 0.7,
    })),

    // Lottery (main pages only, NOT individual numbers)
    { url: `${BASE}/lottery`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/lottery/powerball`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/lottery/mega-millions`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/lottery/jackpot-tracker`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/lottery/number-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/lottery/powerball/stats`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/lottery/mega-millions/stats`, lastModified: now, changeFrequency: "daily", priority: 0.7 },

    // Daily Brief
    { url: `${BASE}/daily`, lastModified: now, changeFrequency: "daily", priority: 0.9 },

    // Research Lab
    { url: `${BASE}/research`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Reports
    { url: `${BASE}/reports`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Blog (quality posts only, 800+ chars)
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...qualityBlogs.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: now, changeFrequency: "monthly" as const, priority: 0.7,
    })),

    // Wisdom list page only (individual pages are noindex)
    { url: `${BASE}/blog/wisdom`, lastModified: now, changeFrequency: "daily", priority: 0.6 },

    // Tools
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/qr-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/password-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    // Static / Legal
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/editorial`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
