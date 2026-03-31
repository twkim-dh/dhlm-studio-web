export interface WisdomEntry {
  id: number;
  quote: string;
  author: string;
  role: string;
  country: string;
  flag: string;
  ticker: string | null;
  category: string;
  explanation: string;
}

export const WISDOM: WisdomEntry[] = [
  // === Warren Buffett (1-15) ===
  {
    id: 1,
    quote: "Be fearful when others are greedy and greedy when others are fearful.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "contrarian",
    explanation: "Buffett's most famous contrarian advice tells investors to go against the crowd. When markets are euphoric, prices are likely inflated. When panic sets in, bargains emerge for those brave enough to buy."
  },
  {
    id: 2,
    quote: "The stock market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "patience",
    explanation: "Short-term traders who panic sell or chase momentum often lose money to long-term investors. Patience is not just a virtue in investing; it is the single most reliable edge a retail investor can have."
  },
  {
    id: 3,
    quote: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "risk",
    explanation: "Capital preservation is the foundation of wealth building. Buffett emphasizes that avoiding permanent losses of capital is more important than chasing gains, because recovery from losses requires disproportionately larger returns."
  },
  {
    id: 4,
    quote: "Price is what you pay. Value is what you get.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "fundamentals",
    explanation: "A cheap stock is not necessarily a good investment, and an expensive stock is not necessarily a bad one. What matters is the intrinsic value of the business compared to the price you pay for it."
  },
  {
    id: 5,
    quote: "Our favorite holding period is forever.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "patience",
    explanation: "When you own a wonderful business at a fair price, the best strategy is to hold it indefinitely. Compounding works its magic over decades, and frequent trading only generates taxes and fees."
  },
  {
    id: 6,
    quote: "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "fundamentals",
    explanation: "Quality matters more than bargain-hunting. A great business will compound value over time even if you pay a reasonable price, whereas a mediocre business bought cheaply may never generate meaningful returns."
  },
  {
    id: 7,
    quote: "Only when the tide goes out do you discover who's been swimming naked.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "risk",
    explanation: "Bull markets hide poor risk management and overleveraged positions. When a downturn arrives, those who took excessive risks without proper safeguards are exposed and suffer the greatest losses."
  },
  {
    id: 8,
    quote: "If you aren't willing to own a stock for ten years, don't even think about owning it for ten minutes.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "patience",
    explanation: "This forces investors to think like business owners rather than traders. If the underlying business isn't something you'd want to own for a decade, the short-term price action shouldn't tempt you either."
  },
  {
    id: 9,
    quote: "The most important quality for an investor is temperament, not intellect.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "mindset",
    explanation: "Emotional control beats raw intelligence in investing. You don't need a genius IQ to succeed, but you do need the discipline to avoid panic selling, FOMO buying, and other behavioral traps."
  },
  {
    id: 10,
    quote: "Risk comes from not knowing what you're doing.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "risk",
    explanation: "Ignorance is the true source of investment risk. When you thoroughly understand a business, its competitive advantages, and its financials, what seems risky to others becomes a calculated decision for you."
  },
  {
    id: 11,
    quote: "Somebody's sitting in the shade today because someone planted a tree a long time ago.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "patience",
    explanation: "Long-term investing rewards those who start early and stay consistent. The compounding effect of patient capital allocation creates wealth that seems effortless in hindsight but requires years of discipline."
  },
  {
    id: 12,
    quote: "Wide diversification is only required when investors do not understand what they are doing.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "fundamentals",
    explanation: "If you deeply understand a few businesses, concentrating your portfolio can lead to superior returns. Over-diversification dilutes your best ideas and is often a hedge against ignorance rather than a strategy."
  },
  {
    id: 13,
    quote: "The stock market is designed to transfer money from the active to the patient.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "mindset",
    explanation: "Overtrading is one of the biggest wealth destroyers for individual investors. Each transaction incurs costs and taxes, and the urge to constantly act usually leads to buying high and selling low."
  },
  {
    id: 14,
    quote: "I try to buy stock in businesses that are so wonderful that an idiot can run them. Because sooner or later, one will.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "humor",
    explanation: "A truly great business has such strong competitive advantages that it can survive poor management. Buffett looks for durable moats like brand power, network effects, or cost advantages that protect the business regardless of who runs it."
  },
  {
    id: 15,
    quote: "You only have to do a very few things right in your life so long as you don't do too many things wrong.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "mindset",
    explanation: "Investing success doesn't require constant brilliance. A handful of great decisions over a lifetime, combined with avoiding catastrophic mistakes, is enough to build extraordinary wealth."
  },

  // === Charlie Munger (16-23) ===
  {
    id: 16,
    quote: "The big money is not in the buying and the selling, but in the waiting.",
    author: "Charlie Munger",
    role: "Vice Chairman, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "patience",
    explanation: "Munger's entire philosophy distilled into one line. The real wealth creation happens during the holding period as compounding does its work. Most investors sabotage themselves by being unable to simply sit still."
  },
  {
    id: 17,
    quote: "Invert, always invert.",
    author: "Charlie Munger",
    role: "Vice Chairman, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "mindset",
    explanation: "Instead of asking how to succeed, ask how to fail and then avoid those things. This mental model helps investors identify risks they might otherwise overlook and leads to more robust decision-making."
  },
  {
    id: 18,
    quote: "It is remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid, instead of trying to be very intelligent.",
    author: "Charlie Munger",
    role: "Vice Chairman, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "mindset",
    explanation: "Avoiding dumb mistakes is more valuable than making brilliant moves. In investing, the winners are often those who simply dodge the pitfalls that eliminate others from the game."
  },
  {
    id: 19,
    quote: "Spend each day trying to be a little wiser than you were when you woke up.",
    author: "Charlie Munger",
    role: "Vice Chairman, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "mindset",
    explanation: "Continuous learning is the foundation of good investing. The world changes constantly, and the investor who reads widely and thinks deeply will make better decisions over time than one who relies on tips and trends."
  },
  {
    id: 20,
    quote: "There is no better teacher than history in determining the future. There are answers worth billions of dollars in a $30 history book.",
    author: "Charlie Munger",
    role: "Vice Chairman, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "cycles",
    explanation: "Market cycles, bubbles, and crashes follow recognizable patterns throughout history. Studying past financial events gives investors a roadmap to navigate current conditions and avoid repeating costly errors."
  },
  {
    id: 21,
    quote: "Knowing what you don't know is more useful than being brilliant.",
    author: "Charlie Munger",
    role: "Vice Chairman, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "risk",
    explanation: "Intellectual humility protects your portfolio. Recognizing the boundaries of your knowledge prevents you from making confident bets in areas you don't truly understand, which is where the biggest losses usually originate."
  },
  {
    id: 22,
    quote: "The world is not driven by greed. It's driven by envy.",
    author: "Charlie Munger",
    role: "Vice Chairman, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "mindset",
    explanation: "Envy of others' returns causes investors to chase performance, take excessive risks, and abandon their strategies. Comparing your portfolio to others is one of the most destructive habits in investing."
  },
  {
    id: 23,
    quote: "If you're not willing to react with equanimity to a market price decline of 50% two or three times a century, you're not fit to be a common shareholder.",
    author: "Charlie Munger",
    role: "Vice Chairman, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "risk",
    explanation: "Severe market declines are a normal part of equity investing, not an aberration. If you cannot stomach a 50% drawdown without panic selling, you should reduce your stock allocation before the next crash arrives."
  },

  // === Benjamin Graham (24-31) ===
  {
    id: 24,
    quote: "In the short run, the market is a voting machine but in the long run, it is a weighing machine.",
    author: "Benjamin Graham",
    role: "Father of Value Investing",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Short-term prices reflect popularity and sentiment, but over time, market prices converge to intrinsic value. This insight is the bedrock of value investing: buy undervalued assets and wait for the market to recognize their true worth."
  },
  {
    id: 25,
    quote: "The intelligent investor is a realist who sells to optimists and buys from pessimists.",
    author: "Benjamin Graham",
    role: "Father of Value Investing",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "contrarian",
    explanation: "Successful investing requires doing the opposite of what feels comfortable. Selling when everyone is euphoric and buying when everyone is despairing is emotionally difficult but financially rewarding."
  },
  {
    id: 26,
    quote: "The investor's chief problem, and even his worst enemy, is likely to be himself.",
    author: "Benjamin Graham",
    role: "Father of Value Investing",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "Behavioral biases like overconfidence, loss aversion, and herd mentality cause more investment losses than bad analysis. Mastering your own psychology is the first step to becoming a successful investor."
  },
  {
    id: 27,
    quote: "Have the courage of your knowledge and experience. If you have formed a conclusion from the facts and if you know your judgment is sound, act on it.",
    author: "Benjamin Graham",
    role: "Father of Value Investing",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "Conviction backed by thorough research is essential. Once you've done your homework and the numbers support your thesis, don't let market noise or the opinions of others shake you from your position."
  },
  {
    id: 28,
    quote: "The margin of safety is always dependent on the price paid.",
    author: "Benjamin Graham",
    role: "Father of Value Investing",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "risk",
    explanation: "The difference between what you pay and what an asset is worth is your buffer against error. A larger margin of safety means even if your analysis is partially wrong, you can still avoid losing money."
  },
  {
    id: 29,
    quote: "To achieve satisfactory investment results is easier than most people realize; to achieve superior results is harder than it looks.",
    author: "Benjamin Graham",
    role: "Father of Value Investing",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "A simple index fund strategy can deliver decent results with minimal effort. However, consistently beating the market requires extraordinary skill, discipline, and temperament that few possess."
  },
  {
    id: 30,
    quote: "Those who do not remember the past are condemned to repeat it.",
    author: "Benjamin Graham",
    role: "Father of Value Investing",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "cycles",
    explanation: "Graham often quoted Santayana to warn investors about cyclical market behavior. Every generation of investors tends to believe 'this time is different,' only to learn the same painful lessons as their predecessors."
  },
  {
    id: 31,
    quote: "Buy not on optimism, but on arithmetic.",
    author: "Benjamin Graham",
    role: "Father of Value Investing",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Investment decisions should be based on cold, hard numbers, not feelings or narratives. Calculate the intrinsic value, compare it to the market price, and let the math guide your decision."
  },

  // === Peter Lynch (32-38) ===
  {
    id: 32,
    quote: "Know what you own, and know why you own it.",
    author: "Peter Lynch",
    role: "Former Manager, Fidelity Magellan Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Every position in your portfolio should have a clear thesis you can articulate. If you can't explain in a few sentences why you own a stock, you're gambling, not investing."
  },
  {
    id: 33,
    quote: "The person that turns over the most rocks wins the game.",
    author: "Peter Lynch",
    role: "Former Manager, Fidelity Magellan Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Thorough research and broad exploration of investment ideas gives you an edge. The more companies you analyze, the more likely you are to find hidden gems that others have overlooked."
  },
  {
    id: 34,
    quote: "Far more money has been lost by investors preparing for corrections, or trying to anticipate corrections, than has been lost in corrections themselves.",
    author: "Peter Lynch",
    role: "Former Manager, Fidelity Magellan Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "cycles",
    explanation: "Market timing is a fool's errand. Investors who sit on the sidelines waiting for a crash miss out on far more gains than they would have lost by simply staying invested through the downturns."
  },
  {
    id: 35,
    quote: "In this business, if you're good, you're right six times out of ten.",
    author: "Peter Lynch",
    role: "Former Manager, Fidelity Magellan Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "risk",
    explanation: "Even the best investors are wrong nearly half the time. What matters is that your winners win big enough to more than compensate for your losers. Accept that being wrong is part of the process."
  },
  {
    id: 36,
    quote: "Go for a business that any idiot can run, because sooner or later, any idiot probably is going to run it.",
    author: "Peter Lynch",
    role: "Former Manager, Fidelity Magellan Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "humor",
    explanation: "Simple, durable business models are more resilient than complex ones. A company that depends on brilliant management is fragile; one that thrives despite average leadership has a truly great business model."
  },
  {
    id: 37,
    quote: "Behind every stock is a company. Find out what it's doing.",
    author: "Peter Lynch",
    role: "Former Manager, Fidelity Magellan Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Stocks are not lottery tickets or blinking symbols on a screen. They represent ownership in real businesses, and understanding the underlying business is the key to making informed investment decisions."
  },
  {
    id: 38,
    quote: "Investing without research is like playing stud poker and never looking at the cards.",
    author: "Peter Lynch",
    role: "Former Manager, Fidelity Magellan Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "humor",
    explanation: "Buying stocks based on tips, hype, or gut feelings without doing due diligence is pure gambling. The information is available to anyone willing to read annual reports and study the business."
  },

  // === George Soros (39-43) ===
  {
    id: 39,
    quote: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.",
    author: "George Soros",
    role: "Founder, Soros Fund Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "risk",
    explanation: "Asymmetric risk-reward is the key to great returns. Position sizing and risk management matter far more than your batting average. A single well-sized winning trade can make up for many small losses."
  },
  {
    id: 40,
    quote: "The financial markets generally are unpredictable. So that one has to have different scenarios.",
    author: "George Soros",
    role: "Founder, Soros Fund Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "risk",
    explanation: "No one can predict the future with certainty, so preparing for multiple outcomes is essential. Having contingency plans for different market scenarios protects you from being blindsided by unexpected events."
  },
  {
    id: 41,
    quote: "Markets are constantly in a state of uncertainty and flux, and money is made by discounting the obvious and betting on the unexpected.",
    author: "George Soros",
    role: "Founder, Soros Fund Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "contrarian",
    explanation: "By the time something is obvious to everyone, it's already priced in. The big profits come from identifying outcomes that the market hasn't yet recognized or has mispriced due to consensus thinking."
  },
  {
    id: 42,
    quote: "I'm only rich because I know when I'm wrong.",
    author: "George Soros",
    role: "Founder, Soros Fund Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "The ability to admit mistakes quickly and cut losses is what separates great investors from average ones. Ego and stubbornness are the enemies of capital preservation."
  },
  {
    id: 43,
    quote: "The worse a situation becomes, the less it takes to turn it around, and the bigger the upside.",
    author: "George Soros",
    role: "Founder, Soros Fund Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "contrarian",
    explanation: "Extreme pessimism creates the greatest opportunities. When expectations are at rock bottom, even a small improvement can trigger a massive rally. This is the essence of contrarian investing."
  },

  // === Ray Dalio (44-48) ===
  {
    id: 44,
    quote: "He who lives by the crystal ball will eat shattered glass.",
    author: "Ray Dalio",
    role: "Founder, Bridgewater Associates",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "cycles",
    explanation: "Relying on market predictions is a recipe for disaster. Instead of trying to forecast, build a portfolio that can weather multiple scenarios and focus on what you can control: your process and risk management."
  },
  {
    id: 45,
    quote: "Pain plus reflection equals progress.",
    author: "Ray Dalio",
    role: "Founder, Bridgewater Associates",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "Investment losses are inevitable, but they become valuable if you analyze what went wrong. Keeping an investment journal and reviewing your mistakes transforms painful experiences into better future decision-making."
  },
  {
    id: 46,
    quote: "Diversifying well is the most important thing you need to do in order to invest well.",
    author: "Ray Dalio",
    role: "Founder, Bridgewater Associates",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "risk",
    explanation: "True diversification means holding uncorrelated assets, not just many stocks. Dalio's All Weather portfolio concept shows that balancing across asset classes, geographies, and risk factors can dramatically reduce volatility without sacrificing returns."
  },
  {
    id: 47,
    quote: "The biggest mistake investors make is to believe that what happened in the recent past is likely to persist.",
    author: "Ray Dalio",
    role: "Founder, Bridgewater Associates",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "cycles",
    explanation: "Recency bias causes investors to extrapolate recent trends indefinitely. Markets are cyclical by nature, and what has been going up will eventually come down, and vice versa."
  },
  {
    id: 48,
    quote: "If you're not failing, you're not pushing your limits, and if you're not pushing your limits, you're not maximizing your potential.",
    author: "Ray Dalio",
    role: "Founder, Bridgewater Associates",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "Calculated risk-taking is necessary for growth, both in investing and in life. Playing it too safe guarantees mediocre returns. The key is to take smart risks where the potential reward justifies the downside."
  },

  // === Howard Marks (49-53) ===
  {
    id: 49,
    quote: "The most important thing is being attentive to cycles. Everything is cyclical.",
    author: "Howard Marks",
    role: "Co-Chairman, Oaktree Capital Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "cycles",
    explanation: "Markets, economies, and investor sentiment all move in cycles. Understanding where we are in the current cycle helps you calibrate risk, position your portfolio, and avoid being caught off guard by reversals."
  },
  {
    id: 50,
    quote: "You can't predict. You can prepare.",
    author: "Howard Marks",
    role: "Co-Chairman, Oaktree Capital Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "risk",
    explanation: "Forecasting is futile, but preparation is powerful. Building a resilient portfolio, maintaining liquidity, and having a plan for various scenarios is far more effective than trying to time the market."
  },
  {
    id: 51,
    quote: "The biggest investing errors come not from factors that are informational or analytical, but from those that are psychological.",
    author: "Howard Marks",
    role: "Co-Chairman, Oaktree Capital Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "Even with perfect information and analysis, psychological biases like greed, fear, and herd mentality can derail investment decisions. Emotional discipline is the most underappreciated investing skill."
  },
  {
    id: 52,
    quote: "There are old investors, and there are bold investors, but there are no old bold investors.",
    author: "Howard Marks",
    role: "Co-Chairman, Oaktree Capital Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "humor",
    explanation: "Reckless risk-taking eventually catches up with everyone. Sustainable investing success comes from managing risk carefully over a long career, not from making aggressive bets that can blow up your portfolio."
  },
  {
    id: 53,
    quote: "Skepticism and pessimism aren't synonymous. Skepticism calls for pessimism when optimism is excessive. But it also calls for optimism when pessimism is excessive.",
    author: "Howard Marks",
    role: "Co-Chairman, Oaktree Capital Management",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "contrarian",
    explanation: "True critical thinking means going against the prevailing mood in either direction. A skeptic questions both euphoria and despair, buying when fear is overdone and selling when greed takes over."
  },

  // === Mark Cuban (54-57) ===
  {
    id: 54,
    quote: "Sweat equity is the most valuable equity there is.",
    author: "Mark Cuban",
    role: "Entrepreneur & Investor",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "Hard work and dedication are worth more than financial capital. Your willingness to outwork the competition is an asset that cannot be taken away and compounds over time into real business value."
  },
  {
    id: 55,
    quote: "It doesn't matter how many times you fail. You only have to be right once.",
    author: "Mark Cuban",
    role: "Entrepreneur & Investor",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "In entrepreneurship and venture investing, the power law dominates. One massive winner can make up for dozens of failures. This mindset encourages persistence and taking calculated shots on high-conviction ideas."
  },
  {
    id: 56,
    quote: "In business, to be a success, you only have to be right once.",
    author: "Mark Cuban",
    role: "Entrepreneur & Investor",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "patience",
    explanation: "Cuban's own career illustrates this perfectly: after multiple ventures, his sale of Broadcast.com made him a billionaire. Don't let early failures discourage you from continuing to seek your breakthrough opportunity."
  },
  {
    id: 57,
    quote: "The number one reason companies fail is they run out of cash.",
    author: "Mark Cuban",
    role: "Entrepreneur & Investor",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "risk",
    explanation: "Cash is oxygen for businesses and portfolios alike. Whether evaluating a company's balance sheet or managing your own investments, maintaining adequate liquidity is essential to surviving downturns."
  },

  // === Elon Musk (58-61) ===
  {
    id: 58,
    quote: "When something is important enough, you do it even if the odds are not in your favor.",
    author: "Elon Musk",
    role: "CEO, Tesla & SpaceX",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "TSLA",
    category: "mindset",
    explanation: "Conviction-driven investing means sometimes backing ideas that consensus says will fail. The highest-returning investments often look crazy at the time, but visionary thinking can yield extraordinary results."
  },
  {
    id: 59,
    quote: "Some people don't like change, but you need to embrace change if the alternative is disaster.",
    author: "Elon Musk",
    role: "CEO, Tesla & SpaceX",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "TSLA",
    category: "cycles",
    explanation: "Industries that resist disruption get destroyed by it. Investors should look for companies that embrace change and innovation, as these are the ones most likely to thrive in a rapidly evolving economy."
  },
  {
    id: 60,
    quote: "Persistence is very important. You should not give up unless you are forced to give up.",
    author: "Elon Musk",
    role: "CEO, Tesla & SpaceX",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "TSLA",
    category: "patience",
    explanation: "Musk nearly went bankrupt with both Tesla and SpaceX before they succeeded. In investing, holding through periods of adversity when your fundamental thesis remains intact can lead to outsized returns."
  },
  {
    id: 61,
    quote: "I think it is possible for ordinary people to choose to be extraordinary.",
    author: "Elon Musk",
    role: "CEO, Tesla & SpaceX",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "TSLA",
    category: "mindset",
    explanation: "You don't need Wall Street connections or an Ivy League degree to be a great investor. With discipline, continuous learning, and rational thinking, ordinary individuals can achieve extraordinary investment results."
  },

  // === Jeff Bezos (62-65) ===
  {
    id: 62,
    quote: "I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying.",
    author: "Jeff Bezos",
    role: "Founder, Amazon",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "AMZN",
    category: "mindset",
    explanation: "The regret minimization framework is powerful for investment decisions too. Missing a great opportunity often hurts more than taking a calculated risk that doesn't work out. Don't let fear of failure prevent action."
  },
  {
    id: 63,
    quote: "If you double the number of experiments you do per year, you're going to double your inventiveness.",
    author: "Jeff Bezos",
    role: "Founder, Amazon",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "AMZN",
    category: "fundamentals",
    explanation: "Companies that experiment aggressively tend to innovate faster and create more value. When evaluating businesses, look for a culture of rapid experimentation as a sign of long-term competitive advantage."
  },
  {
    id: 64,
    quote: "Your margin is my opportunity.",
    author: "Jeff Bezos",
    role: "Founder, Amazon",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "AMZN",
    category: "fundamentals",
    explanation: "Amazon's strategy of sacrificing short-term profits to gain market share disrupted entire industries. Investors should watch for companies willing to invest in growth over immediate profitability, as they often create the most long-term value."
  },
  {
    id: 65,
    quote: "We are stubborn on vision. We are flexible on details.",
    author: "Jeff Bezos",
    role: "Founder, Amazon",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "AMZN",
    category: "patience",
    explanation: "Great companies maintain a clear long-term vision while adapting their tactics as needed. As an investor, have conviction in your thesis but be willing to adjust your approach as new information emerges."
  },

  // === Mark Zuckerberg (66-68) ===
  {
    id: 66,
    quote: "The biggest risk is not taking any risk. In a world that is changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
    author: "Mark Zuckerberg",
    role: "CEO, Meta",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "META",
    category: "risk",
    explanation: "In a rapidly evolving economy, standing still means falling behind. Conservative investing has its place, but avoiding all risk ensures your purchasing power erodes through inflation over time."
  },
  {
    id: 67,
    quote: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
    author: "Mark Zuckerberg",
    role: "CEO, Meta",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "META",
    category: "mindset",
    explanation: "Speed of execution is a competitive advantage in technology. When evaluating tech companies, look for those that iterate quickly and are not afraid to disrupt even their own products to stay ahead."
  },
  {
    id: 68,
    quote: "People think innovation is just having a good idea but a lot of it is just moving quickly and trying a lot of things.",
    author: "Mark Zuckerberg",
    role: "CEO, Meta",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "META",
    category: "fundamentals",
    explanation: "Innovation is a process, not a moment of genius. Companies with strong cultures of rapid iteration and experimentation tend to find product-market fit faster and build more defensible competitive positions."
  },

  // === Jensen Huang (69-71) ===
  {
    id: 69,
    quote: "The conditions don't have to be perfect to get started. The conditions will never be perfect.",
    author: "Jensen Huang",
    role: "CEO, NVIDIA",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "NVDA",
    category: "mindset",
    explanation: "Waiting for the perfect entry point means never investing. Market conditions will always have uncertainties. Starting with a solid plan and adjusting along the way beats indefinite analysis paralysis."
  },
  {
    id: 70,
    quote: "If you want to do something great, you should be prepared to suffer. Greatness is not free.",
    author: "Jensen Huang",
    role: "CEO, NVIDIA",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "NVDA",
    category: "patience",
    explanation: "NVIDIA spent over a decade investing in GPU computing before AI made it a trillion-dollar company. Long-term investors must endure periods of underperformance and doubt before their thesis is validated."
  },
  {
    id: 71,
    quote: "The more you suffer, the more you appreciate success, and it's much more likely that you'll treat your success correctly.",
    author: "Jensen Huang",
    role: "CEO, NVIDIA",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "NVDA",
    category: "mindset",
    explanation: "Investors who have experienced losses and drawdowns develop a healthier respect for risk. The lessons learned from adversity create better decision-making habits and more sustainable long-term returns."
  },

  // === John Templeton (72-74) ===
  {
    id: 72,
    quote: "Bull markets are born on pessimism, grow on skepticism, mature on optimism, and die on euphoria.",
    author: "John Templeton",
    role: "Founder, Templeton Growth Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "cycles",
    explanation: "This is one of the most elegant descriptions of market cycles ever articulated. Understanding which phase the market is in helps you calibrate your risk exposure and identify when to be aggressive versus defensive."
  },
  {
    id: 73,
    quote: "The four most dangerous words in investing are: 'This time it's different.'",
    author: "John Templeton",
    role: "Founder, Templeton Growth Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "cycles",
    explanation: "Every bubble is accompanied by a narrative explaining why traditional valuation metrics no longer apply. History shows that fundamentals always reassert themselves eventually, often with devastating consequences for those who ignored them."
  },
  {
    id: 74,
    quote: "The time of maximum pessimism is the best time to buy, and the time of maximum optimism is the best time to sell.",
    author: "John Templeton",
    role: "Founder, Templeton Growth Fund",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "contrarian",
    explanation: "Templeton built his fortune by buying during periods of extreme fear, including during World War II. Maximum pessimism creates maximum mispricing, offering the greatest potential for above-average returns."
  },

  // === Philip Fisher (75-77) ===
  {
    id: 75,
    quote: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher",
    role: "Author, Common Stocks and Uncommon Profits",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Knowing a stock's price tells you nothing about whether it's a good investment. Understanding the business's competitive position, growth prospects, and management quality is what determines true value."
  },
  {
    id: 76,
    quote: "I don't want a lot of good investments; I want a few outstanding ones.",
    author: "Philip Fisher",
    role: "Author, Common Stocks and Uncommon Profits",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "patience",
    explanation: "Fisher advocated concentrated portfolios of high-quality growth companies. Owning fewer, better businesses allows you to know them deeply and benefit fully from their compounding power over time."
  },
  {
    id: 77,
    quote: "Is the company making above-average efforts to build a strong sales organization?",
    author: "Philip Fisher",
    role: "Author, Common Stocks and Uncommon Profits",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Fisher's scuttlebutt method involves evaluating a company's sales capabilities alongside its products. A great product with a weak sales organization will underperform, making distribution strength a critical investment criterion."
  },

  // === Jesse Livermore (78-80) ===
  {
    id: 78,
    quote: "There is nothing new in Wall Street. There can't be because speculation is as old as the hills.",
    author: "Jesse Livermore",
    role: "Legendary Trader",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "cycles",
    explanation: "Human nature drives markets, and human nature doesn't change. The same patterns of greed, fear, and herd behavior repeat across centuries. Understanding this gives you a timeless edge in markets."
  },
  {
    id: 79,
    quote: "It was never my thinking that made the big money for me. It always was my sitting.",
    author: "Jesse Livermore",
    role: "Legendary Trader",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "patience",
    explanation: "Even the most famous trader in history attributed his success to patience, not cleverness. The ability to hold a winning position through volatility is what separates exceptional returns from average ones."
  },
  {
    id: 80,
    quote: "The market does not beat them. They beat themselves, because though they have brains they cannot sit tight.",
    author: "Jesse Livermore",
    role: "Legendary Trader",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "Intelligent people often perform worse in markets because they overthink and overtrade. The discipline to do nothing when nothing needs to be done is one of the hardest skills to master in investing."
  },

  // === Jack Bogle (81-83) ===
  {
    id: 81,
    quote: "Don't look for the needle in the haystack. Just buy the haystack!",
    author: "Jack Bogle",
    role: "Founder, Vanguard Group",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "humor",
    explanation: "Instead of trying to pick winning stocks, buy the entire market through index funds. This simple strategy has outperformed most professional fund managers over the long term while charging minimal fees."
  },
  {
    id: 82,
    quote: "Time is your friend; impulse is your enemy.",
    author: "Jack Bogle",
    role: "Founder, Vanguard Group",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "patience",
    explanation: "Compounding works in your favor over decades, but impulsive decisions can destroy years of gains in moments. The best thing most investors can do is set up automatic investments and resist the urge to tinker."
  },
  {
    id: 83,
    quote: "In investing, you get what you don't pay for. Costs matter.",
    author: "Jack Bogle",
    role: "Founder, Vanguard Group",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Every dollar spent on fees, commissions, and fund expenses is a dollar that doesn't compound for you. Over a 30-year investing career, even a 1% difference in fees can reduce your final wealth by 25% or more."
  },

  // === Carl Icahn (84-85) ===
  {
    id: 84,
    quote: "In life and business, there are two cardinal sins. The first is to act precipitously without thought and the second is to not act at all.",
    author: "Carl Icahn",
    role: "Activist Investor",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "Both impulsive action and paralysis by analysis can be equally destructive. The ideal investor thinks carefully but acts decisively when the opportunity presents itself, balancing deliberation with courage."
  },
  {
    id: 85,
    quote: "A lot of people die fighting tyranny. The least I can do is vote against it.",
    author: "Carl Icahn",
    role: "Activist Investor",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "contrarian",
    explanation: "Icahn's activist approach reminds investors that they have the power to influence the companies they own. Shareholder activism can unlock value by holding management accountable and pushing for changes that benefit all investors."
  },

  // === Bill Ackman (86-87) ===
  {
    id: 86,
    quote: "Investing is a business where you can look very silly for a long period of time before you are proven right.",
    author: "Bill Ackman",
    role: "CEO, Pershing Square Capital",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "patience",
    explanation: "Contrarian positions often take time to pay off, and you may face ridicule in the interim. Having the conviction to hold unpopular positions when your research supports them is what separates great investors from the crowd."
  },
  {
    id: 87,
    quote: "I look for simple businesses with consistent earning power and a durable competitive advantage.",
    author: "Bill Ackman",
    role: "CEO, Pershing Square Capital",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Complexity is the enemy of understanding. The best investments are often businesses simple enough to analyze with confidence, generating reliable cash flows protected by strong moats against competition."
  },

  // === Cathie Wood (88-89) ===
  {
    id: 88,
    quote: "Innovation solves problems. The bigger the problem, the bigger the opportunity.",
    author: "Cathie Wood",
    role: "CEO, ARK Invest",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Disruptive innovation creates enormous investment opportunities by addressing large, unsolved problems. Companies that use technology to transform industries can grow exponentially, rewarding early investors handsomely."
  },
  {
    id: 89,
    quote: "We believe that innovation is key to growth, and we are investing in the future, not the past.",
    author: "Cathie Wood",
    role: "CEO, ARK Invest",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "contrarian",
    explanation: "Forward-looking investing means identifying transformative trends before they become consensus. While value investors look at current financials, growth investors must imagine how emerging technologies will reshape entire industries."
  },

  // === Jim Cramer (90-91) ===
  {
    id: 90,
    quote: "Bulls make money, bears make money, pigs get slaughtered.",
    author: "Jim Cramer",
    role: "Host, CNBC Mad Money",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "humor",
    explanation: "You can make money in both rising and falling markets, but excessive greed destroys portfolios. Taking reasonable profits and managing position sizes keeps you in the game, while holding out for unrealistic gains often ends in tears."
  },
  {
    id: 91,
    quote: "There's always a bull market somewhere.",
    author: "Jim Cramer",
    role: "Host, CNBC Mad Money",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "humor",
    explanation: "Even in bear markets, certain sectors, regions, or asset classes are thriving. The key is to stay flexible and open-minded, willing to look beyond your usual hunting grounds to find where the opportunities are hiding."
  },

  // === Ken Griffin (92) ===
  {
    id: 92,
    quote: "The glory of the American financial system is its ability to allocate capital to its most productive use.",
    author: "Ken Griffin",
    role: "Founder, Citadel",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "fundamentals",
    explanation: "Efficient capital markets reward businesses that create value and punish those that waste resources. Understanding this mechanism helps investors identify where capital will flow and which companies will benefit most."
  },

  // === Stanley Druckenmiller (93) ===
  {
    id: 93,
    quote: "The way to build long-term returns is through preservation of capital and home runs.",
    author: "Stanley Druckenmiller",
    role: "Former Chairman, Duquesne Capital",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "risk",
    explanation: "Druckenmiller's approach combines defensive capital preservation most of the time with aggressive bets when conviction is highest. This barbell strategy of mostly cautious play punctuated by bold moves has generated legendary returns."
  },

  // === Jamie Dimon (94) ===
  {
    id: 94,
    quote: "The strength of a company is not measured by its size but by the value it creates for its customers.",
    author: "Jamie Dimon",
    role: "CEO, JPMorgan Chase",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "JPM",
    category: "fundamentals",
    explanation: "Revenue and market cap don't tell the whole story. Companies that genuinely solve customer problems build loyalty and pricing power. Look for businesses where customers love the product, not just where the numbers look big."
  },

  // === Paul Tudor Jones (95) ===
  {
    id: 95,
    quote: "The secret to being successful from a trading perspective is to have an indefatigable and an undying and unquenchable thirst for information and knowledge.",
    author: "Paul Tudor Jones",
    role: "Founder, Tudor Investment Corp",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: null,
    category: "mindset",
    explanation: "Continuous learning and information gathering create a sustainable edge. Markets evolve constantly, and the investors who stay curious and keep expanding their knowledge base will adapt and thrive when others fall behind."
  },

  // === Additional Buffett-adjacent and thematic quotes (96-100) ===
  {
    id: 96,
    quote: "If you don't find a way to make money while you sleep, you will work until you die.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "patience",
    explanation: "Passive income from investments is the path to financial freedom. Building a portfolio that generates returns around the clock is the most reliable way to escape the trading-time-for-money trap."
  },
  {
    id: 97,
    quote: "I will tell you how to become rich. Close the doors. Be fearful when others are greedy. Be greedy when others are fearful.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "contrarian",
    explanation: "This is the expanded version of Buffett's most famous quote, delivered at a Columbia University lecture. The opening phrase emphasizes that the secret to wealth is no secret at all; it simply requires doing what is psychologically difficult."
  },
  {
    id: 98,
    quote: "Never invest in a business you cannot understand.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "risk",
    explanation: "Staying within your circle of competence is crucial for sound investing. If you cannot clearly explain how a company makes money and what its competitive advantages are, you are taking on unknowable risks."
  },
  {
    id: 99,
    quote: "We simply attempt to be fearful when others are greedy and to be greedy only when others are fearful.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "contrarian",
    explanation: "From Buffett's 1986 letter to shareholders, this variation emphasizes the word 'simply' to remind us that the strategy is straightforward in concept, even though it requires enormous emotional discipline to execute."
  },
  {
    id: 100,
    quote: "Opportunities come infrequently. When it rains gold, put out the bucket, not the thimble.",
    author: "Warren Buffett",
    role: "CEO, Berkshire Hathaway",
    country: "US",
    flag: "\u{1F1FA}\u{1F1F8}",
    ticker: "BRK.A",
    category: "contrarian",
    explanation: "When rare, high-conviction opportunities appear, go big. Most of the time you should be patient and cautious, but when the market offers you an obvious bargain, that is the time to deploy capital aggressively."
  }
];

export function getWisdomById(id: number): WisdomEntry | undefined {
  return WISDOM.find(w => w.id === id);
}

export function getTodaysWisdom(): WisdomEntry {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return WISDOM[dayOfYear % WISDOM.length];
}
