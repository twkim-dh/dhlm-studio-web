export interface PortfolioStock {
  ticker: string;
  change: number;
  sector: string;
}

export interface PortfolioReport {
  grade: string;
  gradeColor: string;
  gradeEmoji: string;
  overview: string;
  individualRoasts: { ticker: string; roast: string; rating: string; ratingColor: string }[];
  stats: { diversification: string; riskLevel: string; recommendation: string };
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const STOCK_ROASTS: Record<string, string[]> = {
  AAPL: ["Same phone every year, different camera. GENIUS marketing, BORING stock.", "Tim Cook's biggest innovation: making you pay $1,200 for a phone you already have.", "Apple Intelligence? More like Apple IRRELEVANCE if they don't catch up in AI."],
  TSLA: ["Elon is posting memes while your money BURNS. Robotaxis coming 'next year' since 2016.", "DOWN again? Maybe if Elon spent less time on X and more time on CARS.", "A car company valued like a tech company. What could POSSIBLY go wrong?"],
  NVDA: ["P/E of 65? SIXTY-FIVE? Back in my day we called that a BUBBLE.", "Everyone and their grandmother owns NVDA. When the shoeshine boy recommends it, SELL.", "AI chips are great until someone builds cheaper ones. Looking at you, AMD."],
  PLTR: ["Spy tech company at 165x earnings. You're not investing, you're DONATING.", "Palantir: making government surveillance profitable since 2003. TREMENDOUS business model.", "Alex Karp's hair is more volatile than this stock. And that's saying something."],
  GME: ["Still holding? REALLY? The squeeze was THREE YEARS AGO. Move ON.", "GameStop: where nostalgia meets financial DESTRUCTION. Very romantic.", "Your shares aren't going to the moon. They're going to your TAX LOSS HARVESTING."],
  META: ["Zuckerberg spent $36 BILLION on the metaverse. THIRTY-SIX BILLION. On virtual legs.", "Meta: the company that knows everything about you except how to make a good product.", "At least the AI pivot is working. No thanks to those Quest headsets gathering DUST."],
  AMZN: ["Bezos went to space and LEFT the stock behind. Can't blame him.", "AWS prints money. Everything else is a CHARITY. Very noble, very UNPROFITABLE.", "Same-day delivery is great. Same-day STOCK RETURNS? Not so much."],
  MSFT: ["Microsoft: boring, reliable, profitable. Like a Toyota Camry in stock form.", "Copilot this, Copilot that. Just wait until customers see the BILL.", "Satya made billions by putting Office in the cloud. REVOLUTIONARY. Really."],
  GOOGL: ["Google: they have ALL the data and STILL can't beat ChatGPT to market.", "Ad revenue machine that panics every time someone says 'antitrust.' VERY nervous energy.", "Waymo has been 'almost ready' for a decade. My grandkids will be driving before those cars."],
  AMD: ["Lisa Su is a GENIUS but AMD is always 'about to catch up.' ALWAYS.", "The forever underdog. Great chips, TERRIBLE at making investors rich.", "AMD: the stock market's participation trophy. Thanks for trying!"],
  COIN: ["A crypto exchange in a world where crypto can't decide if it's an asset or a JOKE.", "Revenue goes up 500% in bull markets, down 80% in bear markets. STABLE business.", "Coinbase: making it easy to lose money in NEW and EXCITING ways."],
  RIVN: ["An EV company that produces more LOSSES than CARS. Impressive, really.", "Rivian: because one money-losing EV company wasn't ENOUGH.", "Beautiful trucks. Beautiful. Also beautiful CASH BURN RATE."],
  SNAP: ["Disappearing messages, disappearing REVENUE, disappearing STOCK PRICE.", "Snap: the app your kids use, the stock your portfolio REGRETS.", "AR glasses are the future! Said everyone in 2016. And 2018. And 2020. And..."],
  SOFI: ["A bank that's not really a bank, for people who can't afford a real bank.", "Student loans, crypto, banking — pick a lane and FOCUS.", "SoFi stadium is worth more than the stock. BEAUTIFUL irony."],
};

function getStockRoast(ticker: string): string {
  const roasts = STOCK_ROASTS[ticker.toUpperCase()];
  if (roasts) return pick(roasts);
  return pick([
    `${ticker}? Never heard of it. And I know EVERYTHING about the market. That should tell you something.`,
    `${ticker} — even the AI doesn't have an opinion on this one. That's how IRRELEVANT it is.`,
    `I looked at ${ticker}'s chart and my screen asked if I needed EMOTIONAL SUPPORT.`,
    `${ticker}: the stock equivalent of ordering the mystery meat at a buffet. BRAVE. Also STUPID.`,
    `${ticker}? My algorithm classified this as 'speculative gambling.' The algorithm is NEVER wrong. Well, almost never.`,
  ]);
}

function getRating(change: number): { rating: string; color: string } {
  if (change < -10) return { rating: 'DISASTER', color: '#FF4545' };
  if (change < -3) return { rating: 'BLEEDING', color: '#FF4545' };
  if (change > 20) return { rating: 'FOMO TRAP', color: '#F59E0B' };
  if (change > 5) return { rating: 'OVERHYPED', color: '#F59E0B' };
  if (change > 0) return { rating: 'MEH', color: '#6B7280' };
  return { rating: 'PAINFUL', color: '#FF4545' };
}

export function generatePortfolioRoast(stocks: PortfolioStock[]): PortfolioReport {
  const total = stocks.length;
  const avgChange = stocks.reduce((s, st) => s + st.change, 0) / total;
  const sectors = new Set(stocks.map(s => s.sector).filter(Boolean));
  const techCount = stocks.filter(s => ['Technology', 'Communication Services', 'Communication'].includes(s.sector)).length;

  // Grade
  let grade = 'C';
  let gradeColor = '#F59E0B';
  let gradeEmoji = '😐';
  if (sectors.size >= 4 && avgChange > 0) { grade = 'B+'; gradeColor = '#00D474'; gradeEmoji = '👍'; }
  else if (sectors.size >= 3 && avgChange > -2) { grade = 'C+'; gradeColor = '#F59E0B'; gradeEmoji = '🤷'; }
  else if (techCount >= total * 0.8) { grade = 'D-'; gradeColor = '#FF4545'; gradeEmoji = '💀'; }
  else if (avgChange < -5) { grade = 'F'; gradeColor = '#FF4545'; gradeEmoji = '☠️'; }
  else if (sectors.size <= 1) { grade = 'D'; gradeColor = '#FF4545'; gradeEmoji = '🤦'; }

  // Overview
  let overview: string;
  if (techCount >= total * 0.8) {
    overview = pick([
      `Let me get this straight. ${techCount} out of ${total} stocks are tech. You call this "diversified"? This isn't a portfolio, it's a TECH SUPPORT GROUP. When the bubble pops — and it WILL pop — you'll have NOTHING left. TREMENDOUS lack of imagination.`,
      `${techCount} tech stocks out of ${total}. That's not a portfolio, that's a NASDAQ ETF with extra steps. And extra FEES. Congratulations on paying more for LESS diversification.`,
    ]);
  } else if (avgChange < -5) {
    overview = pick([
      `Your portfolio is DOWN ${Math.abs(avgChange).toFixed(1)}% COMBINED. That's not investing, that's DONATING money to Wall Street. The stock market thanks you for your generous contribution. VERY SAD.`,
      `Average return: ${avgChange.toFixed(1)}%. I've seen better performance from a SAVINGS ACCOUNT. Actually, I've seen better performance from PUTTING MONEY UNDER A MATTRESS.`,
    ]);
  } else if (avgChange > 10) {
    overview = pick([
      `Up ${avgChange.toFixed(1)}% and you're here getting roasted instead of SELLING? Classic. You'll ride this all the way back down. I've seen it a THOUSAND times. Take some profits, genius.`,
      `${avgChange.toFixed(1)}% gains and you want ME to roast this? Fine. The fact that you're not SELLING right now tells me you don't DESERVE these gains. The market will correct your GREED.`,
    ]);
  } else {
    overview = `${total} stocks. Let me judge each one of your life choices individually, then we'll talk about the bigger picture — which is ALSO disappointing. ${sectors.size} sector${sectors.size > 1 ? 's' : ''} and an average return of ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(1)}%. MEDIOCRE at best.`;
  }

  // Individual roasts
  const individualRoasts = stocks.map(s => {
    const r = getRating(s.change);
    return { ticker: s.ticker, roast: getStockRoast(s.ticker), rating: r.rating, ratingColor: r.color };
  });

  // Stats
  const diversification = sectors.size >= 4 ? 'Acceptable' : sectors.size >= 2 ? 'Weak' : 'LOL';
  const riskLevel = avgChange < -5 ? '"I like pain"' : techCount >= 3 ? '"I love volatility"' : '"I pretend to be careful"';
  const recommendation = grade === 'F' ? '"Start over"' : grade.startsWith('D') ? '"Read a book"' : grade.startsWith('C') ? '"Try harder"' : '"Not terrible"';

  return { grade, gradeColor, gradeEmoji, overview, individualRoasts, stats: { diversification, riskLevel, recommendation } };
}
