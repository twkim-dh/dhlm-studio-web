// Hardcoded trending data — update manually 2x/week
// YouTube and Movies are fetched via API with these as fallback

export interface TrendingItem {
  rank: number;
  change: 'up' | 'down' | 'same' | 'new';
  title: string;
  subtitle?: string;
  metric?: string;
  metricLabel?: string;
  image?: string;
}

export interface TrendingCategory {
  global: TrendingItem[];
  kr: TrendingItem[];
  us: TrendingItem[];
  jp: TrendingItem[];
  vn: TrendingItem[];
  uk: TrendingItem[];
}

export interface TrendingData {
  updatedAt: string;
  music: TrendingCategory;
  youtube: TrendingCategory;
  movies: TrendingCategory;
  games: TrendingCategory;
  apps: TrendingCategory;
  search: TrendingCategory;
}

export const trendingData: TrendingData = {
  updatedAt: '2026-03-26',

  music: {
    global: [
      { rank: 1, change: 'up', title: 'Ariana Grande', subtitle: 'Eternal Sunshine', metric: '12.4M', metricLabel: 'streams' },
      { rank: 2, change: 'up', title: 'The Weeknd', subtitle: 'Timeless', metric: '11.2M', metricLabel: 'streams' },
      { rank: 3, change: 'same', title: 'Drake', subtitle: 'Search & Rescue', metric: '9.8M', metricLabel: 'streams' },
      { rank: 4, change: 'up', title: 'Taylor Swift', subtitle: 'Fortnight', metric: '9.1M', metricLabel: 'streams' },
      { rank: 5, change: 'down', title: 'Dua Lipa', subtitle: 'Training Season', metric: '8.7M', metricLabel: 'streams' },
    ],
    kr: [
      { rank: 1, change: 'up', title: 'aespa', subtitle: 'Whiplash', metric: '8.2M', metricLabel: 'streams' },
      { rank: 2, change: 'same', title: 'IVE', subtitle: 'HEYA', metric: '7.1M', metricLabel: 'streams' },
      { rank: 3, change: 'up', title: 'BTS (Jimin)', subtitle: 'Who', metric: '6.8M', metricLabel: 'streams' },
      { rank: 4, change: 'new', title: 'ILLIT', subtitle: 'Magnetic', metric: '5.9M', metricLabel: 'streams' },
      { rank: 5, change: 'down', title: 'NewJeans', subtitle: 'Supernatural', metric: '5.4M', metricLabel: 'streams' },
    ],
    us: [
      { rank: 1, change: 'up', title: 'Ariana Grande', subtitle: 'Eternal Sunshine', metric: '14.1M', metricLabel: 'streams' },
      { rank: 2, change: 'same', title: 'Post Malone', subtitle: 'I Had Some Help', metric: '11.8M', metricLabel: 'streams' },
      { rank: 3, change: 'up', title: 'Sabrina Carpenter', subtitle: 'Espresso', metric: '10.2M', metricLabel: 'streams' },
      { rank: 4, change: 'down', title: 'Morgan Wallen', subtitle: 'Last Night', metric: '9.5M', metricLabel: 'streams' },
      { rank: 5, change: 'new', title: 'Kendrick Lamar', subtitle: 'Not Like Us', metric: '8.9M', metricLabel: 'streams' },
    ],
    jp: [
      { rank: 1, change: 'up', title: 'YOASOBI', subtitle: 'Idol', metric: '7.5M', metricLabel: 'streams' },
      { rank: 2, change: 'same', title: 'Ado', subtitle: 'Show', metric: '6.2M', metricLabel: 'streams' },
      { rank: 3, change: 'up', title: 'Fujii Kaze', subtitle: 'Workin Hard', metric: '5.8M', metricLabel: 'streams' },
      { rank: 4, change: 'new', title: 'Mrs. GREEN APPLE', subtitle: 'Lilac', metric: '5.1M', metricLabel: 'streams' },
      { rank: 5, change: 'down', title: 'Kenshi Yonezu', subtitle: 'KICK BACK', metric: '4.7M', metricLabel: 'streams' },
    ],
    vn: [
      { rank: 1, change: 'up', title: 'Son Tung M-TP', subtitle: 'Making My Way', metric: '5.1M', metricLabel: 'streams' },
      { rank: 2, change: 'same', title: 'HIEUTHUHAI', subtitle: 'Exit Sign', metric: '4.3M', metricLabel: 'streams' },
      { rank: 3, change: 'new', title: 'Hoang Thuy Linh', subtitle: 'See Tinh', metric: '3.8M', metricLabel: 'streams' },
      { rank: 4, change: 'up', title: 'Duc Phuc', subtitle: 'Hen Ay', metric: '3.2M', metricLabel: 'streams' },
      { rank: 5, change: 'down', title: 'Jack', subtitle: 'Laylalay', metric: '2.9M', metricLabel: 'streams' },
    ],
    uk: [
      { rank: 1, change: 'up', title: 'Ariana Grande', subtitle: 'Eternal Sunshine', metric: '8.9M', metricLabel: 'streams' },
      { rank: 2, change: 'same', title: 'Dua Lipa', subtitle: 'Training Season', metric: '7.4M', metricLabel: 'streams' },
      { rank: 3, change: 'up', title: 'Ed Sheeran', subtitle: 'Eyes Closed', metric: '6.8M', metricLabel: 'streams' },
      { rank: 4, change: 'new', title: 'Central Cee', subtitle: 'Band4Band', metric: '5.9M', metricLabel: 'streams' },
      { rank: 5, change: 'down', title: 'The Weeknd', subtitle: 'Timeless', metric: '5.3M', metricLabel: 'streams' },
    ],
  },

  youtube: {
    global: [
      { rank: 1, change: 'up', title: 'MrBeast', subtitle: 'I Survived 100 Days', metric: '48M', metricLabel: 'views' },
      { rank: 2, change: 'up', title: 'BLACKPINK', subtitle: 'Pink Venom MV', metric: '35M', metricLabel: 'views' },
      { rank: 3, change: 'same', title: 'Mark Rober', subtitle: 'Glitter Bomb 5.0', metric: '28M', metricLabel: 'views' },
      { rank: 4, change: 'new', title: 'IShowSpeed', subtitle: 'World Tour Highlights', metric: '22M', metricLabel: 'views' },
      { rank: 5, change: 'down', title: 'Dude Perfect', subtitle: 'World Records', metric: '19M', metricLabel: 'views' },
    ],
    kr: [
      { rank: 1, change: 'up', title: '침착맨', subtitle: '무도 리액션', metric: '5.2M', metricLabel: 'views' },
      { rank: 2, change: 'new', title: 'aespa', subtitle: 'Whiplash MV', metric: '4.8M', metricLabel: 'views' },
      { rank: 3, change: 'same', title: '피식대학', subtitle: '한사랑 산악회', metric: '3.9M', metricLabel: 'views' },
      { rank: 4, change: 'up', title: '쯔양', subtitle: '먹방 챌린지', metric: '3.4M', metricLabel: 'views' },
      { rank: 5, change: 'down', title: '나 혼자 산다', subtitle: '이번 주 하이라이트', metric: '2.8M', metricLabel: 'views' },
    ],
    us: [
      { rank: 1, change: 'up', title: 'MrBeast', subtitle: 'I Survived 100 Days', metric: '48M', metricLabel: 'views' },
      { rank: 2, change: 'same', title: 'Mark Rober', subtitle: 'Glitter Bomb 5.0', metric: '28M', metricLabel: 'views' },
      { rank: 3, change: 'up', title: 'Logan Paul', subtitle: 'PRIME Extreme', metric: '18M', metricLabel: 'views' },
      { rank: 4, change: 'new', title: 'Kai Cenat', subtitle: 'Mafiathon 3', metric: '15M', metricLabel: 'views' },
      { rank: 5, change: 'down', title: 'Jimmy Fallon', subtitle: 'Best Moments', metric: '12M', metricLabel: 'views' },
    ],
    jp: [
      { rank: 1, change: 'up', title: 'HikakinTV', subtitle: '新企画スタート', metric: '8.1M', metricLabel: 'views' },
      { rank: 2, change: 'same', title: 'Junya', subtitle: 'Comedy Compilation', metric: '6.5M', metricLabel: 'views' },
      { rank: 3, change: 'new', title: 'ONE PIECE', subtitle: 'EP 1100 Preview', metric: '5.2M', metricLabel: 'views' },
      { rank: 4, change: 'up', title: 'Fischer\'s', subtitle: 'アスレチック', metric: '4.1M', metricLabel: 'views' },
      { rank: 5, change: 'down', title: 'YOASOBI', subtitle: 'Idol Live', metric: '3.8M', metricLabel: 'views' },
    ],
    vn: [
      { rank: 1, change: 'up', title: 'Son Tung M-TP', subtitle: 'Making My Way MV', metric: '12M', metricLabel: 'views' },
      { rank: 2, change: 'same', title: 'Tran Thanh', subtitle: 'Show moi nhat', metric: '8.5M', metricLabel: 'views' },
      { rank: 3, change: 'new', title: 'HIEUTHUHAI', subtitle: 'Exit Sign MV', metric: '6.2M', metricLabel: 'views' },
      { rank: 4, change: 'up', title: 'VTV', subtitle: 'Thoi Su 19h', metric: '4.8M', metricLabel: 'views' },
      { rank: 5, change: 'down', title: 'Toc Tien', subtitle: 'Live Concert', metric: '3.5M', metricLabel: 'views' },
    ],
    uk: [
      { rank: 1, change: 'up', title: 'KSI', subtitle: 'Boxing Return', metric: '15M', metricLabel: 'views' },
      { rank: 2, change: 'same', title: 'BBC', subtitle: 'Top Gear Special', metric: '9.2M', metricLabel: 'views' },
      { rank: 3, change: 'new', title: 'Ed Sheeran', subtitle: 'Live at Wembley', metric: '7.8M', metricLabel: 'views' },
      { rank: 4, change: 'up', title: 'Sidemen', subtitle: 'Charity Match', metric: '6.1M', metricLabel: 'views' },
      { rank: 5, change: 'down', title: 'Gordon Ramsay', subtitle: 'Kitchen Nightmares', metric: '5.4M', metricLabel: 'views' },
    ],
  },

  movies: {
    global: [
      { rank: 1, change: 'up', title: 'Squid Game Season 3', subtitle: 'Netflix', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'up', title: 'Moana 2', subtitle: 'Disney+', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'same', title: 'Severance S2', subtitle: 'Apple TV+', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'new', title: 'Dune: Part Three', subtitle: 'Theaters', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: 'The Last of Us S2', subtitle: 'HBO Max', metric: '#5', metricLabel: 'trending' },
    ],
    kr: [
      { rank: 1, change: 'up', title: '오징어 게임 시즌3', subtitle: 'Netflix', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'new', title: '범죄도시 5', subtitle: '극장', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'same', title: '눈물의 여왕 스페셜', subtitle: 'tvN', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'up', title: '선재 업고 튀어', subtitle: 'tvN', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: '사랑의 이해 S2', subtitle: 'JTBC', metric: '#5', metricLabel: 'trending' },
    ],
    us: [
      { rank: 1, change: 'up', title: 'Dune: Part Three', subtitle: 'Theaters', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'same', title: 'Severance S2', subtitle: 'Apple TV+', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'up', title: 'Squid Game Season 3', subtitle: 'Netflix', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'new', title: 'Superman', subtitle: 'Theaters', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: 'White Lotus S3', subtitle: 'HBO Max', metric: '#5', metricLabel: 'trending' },
    ],
    jp: [
      { rank: 1, change: 'up', title: 'ONE PIECE Film', subtitle: 'Theaters', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'same', title: 'Demon Slayer S5', subtitle: 'Crunchyroll', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'new', title: 'Squid Game S3', subtitle: 'Netflix', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'up', title: 'Jujutsu Kaisen Movie', subtitle: 'Theaters', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: 'Spy x Family S3', subtitle: 'Crunchyroll', metric: '#5', metricLabel: 'trending' },
    ],
    vn: [
      { rank: 1, change: 'up', title: 'Mai', subtitle: 'Theaters', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'same', title: 'Squid Game S3', subtitle: 'Netflix', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'new', title: 'Lat Mat 7', subtitle: 'Theaters', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'up', title: 'Running Man Vietnam', subtitle: 'HTV7', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: 'Moana 2', subtitle: 'Disney+', metric: '#5', metricLabel: 'trending' },
    ],
    uk: [
      { rank: 1, change: 'up', title: 'Severance S2', subtitle: 'Apple TV+', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'same', title: 'Dune: Part Three', subtitle: 'Theaters', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'up', title: 'Squid Game S3', subtitle: 'Netflix', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'new', title: 'Bridgerton S4', subtitle: 'Netflix', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: 'Doctor Who', subtitle: 'BBC', metric: '#5', metricLabel: 'trending' },
    ],
  },

  games: {
    global: [
      { rank: 1, change: 'up', title: 'GTA VI', subtitle: 'Rockstar Games', metric: '98%', metricLabel: 'hype' },
      { rank: 2, change: 'same', title: 'Fortnite', subtitle: 'Epic Games', metric: '350M', metricLabel: 'players' },
      { rank: 3, change: 'up', title: 'League of Legends', subtitle: 'Riot Games', metric: '180M', metricLabel: 'players' },
      { rank: 4, change: 'new', title: 'Elden Ring DLC', subtitle: 'FromSoftware', metric: '25M', metricLabel: 'sales' },
      { rank: 5, change: 'down', title: 'Minecraft', subtitle: 'Mojang', metric: '300M', metricLabel: 'players' },
    ],
    kr: [
      { rank: 1, change: 'same', title: 'League of Legends', subtitle: 'Riot Games', metric: '#1', metricLabel: 'PC방' },
      { rank: 2, change: 'up', title: 'PUBG', subtitle: 'Krafton', metric: '#2', metricLabel: 'PC방' },
      { rank: 3, change: 'up', title: 'FIFA Online 4', subtitle: 'EA/Nexon', metric: '#3', metricLabel: 'PC방' },
      { rank: 4, change: 'new', title: 'Valorant', subtitle: 'Riot Games', metric: '#4', metricLabel: 'PC방' },
      { rank: 5, change: 'down', title: 'MapleStory', subtitle: 'Nexon', metric: '#5', metricLabel: 'PC방' },
    ],
    us: [
      { rank: 1, change: 'up', title: 'Fortnite', subtitle: 'Epic Games', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'same', title: 'Call of Duty', subtitle: 'Activision', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'new', title: 'GTA VI Pre-order', subtitle: 'Rockstar', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'up', title: 'Roblox', subtitle: 'Roblox Corp', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: 'Minecraft', subtitle: 'Mojang', metric: '#5', metricLabel: 'trending' },
    ],
    jp: [
      { rank: 1, change: 'up', title: 'Final Fantasy VII Rebirth', subtitle: 'Square Enix', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'same', title: 'Pokemon', subtitle: 'Game Freak', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'new', title: 'Monster Hunter Wilds', subtitle: 'Capcom', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'up', title: 'Genshin Impact', subtitle: 'miHoYo', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: 'Splatoon 3', subtitle: 'Nintendo', metric: '#5', metricLabel: 'trending' },
    ],
    vn: [
      { rank: 1, change: 'same', title: 'Lien Quan Mobile', subtitle: 'Garena', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'up', title: 'PUBG Mobile', subtitle: 'VNG', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'new', title: 'Genshin Impact', subtitle: 'miHoYo', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'up', title: 'Free Fire', subtitle: 'Garena', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: 'League of Legends', subtitle: 'VNG', metric: '#5', metricLabel: 'trending' },
    ],
    uk: [
      { rank: 1, change: 'up', title: 'EA FC 25', subtitle: 'EA Sports', metric: '#1', metricLabel: 'trending' },
      { rank: 2, change: 'same', title: 'Fortnite', subtitle: 'Epic Games', metric: '#2', metricLabel: 'trending' },
      { rank: 3, change: 'new', title: 'GTA VI Pre-order', subtitle: 'Rockstar', metric: '#3', metricLabel: 'trending' },
      { rank: 4, change: 'up', title: 'Call of Duty', subtitle: 'Activision', metric: '#4', metricLabel: 'trending' },
      { rank: 5, change: 'down', title: 'Hogwarts Legacy', subtitle: 'WB Games', metric: '#5', metricLabel: 'trending' },
    ],
  },

  apps: {
    global: [
      { rank: 1, change: 'up', title: 'ChatGPT', subtitle: 'OpenAI', metric: '#1', metricLabel: 'free' },
      { rank: 2, change: 'same', title: 'TikTok', subtitle: 'ByteDance', metric: '#2', metricLabel: 'free' },
      { rank: 3, change: 'up', title: 'Temu', subtitle: 'PDD Holdings', metric: '#3', metricLabel: 'free' },
      { rank: 4, change: 'new', title: 'Threads', subtitle: 'Meta', metric: '#4', metricLabel: 'free' },
      { rank: 5, change: 'down', title: 'Instagram', subtitle: 'Meta', metric: '#5', metricLabel: 'free' },
    ],
    kr: [
      { rank: 1, change: 'same', title: '카카오톡', subtitle: 'Kakao', metric: '#1', metricLabel: 'free' },
      { rank: 2, change: 'up', title: '쿠팡', subtitle: 'Coupang', metric: '#2', metricLabel: 'free' },
      { rank: 3, change: 'up', title: 'ChatGPT', subtitle: 'OpenAI', metric: '#3', metricLabel: 'free' },
      { rank: 4, change: 'new', title: '당근', subtitle: 'Danggeun Market', metric: '#4', metricLabel: 'free' },
      { rank: 5, change: 'down', title: '네이버', subtitle: 'Naver', metric: '#5', metricLabel: 'free' },
    ],
    us: [
      { rank: 1, change: 'up', title: 'ChatGPT', subtitle: 'OpenAI', metric: '#1', metricLabel: 'free' },
      { rank: 2, change: 'same', title: 'TikTok', subtitle: 'ByteDance', metric: '#2', metricLabel: 'free' },
      { rank: 3, change: 'up', title: 'Temu', subtitle: 'PDD Holdings', metric: '#3', metricLabel: 'free' },
      { rank: 4, change: 'new', title: 'Threads', subtitle: 'Meta', metric: '#4', metricLabel: 'free' },
      { rank: 5, change: 'down', title: 'Instagram', subtitle: 'Meta', metric: '#5', metricLabel: 'free' },
    ],
    jp: [
      { rank: 1, change: 'same', title: 'LINE', subtitle: 'LY Corp', metric: '#1', metricLabel: 'free' },
      { rank: 2, change: 'up', title: 'PayPay', subtitle: 'SoftBank', metric: '#2', metricLabel: 'free' },
      { rank: 3, change: 'up', title: 'ChatGPT', subtitle: 'OpenAI', metric: '#3', metricLabel: 'free' },
      { rank: 4, change: 'new', title: 'TikTok', subtitle: 'ByteDance', metric: '#4', metricLabel: 'free' },
      { rank: 5, change: 'down', title: 'YouTube', subtitle: 'Google', metric: '#5', metricLabel: 'free' },
    ],
    vn: [
      { rank: 1, change: 'same', title: 'Zalo', subtitle: 'VNG', metric: '#1', metricLabel: 'free' },
      { rank: 2, change: 'up', title: 'TikTok', subtitle: 'ByteDance', metric: '#2', metricLabel: 'free' },
      { rank: 3, change: 'up', title: 'Shopee', subtitle: 'Sea Group', metric: '#3', metricLabel: 'free' },
      { rank: 4, change: 'new', title: 'MoMo', subtitle: 'M_Service', metric: '#4', metricLabel: 'free' },
      { rank: 5, change: 'down', title: 'Facebook', subtitle: 'Meta', metric: '#5', metricLabel: 'free' },
    ],
    uk: [
      { rank: 1, change: 'up', title: 'ChatGPT', subtitle: 'OpenAI', metric: '#1', metricLabel: 'free' },
      { rank: 2, change: 'same', title: 'TikTok', subtitle: 'ByteDance', metric: '#2', metricLabel: 'free' },
      { rank: 3, change: 'up', title: 'Revolut', subtitle: 'Revolut Ltd', metric: '#3', metricLabel: 'free' },
      { rank: 4, change: 'new', title: 'Temu', subtitle: 'PDD Holdings', metric: '#4', metricLabel: 'free' },
      { rank: 5, change: 'down', title: 'Instagram', subtitle: 'Meta', metric: '#5', metricLabel: 'free' },
    ],
  },

  search: {
    global: [
      { rank: 1, change: 'up', title: 'March Madness 2026', subtitle: 'Sports', metric: '5M+', metricLabel: 'searches' },
      { rank: 2, change: 'new', title: 'Cherry blossom forecast', subtitle: 'Seasonal', metric: '3.2M', metricLabel: 'searches' },
      { rank: 3, change: 'up', title: 'iPhone 18 leak', subtitle: 'Tech', metric: '2.8M', metricLabel: 'searches' },
      { rank: 4, change: 'same', title: 'AI news today', subtitle: 'Tech', metric: '2.1M', metricLabel: 'searches' },
      { rank: 5, change: 'down', title: 'Oscars 2026 winners', subtitle: 'Entertainment', metric: '1.9M', metricLabel: 'searches' },
    ],
    kr: [
      { rank: 1, change: 'up', title: '벚꽃 개화 시기 2026', subtitle: '계절', metric: '2.1M', metricLabel: 'searches' },
      { rank: 2, change: 'new', title: '오징어게임 시즌3', subtitle: '엔터', metric: '1.8M', metricLabel: 'searches' },
      { rank: 3, change: 'same', title: 'KBO 개막전', subtitle: '스포츠', metric: '1.5M', metricLabel: 'searches' },
      { rank: 4, change: 'up', title: '부동산 전망 2026', subtitle: '경제', metric: '1.2M', metricLabel: 'searches' },
      { rank: 5, change: 'down', title: '연봉 실수령액', subtitle: '금융', metric: '980K', metricLabel: 'searches' },
    ],
    us: [
      { rank: 1, change: 'up', title: 'March Madness bracket', subtitle: 'Sports', metric: '8.5M', metricLabel: 'searches' },
      { rank: 2, change: 'new', title: 'Spring break deals', subtitle: 'Travel', metric: '4.2M', metricLabel: 'searches' },
      { rank: 3, change: 'same', title: 'Tax filing 2026', subtitle: 'Finance', metric: '3.8M', metricLabel: 'searches' },
      { rank: 4, change: 'up', title: 'iPhone 18 release date', subtitle: 'Tech', metric: '2.9M', metricLabel: 'searches' },
      { rank: 5, change: 'down', title: 'Oscars 2026', subtitle: 'Entertainment', metric: '2.1M', metricLabel: 'searches' },
    ],
    jp: [
      { rank: 1, change: 'up', title: '桜 開花予想 2026', subtitle: '季節', metric: '3.1M', metricLabel: 'searches' },
      { rank: 2, change: 'new', title: 'ONE PIECE 最新話', subtitle: 'アニメ', metric: '2.4M', metricLabel: 'searches' },
      { rank: 3, change: 'same', title: 'プロ野球 開幕', subtitle: 'スポーツ', metric: '1.8M', metricLabel: 'searches' },
      { rank: 4, change: 'up', title: '新生活 準備', subtitle: '生活', metric: '1.5M', metricLabel: 'searches' },
      { rank: 5, change: 'down', title: 'iPhone 18', subtitle: 'テック', metric: '1.2M', metricLabel: 'searches' },
    ],
    vn: [
      { rank: 1, change: 'up', title: 'Lich nghi le 30/4', subtitle: 'Ngay le', metric: '1.8M', metricLabel: 'searches' },
      { rank: 2, change: 'new', title: 'Son Tung MV moi', subtitle: 'Am nhac', metric: '1.2M', metricLabel: 'searches' },
      { rank: 3, change: 'same', title: 'V-League 2026', subtitle: 'The thao', metric: '890K', metricLabel: 'searches' },
      { rank: 4, change: 'up', title: 'Tuyen sinh dai hoc', subtitle: 'Giao duc', metric: '750K', metricLabel: 'searches' },
      { rank: 5, change: 'down', title: 'Gia vang hom nay', subtitle: 'Tai chinh', metric: '680K', metricLabel: 'searches' },
    ],
    uk: [
      { rank: 1, change: 'up', title: 'Premier League results', subtitle: 'Sports', metric: '4.5M', metricLabel: 'searches' },
      { rank: 2, change: 'new', title: 'Spring budget 2026', subtitle: 'Politics', metric: '2.8M', metricLabel: 'searches' },
      { rank: 3, change: 'same', title: 'Cheltenham results', subtitle: 'Sports', metric: '2.1M', metricLabel: 'searches' },
      { rank: 4, change: 'up', title: 'Bank holiday dates', subtitle: 'Lifestyle', metric: '1.7M', metricLabel: 'searches' },
      { rank: 5, change: 'down', title: 'iPhone 18 UK price', subtitle: 'Tech', metric: '1.3M', metricLabel: 'searches' },
    ],
  },
};
