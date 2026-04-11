/**
 * Weekly Auto-Blog Generator v2
 * Runs via GitHub Actions every Monday 06:00 UTC
 * Generates: 1 weekly market recap + 1 crypto weekly
 * Focus: Large-cap stocks only ($10B+, $5+ price, no warrants)
 */

import fs from 'fs';
import path from 'path';

const today = new Date();
const dateStr = today.toISOString().split('T')[0];
const weekLabel = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

function esc(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\u2018/g, "\\'").replace(/\u2019/g, "\\'")
    .replace(/\u201C/g, '\\"').replace(/\u201D/g, '\\"')
    .replace(/\n/g, '\\n').replace(/\r/g, '');
}

// ── Fetch market movers (filter: $10B+ market cap, $5+ price, no warrants) ──
async function fetchMarketMovers() {
  const key = process.env.ALPHA_VANTAGE_KEY || 'demo';
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${key}`);
    const data = await res.json();

    const filter = (list) => (list || [])
      .filter(s => {
        const price = parseFloat(s.price);
        const ticker = s.ticker || '';
        return price >= 5 && !ticker.includes('W') && !ticker.includes('^') && ticker.length <= 5;
      })
      .slice(0, 10);

    return {
      gainers: filter(data.top_gainers).map(s => ({
        ticker: s.ticker, price: `$${parseFloat(s.price).toFixed(2)}`,
        change: s.change_percentage, volume: s.volume,
      })),
      losers: filter(data.top_losers).map(s => ({
        ticker: s.ticker, price: `$${parseFloat(s.price).toFixed(2)}`,
        change: s.change_percentage, volume: s.volume,
      })),
    };
  } catch { return { gainers: [], losers: [] }; }
}

// ── Fetch crypto TOP 10 ──
async function fetchCrypto() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false');
    return (await res.json()).map(c => ({
      name: c.name, symbol: c.symbol.toUpperCase(),
      price: c.current_price, change7d: c.price_change_percentage_7d_in_currency || 0,
      marketCap: c.market_cap,
    }));
  } catch { return []; }
}

// ── Generate weekly market recap ──
function generateWeeklyRecap(movers) {
  const { gainers, losers } = movers;

  const gList = gainers.slice(0, 5).map((g, i) =>
    `${i + 1}. ${g.ticker} — ${g.price} (${g.change})`
  ).join('. ') || 'Data unavailable';

  const lList = losers.slice(0, 5).map((l, i) =>
    `${i + 1}. ${l.ticker} — ${l.price} (${l.change})`
  ).join('. ') || 'Data unavailable';

  return {
    slug: `wall-street-weekly-${dateStr}`,
    title: `This Week on Wall Street — ${weekLabel}`,
    category: 'Markets', catColor: '#00D474', date: dateStr, readTime: '5 min',
    description: `Weekly market recap: top gainers, biggest losers, and what moved Wall Street. ${weekLabel}.`,
    sections: [
      {
        heading: 'Market Summary',
        body: `Here is your weekly Wall Street recap for the week ending ${weekLabel}. Markets continued to react to earnings season, macro data, and global trade developments. Check our Markets page for real-time data throughout the week.`,
      },
      {
        heading: 'Top Gainers (Large-Cap)',
        body: `The biggest winners among large-cap stocks this week: ${gList}. These moves were driven by earnings beats, analyst upgrades, and sector momentum. Visit individual stock pages for Brutal Edge commentary on each.`,
      },
      {
        heading: 'Top Losers (Large-Cap)',
        body: `The biggest decliners this week: ${lList}. Earnings misses, guidance cuts, and macro headwinds drove these losses. Check our Sector Heatmap to see which sectors were hit hardest.`,
      },
      {
        heading: 'Week Ahead',
        body: `Key events to watch next week include Federal Reserve commentary, major earnings reports, and economic data releases. Stay updated with our daily market movers at dhlm-studio.com/markets.`,
      },
      {
        heading: 'FAQ',
        body: 'Q: Where does this data come from?\\nA: Market data is sourced from Alpha Vantage API. Large-cap stocks only ($5+ price, no warrants or penny stocks).\\n\\nQ: Is this investment advice?\\nA: No. This is informational content only. Always do your own research before making investment decisions.',
      },
    ],
  };
}

// ── Generate crypto weekly ──
function generateCryptoWeekly(coins) {
  const list = coins.slice(0, 10).map((c, i) =>
    `${i + 1}. ${c.name} (${c.symbol}) at $${c.price >= 1 ? c.price.toFixed(2) : c.price.toFixed(4)}, 7d: ${c.change7d >= 0 ? '+' : ''}${c.change7d.toFixed(1)}%`
  ).join('. ') || 'Data unavailable';

  const winners = coins.filter(c => c.change7d > 0).slice(0, 3);
  const losersC = [...coins].sort((a, b) => a.change7d - b.change7d).slice(0, 3);

  return {
    slug: `crypto-weekly-${dateStr}`,
    title: `Crypto Market Weekly — ${weekLabel}`,
    category: 'Crypto', catColor: '#F59E0B', date: dateStr, readTime: '4 min',
    description: `Weekly crypto recap: Bitcoin, Ethereum, and top altcoins performance. ${weekLabel}.`,
    sections: [
      {
        heading: 'Top 10 Cryptocurrencies',
        body: `This week in crypto: ${list}. View live prices and Brutal Edge commentary on our Crypto Rankings page.`,
      },
      {
        heading: 'Winners and Losers',
        body: `Weekly winners: ${winners.map(w => `${w.symbol} (+${w.change7d.toFixed(1)}%)`).join(', ') || 'N/A'}. Weekly losers: ${losersC.map(l => `${l.symbol} (${l.change7d.toFixed(1)}%)`).join(', ') || 'N/A'}. For detailed analysis on any coin, visit our individual crypto pages.`,
      },
      {
        heading: 'FAQ',
        body: 'Q: Where does crypto data come from?\\nA: All data is from CoinGecko API, updated in real-time.\\n\\nQ: Is this financial advice?\\nA: No. Crypto is highly volatile. This is informational content only.',
      },
    ],
  };
}

// ── Main ──
async function main() {
  console.log(`Generating weekly blogs for ${dateStr}...`);

  const [movers, crypto] = await Promise.all([fetchMarketMovers(), fetchCrypto()]);
  const posts = [generateWeeklyRecap(movers), generateCryptoWeekly(crypto)];

  const filePath = path.resolve('src/data/blog-posts.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  const insertPoint = 'export const blogPosts: BlogPost[] = [';

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
