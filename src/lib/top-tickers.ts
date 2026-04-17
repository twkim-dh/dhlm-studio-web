/**
 * Top 30 tickers by market cap — confirmed 2026-04-17
 * These are the only tickers with /markets/[ticker] pages.
 * Review quarterly (1/1, 4/1, 7/1, 10/1).
 * batch-quote handles 30 symbols in a single FMP call.
 */
export const TOP_30_TICKERS = [
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN',
  'META', 'TSLA', 'BRK-B', 'AVGO', 'LLY',
  'JPM',  'V',    'WMT',  'XOM',  'UNH',
  'MA',   'ORCL', 'JNJ',  'COST', 'PG',
  'HD',   'NFLX', 'ABBV', 'BAC',  'KO',
  'CVX',  'CRM',  'TMUS', 'AMD',  'PLTR',
] as const;

export type Top30Ticker = typeof TOP_30_TICKERS[number];

export function isTop30(ticker: string): boolean {
  return (TOP_30_TICKERS as readonly string[]).includes(ticker.toUpperCase());
}
