function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const ROASTS: Record<string, string[]> = {
  bitcoin: [
    "Digital gold? More like digital ANXIETY. Up 10%, down 15%, up 20% — in ONE WEEK. Your heart can't take this.",
    "Bitcoin is worth $66,000 and NOBODY can explain why without using the word 'decentralized' seventeen times.",
    "Satoshi created Bitcoin and DISAPPEARED. Even the FOUNDER doesn't want to be associated with this volatility.",
  ],
  ethereum: [
    "The merge was supposed to fix everything. Gas fees are still ROBBERY. But hey, at least it's 'proof of stake' now.",
    "Ethereum: where you pay $47 in gas to send $12. REVOLUTIONARY technology. Really.",
    "Vitalik is a genius. His investors? Let's just say they have TREMENDOUS faith and QUESTIONABLE timing.",
  ],
  solana: [
    "Solana: fast, cheap, and goes DOWN more often than a cheap elevator. But when it's UP, it's REALLY up.",
    "The 'Ethereum killer' that keeps killing its own NETWORK. Outages are a FEATURE, not a bug. Apparently.",
    "SOL went from $260 to $8 to $180. If you held through all that, you don't need investing advice — you need THERAPY.",
  ],
  ripple: [
    "XRP: the coin that's been in a LAWSUIT longer than most marriages. SEC vs Ripple is the true never-ending story.",
    "Banks will use XRP any day now. They've been saying that since 2017. TREMENDOUS patience required.",
    "XRP holders have been waiting so long for the 'moon' that they've actually aged into RETIREMENT.",
  ],
  binancecoin: [
    "BNB: trusting your money to a crypto exchange. What could POSSIBLY go wrong? Ask FTX. Oh wait, you CAN'T.",
    "Binance's legal department works harder than any blockchain. THAT'S the real proof of work.",
    "CZ stepped down and BNB is still here. The cockroach of crypto. I mean that as a COMPLIMENT.",
  ],
  cardano: [
    "Cardano: the academic blockchain. Peer-reviewed papers, zero killer apps. It's like a PhD that can't find a JOB.",
    "ADA has been 'almost ready' for smart contracts since 2017. At this rate, my grandkids will use Cardano. MAYBE.",
    "Charles Hoskinson makes more YouTube videos than a TEENAGER. Maybe spend that time BUILDING something?",
  ],
  dogecoin: [
    "A coin created as a JOKE is worth more than most companies. And you wonder why Buffett hates crypto.",
    "DOGE: where your financial future depends on Elon Musk's TWEET schedule. Very stable investment strategy.",
    "Dogecoin has no max supply, no real utility, and INFINITE meme energy. Somehow that's worth $20 billion.",
  ],
  'avalanche-2': [
    "Avalanche: another 'Ethereum killer' in a VERY crowded field. They're going to need a bigger graveyard.",
    "AVAX is fast and cheap. So is fast food. Doesn't mean it's GOOD for you.",
    "Subnet technology is genuinely impressive. The token price? LESS impressive. Much less.",
  ],
  polkadot: [
    "Polkadot: connecting blockchains that nobody uses to other blockchains that nobody uses. INTEROPERABILITY!",
    "DOT parachain auctions are like buying real estate in the METAVERSE. Sounds cool, feels empty.",
    "Gavin Wood left Ethereum to build something 'better.' The market says: we're still WAITING.",
  ],
  'polygon-ecosystem-token': [
    "MATIC rebranded to POL because apparently a new NAME fixes everything. Just ask Facebook. Oh wait, META.",
    "Polygon: Ethereum's cheaper cousin who lives in the BASEMENT. But hey, at least the gas is affordable.",
    "Layer 2 scaling solution that needs Layer 1 to exist. It's like being a PARASITE, but with better marketing.",
  ],
  chainlink: [
    "LINK: the backbone of DeFi that nobody talks about. It's the PLUMBING of crypto. Essential but BORING.",
    "Chainlink oracles feed data to smart contracts. Without it, DeFi collapses. Does the price reflect that? ABSOLUTELY NOT.",
    "Sergey Nazarov has been wearing the same plaid shirt for 7 years. That's either dedication or a CRY for help.",
  ],
  uniswap: [
    "UNI: a governance token where nobody GOVERNS. Democracy in action, crypto style.",
    "Uniswap invented the DEX. Then everyone COPIED it. Being first doesn't mean being RICHEST.",
    "You can trade anything on Uniswap. Including your DIGNITY when you buy that random memecoin at 3 AM.",
  ],
  'shiba-inu': [
    "SHIB: Dogecoin's KNOCKOFF. A meme of a meme. We've reached PEAK absurdity.",
    "Shiba Inu has its own DEX, metaverse, and layer 2. For a 'joke coin,' it's TREMENDOUSLY serious.",
    "SHIB burned trillions of tokens and the price STILL didn't move. Math is not on your side.",
  ],
  litecoin: [
    "Litecoin: the 'silver to Bitcoin's gold.' Silver that's been TARNISHING since 2018.",
    "LTC was created to be faster than Bitcoin. Now EVERYTHING is faster than Bitcoin. Welcome to IRRELEVANCE.",
    "Charlie Lee sold the top in 2017. His own creator DUMPED on you. That's all you need to know.",
  ],
  cosmos: [
    "ATOM: the 'Internet of Blockchains.' A very EMPTY internet with very few VISITORS.",
    "Cosmos tech is genuinely good. Cosmos tokenomics? Let's just say the VALUE doesn't match the VISION.",
    "IBC is beautiful technology. Too bad beautiful technology doesn't always mean beautiful RETURNS.",
  ],
  near: [
    "NEAR Protocol: sharding done right. Now just need USERS done right.",
    "NEAR is technically superior to most chains. The market doesn't care about TECHNICAL SUPERIORITY. Ask Betamax.",
    "Another VC-backed chain with more INVESTORS than actual users. The ratio is CONCERNING.",
  ],
  aptos: [
    "Aptos: built by ex-Meta employees. Because if there's anyone you trust with DECENTRALIZATION, it's Big Tech.",
    "APT launched at $100, dropped to $3, and people STILL bought more. The definition of HOPE over experience.",
    "Move language is interesting. The price movement? Mostly DOWN. Ironic, isn't it?",
  ],
  arbitrum: [
    "ARB: an Ethereum Layer 2 that airdropped tokens to everyone and their GRANDMOTHER. Democracy!",
    "Arbitrum handles more transactions than most Layer 1s. Gets paid like an INTERN.",
    "L2 tokens are the new ICO. Promise everything, deliver a GOVERNANCE token nobody votes with.",
  ],
  optimism: [
    "OP: optimistic about everything except its token PRICE. The name is aspirational at best.",
    "Optimistic rollups: 'We assume everything is fine until proven otherwise.' That's also how I invest. BADLY.",
    "The Optimism Foundation gives away more tokens than Santa gives PRESENTS. Bullish for airdrops, bearish for VALUE.",
  ],
  pepe: [
    "PEPE: a literal FROG meme worth billions. This is fine. Everything is FINE.",
    "Buying PEPE is not investing. It's donating to the meme economy. Tax-deductible? UNFORTUNATELY NOT.",
    "PEPE mooned, crashed, mooned again. It's the ROLLERCOASTER nobody asked for but everyone rides.",
  ],
};

const GENERIC = [
  "Another crypto promising to change the world. The world is STILL waiting.",
  "This coin's whitepaper has more FICTION than a Harry Potter novel. At least Harry Potter is ENTERTAINING.",
  "Crypto projects come and go. MOSTLY go. But sure, THIS one is different. TREMENDOUS conviction.",
];

export function getCryptoRoast(coinId: string): { roast: string; rating: string; ratingColor: string } {
  const roasts = ROASTS[coinId.toLowerCase()];
  const roast = roasts ? pick(roasts) : pick(GENERIC);

  // Rating based on coin
  const top5 = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple'];
  const memes = ['dogecoin', 'shiba-inu', 'pepe'];

  let rating = 'VOLATILE';
  let ratingColor = '#F59E0B';
  if (top5.includes(coinId.toLowerCase())) { rating = 'BLUE CHIP (LOL)'; ratingColor = '#3B82F6'; }
  else if (memes.includes(coinId.toLowerCase())) { rating = 'MEME CASINO'; ratingColor = '#EF4444'; }
  else { rating = 'SPECULATIVE'; ratingColor = '#F59E0B'; }

  return { roast, rating, ratingColor };
}
