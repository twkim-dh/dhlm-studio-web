import type { MetadataRoute } from "next";

const BASE = "https://dhlm-studio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Main
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },

    // Lotto
    { url: `${BASE}/lotto`, lastModified: now, changeFrequency: "daily", priority: 0.9 },

    // Tools
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/tools/qr-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/tools/password-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Blog
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
