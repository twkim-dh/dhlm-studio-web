// Fetch daily top stock movers from Alpha Vantage
// Run via GitHub Actions every weekday at 22:00 KST

import { readFileSync, writeFileSync } from 'fs';

const API_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';

async function main() {
  console.log('Fetching top movers from Alpha Vantage...');

  const res = await fetch(
    `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
  );
  const raw = await res.json();

  if (!raw.top_gainers) {
    console.log('No data:', raw.Note || raw.Information || 'Unknown error');
    console.log('This may be due to API rate limits. Try again later or use a real API key.');
    return;
  }

  const movers = raw.top_gainers.slice(0, 15).map((s, i) => ({
    ticker: s.ticker,
    price: parseFloat(s.price),
    change: parseFloat(s.change_percentage?.replace('%', '') || '0'),
    volume: parseInt(s.volume || '0'),
  }));

  console.log(`Got ${movers.length} top movers:`);
  movers.slice(0, 5).forEach(m => console.log(`  ${m.ticker}: $${m.price} +${m.change}%`));

  // Update the data file
  const filePath = 'src/data/markets.ts';
  let content = readFileSync(filePath, 'utf-8');

  // We can't easily update TypeScript data, so save as JSON for reference
  const jsonPath = 'src/data/markets-live.json';
  writeFileSync(jsonPath, JSON.stringify({ date: new Date().toISOString().split('T')[0], movers }, null, 2));
  console.log(`✅ Saved to ${jsonPath}`);
}

main().catch(console.error);
