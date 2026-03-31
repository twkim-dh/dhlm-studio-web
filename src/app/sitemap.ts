import type { MetadataRoute } from "next";
import { stocks } from "@/data/markets";
import { TOP_STOCKS } from "@/data/top-stocks";
import { TOP_CRYPTOS } from "@/data/top-cryptos";
import { blogPosts } from "@/data/blog-posts";
import { WISDOM } from "@/data/wisdom";

const BASE = "https://dhlm-studio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Main
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },

    // Data pages
    { url: `${BASE}/markets`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/creators`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/rankings`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/rankings/crypto`, lastModified: now, changeFrequency: "daily", priority: 0.9 },

    // Individual stocks (500+)
    ...[...new Set([...stocks.map(s => s.ticker.toLowerCase()), ...TOP_STOCKS.map(t => t.toLowerCase())])].map(t => ({
      url: `${BASE}/markets/${t}`,
      lastModified: now, changeFrequency: "daily" as const, priority: 0.7,
    })),

    // Individual crypto (100)
    ...TOP_CRYPTOS.map(id => ({
      url: `${BASE}/rankings/crypto/${id}`,
      lastModified: now, changeFrequency: "daily" as const, priority: 0.7,
    })),

    // US Lottery
    { url: `${BASE}/lottery`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/lottery/powerball`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/lottery/mega-millions`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/lottery/jackpot-tracker`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/lottery/number-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Blog
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...blogPosts.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: now, changeFrequency: "monthly" as const, priority: 0.7,
    })),

    // Wisdom
    ...WISDOM.map(w => ({
      url: `${BASE}/blog/wisdom/${String(w.id).padStart(3, '0')}`,
      lastModified: now, changeFrequency: "monthly" as const, priority: 0.6,
    })),

    // Markets sub-pages
    { url: `${BASE}/markets/gainers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/markets/losers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/markets/most-active`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/markets/search`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/markets/sectors`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/markets/bless`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },

    // Tools
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/qr-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/password-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Static
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
