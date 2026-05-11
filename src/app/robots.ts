import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/markets/",
        "/daily/",
        "/tools/",
        "/lottery/",
        "/rankings/",
        "/research/paper-vs-profit/",
      ],
    },
    sitemap: "https://dhlm-studio.com/sitemap.xml",
  };
}
