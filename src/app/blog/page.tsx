import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts";
import BlogFilter from "@/components/BlogFilter";

export const metadata: Metadata = {
  title: "Blog — Market Analysis & Financial Insights | DHLM Studio",
  description: "In-depth market analysis, stock market data, global economic rankings, and financial insights from DHLM Studio.",
  alternates: { canonical: 'https://dhlm-studio.com/blog' },
  robots: { index: false, follow: false },
};

export default function BlogPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: '#C73E3A', letterSpacing: 3, marginBottom: 8 }}>BLOG</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 400, color: '#16161A', margin: 0 }}>Insights & Analysis</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: '#8A929C', marginTop: 4 }}>Data-driven stories about markets, rankings, and global trends</p>
          </div>
          <Link href="/" style={{ fontSize: 12, color: '#8A929C', fontFamily: 'var(--sans)' }}>← Home</Link>
        </div>

        {/* Crypto 101 banner */}
        <Link href="/learn/crypto-101" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 12, background: '#A78BFA10', border: '1px solid #A78BFA20', textDecoration: 'none', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📚</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA' }}>New to crypto?</div>
              <div style={{ fontSize: 11, color: '#8A929C', marginTop: 1 }}>Start with Crypto 101 — 12-week beginner curriculum</div>
            </div>
          </div>
          <span style={{ fontSize: 12, color: '#A78BFA', fontFamily: 'var(--mono)' }}>Start →</span>
        </Link>

        <BlogFilter posts={blogPosts.filter(p => !p.noindex)} />
      </div>
    </div>
  );
}
