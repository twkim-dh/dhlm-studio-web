// Ticker → corporate domain map. Used by TickerLogo to construct
// Clearbit Logo API URLs in the form https://logo.clearbit.com/<domain>.
//
// Clearbit Logo API is free, requires no auth, and serves logos at
// reasonable resolutions for inline display. If a ticker is not in this
// map, TickerLogo falls back to the existing StockLogo placeholder.
//
// Source: each company's official primary domain. Update when companies
// rename or rebrand.

export const TICKER_DOMAINS: Record<string, string> = {
  // Mega-cap tech
  AAPL:  'apple.com',
  MSFT:  'microsoft.com',
  NVDA:  'nvidia.com',
  GOOGL: 'google.com',
  GOOG:  'google.com',
  AMZN:  'amazon.com',
  META:  'meta.com',
  TSLA:  'tesla.com',
  // Semis
  AMD:   'amd.com',
  AVGO:  'broadcom.com',
  INTC:  'intel.com',
  TSM:   'tsmc.com',
  // Software
  ORCL:  'oracle.com',
  ADBE:  'adobe.com',
  CRM:   'salesforce.com',
  NOW:   'servicenow.com',
  PLTR:  'palantir.com',
  SNOW:  'snowflake.com',
  // Financial
  JPM:   'jpmorgan.com',
  BAC:   'bankofamerica.com',
  WFC:   'wellsfargo.com',
  GS:    'goldmansachs.com',
  MS:    'morganstanley.com',
  V:     'visa.com',
  MA:    'mastercard.com',
  // Berkshire
  'BRK-B': 'berkshirehathaway.com',
  'BRK-A': 'berkshirehathaway.com',
  // Healthcare
  UNH:   'unitedhealthgroup.com',
  JNJ:   'jnj.com',
  LLY:   'lilly.com',
  PFE:   'pfizer.com',
  ABBV:  'abbvie.com',
  MRK:   'merck.com',
  TMO:   'thermofisher.com',
  // Consumer
  WMT:   'walmart.com',
  COST:  'costco.com',
  HD:    'homedepot.com',
  PG:    'pg.com',
  KO:    'coca-colacompany.com',
  PEP:   'pepsico.com',
  MCD:   'mcdonalds.com',
  NKE:   'nike.com',
  SBUX:  'starbucks.com',
  DIS:   'disney.com',
  NFLX:  'netflix.com',
  // Energy
  XOM:   'corporate.exxonmobil.com',
  CVX:   'chevron.com',
  COP:   'conocophillips.com',
  MPC:   'marathonpetroleum.com',
  PSX:   'phillips66.com',
  VLO:   'valero.com',
  OXY:   'oxy.com',
  APA:   'apacorp.com',
  // Industrial
  CAT:   'caterpillar.com',
  GE:    'ge.com',
  BA:    'boeing.com',
  HON:   'honeywell.com',
  UPS:   'ups.com',
  FDX:   'fedex.com',
  // Telecom
  T:     'att.com',
  VZ:    'verizon.com',
  CMCSA: 'comcastcorporation.com',
  // Communication
  IBM:   'ibm.com',
  CSCO:  'cisco.com',
  // Defense
  LMT:   'lockheedmartin.com',
  RTX:   'rtx.com',
  NOC:   'northropgrumman.com',
  GD:    'gd.com',
  // Crypto/Fintech (where relevant)
  COIN:  'coinbase.com',
  SOFI:  'sofi.com',
  PYPL:  'paypal.com',
  // Auto
  F:     'ford.com',
  GM:    'gm.com',
  RIVN:  'rivian.com',
  // Retail / E-commerce
  TGT:   'target.com',
  // Other notable
  GME:   'gamestop.com',
  AMC:   'amctheatres.com',
};

export function tickerToLogoUrl(ticker: string): string | undefined {
  const domain = TICKER_DOMAINS[ticker.toUpperCase()];
  return domain ? `https://logo.clearbit.com/${domain}` : undefined;
}
