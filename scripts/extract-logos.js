// scripts/extract-logos.js
// Collects 128x128 PNG logos: simple-icons first, styled SVG placeholder fallback
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// simple-icons key mapping (verified against installed version)
const SI_MAP = {
  NVDA:  'siNvidia',
  AAPL:  'siApple',
  GOOGL: 'siGoogle',
  META:  'siMeta',
  TSLA:  'siTesla',
  NFLX:  'siNetflix',
  PLTR:  'siPalantir',
  INTC:  'siIntel',
  SNOW:  'siSnowflake',
  QCOM:  'siQualcomm',
  GS:    'siGoldmansachs',
  V:     'siVisa',
  MA:    'siMastercard',
  AXP:   'siAmericanexpress',
  BTC:   'siBitcoin',
  ETH:   'siEthereum',
  SOL:   'siSolana',
  UBER:  'siUber',
  ABNB:  'siAirbnb',
  COIN:  'siCoinbase',
  SHOP:  'siShopify',
  PYPL:  'siPaypal',
  NET:   'siCloudflare',
  DDOG:  'siDatadog',
  SPOT:  'siSpotify',
  NKE:   'siNike',
  SBUX:  'siStarbucks',
  MCD:   'siMcdonalds',
  HD:    'siHomeadvisor',
  AMD:   'siAmd',
  BAC:   'siBankofamerica',
  AVGO:  'siBroadcom',
};

// Styled placeholder: bg color + white ticker text
// Brand-approximate colors
const PLACEHOLDER_MAP = {
  MSFT:  { bg: '00A4EF', label: 'MSFT' },
  AMZN:  { bg: 'FF9900', label: 'AMZN' },
  IBM:   { bg: '054ADA', label: 'IBM'  },
  ORCL:  { bg: 'F80000', label: 'ORCL' },
  CRM:   { bg: '00A1E0', label: 'CRM'  },
  ADBE:  { bg: 'FF0000', label: 'ADBE' },
  CRWD:  { bg: 'E1000F', label: 'CRWD' },
  WMT:   { bg: '0071CE', label: 'WMT'  },
  COST:  { bg: '005DAA', label: 'COST' },
  DIS:   { bg: '113CCF', label: 'DIS'  },
  USDC:  { bg: '2775CA', label: 'USDC' },
  JPM:   { bg: '003087', label: 'JPM'  },
  UNH:   { bg: '002677', label: 'UNH'  },
  LLY:   { bg: 'D52B1E', label: 'LLY'  },
  JNJ:   { bg: 'CA2026', label: 'JNJ'  },
  PFE:   { bg: '0093D0', label: 'PFE'  },
  XOM:   { bg: 'E2231A', label: 'XOM'  },
  CVX:   { bg: '0066B1', label: 'CVX'  },
  ASML:  { bg: '0071B9', label: 'ASML' },
  NOW:   { bg: '81B5A1', label: 'NOW'  },
  IONQ:  { bg: '2B2B6B', label: 'IONQ' },
  CRCL:  { bg: '2775CA', label: 'CRCL' },
  RDW:   { bg: 'E31837', label: 'RDW'  },
  NBIS:  { bg: '1A1A2E', label: 'NBIS' },
  RKLB:  { bg: 'C0392B', label: 'RKLB' },
  ASTS:  { bg: '0D47A1', label: 'ASTS' },
  OKLO:  { bg: '2C2C54', label: 'OKLO' },
  PL:    { bg: '08A8D3', label: 'PL'   },
  ONDS:  { bg: '003087', label: 'ONDS' },
  BRK:   { bg: '4E1F00', label: 'BRK'  },
  VELO:  { bg: '1C1C3A', label: 'VELO' },
};

const OUTPUT = path.join(__dirname, '..', 'public', 'images', 'logos');
if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT, { recursive: true });

const results = { success: [], failed: [] };

function makePlaceholderSvg(label, bgHex) {
  const displayLabel = label.length > 4 ? label.slice(0, 4) : label;
  const fontSize = label.length <= 2 ? 52 : label.length === 3 ? 44 : 34;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="20" fill="#${bgHex}"/>
  <text x="64" y="${64 + fontSize * 0.35}" font-family="Arial Black, Arial, sans-serif" font-size="${fontSize}" font-weight="900" fill="white" text-anchor="middle" dominant-baseline="middle">${displayLabel}</text>
</svg>`;
}

async function saveLogo(ticker, inputBuffer, inputType = 'svg') {
  const outPath = path.join(OUTPUT, `${ticker}.png`);
  let sharpInst;
  if (inputType === 'svg') {
    sharpInst = sharp(inputBuffer, { density: 300 });
  } else {
    sharpInst = sharp(inputBuffer);
  }
  await sharpInst
    .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outPath);
}

async function processSimpleIcons() {
  const si = require('simple-icons');
  console.log('\n=== Step 1: simple-icons ===');
  for (const [ticker, siKey] of Object.entries(SI_MAP)) {
    const outPath = path.join(OUTPUT, `${ticker}.png`);
    if (fs.existsSync(outPath)) {
      results.success.push(ticker);
      console.log(`→ ${ticker} already exists`);
      continue;
    }
    const icon = si[siKey];
    if (!icon?.svg) {
      results.failed.push({ ticker, reason: `key not found: ${siKey}` });
      console.log(`✗ ${ticker} (${siKey}): not found`);
      continue;
    }
    try {
      const coloredSvg = icon.svg.replace('<svg ', `<svg fill="#${icon.hex || '000000'}" `);
      await saveLogo(ticker, Buffer.from(coloredSvg), 'svg');
      results.success.push(ticker);
      console.log(`✓ ${ticker}`);
    } catch (e) {
      results.failed.push({ ticker, reason: e.message });
      console.log(`✗ ${ticker}: ${e.message}`);
    }
  }
}

async function processPlaceholders() {
  console.log('\n=== Step 2: Styled placeholders for missing brands ===');
  for (const [ticker, { bg, label }] of Object.entries(PLACEHOLDER_MAP)) {
    const outPath = path.join(OUTPUT, `${ticker}.png`);
    if (fs.existsSync(outPath)) {
      results.success.push(ticker);
      console.log(`→ ${ticker} already exists`);
      continue;
    }
    try {
      const svg = makePlaceholderSvg(label, bg);
      await saveLogo(ticker, Buffer.from(svg), 'svg');
      results.success.push(ticker);
      console.log(`✓ ${ticker} (placeholder #${bg})`);
    } catch (e) {
      results.failed.push({ ticker, reason: e.message });
      console.log(`✗ ${ticker}: ${e.message}`);
    }
  }
}

(async () => {
  await processSimpleIcons();
  await processPlaceholders();

  const files = fs.readdirSync(OUTPUT).filter(f => f.endsWith('.png'));
  console.log(`\n=== Results ===`);
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed:  ${results.failed.length}`);
  console.log(`Files in /public/images/logos/: ${files.length}`);

  if (results.failed.length > 0) {
    const failedTickers = results.failed.map(f => f.ticker).join('\n');
    fs.writeFileSync('/tmp/missing-logos.txt', failedTickers);
    console.log('\nFailed:', results.failed.map(f => f.ticker).join(', '));
  }

  fs.writeFileSync(
    path.join(__dirname, '..', 'logo-results.json'),
    JSON.stringify(results, null, 2)
  );
})();
