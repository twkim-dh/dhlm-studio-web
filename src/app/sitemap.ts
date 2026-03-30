import type { MetadataRoute } from "next";
import { slugToId } from "@/lib/world-lottery";

const BASE = "https://dhlm-studio.com";
const YEAR = new Date().getFullYear();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Lotto game slugs
  const lottoSlugs = Object.keys(slugToId);

  return [
    // Main
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },

    // Data pages (high priority — main content)
    { url: `${BASE}/markets`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/creators`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/rankings`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    // Lotto
    { url: `${BASE}/lotto`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...lottoSlugs.map(slug => ({
      url: `${BASE}/lotto/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // Tools
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/qr-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/password-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Blog
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Static
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
