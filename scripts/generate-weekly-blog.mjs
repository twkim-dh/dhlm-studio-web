/**
 * Weekly Auto-Blog Generator
 * Runs via GitHub Actions every Monday 06:00 UTC
 * Generates 3 blog posts based on live data
 */

import fs from 'fs';
import path from 'path';

const today = new Date();
const dateStr = today.toISOString().split('T')[0];
const weekLabel = `Week of ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

/**
 * Escape ALL single quotes for safe insertion into JS single-quoted strings.
 * Also handles smart quotes, backticks, and backslashes.
 */
function esc(str) {
  return str
    .replace(/\\/g, '\\\\')           // backslash first
    .replace(/'/g, "\\'")             // straight apostrophe
    .replace(/\u2018/g, "\\'")        // left smart quote
    .replace(/\u2019/g, "\\'")        // right smart quote
    .replace(/\u201C/g, '\\"')        // left double smart quote
    .replace(/\u201D/g, '\\"')        // right double smart quote
    .replace(/\n/g, '\\n')            // newlines
    .replace(/\r/g, '');              // carriage returns
}

// ── Fetch market movers ──
async function fetchMarketMovers() {
  const key = process.env.ALPHA_VANTAGE_KEY || 'demo';
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${key}`);
    const data = await res.json();
    return {
      gainers: (data.top_gainers || []).slice(0, 5).map(s => ({ ticker: s.ticker, price: s.price, change: s.change_percentage })),
      losers: (data.top_losers || []).slice(0, 5).map(s => ({ ticker: s.ticker, price: s.price, change: s.change_percentage })),
    };
  } catch { return { gainers: [], losers: [] }; }
}

// ── Fetch crypto ──
async function fetchCrypto() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false');
    return (await res.json()).map(c => ({
      name: c.name, symbol: c.symbol.toUpperCase(),
      price: c.current_price, change7d: c.price_change_percentage_7d_in_currency || 0,
    }));
  } catch { return []; }
}

// ── Generate blogs ──
function generateMoversBlog(movers) {
  const gl = movers.gainers.map((g, i) => `${i + 1}. ${g.ticker} at $${g.price} (${g.change})`).join(', ');
  const ll = movers.losers.map((l, i) => `${i + 1}. ${l.ticker} at $${l.price} (${l.change})`).join(', ');
  return {
    slug: `weekly-stock-movers-${dateStr}`,
    title: `Top Stock Movers This Week - ${dateStr}`,
    category: 'Markets', catColor: '#00D474', date: dateStr, readTime: '4 min',
    description: `Top stock gainers and losers this week. Live market data updated ${dateStr}.`,
    sections: [
      { heading: 'Top Gainers', body: `The biggest gainers this week: ${gl || 'Data unavailable.'}. Check our Markets page for live updates.` },
      { heading: 'Top Losers', body: `The biggest losers this week: ${ll || 'Data unavailable.'}. Visit individual stock pages for details.` },
      { heading: 'FAQ', body: 'Q: How often is data updated?\\nA: Market data updates in real-time during US market hours via Alpha Vantage API.\\n\\nQ: Is this financial advice?\\nA: No. This is informational content only. Always do your own research.' },
    ],
  };
}

function generateCryptoBlog(coins) {
  const list = coins.map((c, i) => `${i + 1}. ${c.name} (${c.symbol}) at $${c.price >= 1 ? c.price.toFixed(2) : c.price.toFixed(4)}, 7d: ${c.change7d >= 0 ? '+' : ''}${c.change7d.toFixed(1)}%`).join(', ');
  return {
    slug: `crypto-weekly-${dateStr}`,
    title: `Crypto Market Weekly - ${dateStr}`,
    category: 'Crypto', catColor: '#F59E0B', date: dateStr, readTime: '4 min',
    description: `Weekly crypto summary: Bitcoin, Ethereum, and top altcoins. Prices and 7-day changes for ${dateStr}.`,
    sections: [
      { heading: 'Top 10 Cryptocurrencies', body: `This week in crypto: ${list || 'Data unavailable.'}. View live prices on our Crypto Rankings page.` },
      { heading: 'FAQ', body: 'Q: Where does crypto data come from?\\nA: All data is from CoinGecko API.\\n\\nQ: Is this financial advice?\\nA: No. Crypto is highly volatile. Always DYOR.' },
    ],
  };
}

function generateCreatorsBlog() {
  return {
    slug: `weekly-creators-${dateStr}`,
    title: `Fastest Growing Creators - ${dateStr}`,
    category: 'Creators', catColor: '#A78BFA', date: dateStr, readTime: '3 min',
    description: `Fastest growing YouTube, TikTok, and Instagram creators this week. Updated ${dateStr}.`,
    sections: [
      { heading: 'YouTube Growth', body: 'MrBeast continues to lead YouTube with 382M+ subscribers. IShowSpeed and Kai Cenat are the fastest growing gaming creators. Check our Creators page for full rankings.' },
      { heading: 'FAQ', body: 'Q: How is creator growth measured?\\nA: We track subscriber and follower changes weekly across YouTube, TikTok, Instagram, and X.' },
    ],
  };
}

// ── Main ──
async function main() {
  console.log(`Generating weekly blogs for ${dateStr}...`);

  const [movers, crypto] = await Promise.all([fetchMarketMovers(), fetchCrypto()]);
  const posts = [generateMoversBlog(movers), generateCryptoBlog(crypto), generateCreatorsBlog()];

  const filePath = path.resolve('src/data/blog-posts.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  const insertPoint = 'export const blogPosts: BlogPost[] = [';

  // Build entries with ALL strings escaped
  const newEntries = posts.map(p => {
    const sectionsStr = p.sections.map(s =>
      `      { heading: '${esc(s.heading)}', body: '${esc(s.body)}' }`
    ).join(',\n');

    return `  {
    slug: '${esc(p.slug)}', title: '${esc(p.title)}',
    category: '${esc(p.category)}', catColor: '${p.catColor}', date: '${p.date}', readTime: '${p.readTime}',
    description: '${esc(p.description)}',
    sections: [
${sectionsStr}
    ],
  }`;
  }).join(',\n');

  content = content.replace(insertPoint, `${insertPoint}\n${newEntries},`);
  fs.writeFileSync(filePath, content);

  console.log(`Added ${posts.length} weekly blog posts.`);
  posts.forEach(p => console.log(`  - ${p.slug}`));
}

main().catch(console.error);
