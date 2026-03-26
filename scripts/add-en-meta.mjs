// Script to add English meta tags + hreflang alternates to all tool pages
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const TOOLS_DIR = join(process.cwd(), 'src/app/tools');
const BASE_URL = 'https://dhlm-studio.com';

// English translations for each tool path
const enMeta = {
  // calc
  'calc/salary': { title: 'Salary Calculator - Take Home Pay', desc: 'Free salary calculator. Calculate your take-home pay after taxes instantly.' },
  'calc/severance': { title: 'Severance Pay Calculator', desc: 'Calculate your retirement severance pay based on years of service.' },
  'calc/loan': { title: 'Loan Interest Calculator', desc: 'Calculate loan interest payments, monthly installments and total cost.' },
  'calc/vat': { title: 'VAT Calculator - Tax Calculator', desc: 'Calculate VAT (Value Added Tax) amount and total price instantly.' },
  'calc/deposit': { title: 'Savings Interest Calculator', desc: 'Calculate savings account interest and maturity amount.' },
  'calc/margin': { title: 'Profit Margin Calculator', desc: 'Calculate profit margin percentage from cost and selling price.' },
  'calc/youtube': { title: 'YouTube Revenue Calculator', desc: 'Estimate YouTube earnings based on views and CPM rates.' },
  'calc/percent': { title: 'Percentage Calculator', desc: 'Calculate percentages, percentage change, and percentage of a number.' },
  'calc/exchange': { title: 'Currency Converter', desc: 'Convert currencies with real-time exchange rates.' },
  'calc/time': { title: 'Time & Hourly Rate Converter', desc: 'Convert between hourly, daily, monthly and yearly rates.' },
  'calc/gold': { title: 'Gold Price Calculator', desc: 'Calculate gold value by weight with current market prices.' },
  'calc/hourly-wage': { title: 'Hourly Wage Calculator 2026', desc: 'Calculate hourly wage from salary or vice versa.' },
  'calc/loan-compare': { title: 'Loan Comparison Calculator', desc: 'Compare multiple loan options side by side.' },
  'calc/rent-vs-buy': { title: 'Rent vs Buy Calculator', desc: 'Compare renting vs buying a home financially.' },
  'calc/roi': { title: 'ROI Calculator - Return on Investment', desc: 'Calculate return on investment percentage and profit.' },
  'calc/coupang-fee': { title: 'Marketplace Fee Calculator', desc: 'Calculate e-commerce marketplace selling fees and profit.' },
  'calc/tax-calculator': { title: 'Income Tax Calculator', desc: 'Calculate your income tax and effective tax rate.' },
  // life
  'life/bmi': { title: 'BMI Calculator - Body Mass Index', desc: 'Calculate your BMI and check if your weight is healthy.' },
  'life/age': { title: 'Age Calculator', desc: 'Calculate exact age in years, months, and days from birth date.' },
  'life/date': { title: 'Date Calculator - Days Between Dates', desc: 'Calculate the number of days between two dates.' },
  'life/unit-converter': { title: 'Unit Converter - Length, Weight, Area', desc: 'Convert between units of length, weight, area, volume and more.' },
  'life/stopwatch': { title: 'Online Stopwatch & Timer', desc: 'Free online stopwatch and countdown timer.' },
  'life/calorie': { title: 'Calorie Calculator', desc: 'Calculate daily calorie needs based on age, weight, and activity.' },
  'life/tip-calculator': { title: 'Tip & Split Bill Calculator', desc: 'Calculate tips and split bills evenly among friends.' },
  'life/countdown': { title: 'Countdown Timer', desc: 'Set a countdown to any date or event.' },
  'life/electricity': { title: 'Electricity Bill Calculator', desc: 'Estimate your electricity bill based on usage.' },
  'life/typing-speed': { title: 'Typing Speed Test - WPM Test', desc: 'Test your typing speed in words per minute. Free online typing test.' },
  // dev
  'dev/json': { title: 'JSON Formatter & Validator', desc: 'Format, validate, and beautify JSON data online for free.' },
  'dev/base64': { title: 'Base64 Encoder/Decoder', desc: 'Encode text to Base64 or decode Base64 to text online.' },
  'dev/jwt': { title: 'JWT Decoder - JSON Web Token', desc: 'Decode and inspect JWT tokens online.' },
  'dev/cron': { title: 'Cron Expression Generator', desc: 'Generate and explain cron schedule expressions.' },
  'dev/sql': { title: 'SQL Formatter', desc: 'Format and beautify SQL queries online.' },
  'dev/color-picker': { title: 'Color Picker & Converter', desc: 'Pick colors and convert between HEX, RGB, and HSL formats.' },
  'dev/lorem-ipsum': { title: 'Lorem Ipsum Generator', desc: 'Generate dummy placeholder text for design and development.' },
  'dev/url-encoder': { title: 'URL Encoder/Decoder', desc: 'Encode or decode URLs and query strings online.' },
  'dev/regex-tester': { title: 'Regex Tester - Regular Expression', desc: 'Test and debug regular expressions with live matching.' },
  'dev/ip-check': { title: 'What Is My IP Address', desc: 'Check your public IP address instantly.' },
  'dev/screen-size': { title: 'Screen Size & Resolution Checker', desc: 'Check your screen resolution and viewport size.' },
  'dev/markdown-preview': { title: 'Markdown Preview', desc: 'Preview and edit Markdown text with live rendering.' },
  'dev/font-preview': { title: 'Font Preview Tool', desc: 'Preview and compare fonts with custom text.' },
  'dev/timestamp': { title: 'Unix Timestamp Converter', desc: 'Convert Unix timestamps to human-readable dates and vice versa.' },
  'dev/subnet': { title: 'Subnet Calculator', desc: 'Calculate subnet masks, network addresses, and IP ranges.' },
  'dev/chmod': { title: 'chmod Calculator - File Permissions', desc: 'Calculate Linux file permission values (chmod).' },
  'dev/binary-converter': { title: 'Number Base Converter', desc: 'Convert between binary, octal, decimal, and hexadecimal.' },
  'dev/html-entity': { title: 'HTML Entity Converter', desc: 'Encode and decode HTML entities online.' },
  // image
  'image/image-compress': { title: 'Image Compressor - Reduce File Size', desc: 'Compress images online for free. Reduce file size without quality loss.' },
  'image/image-convert': { title: 'Image Format Converter', desc: 'Convert images between PNG, JPG, WebP and more.' },
  'image/image-resize': { title: 'Image Resizer', desc: 'Resize images to any dimension online for free.' },
  'image/youtube-thumbnail': { title: 'YouTube Thumbnail Downloader', desc: 'Download YouTube video thumbnails in all resolutions.' },
  'image/qr': { title: 'QR Code Generator', desc: 'Generate QR codes for URLs, text, and more for free.' },
  // msg/doc
  'msg/resign-letter': { title: 'Resignation Letter Generator', desc: 'Generate professional resignation letter templates.' },
  'msg/reject-message': { title: 'Polite Rejection Message Generator', desc: 'Create polite rejection messages for various situations.' },
  'msg/congratulation': { title: 'Congratulations Message Generator', desc: 'Generate congratulations messages for weddings, events and more.' },
  'msg/annual-leave': { title: 'Leave Request Reason Generator', desc: 'Generate professional leave request reasons.' },
  'msg/late-excuse': { title: 'Late Excuse Generator', desc: 'Generate believable excuses for being late.' },
  'msg/text-summary': { title: 'Text Summarizer', desc: 'Summarize long text into a short one-line summary.' },
  'msg/character-count': { title: 'Character Counter - Word Counter', desc: 'Count characters, words, sentences, and paragraphs in text.' },
  'msg/text-transform': { title: 'Text Case Converter', desc: 'Convert text between uppercase, lowercase, title case and more.' },
  // gen
  'gen/nickname-gen': { title: 'Nickname Generator', desc: 'Generate random unique nicknames for games and social media.' },
  'gen/company-name-gen': { title: 'Business Name Generator', desc: 'Generate creative company and brand name ideas.' },
  'gen/team-name-gen': { title: 'Team Name Generator', desc: 'Generate cool team names for sports, games and projects.' },
  'gen/random-picker': { title: 'Random Picker - Decision Maker', desc: 'Pick a random item from your list. Great for making decisions.' },
  'gen/password-gen': { title: 'Password Generator - Strong & Secure', desc: 'Generate strong random passwords with customizable options.' },
  'gen/hashtag-gen': { title: 'Hashtag Generator', desc: 'Generate trending hashtags for Instagram, TikTok and social media.' },
  'gen/emoji-search': { title: 'Emoji Search & Copy', desc: 'Search and copy emojis easily. Browse all emojis by category.' },
  'gen/random-number': { title: 'Random Number Generator', desc: 'Generate random numbers within a custom range.' },
  'gen/morse-code': { title: 'Morse Code Translator', desc: 'Convert text to Morse code and Morse code to text.' },
  // mfg
  'mfg/unit-weight': { title: 'Unit Weight Calculator', desc: 'Calculate material unit weight for manufacturing.' },
  'mfg/cpk': { title: 'Cpk Calculator - Process Capability', desc: 'Calculate process capability index (Cpk/Cp) for quality control.' },
  'mfg/uph': { title: 'UPH Calculator - Units Per Hour', desc: 'Calculate production rate in units per hour.' },
  'mfg/defect': { title: 'Defect Rate Calculator - PPM/DPMO', desc: 'Calculate defect rate, PPM, and DPMO for manufacturing.' },
  'mfg/oee': { title: 'OEE Calculator - Overall Equipment Effectiveness', desc: 'Calculate OEE from availability, performance, and quality.' },
  // compare
  'compare/deposit-compare': { title: 'Savings Rate Comparison', desc: 'Compare savings account interest rates side by side.' },
  'compare/card-compare': { title: 'Credit Card Comparison', desc: 'Compare credit card benefits and rewards.' },
  'compare/phone-compare': { title: 'Phone Plan Comparison', desc: 'Compare mobile phone plans and prices.' },
};

function findPageFiles(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findPageFiles(full, results);
    } else if (entry === 'page.tsx') {
      results.push(full);
    }
  }
  return results;
}

let updated = 0;
let skipped = 0;

for (const filePath of findPageFiles(TOOLS_DIR)) {
  // Skip the tools index page
  if (filePath.endsWith('src/app/tools/page.tsx') || filePath === join(TOOLS_DIR, 'page.tsx')) {
    skipped++;
    continue;
  }

  const content = readFileSync(filePath, 'utf-8');

  // Already has alternates? skip
  if (content.includes('alternates')) {
    skipped++;
    continue;
  }

  // Get the tool path relative to tools dir
  const rel = relative(TOOLS_DIR, filePath).replace(/[\\/]page\.tsx$/, '').replace(/\\/g, '/');
  const en = enMeta[rel];

  if (!en) {
    console.log(`No EN meta for: ${rel}`);
    skipped++;
    continue;
  }

  const url = `${BASE_URL}/tools/${rel}`;

  // Replace the metadata export
  const newContent = content.replace(
    /export const metadata: Metadata = \{([^}]+)\};/s,
    (match, inner) => {
      // Extract existing title and description
      return `export const metadata: Metadata = {${inner},
  openGraph: {
    title: "${en.title} | DHLM Studio",
    description: "${en.desc}",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  alternates: {
    canonical: "${url}",
    languages: {
      "ko": "${url}",
      "en": "${url}",
      "x-default": "${url}",
    },
  },
};`
    }
  );

  if (newContent !== content) {
    writeFileSync(filePath, newContent, 'utf-8');
    updated++;
    console.log(`Updated: ${rel}`);
  } else {
    skipped++;
  }
}

console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
