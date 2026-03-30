import type { MetadataRoute } from "next";
import { slugToId } from "@/lib/world-lottery";
import { stocks } from "@/data/markets";
import { blogPosts } from "@/data/blog-posts";

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

    // Individual stocks
    ...stocks.map(s => ({
      url: `${BASE}/markets/${s.ticker.toLowerCase()}`,
      lastModified: now, changeFrequency: "daily" as const, priority: 0.8,
    })),

    // Lotto
    { url: `${BASE}/lotto`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...Object.keys(slugToId).map(slug => ({
      url: `${BASE}/lotto/${slug}`,
      lastModified: now, changeFrequency: "weekly" as const, priority: 0.8,
    })),

    // Blog
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...blogPosts.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: now, changeFrequency: "monthly" as const, priority: 0.7,
    })),

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
