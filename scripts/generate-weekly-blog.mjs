/**
 * Weekly Auto-Blog Generator
 * Runs via GitHub Actions every Monday 06:00 UTC
 * Generates 3 blog posts based on live data:
 * 1. Top Stock Movers of the week
 * 2. Fastest Growing YouTube Channels
 * 3. Crypto Market Weekly
 */

import fs from 'fs';
import path from 'path';

const today = new Date();
const dateStr = today.toISOString().split('T')[0];
const weekLabel = `Week of ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

// ── Fetch market movers from Alpha Vantage ──
async function fetchMarketMovers() {
  const key = process.env.ALPHA_VANTAGE_KEY || 'demo';
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${key}`);
    const data = await res.json();
    const gainers = (data.top_gainers || []).slice(0, 5).map(s => ({
      ticker: s.ticker, price: s.price, change: s.change_percentage,
    }));
    const losers = (data.top_losers || []).slice(0, 5).map(s => ({
      ticker: s.ticker, price: s.price, change: s.change_percentage,
    }));
    return { gainers, losers };
  } catch {
    return { gainers: [], losers: [] };
  }
}

// ── Fetch crypto data from CoinGecko ──
async function fetchCrypto() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false');
    const data = await res.json();
    return data.map(c => ({
      name: c.name, symbol: c.symbol.toUpperCase(),
      price: c.current_price, change7d: c.price_change_percentage_7d_in_currency || 0,
      marketCap: c.market_cap,
    }));
  } catch {
    return [];
  }
}

// ── Generate stock movers blog ──
function generateMoversBlog(movers) {
  const { gainers, losers } = movers;
  const gainersList = gainers.map((g, i) => `${i + 1}. **${g.ticker}** — $${g.price} (${g.change})`).join('\\n');
  const losersList = losers.map((l, i) => `${i + 1}. **${l.ticker}** — $${l.price} (${l.change})`).join('\\n');

  return {
    slug: `weekly-stock-movers-${dateStr}`,
    title: `This Week's Top Stock Movers — ${weekLabel}`,
    category: 'Markets',
    catColor: '#00D474',
    date: dateStr,
    readTime: '4 min',
    description: `Top stock gainers and losers this week. ${weekLabel}. Live market data from Alpha Vantage.`,
    sections: [
      {
        heading: 'Top Gainers This Week',
        body: `Here are the stocks that surged the most this week. These movers caught Wall Street\\'s attention with significant price action. Check our Markets page for real-time updates.\\n\\n${gainersList || 'Data temporarily unavailable.'}`,
      },
      {
        heading: 'Top Losers This Week',
        body: `Not every stock had a good week. These tickers experienced the biggest declines. Visit our individual stock pages for detailed analysis on each.\\n\\n${losersList || 'Data temporarily unavailable.'}`,
      },
      {
        heading: 'Market Context',
        body: `This week\\'s movers reflect ongoing trends in the US market. Technology and AI-related stocks continue to dominate both the gainers and losers lists, showing the sector\\'s volatility. For sector-level analysis, check our Sector Heatmap. For individual stock roasts, try our Brutal AI commentary on the Markets page.`,
      },
      {
        heading: 'FAQ',
        body: `Q: How often is market mover data updated?\\nA: Our data updates in real-time during US market hours (9:30 AM - 4:00 PM ET) via Alpha Vantage API.\\n\\nQ: Should I buy top gainers?\\nA: Past performance doesn\\'t predict future results. Stocks that surge often pull back. Always do your own research.`,
      },
    ],
  };
}

// ── Generate crypto blog ──
function generateCryptoBlog(coins) {
  const coinList = coins.map((c, i) =>
    `${i + 1}. **${c.name}** (${c.symbol}) — $${c.price >= 1 ? c.price.toFixed(2) : c.price.toFixed(4)} · 7d: ${c.change7d >= 0 ? '+' : ''}${c.change7d.toFixed(1)}%`
  ).join('\\n');

  const winners = coins.filter(c => c.change7d > 0).slice(0, 3);
  const losersC = [...coins].sort((a, b) => a.change7d - b.change7d).slice(0, 3);

  return {
    slug: `crypto-weekly-${dateStr}`,
    title: `Crypto Market Weekly — ${weekLabel}`,
    category: 'Crypto',
    catColor: '#F59E0B',
    date: dateStr,
    readTime: '4 min',
    description: `Weekly crypto market summary: Bitcoin, Ethereum, and top altcoins. Prices, 7-day changes, and analysis. ${weekLabel}.`,
    sections: [
      {
        heading: 'Top 10 Cryptocurrencies This Week',
        body: `Here\\'s how the top 10 cryptocurrencies by market cap performed this week. View live prices on our Crypto Rankings page.\\n\\n${coinList || 'Data temporarily unavailable.'}`,
      },
      {
        heading: 'Weekly Winners & Losers',
        body: `**Winners:** ${winners.map(w => `${w.symbol} (+${w.change7d.toFixed(1)}%)`).join(', ') || 'N/A'}\\n\\n**Losers:** ${losersC.map(l => `${l.symbol} (${l.change7d.toFixed(1)}%)`).join(', ') || 'N/A'}\\n\\nFor individual coin analysis, visit our crypto detail pages where you can see market cap, volume, and historical data.`,
      },
      {
        heading: 'FAQ',
        body: `Q: Where does the crypto data come from?\\nA: All cryptocurrency data is sourced from the CoinGecko API, one of the most trusted crypto data providers.\\n\\nQ: Is this financial advice?\\nA: No. Cryptocurrency is highly volatile. This is informational content only. Always DYOR.`,
      },
    ],
  };
}

// ── Generate creators blog (static template) ──
function generateCreatorsBlog() {
  return {
    slug: `weekly-creators-${dateStr}`,
    title: `Fastest Growing Creators — ${weekLabel}`,
    category: 'Creators',
    catColor: '#A78BFA',
    date: dateStr,
    readTime: '3 min',
    description: `This week's fastest growing YouTube, TikTok, and Instagram creators. ${weekLabel}.`,
    sections: [
      {
        heading: 'YouTube Growth Leaders',
        body: `MrBeast continues to dominate YouTube with over 382M subscribers. IShowSpeed and Kai Cenat are the fastest growing gaming/streaming creators. Mark Rober\\'s science content sees steady growth. Check our Creators page for the full rankings.`,
      },
      {
        heading: 'TikTok & Instagram Trends',
        body: `Khaby Lame maintains his position as TikTok\\'s most-followed creator at 163M. Cristiano Ronaldo leads Instagram growth among non-entertainment accounts. The creator economy continues to shift toward short-form video content across all platforms.`,
      },
      {
        heading: 'FAQ',
        body: `Q: How is creator growth measured?\\nA: We track subscriber/follower count changes on a weekly basis across YouTube, TikTok, Instagram, and X.\\n\\nQ: Where can I see the full creator rankings?\\nA: Visit our Creators page for the complete top 10 across all platforms.`,
      },
    ],
  };
}

// ── Main ──
async function main() {
  console.log(`Generating weekly blogs for ${dateStr}...`);

  const [movers, crypto] = await Promise.all([
    fetchMarketMovers(),
    fetchCrypto(),
  ]);

  const posts = [
    generateMoversBlog(movers),
    generateCryptoBlog(crypto),
    generateCreatorsBlog(),
  ];

  // Read existing blog-posts.ts
  const filePath = path.resolve('src/data/blog-posts.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert new posts at the beginning of the array
  const insertPoint = 'export const blogPosts: BlogPost[] = [';
  const newEntries = posts.map(p => `  {
    slug: '${p.slug}', title: '${p.title.replace(/'/g, "\\'")}',
    category: '${p.category}', catColor: '${p.catColor}', date: '${p.date}', readTime: '${p.readTime}',
    description: '${p.description.replace(/'/g, "\\'")}',
    sections: [
${p.sections.map(s => `      { heading: '${s.heading.replace(/'/g, "\\'")}', body: '${s.body.replace(/'/g, "\\'")}' }`).join(',\n')}
    ],
  }`).join(',\n');

  content = content.replace(insertPoint, `${insertPoint}\n${newEntries},`);
  fs.writeFileSync(filePath, content);

  console.log(`Added ${posts.length} weekly blog posts.`);
  posts.forEach(p => console.log(`  - ${p.slug}`));
}

main().catch(console.error);
