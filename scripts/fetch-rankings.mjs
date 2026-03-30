// Fetch World Bank rankings data
// Run via GitHub Actions monthly

import { writeFileSync } from 'fs';

const COUNTRIES = 'US;CN;DE;JP;IN;GB;FR;BR;IT;CA;RU;KR;AU;ES;MX;ID;NL;SA;TR;CH;PK;NG;BD;PH;EG;AR;ZA;TH;VN;PL';

const INDICATORS = {
  gdp: { code: 'NY.GDP.MKTP.CD', label: 'GDP (Nominal USD)' },
  population: { code: 'SP.POP.TOTL', label: 'Population' },
  gdpPerCapita: { code: 'NY.GDP.PCAP.CD', label: 'GDP per Capita' },
};

const FLAGS = {
  'US': '🇺🇸', 'CN': '🇨🇳', 'DE': '🇩🇪', 'JP': '🇯🇵', 'IN': '🇮🇳',
  'GB': '🇬🇧', 'FR': '🇫🇷', 'BR': '🇧🇷', 'IT': '🇮🇹', 'CA': '🇨🇦',
  'RU': '🇷🇺', 'KR': '🇰🇷', 'AU': '🇦🇺', 'ES': '🇪🇸', 'MX': '🇲🇽',
  'ID': '🇮🇩', 'NL': '🇳🇱', 'SA': '🇸🇦', 'TR': '🇹🇷', 'CH': '🇨🇭',
  'PK': '🇵🇰', 'NG': '🇳🇬', 'BD': '🇧🇩', 'PH': '🇵🇭', 'EG': '🇪🇬',
  'AR': '🇦🇷', 'ZA': '🇿🇦', 'TH': '🇹🇭', 'VN': '🇻🇳', 'PL': '🇵🇱',
};

async function fetchIndicator(code, label) {
  const url = `https://api.worldbank.org/v2/country/${COUNTRIES}/indicator/${code}?format=json&date=2024&per_page=50`;
  const res = await fetch(url);
  const json = await res.json();

  if (!json[1]) {
    console.log(`  No data for ${label}`);
    return [];
  }

  return json[1]
    .filter(d => d.value !== null)
    .map(d => ({
      country: d.country.value,
      code: d.country.id,
      flag: FLAGS[d.country.id] || '🏳️',
      value: d.value,
    }))
    .sort((a, b) => b.value - a.value);
}

async function main() {
  console.log('Fetching World Bank data...');
  const result = {};

  for (const [key, { code, label }] of Object.entries(INDICATORS)) {
    console.log(`  Fetching ${label}...`);
    result[key] = await fetchIndicator(code, label);
    console.log(`  Got ${result[key].length} entries`);
  }

  const filePath = 'src/data/rankings-live.json';
  writeFileSync(filePath, JSON.stringify({
    updatedAt: new Date().toISOString().split('T')[0],
    ...result,
  }, null, 2));

  console.log(`✅ Saved to ${filePath}`);
}

main().catch(console.error);
