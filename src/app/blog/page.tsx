import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Data Insights & Analysis | DHLM Studio",
  description: "Market analysis, global rankings, cost of living insights, creator trends, and data-driven stories.",
};

const posts = [
  { slug: "top-stock-movers-explained", title: "How to Read Today's Top Stock Movers", cat: "Markets", date: "2026-03-28" },
  { slug: "billionaire-rankings-2026", title: "2026 Billionaire Rankings: Who's Gaining, Who's Losing", cat: "Rankings", date: "2026-03-27" },
  { slug: "nyc-vs-la-cost-of-living", title: "NYC vs LA: Complete Cost of Living Comparison", cat: "Cost of Living", date: "2026-03-26" },
  { slug: "fastest-growing-creators-march", title: "Fastest Growing Creators This Month", cat: "Creators", date: "2026-03-25" },
  { slug: "quantum-computing-stocks", title: "Quantum Computing Stocks: Why They're Surging", cat: "Markets", date: "2026-03-24" },
  { slug: "gdp-rankings-2026", title: "Global GDP Rankings 2026: Biggest Movers", cat: "Rankings", date: "2026-03-23" },
  { slug: "cheapest-cities-digital-nomads", title: "10 Cheapest Cities for Digital Nomads in 2026", cat: "Cost of Living", date: "2026-03-22" },
  { slug: "mrbeast-growth-analysis", title: "MrBeast's Growth: A Data Analysis", cat: "Creators", date: "2026-03-21" },
  { slug: "ai-stocks-to-watch", title: "AI Stocks to Watch: SMCI, PLTR, and More", cat: "Markets", date: "2026-03-20" },
  { slug: "data-visualization-trends", title: "How Data Visualization is Changing the Web", cat: "Data", date: "2026-03-19" },
];

const cats = [
  { label: "All", color: "#F1F5F9" },
  { label: "Markets", color: "#00D474" },
  { label: "Rankings", color: "#D4A843" },
  { label: "Cost of Living", color: "#3B82F6" },
  { label: "Creators", color: "#A78BFA" },
  { label: "Data", color: "#64748B" },
];

export default function BlogPage() {
  return (
    <div style={{ background: "#0B0F19", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: "#C73E3A", letterSpacing: 3, marginBottom: 8 }}>BLOG</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 900, color: "#F1F5F9", margin: "0 0 8px" }}>Insights & Analysis</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "#64748B", margin: "0 0 32px" }}>Data-driven stories about markets, rankings, and global trends</p>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32, paddingBottom: 16, borderBottom: "1px solid #1E293B" }}>
          {cats.map(c => (
            <span key={c.label} style={{
              fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, color: c.color,
              padding: "4px 12px", borderRadius: 20, background: `${c.color}10`, border: `1px solid ${c.color}20`,
            }}>{c.label}</span>
          ))}
        </div>

        {/* Posts */}
        <div>
          {posts.map(post => {
            const catColor = cats.find(c => c.label === post.cat)?.color || "#64748B";
            return (
              <div key={post.slug} style={{ borderBottom: "1px solid #1E293B", padding: "20px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600, color: catColor, padding: "2px 8px", borderRadius: 4, background: `${catColor}14` }}>{post.cat}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: "#475569" }}>{post.date}</span>
                </div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 700, color: "#E2E8F0", margin: 0, lineHeight: 1.5 }}>
                  {post.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
