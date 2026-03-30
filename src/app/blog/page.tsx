import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Data Insights & Analysis | DHLM Studio",
  description: "Market analysis, global rankings, cost of living insights, creator trends, and data-driven stories.",
};

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
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>BLOG</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Insights & Analysis</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#64748B', marginTop: 4 }}>Data-driven stories about markets, rankings, and global trends</p>
          </div>
          <Link href="/" style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--sans)' }}>← Home</Link>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '24px 0 32px', paddingBottom: 16, borderBottom: '1px solid #1E293B' }}>
          {cats.map(c => (
            <span key={c.label} style={{
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, color: c.color,
              padding: '4px 12px', borderRadius: 20, background: `${c.color}10`, border: `1px solid ${c.color}20`,
            }}>{c.label}</span>
          ))}
        </div>

        {/* Posts */}
        <div>
          {blogPosts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'block', borderBottom: '1px solid #1E293B', padding: '20px 0', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color: post.catColor, padding: '2px 8px', borderRadius: 4, background: `${post.catColor}14` }}>{post.category}</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#475569' }}>{post.date} · {post.readTime}</span>
              </div>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: '#E2E8F0', margin: 0, lineHeight: 1.5 }}>
                {post.title}
              </p>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#64748B', margin: '6px 0 0', lineHeight: 1.6 }}>
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
