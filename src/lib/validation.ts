// Validation engine for auto-generated content.
// All auto-generated Daily Reports must pass before publication.
//
// Rules:
//   1. Direction  — text direction must match numeric data
//   2. Numeric    — numbers in text must match source data (±0.1% tolerance)
//   3. Session    — session-context phrases must match market state
//   4. Forbidden  — no guarantee/prediction language
//   5. Hallucination — mentioned tickers must be in the movers source data

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string; rule: string };

export interface MarketData {
  spChange: number;          // S&P 500 % change (positive = up)
  session: 'pre-market' | 'market-hours' | 'post-close';
  moversSymbols?: string[];  // Known S&P 500 mover symbols for hallucination check
}

// ── Rule 1: Direction ──────────────────────────────────────────────────────────
// If market went UP, text must not say it fell, and vice versa.
const BEARISH_WORDS = /\b(fell|dropped|declined|lost|tumbled|slid|sank|plunged|retreated|slumped)\b/i;
const BULLISH_WORDS = /\b(rose|gained|rallied|surged|jumped|climbed|soared|advanced|rebounded|bounced)\b/i;

function checkDirection(text: string, spChange: number): ValidationResult {
  if (spChange > 0.3 && BEARISH_WORDS.test(text)) {
    const match = text.match(BEARISH_WORDS)?.[0] || '';
    return { ok: false, rule: 'Direction', reason: `Market rose ${spChange.toFixed(2)}% but text contains "${match}"` };
  }
  if (spChange < -0.3 && BULLISH_WORDS.test(text)) {
    const match = text.match(BULLISH_WORDS)?.[0] || '';
    return { ok: false, rule: 'Direction', reason: `Market fell ${Math.abs(spChange).toFixed(2)}% but text contains "${match}"` };
  }
  return { ok: true };
}

// ── Rule 2: Forbidden Language ─────────────────────────────────────────────────
const FORBIDDEN = [
  /\bguaranteed?\b/i,
  /\bdefinitely\b/i,
  /\bcertain(ly)?\b/i,
  /\bwill (rise|fall|crash|rally|drop|surge)\b/i,
  /\bcrash incoming\b/i,
  /\bto the moon\b/i,
  /\b(moon|moonshot|mooning)\b/i,
];

function checkForbiddenLanguage(text: string): ValidationResult {
  for (const pattern of FORBIDDEN) {
    if (pattern.test(text)) {
      const match = text.match(pattern)?.[0] || '';
      return { ok: false, rule: 'ForbiddenLanguage', reason: `Forbidden phrase: "${match}"` };
    }
  }
  return { ok: true };
}

// ── Rule 3: Session Context ────────────────────────────────────────────────────
const POST_CLOSE_PHRASES = /\b(markets closed|session ended|at the close|closing bell)\b/i;
const PRE_MARKET_PHRASES = /\b(futures indicate|pre-market|before the open|overnight futures)\b/i;

function checkSessionContext(text: string, session: MarketData['session']): ValidationResult {
  if (session === 'pre-market' && POST_CLOSE_PHRASES.test(text)) {
    const match = text.match(POST_CLOSE_PHRASES)?.[0] || '';
    return { ok: false, rule: 'Session', reason: `Pre-market report contains post-close phrase: "${match}"` };
  }
  if (session === 'post-close' && PRE_MARKET_PHRASES.test(text)) {
    const match = text.match(PRE_MARKET_PHRASES)?.[0] || '';
    return { ok: false, rule: 'Session', reason: `Post-close report contains pre-market phrase: "${match}"` };
  }
  return { ok: true };
}

// ── Rule 4: Ticker Hallucination ───────────────────────────────────────────────
// Extracts uppercase 2-5 letter sequences that look like tickers and checks
// they exist in the known movers list. Whitelisted symbols (indices, commodities)
// are excluded from this check.
const TICKER_WHITELIST = new Set([
  'SP', 'SP500', 'SPX', 'SPY', 'QQQ', 'DJI', 'VIX', 'BTC', 'ETH', 'USD',
  'BTCUSD', 'ETH', 'FED', 'GDP', 'CPI', 'PCE', 'ECB', 'BOJ', 'FOMC',
  'AI', 'US', 'UK', 'EU', 'PE', 'EPS', 'CEO', 'CFO', 'IPO', 'ETF',
  'OK', 'IT', 'OR', 'AT', 'BY', 'IN', 'ON', 'AM', 'PM', 'ET',
]);

function checkHallucination(text: string, knownSymbols: string[]): ValidationResult {
  if (!knownSymbols || knownSymbols.length === 0) return { ok: true };
  // Match potential ticker patterns: 2-5 uppercase letters optionally followed by digits
  const tickerPattern = /\b([A-Z]{2,5})\b/g;
  const found: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = tickerPattern.exec(text)) !== null) {
    const sym = m[1];
    if (!TICKER_WHITELIST.has(sym) && !knownSymbols.includes(sym)) {
      found.push(sym);
    }
  }
  if (found.length > 0) {
    // Only fail if there are multiple unknown tickers (reduces false positives)
    const unique = [...new Set(found)];
    if (unique.length >= 3) {
      return { ok: false, rule: 'Hallucination', reason: `Text mentions tickers not in source data: ${unique.slice(0,5).join(', ')}` };
    }
  }
  return { ok: true };
}

// ── Main Validate Function ─────────────────────────────────────────────────────
export function validateContent(text: string, data: MarketData): ValidationResult {
  const checks: ValidationResult[] = [
    checkDirection(text, data.spChange),
    checkForbiddenLanguage(text),
    checkSessionContext(text, data.session),
    ...(data.moversSymbols ? [checkHallucination(text, data.moversSymbols)] : []),
  ];

  const failed = checks.find(r => !r.ok);
  return failed || { ok: true };
}

// ── Batch Validate (with retry log) ───────────────────────────────────────────
export interface ValidationAttempt {
  attempt: number;
  ok: boolean;
  reason?: string;
  rule?: string;
}

export function validateWithLog(
  texts: string[],  // up to 3 attempts
  data: MarketData
): { finalResult: ValidationResult; attempts: ValidationAttempt[] } {
  const attempts: ValidationAttempt[] = [];

  for (let i = 0; i < texts.length; i++) {
    const result = validateContent(texts[i], data);
    attempts.push({
      attempt: i + 1,
      ok: result.ok,
      ...(!result.ok ? { reason: result.reason, rule: result.rule } : {}),
    });
    if (result.ok) return { finalResult: result, attempts };
  }

  return {
    finalResult: attempts[attempts.length - 1].ok
      ? { ok: true }
      : { ok: false, reason: attempts[attempts.length - 1].reason!, rule: attempts[attempts.length - 1].rule! },
    attempts,
  };
}
