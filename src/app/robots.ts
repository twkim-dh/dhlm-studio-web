import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/creators/",
        "/blog/wisdom/",
        "/rankings/",
        "/markets/",
        "/daily/",
        "/tools/",
        "/api/",
      ],
    },
    sitemap: "https://dhlm-studio.com/sitemap.xml",
  };
}
