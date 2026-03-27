// Monthly updated Korean culture data
// Update this file monthly with fresh content

export interface Comeback { artist: string; title: string; date: string }
export interface Concert { artist: string; venue: string; dates: string }
export interface Drama { name: string; platform: string; genre: string }
export interface BeautyProduct { name: string; brand: string; category: string }
export interface PopupStore { brand: string; location: string; until: string }
export interface Slang { word: string; romanized: string; meaning: string }

export interface KoreaMonthly {
  updatedAt: string;
  kpop: {
    comebacks: Comeback[];
    concerts: Concert[];
  };
  drama: Drama[];
  beauty: {
    oliveyoungTop: BeautyProduct[];
    popups: PopupStore[];
  };
  trending: {
    slang: Slang[];
  };
}

export const koreaMonthly: KoreaMonthly = {
  updatedAt: '2026-04',

  kpop: {
    comebacks: [
      { artist: 'aespa', title: 'Whiplash (Repackage)', date: 'Apr 5' },
      { artist: 'ENHYPEN', title: 'Romance Untold', date: 'Apr 12' },
      { artist: 'IVE', title: 'Switch', date: 'Apr 19' },
      { artist: 'Stray Kids', title: 'ATE (Deluxe)', date: 'Apr 22' },
    ],
    concerts: [
      { artist: 'BTS (Jimin)', venue: 'Jamsil Stadium', dates: 'Apr 10-12' },
      { artist: 'BLACKPINK Rosé', venue: 'KSPO Dome', dates: 'Apr 18-20' },
      { artist: 'NewJeans', venue: 'Olympic Hall', dates: 'Apr 25-27' },
    ],
  },

  drama: [
    { name: 'Squid Game Season 3', platform: 'Netflix', genre: 'Thriller' },
    { name: 'When the Stars Gossip', platform: 'tvN', genre: 'Romance' },
    { name: 'Unmasked', platform: 'JTBC', genre: 'Mystery' },
    { name: 'The Trauma Code', platform: 'Netflix', genre: 'Medical' },
  ],

  beauty: {
    oliveyoungTop: [
      { name: 'Heartleaf 77% Toner', brand: 'Anua', category: 'Toner' },
      { name: 'Birch Juice Sunscreen', brand: 'Round Lab', category: 'Sunscreen' },
      { name: 'Age-R Booster Pro', brand: 'Medicube', category: 'Device' },
      { name: 'Rice Toner', brand: 'Im From', category: 'Toner' },
      { name: 'Soon Jung Emulsion', brand: 'Etude', category: 'Moisturizer' },
    ],
    popups: [
      { brand: 'Dior Beauty', location: 'Seongsu-dong', until: 'Apr 30' },
      { brand: 'Gentle Monster', location: 'Hannam-dong', until: 'May 15' },
      { brand: 'Aespa x Prada', location: 'Gangnam', until: 'Apr 20' },
    ],
  },

  trending: {
    slang: [
      { word: '갓생', romanized: 'gat-saeng', meaning: 'Living your best productive life (God + 인생)' },
      { word: '존맛탱', romanized: 'jon-mat-taeng', meaning: 'Insanely delicious (short for 존나 맛있다)' },
      { word: '오운완', romanized: 'o-un-wan', meaning: 'Finished today\'s workout (오늘 운동 완료)' },
      { word: '점메추', romanized: 'jeom-me-chu', meaning: 'Recommend me lunch (점심 메뉴 추천)' },
    ],
  },
};
