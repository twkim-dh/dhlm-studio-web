import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts";
import BlogFilter from "@/components/BlogFilter";

export const metadata: Metadata = {
  title: "Blog — Market Analysis & Financial Insights | DHLM Studio",
  description: "In-depth market analysis, stock market data, global economic rankings, and financial insights from the Brutal Edge team.",
  alternates: { canonical: 'https://dhlm-studio.com/blog' },
};

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

        {/* Crypto 101 banner */}
        <Link href="/crypto-101" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 12, background: '#A78BFA10', border: '1px solid #A78BFA20', textDecoration: 'none', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📚</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA' }}>New to crypto?</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>Start with Crypto 101 — 12-week beginner curriculum</div>
            </div>
          </div>
          <span style={{ fontSize: 12, color: '#A78BFA', fontFamily: 'var(--mono)' }}>Start →</span>
        </Link>

        <BlogFilter posts={blogPosts} />
      </div>
    </div>
  );
}
