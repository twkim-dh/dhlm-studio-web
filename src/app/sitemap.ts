import type { MetadataRoute } from "next";

const BASE = "https://dhlm-studio.com";

// Static / main pages
const staticRoutes = [
  "", "about", "privacy", "terms",
];

// Viral services
const viralRoutes = [
  "ttok", "mwomuk", "guessme", "balance", "spin",
];

// Lotto
const lottoRoutes = [
  "lotto",
  "lotto/powerball", "lotto/mega-millions", "lotto/euromillions", "lotto/eurojackpot",
  "lotto/uk-lottery", "lotto/japan-loto6", "lotto/australia-powerball", "lotto/mega-sena", "lotto/lotto-max",
  "lotto/germany-6aus49", "lotto/france-loto", "lotto/italy-superenalotto", "lotto/spain-primitiva",
  "lotto/irish-lotto", "lotto/netherlands-lotto", "lotto/poland-lotto", "lotto/austria-lotto",
  "lotto/sweden-lotto", "lotto/thunderball",
  "lotto/india-lottery", "lotto/thai-lottery", "lotto/philippines-lotto", "lotto/newzealand-lotto", "lotto/southafrica-lotto",
];

// Fortune / AI
const fortuneRoutes = [
  "fortune", "fortune/daily", "fortune/tarot", "fortune/compatibility", "fortune/name",
];

// Today
const todayRoutes = [
  "today", "today/outfit", "today/food", "today/drink",
];

// Blog posts
const blogSlugs = [
  "how-to-choose-menu", "couple-compatibility-test", "food-matching-guide",
  "balance-game-ideas", "daily-decision-tips",
  "lotto-number-generator", "lotto-dream-number", "lotto-statistics", "lotto-winning-tips",
  "salary-calculator", "retirement-calculator", "loan-interest", "bmi-guide",
  "party-games", "friend-quiz", "menu-decision", "couple-compatibility",
  "online-tools-free", "vat-calculator-guide", "severance-pay-guide",
  "gold-price-today", "unit-converter-guide", "qr-code-free",
  "image-compress-free", "youtube-thumbnail-download", "json-formatter-online",
  "password-generator", "typing-speed-test", "electricity-calculator", "coupang-seller-fee",
];

// Tools
const toolRoutes = [
  "tools",
  // calc
  "tools/calc/salary", "tools/calc/severance", "tools/calc/loan", "tools/calc/vat",
  "tools/calc/deposit", "tools/calc/margin", "tools/calc/youtube", "tools/calc/percent",
  "tools/calc/exchange", "tools/calc/time", "tools/calc/gold", "tools/calc/hourly",
  "tools/calc/loan-compare", "tools/calc/rent-vs-buy", "tools/calc/investment-return",
  "tools/calc/coupang-fee", "tools/calc/tax-calculator", "tools/calc/hourly-wage",
  // life
  "tools/life/bmi", "tools/life/age", "tools/life/date", "tools/life/unit-converter",
  "tools/life/stopwatch", "tools/life/calorie", "tools/life/tip-calculator",
  "tools/life/countdown", "tools/life/electricity", "tools/life/typing-speed",
  // mfg
  "tools/mfg/unit-weight", "tools/mfg/cpk", "tools/mfg/uph", "tools/mfg/defect", "tools/mfg/oee",
  // dev
  "tools/dev/json", "tools/dev/base64", "tools/dev/jwt", "tools/dev/cron", "tools/dev/sql",
  "tools/dev/color-picker", "tools/dev/lorem-ipsum", "tools/dev/url-encoder",
  "tools/dev/regex-tester", "tools/dev/ip-check", "tools/dev/screen-size",
  "tools/dev/markdown-preview", "tools/dev/font-preview",
  "tools/dev/timestamp", "tools/dev/subnet", "tools/dev/chmod",
  "tools/dev/binary-converter", "tools/dev/html-entity",
  // image
  "tools/image/image-compress", "tools/image/image-convert", "tools/image/image-resize",
  "tools/image/youtube-thumbnail", "tools/image/qr",
  // msg
  "tools/msg/resign-letter", "tools/msg/reject-message", "tools/msg/congratulation",
  "tools/msg/annual-leave", "tools/msg/late-excuse", "tools/msg/text-summary",
  "tools/msg/character-count", "tools/msg/text-transform",
  // gen
  "tools/gen/nickname-gen", "tools/gen/company-name-gen", "tools/gen/team-name-gen",
  "tools/gen/random-picker", "tools/gen/password-gen", "tools/gen/hashtag-gen",
  "tools/gen/emoji-search", "tools/gen/random-number", "tools/gen/morse-code",
  // compare
  "tools/compare/deposit-compare", "tools/compare/card-compare", "tools/compare/phone-compare",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Homepage — highest priority, daily change
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },

    // Static pages
    ...staticRoutes.filter(r => r !== "").map(r => ({
      url: `${BASE}/${r}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5,
    })),

    // Viral services — high priority
    ...viralRoutes.map(r => ({
      url: `${BASE}/${r}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9,
    })),

    // Lotto — high priority, daily change
    ...lottoRoutes.map(r => ({
      url: `${BASE}/${r}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9,
    })),

    // Fortune
    ...fortuneRoutes.map(r => ({
      url: `${BASE}/${r}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8,
    })),

    // Today
    ...todayRoutes.map(r => ({
      url: `${BASE}/${r}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.7,
    })),

    // Blog — monthly
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ...blogSlugs.map(s => ({
      url: `${BASE}/blog/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7,
    })),

    // Tools — weekly
    ...toolRoutes.map(r => ({
      url: `${BASE}/${r}`, lastModified: now, changeFrequency: "weekly" as const, priority: r === "tools" ? 0.9 : 0.8,
    })),
  ];
}
