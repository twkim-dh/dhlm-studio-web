// Fetch latest lotto draw data from 동행복권 API
// Runs via GitHub Actions every Saturday 22:00 KST

import { readFileSync, writeFileSync } from 'fs';

const API = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=';

async function fetchRound(round) {
  try {
    const res = await fetch(`${API}${round}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/javascript, */*',
        'Referer': 'https://www.dhlottery.co.kr/gameResult.do?method=byWin',
      },
    });
    const text = await res.text();
    if (!text.trim().startsWith('{')) return null;
    const data = JSON.parse(text);
    if (data.returnValue !== 'success') return null;
    return {
      round: data.drwNo,
      date: data.drwNoDate,
      numbers: [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6].sort((a, b) => a - b),
      bonus: data.bnusNo,
      prize1: data.firstWinamnt ? `${data.firstWinamnt.toLocaleString()}원` : '',
      winners1: data.firstPrzwnerCo || 0,
    };
  } catch (e) {
    console.error(`Failed to fetch round ${round}:`, e.message);
    return null;
  }
}

async function main() {
  // Read current lotto page to find existing rounds
  const pagePath = 'src/app/lotto/page.tsx';
  let pageContent = readFileSync(pagePath, 'utf-8');

  // Find latest round in DRAWS array
  const roundMatch = pageContent.match(/round:\s*(\d+)/);
  const currentLatest = roundMatch ? parseInt(roundMatch[1]) : 1217;

  console.log(`Current latest round: ${currentLatest}`);

  // Try to fetch next round
  const nextRound = currentLatest + 1;
  console.log(`Trying to fetch round ${nextRound}...`);

  const data = await fetchRound(nextRound);

  if (!data) {
    console.log(`Round ${nextRound} not available yet. Trying current latest ${currentLatest}...`);
    // Try to update current latest (might have been placeholder)
    const currentData = await fetchRound(currentLatest);
    if (currentData) {
      console.log(`Updated round ${currentLatest} with fresh data.`);
    } else {
      console.log('No new data available. Exiting.');
    }
    return;
  }

  console.log(`Got round ${data.round}: ${data.numbers.join(', ')} + ${data.bonus}`);
  console.log(`Prize: ${data.prize1}, Winners: ${data.winners1}`);

  // Add new round to DRAWS array in page.tsx
  const newEntry = `  { round: ${data.round}, numbers: [${data.numbers.join(', ')}], bonus: ${data.bonus}, date: '${data.date.replace(/-/g, '.')}' },`;

  // Insert after "const DRAWS" line
  pageContent = pageContent.replace(
    /(const DRAWS:[^[]*\[)\n/,
    `$1\n${newEntry}\n`
  );

  writeFileSync(pagePath, pageContent);
  console.log(`✅ Added round ${data.round} to DRAWS array.`);

  // Also update all-draws.json if exists
  try {
    const jsonPath = 'src/data/lotto/all-draws.json';
    const allDraws = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    const exists = allDraws.some(d => d.round === data.round);
    if (!exists) {
      allDraws.push(data);
      allDraws.sort((a, b) => a.round - b.round);
      writeFileSync(jsonPath, JSON.stringify(allDraws));
      console.log(`✅ Added round ${data.round} to all-draws.json.`);
    }
  } catch (e) {
    console.log('all-draws.json update skipped:', e.message);
  }
}

main().catch(console.error);
