import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://dhlm-studio.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://dhlm-studio.com/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://dhlm-studio.com/services", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://dhlm-studio.com/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://dhlm-studio.com/blog/how-to-choose-menu", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://dhlm-studio.com/blog/couple-compatibility-test", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://dhlm-studio.com/blog/food-matching-guide", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://dhlm-studio.com/blog/balance-game-ideas", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://dhlm-studio.com/blog/daily-decision-tips", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://dhlm-studio.com/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://dhlm-studio.com/terms", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
