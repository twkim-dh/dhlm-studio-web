import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import fs from "fs";
import path from "path";

const BASE = "https://dhlm-studio.com";

function getReportSlugs(): string[] {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const dir = path.join(process.cwd(), 'src/content/reports');
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .filter(f => {
        try {
          const content = fs.readFileSync(path.join(dir, f), 'utf8');
          const m = content.match(/^date:\s*"?([^"\n]+)"?/m);
          if (!m) return true;
          return m[1].trim().slice(0, 10) <= today;
        } catch { return true; }
      })
      .map(f => f.replace(/\.md$/, ''));
  } catch { return []; }
}

function getLearnIntermediateSlugs(): string[] {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const dir = path.join(process.cwd(), 'src/content/learn');
    return fs.readdirSync(dir)
      .filter(f => f.includes('intermediate') && f.endsWith('.md'))
      .filter(f => {
        const content = fs.readFileSync(path.join(dir, f), 'utf8');
        const m = content.match(/^publishDate:\s*"?([^"\n]+)"?/m);
        if (!m) return true;
        return m[1].trim().slice(0, 10) <= today;
      })
      .map(f => f.replace(/\.md$/, ''));
  } catch { return []; }
}

function getResearchSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), 'src/content/research');
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.md') && !f.startsWith('paper-vs-profit'))
      .map(f => f.replace(/\.md$/, ''));
  } catch { return []; }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const today = new Date().toISOString().slice(0, 10);
  const qualityBlogs = blogPosts.filter(p => !p.noindex && p.date <= today);

  return [
    // Core pages
    { url: BASE,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/reports`,             lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/blog`,                lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/learn`,               lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/learn/crypto-101`,             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/learn/investing-101`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/learn/investing-101-beginner`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/learn/investing-101-intermediate`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Investing 101 Beginner Series — 12 lessons
    ...[
      'investing-101-beginner-w1-what-is-a-stock-really',
      'investing-101-beginner-w2-how-the-market-actually-works',
      'investing-101-beginner-w3-opening-your-first-brokerage-account',
      'investing-101-beginner-w4-reading-income-statement',
      'investing-101-beginner-w5-reading-balance-sheet',
      'investing-101-beginner-w6-reading-cash-flow-statement',
      'investing-101-beginner-w7-what-is-a-business-model',
      'investing-101-beginner-w8-valuation-basics',
      'investing-101-beginner-w9-dividends-and-total-return',
      'investing-101-beginner-w10-diversification-portfolio-basics',
      'investing-101-beginner-w11-investors-mind',
      'investing-101-beginner-w12-your-first-five-years',
    ].map(slug => ({ url: `${BASE}/learn/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    // Investing 101 Intermediate Series — published lessons only (future dates excluded)
    ...getLearnIntermediateSlugs().map(slug => ({
      url: `${BASE}/learn/${slug}`,
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
    })),

    { url: `${BASE}/research`,            lastModified: now, changeFrequency: "weekly",  priority: 0.8 },

    // Reports (all slugs from content/reports/)
    ...getReportSlugs().map(slug => ({
      url: `${BASE}/reports/${slug}`,
      lastModified: now, changeFrequency: "monthly" as const, priority: 0.8,
    })),

    // Research articles (Mental Game, Structural View)
    ...getResearchSlugs().map(slug => ({
      url: `${BASE}/research/${slug}`,
      lastModified: now, changeFrequency: "monthly" as const, priority: 0.8,
    })),

    // Blog posts (quality filter: no noindex flag)
    ...qualityBlogs.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: now, changeFrequency: "monthly" as const, priority: 0.7,
    })),

    // /blog/wisdom and /creators are noindex — excluded from sitemap

    // Calculators (search-driven, no nav)
    { url: `${BASE}/calculators/compound-interest`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculators/dca`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculators/position-size`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Static / Legal
    { url: `${BASE}/about`,                lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/editorial`,            lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`,              lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`,                lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
