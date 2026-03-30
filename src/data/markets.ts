export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  cap: string;
  sector: string;
  catalyst: string;
  tags: string[];
  description: string;
  ceo: string;
  founded: number;
  hq: string;
  employees: string;
  pe: string;
  revenue: string;
  website: string;
}

// Updated: 2026-03-28
export const stocks: Stock[] = [
  {
    ticker: 'QBTS', name: 'D-Wave Quantum', price: 12.47, change: 34.2, cap: '$3.2B',
    sector: 'Quantum Computing', catalyst: 'Won $150M US DoD quantum computing contract',
    tags: ['Quantum', 'Defense'],
    description: 'D-Wave Quantum builds quantum computing systems for businesses and governments. Their quantum annealing technology solves optimization problems faster than classical computers.',
    ceo: 'Dr. Alan Baratz', founded: 1999, hq: 'Burnaby, Canada', employees: '200+',
    pe: 'N/A (pre-profit)', revenue: '$8.8M (TTM)', website: 'dwavesys.com',
  },
  {
    ticker: 'SMCI', name: 'Super Micro Computer', price: 48.32, change: 28.7, cap: '$28.4B',
    sector: 'AI Hardware', catalyst: 'Exclusive NVIDIA Blackwell Ultra server supply deal',
    tags: ['AI', 'Servers'],
    description: 'Supermicro designs and manufactures high-performance server solutions. They are a key supplier of AI infrastructure, building GPU-dense servers for data centers running NVIDIA chips.',
    ceo: 'Charles Liang', founded: 1993, hq: 'San Jose, CA', employees: '5,600+',
    pe: '15.2x', revenue: '$14.9B (TTM)', website: 'supermicro.com',
  },
  {
    ticker: 'IONQ', name: 'IonQ Inc.', price: 42.18, change: 22.4, cap: '$9.1B',
    sector: 'Quantum Computing', catalyst: 'Major European bank quantum finance partnership',
    tags: ['Quantum', 'FinTech'],
    description: 'IonQ builds trapped-ion quantum computers, considered among the most accurate quantum systems available. Their technology is used in finance, chemistry, and machine learning applications.',
    ceo: 'Peter Chapman', founded: 2015, hq: 'College Park, MD', employees: '350+',
    pe: 'N/A (pre-profit)', revenue: '$22M (TTM)', website: 'ionq.com',
  },
  {
    ticker: 'RKLB', name: 'Rocket Lab USA', price: 28.95, change: 18.6, cap: '$14.2B',
    sector: 'Aerospace', catalyst: '2 new NASA Artemis satellite launch contracts',
    tags: ['Space', 'NASA'],
    description: 'Rocket Lab is a space launch company that builds and operates the Electron rocket for small satellite launches. They are developing the larger Neutron rocket for medium-lift missions.',
    ceo: 'Peter Beck', founded: 2006, hq: 'Long Beach, CA', employees: '2,000+',
    pe: 'N/A (pre-profit)', revenue: '$364M (TTM)', website: 'rocketlabusa.com',
  },
  {
    ticker: 'PLTR', name: 'Palantir Technologies', price: 87.43, change: 15.2, cap: '$198B',
    sector: 'AI Software', catalyst: 'US Army extends $480M AI platform contract',
    tags: ['AI', 'Gov'],
    description: 'Palantir builds software platforms for data integration and analysis. Their Gotham platform serves government intelligence, while Foundry serves commercial enterprises with AI-driven analytics.',
    ceo: 'Alex Karp', founded: 2003, hq: 'Denver, CO', employees: '3,800+',
    pe: '180x', revenue: '$2.5B (TTM)', website: 'palantir.com',
  },
  {
    ticker: 'RIVN', name: 'Rivian Automotive', price: 18.65, change: 12.8, cap: '$19.7B',
    sector: 'EV', catalyst: 'New R2 SUV pre-orders exceed 100K in first week',
    tags: ['EV', 'Auto'],
    description: 'Rivian designs and manufactures electric adventure vehicles. Their R1T pickup and R1S SUV compete in the premium EV market, and they build delivery vans for Amazon.',
    ceo: 'RJ Scaringe', founded: 2009, hq: 'Irvine, CA', employees: '16,000+',
    pe: 'N/A (pre-profit)', revenue: '$4.4B (TTM)', website: 'rivian.com',
  },
  {
    ticker: 'SNOW', name: 'Snowflake Inc.', price: 172.40, change: 11.5, cap: '$56.8B',
    sector: 'Cloud Data', catalyst: 'AI data marketplace partnership with OpenAI',
    tags: ['AI', 'Cloud'],
    description: 'Snowflake provides a cloud-based data platform that enables organizations to store, process, and analyze data. Their Data Cloud allows seamless data sharing across organizations.',
    ceo: 'Sridhar Ramaswamy', founded: 2012, hq: 'Bozeman, MT', employees: '5,900+',
    pe: '350x', revenue: '$3.2B (TTM)', website: 'snowflake.com',
  },
  {
    ticker: 'CRWD', name: 'CrowdStrike', price: 342.10, change: 9.8, cap: '$82.1B',
    sector: 'Cybersecurity', catalyst: 'Won $200M federal cybersecurity contract',
    tags: ['Security', 'Gov'],
    description: 'CrowdStrike is a cybersecurity company providing cloud-native endpoint protection. Their Falcon platform uses AI to detect and prevent cyber threats in real-time.',
    ceo: 'George Kurtz', founded: 2011, hq: 'Austin, TX', employees: '8,400+',
    pe: '72x', revenue: '$3.8B (TTM)', website: 'crowdstrike.com',
  },
  {
    ticker: 'MARA', name: 'Marathon Digital', price: 24.87, change: 8.4, cap: '$7.8B',
    sector: 'Bitcoin Mining', catalyst: 'Bitcoin breaks $95K, mining revenue surges',
    tags: ['Crypto', 'Mining'],
    description: 'Marathon Digital Holdings is one of the largest Bitcoin mining operations in North America. They operate mining facilities using renewable energy sources.',
    ceo: 'Fred Thiel', founded: 2010, hq: 'Fort Lauderdale, FL', employees: '100+',
    pe: '28x', revenue: '$660M (TTM)', website: 'mara.com',
  },
  {
    ticker: 'DKNG', name: 'DraftKings', price: 48.92, change: 7.6, cap: '$23.1B',
    sector: 'Sports Betting', catalyst: 'March Madness drives record user engagement',
    tags: ['Gaming', 'Sports'],
    description: 'DraftKings is a digital sports entertainment and gaming company. They offer online sports betting, daily fantasy sports, and iGaming across multiple US states.',
    ceo: 'Jason Robins', founded: 2012, hq: 'Boston, MA', employees: '5,500+',
    pe: '95x', revenue: '$4.3B (TTM)', website: 'draftkings.com',
  },
];

export function getStockByTicker(ticker: string): Stock | undefined {
  return stocks.find(s => s.ticker.toLowerCase() === ticker.toLowerCase());
}
