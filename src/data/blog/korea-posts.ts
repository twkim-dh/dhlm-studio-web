export interface KoreaPost {
  slug: string;
  title: string;
  category: string;
  emoji: string;
  readTime: string;
  description: string;
  image: string;
  intro: string;
  sections: { heading: string; body: string; image?: string; imageAlt?: string }[];
  funFact: string;
  koreanWord: { word: string; romanized: string; meaning: string };
  tags: string[];
}

// Category → Unsplash image mapping
const catImages: Record<string, string> = {
  Beliefs: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=75',
  Food: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75',
  'K-Culture': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75',
  Travel: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=75',
  Language: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&q=75',
  Work: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=75',
  Tech: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=75',
  Comparison: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75',
  Lifestyle: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75',
};

export const koreaPosts: KoreaPost[] = [
  // ═══ Beliefs & Superstitions ═══
  {
    slug: 'red-ink-death', title: 'Why Koreans Never Write Names in Red Ink', category: 'Beliefs', emoji: '🔮', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=75', readTime: '3 min',
    description: 'In Korea, writing someone\'s name in red ink is associated with death. Learn the history behind this superstition.',
    intro: 'Hand someone a red pen in Korea and ask them to write their name. Watch their reaction — most will politely refuse. Writing a living person\'s name in red ink is one of Korea\'s strongest taboos.',
    sections: [
      { heading: 'The Origin', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&q=75', imageAlt: 'Red ink calligraphy', body: 'In traditional Korea, the names of deceased people were written in red ink on family registers and funeral banners. Red ink on a name essentially marked that person as dead. This practice dates back centuries to Confucian record-keeping traditions.' },
      { heading: 'Modern Korea', body: 'Even today, most Koreans avoid red ink for names. Teachers never grade papers with red-inked names. Business cards in red would be shocking. The superstition is so deeply embedded that even young Koreans who don\'t believe in it still feel uncomfortable.' },
    ],
    funFact: 'Korean prison documents historically used red ink for death row inmates\' names.',
    koreanWord: { word: '빨간색', romanized: 'ppalgansaek', meaning: 'red color' },
    tags: ['superstition', 'red ink', 'Korean culture', 'death taboo'],
  },
  {
    slug: 'fan-death', title: 'Fan Death: Korea\'s Most Famous Urban Legend', category: 'Beliefs', emoji: '🔮', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=75', readTime: '4 min',
    description: 'Many Koreans believe sleeping with an electric fan on in a closed room can kill you. Here\'s why.',
    intro: 'Ask any Korean about sleeping with a fan on in a closed room. Many will genuinely warn you it could be fatal. Welcome to "fan death" — Korea\'s most uniquely Korean urban legend.',
    sections: [
      { heading: 'The Belief', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=700&q=75', imageAlt: 'Electric fan in Korean room', body: 'Fan death (선풍기 사망) is the belief that an electric fan running overnight in a sealed room can cause death by hypothermia or suffocation. Korean media has reported fan death cases for decades, and many electric fans sold in Korea come with auto-off timers specifically for this reason.' },
      { heading: 'Why It Persists', body: 'Scientists have debunked fan death repeatedly, but the belief persists. Some theories suggest the government promoted the myth during energy crises to reduce electricity usage. Others point to confirmation bias — when someone dies in a room with a fan, the fan gets blamed.' },
    ],
    funFact: 'Korean electric fans are often sold with built-in timers that automatically shut off after a set period.',
    koreanWord: { word: '선풍기', romanized: 'seonpunggi', meaning: 'electric fan' },
    tags: ['urban legend', 'fan death', 'Korean belief', 'superstition'],
  },
  {
    slug: 'number-four', title: 'Why Korean Buildings Skip the 4th Floor', category: 'Beliefs', emoji: '🔮', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=75', readTime: '3 min',
    description: 'The number 4 sounds like "death" in Korean. Many buildings skip the 4th floor entirely.',
    intro: 'Step into a Korean elevator and look at the buttons. You might notice something odd: there\'s no 4th floor. Instead, you\'ll see "F" — or the floor simply doesn\'t exist.',
    sections: [
      { heading: 'Why Four is Feared', image: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=700&q=75', imageAlt: 'Korean elevator buttons', body: 'The Korean word for four (사, sa) sounds identical to the word for death (死, sa). This tetraphobia (fear of four) is shared across East Asia but is particularly strong in Korea. Many buildings, hospitals, and apartments skip the 4th floor entirely, labeling it "F" (for four) instead.' },
      { heading: 'How Deep It Goes', body: 'The avoidance extends beyond buildings. Many Koreans avoid giving gifts in sets of four. Phone numbers with multiple 4s are considered unlucky. Hospital rooms ending in 4 are often avoided. Some apartment complexes skip all floors with 4 — no 4th, 14th, 24th, or 34th floors.' },
    ],
    funFact: 'Some Korean hospitals skip room numbers containing 4 entirely, jumping from 403 to 405.',
    koreanWord: { word: '사', romanized: 'sa', meaning: 'four / death' },
    tags: ['number 4', 'tetraphobia', 'elevator', 'death'],
  },
  {
    slug: 'dream-pigs', title: 'Dreaming of Pigs Means You\'ll Get Rich', category: 'Beliefs', emoji: '🔮', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=75', readTime: '3 min',
    description: 'In Korean culture, dreaming about pigs is considered extremely lucky — it means wealth is coming.',
    intro: 'If a Korean tells you they dreamed about pigs last night, don\'t be surprised when they rush to buy a lottery ticket. In Korea, pig dreams = incoming wealth.',
    sections: [
      { heading: 'Pig = Wealth', body: 'Pigs have symbolized wealth and prosperity in Korean culture for centuries. The Korean word for pig (돼지, dwaeji) is associated with abundance. Pig-shaped piggy banks aren\'t just cute — they\'re culturally significant. Dreaming of pigs, especially golden pigs, is considered one of the luckiest dreams.' },
      { heading: 'Other Lucky Dreams', body: 'Koreans take dream interpretation seriously. Dragons mean great fortune, ancestors appearing means guidance, and clear water means good luck. Many people buy lottery tickets immediately after having these "lucky dreams." There are even shops near lottery retailers that sell dream interpretation guides.' },
    ],
    funFact: 'In 2007, the Year of the Golden Pig, Korean birth rates spiked as parents wanted "lucky" babies.',
    koreanWord: { word: '돼지꿈', romanized: 'dwaeji-kkum', meaning: 'pig dream (lucky dream)' },
    tags: ['pig dream', 'luck', 'lottery', 'wealth'],
  },
  {
    slug: 'shoe-gift', title: 'Never Gift Shoes to Your Korean Lover', category: 'Beliefs', emoji: '🔮', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=75', readTime: '3 min',
    description: 'Giving shoes as a gift to your partner means they\'ll walk away from you. A deeply held Korean superstition.',
    intro: 'Planning to buy your Korean boyfriend or girlfriend a nice pair of sneakers? Think twice. In Korea, gifting shoes to a romantic partner is believed to make them "run away" from the relationship.',
    sections: [
      { heading: 'The Superstition', body: 'The logic is straightforward: shoes help people walk away. Gifting shoes to your partner symbolically gives them the means to leave you. This belief is so widespread that many Korean couples genuinely avoid shoe gifts, or the recipient pays a symbolic amount (even just 100 won) to "buy" them instead.' },
      { heading: 'The Workaround', body: 'If you really want to give shoes, the recipient gives you a small amount of money in return. This technically makes it a "purchase" rather than a "gift," breaking the curse. This practice is common and considered perfectly normal in Korea.' },
    ],
    funFact: 'Korean couples also avoid gifting knives (symbolizes cutting the relationship) and handkerchiefs (symbolizes tears/farewell).',
    koreanWord: { word: '신발', romanized: 'sinbal', meaning: 'shoes' },
    tags: ['gift taboo', 'shoes', 'relationship', 'superstition'],
  },
  // ═══ Food & Drink ═══
  {
    slug: 'korean-bbq-guide', title: 'Korean BBQ: The Complete Guide for Beginners', category: 'Food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75', readTime: '5 min',
    description: 'Everything you need to know about Korean BBQ — from ordering to grilling to the unwritten rules.',
    intro: 'Korean BBQ is more than a meal — it\'s a social ritual. Grilling meat at your table, wrapping it in lettuce with garlic and ssamjang, and sharing soju with friends. Here\'s how to do it right.',
    sections: [
      { heading: 'How to Order', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=700&q=75', imageAlt: 'Korean BBQ grilling meat', body: 'Most Korean BBQ restaurants require a minimum of 2 servings per meat type. Popular cuts include samgyeopsal (pork belly), galbi (marinated short ribs), and chadol (beef brisket). Don\'t worry about grilling — the staff usually handles the first round.' },
      { heading: 'The Art of the Wrap', image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=700&q=75', imageAlt: 'Korean BBQ lettuce wrap', body: 'Take a piece of lettuce (ssam), add a slice of grilled meat, a thin slice of raw garlic, a dab of ssamjang (spicy paste), and optionally some rice. Fold it into a neat pocket and eat in one bite. Never take two bites — it\'s considered bad form.' },
      { heading: 'Unwritten Rules', image: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=700&q=75', imageAlt: 'Soju pouring at dinner', body: 'The youngest person pours drinks for elders. Turn your head away when drinking with someone older. Don\'t start eating until the eldest person begins. And most importantly — don\'t flip the meat too often. Once on each side is ideal.' },
    ],
    funFact: 'Koreans consume about 27kg of pork per person annually, making Korea one of the world\'s top pork consumers.',
    koreanWord: { word: '삼겹살', romanized: 'samgyeopsal', meaning: 'three-layer pork belly' },
    tags: ['BBQ', 'Korean food', 'samgyeopsal', 'dining guide'],
  },
  {
    slug: 'soju-drinking-rules', title: 'Soju Drinking Rules: 7 Things You Must Know', category: 'Food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75', readTime: '4 min',
    description: 'Korean drinking culture has strict unwritten rules. Break them and you\'ll get looks. Here\'s the survival guide.',
    intro: 'Soju is Korea\'s national drink — a clear spirit that fuels every Korean social gathering. But drinking soju comes with a set of unwritten rules that every foreigner should know.',
    sections: [
      { heading: 'The 7 Rules', image: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=700&q=75', imageAlt: 'Soju bottles and glasses', body: '1. Never pour your own drink — wait for someone else to pour for you.\n2. When someone older pours for you, hold your glass with both hands.\n3. Turn away from elders when you drink.\n4. The youngest person at the table pours for everyone else.\n5. Never let someone\'s glass stay empty.\n6. The first shot is done together — everyone cheers and drinks at once.\n7. Don\'t refuse the first drink offered by a senior.' },
      { heading: 'Why It Matters', body: 'Korean drinking culture is deeply tied to hierarchy and respect. These rules aren\'t just etiquette — they demonstrate awareness of social relationships. Following them shows respect, and Koreans will genuinely appreciate a foreigner who knows the customs.' },
    ],
    funFact: 'Jinro Soju is the world\'s best-selling spirit brand, outselling even vodka globally.',
    koreanWord: { word: '건배', romanized: 'geonbae', meaning: 'cheers (empty glass)' },
    tags: ['soju', 'drinking culture', 'etiquette', 'Korean rules'],
  },
  {
    slug: 'street-food-top10', title: 'Top 10 Korean Street Foods You Must Try', category: 'Food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75', readTime: '4 min',
    description: 'From tteokbokki to hotteok, the definitive guide to Korean street food.',
    intro: 'Korean street food is legendary. Every market, subway exit, and university area has vendors selling snacks that are cheap, delicious, and uniquely Korean.',
    sections: [
      { heading: 'The Essential 10', image: 'https://images.unsplash.com/photo-1632209710624-a25cc47e4e3a?w=700&q=75', imageAlt: 'Korean street food tteokbokki', body: '1. Tteokbokki (떡볶이) — Spicy rice cakes in gochujang sauce. The #1 street food.\n2. Hotteok (호떡) — Sweet pancakes filled with brown sugar and nuts.\n3. Eomuk (어묵) — Fish cake skewers in warm broth. Perfect in winter.\n4. Sundae (순대) — Korean blood sausage with glass noodles. Better than it sounds.\n5. Tornado Potato — Spiral-cut potato on a stick. Crispy and fun.\n6. Bungeoppang (붕어빵) — Fish-shaped pastry with red bean filling.\n7. Gyeranppang (계란빵) — Egg bread. A whole egg baked into sweet bread.\n8. Ttankkongppang (땅콩빵) — Peanut bread. Cute peanut shape.\n9. Dakkochi (닭꼬치) — Sweet-spicy chicken skewers.\n10. Gimbap (김밥) — Korean rice rolls. The perfect grab-and-go food.' },
      { heading: 'Where to Find Them', image: 'https://images.unsplash.com/photo-1583224994076-1a72e3a0ed83?w=700&q=75', imageAlt: 'Korean food market stalls', body: 'The best street food areas in Seoul: Gwangjang Market (the OG), Myeongdong (tourist-friendly), Hongdae (university vibes), and Dongdaemun (late-night). Each market has its own specialty — Gwangjang is famous for bindaetteok (mung bean pancakes), while Myeongdong excels at egg bread.' },
    ],
    funFact: 'Tteokbokki was originally a royal court dish made with soy sauce, not gochujang. The spicy version we know today was invented in the 1950s.',
    koreanWord: { word: '떡볶이', romanized: 'tteokbokki', meaning: 'spicy stir-fried rice cakes' },
    tags: ['street food', 'tteokbokki', 'market', 'snacks'],
  },
  {
    slug: 'korean-fried-chicken', title: 'Why Korean Fried Chicken Conquered the World', category: 'Food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75', readTime: '4 min',
    description: 'Korean fried chicken is different. Double-fried for extra crunch, glazed with addictive sauces. Here\'s the story.',
    intro: 'There\'s a reason Korean fried chicken has gone global. The secret? It\'s fried twice — resulting in an impossibly crispy exterior that stays crunchy even after being drenched in sauce.',
    sections: [
      { heading: 'The Double-Fry Secret', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=700&q=75', imageAlt: 'Korean fried chicken', body: 'Korean fried chicken is fried at a lower temperature first, then fried again at a higher temperature. This double-frying technique renders out more fat and creates a thin, glass-like crust that stays crispy for hours. Japanese karaage is fried once; American fried chicken uses thick batter. Korean chicken is thin-crusted and crackling.' },
      { heading: 'The Culture of Chimaek', image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=700&q=75', imageAlt: 'Chicken and beer delivery', body: 'Chimaek (치맥) = chicken + maekju (beer). It\'s not just food — it\'s a Korean institution. Koreans order fried chicken delivery to parks, rivers, and even movie theaters. Eating fried chicken while watching Korean baseball or soccer is a national pastime. The delivery culture means fresh fried chicken arrives at your door in 30 minutes.' },
    ],
    funFact: 'Korea has more fried chicken restaurants than McDonald\'s locations worldwide.',
    koreanWord: { word: '치맥', romanized: 'chimaek', meaning: 'chicken + beer (the ultimate combo)' },
    tags: ['fried chicken', 'chimaek', 'Korean food', 'delivery'],
  },
  {
    slug: 'korean-convenience-store', title: 'Korean Convenience Store Food: Better Than Restaurants?', category: 'Food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75', readTime: '4 min',
    description: 'CU, GS25, 7-Eleven — Korean convenience stores serve restaurant-quality food at $3. Here\'s what to eat.',
    intro: 'Korean convenience stores aren\'t like anywhere else in the world. They\'re mini restaurants with seating areas, microwaves, and food that\'s genuinely delicious.',
    sections: [
      { heading: 'Must-Try Items', body: 'Triangle kimbap (삼각김밥) — $1 rice triangles in various flavors. Cup ramyeon — cook it right at the store\'s hot water station. Lunch boxes (도시락) — full meals under $4. Banana milk (바나나우유) — Korea\'s iconic yellow drink. Corn dogs — cheese-filled, covered in batter bits.' },
      { heading: 'The CU vs GS25 Debate', body: 'CU and GS25 are the two biggest chains and Koreans have strong opinions about which is better. CU is known for trendy collaborations (like BTS-themed products). GS25 is known for better lunch boxes. Both are open 24/7 and both are excellent.' },
    ],
    funFact: 'Korea has about 50,000 convenience stores — one for every 1,000 people.',
    koreanWord: { word: '편의점', romanized: 'pyeonuijeom', meaning: 'convenience store' },
    tags: ['convenience store', 'CU', 'GS25', 'cheap food'],
  },
  // ═══ K-Culture & Entertainment ═══
  {
    slug: 'kpop-trainee-life', title: 'K-Pop Trainee Life: 7 Years of Practice', category: 'K-Culture', emoji: '🎵', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '5 min',
    description: 'What does it take to become a K-Pop idol? Years of training, strict diets, and an uncertain future.',
    intro: 'Behind every K-Pop group\'s perfect performance are years of grueling training. Most trainees start at 13-15 years old, practice 12+ hours daily, and many never debut.',
    sections: [
      { heading: 'The Training System', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=700&q=75', imageAlt: 'Korean entertainment district', body: 'K-Pop agencies (like HYBE, SM, JYP, YG) recruit trainees through auditions. Once selected, trainees move into dormitories and follow a strict schedule: vocal lessons, dance practice, language classes (Japanese, English, Chinese), and sometimes acting lessons. The average training period is 3-7 years. Some trainees train for over a decade.' },
      { heading: 'The Dark Side', body: 'Training isn\'t free — some companies charge trainees for training costs, which must be repaid from future earnings. Diet restrictions are extreme. Privacy is limited. And after years of training, many are eliminated before debut. The pressure creates immense stress, and the industry has faced criticism for its treatment of young trainees.' },
    ],
    funFact: 'BTS member Jungkook was scouted by 7 different agencies after his audition, but chose HYBE (then Big Hit) because of RM.',
    koreanWord: { word: '연습생', romanized: 'yeonseup-saeng', meaning: 'trainee (practice student)' },
    tags: ['K-Pop', 'trainee', 'idol', 'HYBE', 'SM'],
  },
  {
    slug: 'kdrama-tropes', title: '10 K-Drama Tropes That Always Happen', category: 'K-Culture', emoji: '🎵', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '4 min',
    description: 'Wrist grabs, piggyback rides, and accidental cohabitation — the K-Drama starter pack.',
    intro: 'If you\'ve watched more than three K-Dramas, you\'ve noticed the patterns. These tropes are so consistent they\'re practically genre requirements.',
    sections: [
      { heading: 'The Classic 10', body: '1. Wrist grab — The lead grabs the other\'s wrist to stop them from leaving.\n2. Piggyback ride — One character carries the drunk/sick other on their back.\n3. Accidental cohabitation — They\'re forced to live together by circumstance.\n4. Rich guy, poor girl — Korea\'s favorite class dynamic.\n5. Love triangle — Always a second lead you feel sorry for.\n6. Ramen = spending the night — "Want to come up for ramen?" is code.\n7. Amnesia — Someone always loses their memory at a critical moment.\n8. Slow-motion first meeting — Time literally slows down.\n9. Hospital scene — At least one character will be hospitalized.\n10. Airport chase — Running to stop someone from leaving the country.' },
      { heading: 'Why We Love Them', body: 'These tropes persist because they work. Korean audiences find comfort in familiar patterns, and international viewers find the cultural differences charming. The key is execution — a well-done wrist grab scene can still create genuine emotion.' },
    ],
    funFact: 'The "ramen invitation" trope is so well-known that a Korean court once cited it in a sexual harassment case.',
    koreanWord: { word: '라면 먹고 갈래?', romanized: 'ramyeon meokgo gallae?', meaning: 'Want to come in for ramen? (suggestive invitation)' },
    tags: ['K-Drama', 'tropes', 'cliches', 'Korean TV'],
  },
  {
    slug: 'hallyu-wave', title: 'Hallyu Wave: How Korean Culture Took Over the World', category: 'K-Culture', emoji: '🎵', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '5 min',
    description: 'From BTS to Squid Game to K-Beauty — how Korea became the world\'s cultural superpower.',
    intro: 'In 2000, almost nobody outside Asia knew Korean pop culture existed. By 2025, BTS sells out stadiums worldwide, Korean dramas dominate Netflix, and Korean skincare is in every bathroom. What happened?',
    sections: [
      { heading: 'The Three Waves', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=700&q=75', imageAlt: 'Seoul K-Pop district', body: 'Wave 1 (late 1990s): K-Dramas spread across Asia, starting with "Winter Sonata" in Japan. Wave 2 (2010s): K-Pop goes global — PSY\'s Gangnam Style, BTS, BLACKPINK. Wave 3 (2020s): Korean content dominates streaming — Squid Game, Parasite wins Oscar, K-Beauty and K-Food become global trends.' },
      { heading: 'Why Korea Succeeded', body: 'Korea invested heavily in cultural exports as a national strategy. The government supports the entertainment industry. Korean companies perfected the "idol system" for K-Pop. And Korean content fills a gap — it\'s emotionally rich, production quality is high, and it offers a perspective different from Hollywood. The internet and streaming platforms removed distribution barriers, allowing Korean content to reach global audiences directly.' },
    ],
    funFact: 'The Korean Wave generates over $12 billion annually in exports, and K-Pop alone accounts for about $5 billion.',
    koreanWord: { word: '한류', romanized: 'hallyu', meaning: 'Korean Wave (cultural influence)' },
    tags: ['Hallyu', 'Korean Wave', 'BTS', 'cultural export'],
  },
  // ═══ Travel ═══
  {
    slug: 'seoul-neighborhoods', title: 'Seoul Neighborhoods Guide: 15 Areas Explained', category: 'Travel', emoji: '🏙️', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=75', readTime: '6 min',
    description: 'Each Seoul neighborhood has its own personality. Gangnam is different from Hongdae is different from Itaewon.',
    intro: 'Seoul isn\'t one city — it\'s dozens of distinct neighborhoods, each with its own vibe. Knowing which area suits you can make or break your trip.',
    sections: [
      { heading: 'The Key Areas', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=700&q=75', imageAlt: 'Seoul cityscape at night', body: 'Gangnam — Luxury, K-Pop agencies, high-end shopping. Think Apgujeong and Cheongdam.\nHongdae — University area, indie music, street art, nightlife.\nItaewon — International food, diverse crowd, LGBTQ-friendly.\nMyeongdong — Shopping and street food mecca for tourists.\nInsadong — Traditional crafts, tea houses, galleries.\nBukchon — Hanok village, Instagram-worthy traditional houses.\nSeongsu — "Brooklyn of Seoul." Cafes, art spaces, pop-ups.\nYeonnam-dong — Quiet cafes, local food, relaxed vibes.\nGwangjang Market — The original street food market.\nDongdaemun — Fashion wholesale, 24-hour shopping.\nJamsil — Lotte World, sports stadiums, family-friendly.\nYeouido — Business district, Han River park, cherry blossoms.\nHaebangchon — Expat neighborhood, rooftop bars.\nMangwon — Local markets, bakeries, residential charm.\nSamcheong-dong — Art galleries, quiet streets near palaces.' },
    ],
    funFact: 'Seoul\'s subway has 23 lines and over 700 stations, making it one of the world\'s most comprehensive metro systems.',
    koreanWord: { word: '동네', romanized: 'dongne', meaning: 'neighborhood' },
    tags: ['Seoul', 'neighborhoods', 'Gangnam', 'Hongdae', 'travel guide'],
  },
  {
    slug: 'jeju-island-guide', title: 'Jeju Island: Korea\'s Hawaii', category: 'Travel', emoji: '🏙️', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=75', readTime: '5 min',
    description: 'Volcanic landscapes, tangerine groves, and pristine beaches. Jeju is Korea\'s tropical paradise.',
    intro: 'Jeju Island is where Koreans go to escape. A volcanic island off the southern coast, it offers stunning scenery, unique food, and a laid-back atmosphere completely different from mainland Korea.',
    sections: [
      { heading: 'Must-See Spots', image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=700&q=75', imageAlt: 'Jeju Island coastline', body: 'Hallasan Mountain — Korea\'s highest peak. Hike to the crater lake at the summit.\nSeongsan Ilchulbong — Dramatic volcanic crater by the sea. Best at sunrise.\nManjanggul Cave — One of the world\'s longest lava tubes.\nCheonjiyeon Waterfall — Surrounded by subtropical forest.\nHyeopjae Beach — Turquoise water with Hallasan views.\nJeju Haenyeo — Watch the famous female divers harvest seafood.' },
      { heading: 'What to Eat', image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=700&q=75', imageAlt: 'Jeju tangerines and food', body: 'Jeju black pork (흑돼지) — Grilled at your table, incredibly flavorful. Abalone porridge (전복죽) — Jeju\'s signature breakfast. Hallabong tangerines — Sweet citrus only grown on Jeju. Haemul-tang (해물탕) — Seafood stew with everything fresh from the ocean.' },
    ],
    funFact: 'Jeju has its own language (Jejueo) which is so different from Korean that UNESCO classified it as a critically endangered language.',
    koreanWord: { word: '해녀', romanized: 'haenyeo', meaning: 'female diver (Jeju diving women)' },
    tags: ['Jeju', 'island', 'travel', 'Hallasan', 'beach'],
  },
  {
    slug: 'korean-temple-stay', title: 'Korean Temple Stay: What to Expect', category: 'Travel', emoji: '🏙️', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=75', readTime: '4 min',
    description: 'Sleep in a Buddhist temple, wake at 4 AM for chanting, eat temple food, and find inner peace.',
    intro: 'Templestay is one of Korea\'s most unique experiences. For $30-60, you sleep in a 1,000-year-old temple, eat vegetarian temple food, and follow the monks\' daily routine.',
    sections: [
      { heading: 'A Typical Day', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=700&q=75', imageAlt: 'Korean Buddhist temple', body: '3:30 AM — Wake up bell. 4:00 AM — Morning chanting (yebul). 6:00 AM — Breakfast (temple food — all vegetarian, no garlic/onion). 8:00 AM — Tea ceremony with a monk. 10:00 AM — Meditation or hiking. 12:00 PM — Lunch. 2:00 PM — Lotus lantern making or Buddhist bead crafting. 5:00 PM — Dinner (the last meal of the day). 7:00 PM — Evening meditation. 9:00 PM — Lights out.' },
      { heading: 'Temple Food', image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=700&q=75', imageAlt: 'Temple food spread', body: 'Korean temple food (사찰음식) is a UNESCO-recognized culinary tradition. No meat, no garlic, no onion, no leek, no green onion — yet it\'s incredibly flavorful. Monks use fermentation, wild herbs, and seasonal ingredients. The food is so respected that some temple food restaurants in Seoul have Michelin stars.' },
    ],
    funFact: 'Jogyesa Temple in central Seoul is only 10 minutes from the busiest shopping district, Myeongdong.',
    koreanWord: { word: '사찰', romanized: 'sachal', meaning: 'Buddhist temple' },
    tags: ['temple stay', 'Buddhism', 'meditation', 'temple food'],
  },
  // ═══ Language ═══
  {
    slug: 'hangul-one-hour', title: 'Learn Hangul in 1 Hour: The Complete Guide', category: 'Language', emoji: '🗣️', image: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&q=75', readTime: '5 min',
    description: 'Korean alphabet is considered the most scientific writing system in the world. And you can learn it in an hour.',
    intro: 'Hangul, the Korean alphabet, was designed by King Sejong in 1443 specifically to be easy to learn. Unlike Chinese characters or Japanese kanji, Hangul is logical, phonetic, and learnable in a single afternoon.',
    sections: [
      { heading: 'The Basics', image: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=700&q=75', imageAlt: 'Hangul Korean alphabet', body: '14 consonants and 10 vowels — that\'s all you need. The consonants are designed to mimic the shape of your mouth when you make the sound. ㄱ (g) looks like the back of the tongue. ㄴ (n) looks like the tongue touching the roof of the mouth. ㅁ (m) looks like lips together. It\'s literally a diagram of how to make the sound.' },
      { heading: 'Building Blocks', body: 'Korean syllables are built in blocks: consonant + vowel (+ optional final consonant). For example: 한 = ㅎ(h) + ㅏ(a) + ㄴ(n) = "han". 국 = ㄱ(g) + ㅜ(u) + ㄱ(k) = "guk". Put them together: 한국 = "Hanguk" = Korea. Once you understand the system, you can sound out any Korean word.' },
    ],
    funFact: 'UNESCO created the King Sejong Literacy Prize in honor of Hangul\'s contribution to global literacy.',
    koreanWord: { word: '한글', romanized: 'Hangeul', meaning: 'Korean alphabet' },
    tags: ['Hangul', 'Korean alphabet', 'learn Korean', 'King Sejong'],
  },
  {
    slug: 'oppa-meaning', title: 'What Does "Oppa" Really Mean?', category: 'Language', emoji: '🗣️', image: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&q=75', readTime: '3 min',
    description: 'Oppa doesn\'t just mean "older brother." It\'s one of the most loaded words in Korean.',
    intro: 'If you\'ve watched any K-Drama, you\'ve heard it: "Oppa~!" It\'s one of the first Korean words foreigners learn, but its meaning goes far beyond "older brother."',
    sections: [
      { heading: 'The Literal Meaning', body: 'Oppa (오빠) literally means "older brother" — but only when used by a female speaker. A woman calls her older brother "oppa." She also calls older male friends, senior colleagues, and boyfriends "oppa." The word carries warmth, closeness, and a hint of affection.' },
      { heading: 'The Cultural Weight', body: 'When a Korean woman calls a man "oppa," it signals closeness and trust. In dating, it\'s almost expected. K-Pop fans call their favorite male idols "oppa." The way you say it matters — a casual "oppa" between friends is different from a drawn-out "oppa~" between lovers. The equivalent for male speakers is "hyung" (형) for older brothers/male friends.' },
    ],
    funFact: 'PSY\'s "Gangnam Style" originally had the working title "Oppa is Gangnam Style" — and that\'s how Koreans actually refer to the song.',
    koreanWord: { word: '오빠', romanized: 'oppa', meaning: 'older brother (from a female speaker) / boyfriend / male idol' },
    tags: ['oppa', 'Korean words', 'K-Drama', 'language'],
  },
  // ═══ Work & Business ═══
  {
    slug: 'hoesik-work-dinner', title: 'Hoesik: Korea\'s Mandatory Work Dinners', category: 'Work', emoji: '💼', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=75', readTime: '4 min',
    description: 'In Korea, after-work team dinners with drinking aren\'t optional. They\'re practically mandatory.',
    intro: 'Imagine your boss announcing that tonight, the entire team is going out for dinner and drinks — and there\'s no politely declining. Welcome to hoesik, Korea\'s infamous work dinner culture.',
    sections: [
      { heading: 'What is Hoesik?', body: 'Hoesik (회식) literally means "company meal." It\'s a team dinner, usually involving Korean BBQ and copious amounts of soju. The company pays. Attendance is technically voluntary but practically mandatory — declining too often marks you as "not a team player." Hoesik often progresses through multiple rounds: 1차 (dinner), 2차 (bar/noraebang), 3차 (another bar).' },
      { heading: 'Is It Changing?', body: 'Young Koreans increasingly push back against forced hoesik culture. The 52-hour work week law has reduced after-hours pressure. Many companies now offer "no-drink hoesik" options or substitute with lunch gatherings. But in traditional industries — construction, manufacturing, finance — the old hoesik culture remains strong.' },
    ],
    funFact: 'A 2023 survey found that 63% of Korean workers wished hoesik didn\'t exist, but 78% still attended regularly.',
    koreanWord: { word: '회식', romanized: 'hoesik', meaning: 'company dinner/team gathering' },
    tags: ['work culture', 'hoesik', 'drinking', 'office life'],
  },
  {
    slug: 'ppalli-ppalli', title: 'Ppalli Ppalli: Korea\'s Obsession with Speed', category: 'Work', emoji: '💼', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=75', readTime: '3 min',
    description: '"Hurry hurry!" — the unofficial motto of Korean society. Everything must be fast.',
    intro: '"Ppalli ppalli!" (빨리빨리!) — you\'ll hear this everywhere in Korea. It means "hurry hurry" and it captures something fundamental about Korean culture: an obsession with speed.',
    sections: [
      { heading: 'Speed Is Everything', body: 'Korea rebuilt from war ruins to the world\'s 10th largest economy in one generation. This "ppalli ppalli" mindset was essential for rapid development. Today it shows up everywhere: the world\'s fastest internet, same-day delivery for almost anything, 30-minute food delivery, express everything. Construction projects that take years elsewhere finish in months in Korea.' },
      { heading: 'The Downside', body: 'The speed culture creates pressure. Korea has high stress levels, long work hours (despite recent reforms), and an intense competitive atmosphere. "Quick quick" can mean cutting corners. But it also means incredible efficiency — Korean bureaucracy is surprisingly fast, and services run like clockwork.' },
    ],
    funFact: 'Korean apartment buildings are typically constructed in 6-8 months — a timeline that would be 2+ years in most Western countries.',
    koreanWord: { word: '빨리빨리', romanized: 'ppalli ppalli', meaning: 'hurry hurry / quickly quickly' },
    tags: ['speed culture', 'ppalli', 'efficiency', 'Korean mindset'],
  },
  // ═══ Tech ═══
  {
    slug: 'kakao-everything', title: 'KakaoTalk: The App That Runs Korea', category: 'Tech', emoji: '📱', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=75', readTime: '4 min',
    description: 'Forget WhatsApp. In Korea, KakaoTalk is messaging, banking, taxi, shopping, and everything else.',
    intro: '93% of South Koreans use KakaoTalk. It\'s not just a messaging app — it\'s the operating system of Korean daily life. If you\'re not on Kakao, you basically don\'t exist in Korea.',
    sections: [
      { heading: 'More Than Messaging', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=700&q=75', imageAlt: 'Korean smartphone apps', body: 'KakaoTalk started as a simple messenger in 2010. Today the Kakao ecosystem includes: KakaoBank (banking), KakaoTaxi (like Uber), KakaoPay (mobile payments), KakaoMap (navigation), KakaoStyle (fashion), and dozens more. Businesses send official messages through Kakao. Government notifications come through Kakao. Even your building\'s security system connects to Kakao.' },
      { heading: 'Why Not WhatsApp/Line?', body: 'KakaoTalk won Korea because it was free at a time when Korean carriers charged per text message. By offering free messaging over WiFi, Kakao exploded overnight. By the time competitors arrived, Kakao had become too embedded in Korean infrastructure to replace. The network effect is absolute — everyone is on Kakao because everyone is on Kakao.' },
    ],
    funFact: 'When KakaoTalk servers went down for a few hours in 2022, it caused national disruption — people couldn\'t access banking, taxis, or even government services.',
    koreanWord: { word: '카톡', romanized: 'ka-tok', meaning: 'KakaoTalk (abbreviated)' },
    tags: ['KakaoTalk', 'Korean apps', 'technology', 'messaging'],
  },
  {
    slug: 'naver-not-google', title: 'Why Koreans Use Naver, Not Google', category: 'Tech', emoji: '📱', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=75', readTime: '3 min',
    description: 'Google dominates the world, but in Korea, Naver is king. Here\'s why Koreans prefer their own search engine.',
    intro: 'In most countries, "search it" means "Google it." In Korea, it means "Naver it." Naver controls about 60% of Korea\'s search market, while Google has only about 30%.',
    sections: [
      { heading: 'What Makes Naver Different', body: 'Naver isn\'t just a search engine — it\'s a portal. Search results show Naver Blog posts, Naver Cafe (forums), Naver News, Naver Shopping, and Naver Encyclopedia all on one page. For Korean-language content, Naver\'s results are significantly better than Google\'s. Naver also has Naver Webtoon (world\'s largest comic platform), Naver Pay, and SNOW (photo app).' },
      { heading: 'The Blog Culture', body: 'Korean internet culture revolves around Naver Blogs. Restaurant reviews, product reviews, travel guides — Koreans check Naver Blog posts, not Google results. Businesses optimize for Naver, not Google. This creates a self-reinforcing cycle: the best Korean content is on Naver, so Koreans stay on Naver.' },
    ],
    funFact: 'Naver\'s AI assistant, Clova, was one of the first AI assistants to support Korean language naturally.',
    koreanWord: { word: '네이버', romanized: 'neibeo', meaning: 'Naver (Korean search engine)' },
    tags: ['Naver', 'Korean internet', 'search engine', 'technology'],
  },
  // ═══ Additional Beliefs ═══
  {
    slug: 'whistling-night', title: "Don't Whistle at Night in Korea", category: 'Beliefs', emoji: '🔮', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=75', readTime: '3 min',
    description: 'Whistling after dark is believed to summon ghosts or snakes in Korean folklore.',
    intro: 'Whistle a tune while walking home at night in Korea, and someone will almost certainly tell you to stop. Whistling after dark is believed to call ghosts — or snakes.',
    sections: [
      { heading: 'The Belief', body: "Korean folklore holds that evil spirits are attracted to whistling sounds at night. Some versions say it summons ghosts, others say snakes. The belief likely originated from rural Korea where whistling could attract actual snakes or wild animals in the dark." },
      { heading: 'Still Alive Today', body: "Even urban Koreans who don't believe in ghosts often feel uneasy hearing whistling at night. It's been reinforced through Korean horror movies and TV shows. Parents still tell children not to whistle after sunset." },
    ],
    funFact: 'In old Korea, night watchmen used clappers instead of whistles specifically to avoid "summoning spirits."',
    koreanWord: { word: '귀신', romanized: 'gwisin', meaning: 'ghost/spirit' },
    tags: ['whistling', 'ghosts', 'night', 'Korean folklore'],
  },
  {
    slug: 'exam-superstitions', title: 'Korean Exam Day Superstitions: Yeot Candy & More', category: 'Beliefs', emoji: '🔮', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=75', readTime: '3 min',
    description: "On Korea's college entrance exam day, the entire country mobilizes. Here are the superstitions students follow.",
    intro: "Every November, Korea's entire society revolves around one event: the Suneung (college entrance exam). Planes are grounded, offices open late, and police escort late students. The superstitions are just as intense.",
    sections: [
      { heading: 'Lucky Rituals', body: "Students receive yeot (엿, sticky candy) — because it 'sticks' to the exam, meaning answers will stick in their minds. Seaweed soup is avoided because seaweed is slippery (answers will 'slip' away). Parents pray at temples for 100 days before the exam. Younger students cheer outside exam halls, performing coordinated dances." },
      { heading: 'The Social Impact', body: "The Suneung is so important that it affects national policy. Flight schedules change to reduce noise during the listening test. Stock markets open late. The entire country goes quiet during the English listening section. This single test determines which university a student attends, which in Korea determines career, social status, and even marriage prospects." },
    ],
    funFact: "Korea's Suneung is considered one of the world's most stressful exams — the suicide rate among Korean students spikes around exam season.",
    koreanWord: { word: '수능', romanized: 'suneung', meaning: 'College Scholastic Ability Test' },
    tags: ['Suneung', 'exam', 'education', 'superstition'],
  },
  // ═══ Additional Food ═══
  {
    slug: 'korean-cafe-culture', title: "Korea's Coffee Obsession: More Cafes Than Convenience Stores", category: 'Food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75', readTime: '4 min',
    description: 'Seoul has more cafes per capita than any city in the world. Koreans take their coffee seriously.',
    intro: "Korea has approximately 100,000 cafes — that's more cafes than McDonald's locations worldwide, all in a country smaller than Pennsylvania.",
    sections: [
      { heading: 'Why So Many Cafes?', image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=700&q=75', imageAlt: 'Korean cafe interior', body: "Korean cafe culture isn't just about coffee — it's about space. In a country where apartments are small and public spaces are limited, cafes serve as living rooms, offices, study halls, and date spots. The concept of 'cafe hopping' (카페 투어) is a legitimate weekend activity. Koreans visit cafes for the aesthetics as much as the drinks." },
      { heading: 'Cafe Types', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=75', imageAlt: 'Korean coffee and dessert', body: "Themed cafes: Dog cafes, cat cafes, raccoon cafes, sheep cafes. Study cafes: Pay by the hour, complete silence enforced. Dessert cafes: Elaborate cakes, bingsu (shaved ice), souffle pancakes. Hanok cafes: Traditional Korean house converted into a cafe. Rooftop cafes: Views of Seoul skyline. Book cafes: Thousands of books, quiet atmosphere." },
    ],
    funFact: 'South Korea is the 7th largest coffee market in the world, drinking more coffee per capita than the US.',
    koreanWord: { word: '아메리카노', romanized: 'amerikano', meaning: 'Americano (the most popular coffee order in Korea)' },
    tags: ['cafe', 'coffee', 'Korean culture', 'Seoul'],
  },
  {
    slug: 'korean-delivery-culture', title: "Korea's Delivery Culture: Anything, Anywhere, Anytime", category: 'Food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75', readTime: '4 min',
    description: 'Koreans can get fried chicken delivered to a park bench at midnight. The delivery culture is unmatched.',
    intro: "In Korea, delivery isn't limited to pizza and Chinese food. You can get Korean BBQ sets, full-course meals, coffee, and even fried chicken delivered to a park bench by the Han River at 2 AM.",
    sections: [
      { heading: 'How It Works', body: "Apps like Baedal Minjok (배달의민족) and Coupang Eats dominate. Almost every restaurant delivers. The average delivery time is 30-40 minutes. You can order to literally any location — parks, offices, hotels. Some services deliver single cups of coffee. Payment is usually through the app, and tipping is not expected." },
      { heading: 'The Han River Tradition', image: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=700&q=75', imageAlt: 'Han River picnic with delivery food', body: "Ordering fried chicken to a spot on the Han River bank is practically a Korean rite of passage. Every spring and summer evening, thousands of people sit along the river with delivery chicken and beer. The delivery riders navigate through parks on scooters to find you — you just drop a pin on the map." },
    ],
    funFact: "Korea's food delivery market is worth over $20 billion — about 3% of the country's entire GDP.",
    koreanWord: { word: '배달', romanized: 'baedal', meaning: 'delivery' },
    tags: ['delivery', 'food delivery', 'Baedal Minjok', 'Korean apps'],
  },
  {
    slug: 'korean-ramen-vs-japanese', title: 'Korean Ramyeon vs Japanese Ramen: The Real Difference', category: 'Food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75', readTime: '3 min',
    description: "They share a name origin but they're completely different foods. Here's the breakdown.",
    intro: "Foreigners often confuse Korean ramyeon with Japanese ramen. While they share an etymological root, they're as different as New York pizza and Italian pizza.",
    sections: [
      { heading: 'The Differences', body: "Korean ramyeon (라면) is almost always instant — curly noodles in spicy red broth, cooked at home or at a convenience store. Japanese ramen (ラーメン) is a restaurant dish — handmade noodles in hours-long bone broth. Korean ramyeon costs $1. Japanese ramen costs $10+. Koreans eat ramyeon as a quick snack. Japanese eat ramen as a proper meal." },
      { heading: 'Korean Ramyeon Culture', body: "Koreans eat 80+ servings of instant ramyeon per person per year — the highest in the world. Cooking ramyeon has a specific art: the water-to-powder ratio, the egg timing, adding cheese or rice. Shin Ramyun is the most famous brand globally. Eating ramyeon at a convenience store (with the hot water dispenser) is a quintessential Korean experience." },
    ],
    funFact: "The Korean movie 'Parasite' featured a ram-don (짜파구리) scene that caused instant noodle sales to spike globally.",
    koreanWord: { word: '라면', romanized: 'ramyeon', meaning: 'instant noodles (Korean style)' },
    tags: ['ramyeon', 'ramen', 'instant noodles', 'Korean vs Japanese'],
  },
  // ═══ Additional K-Culture ═══
  {
    slug: 'mukbang-culture', title: 'Mukbang: Why Millions Watch Koreans Eat', category: 'K-Culture', emoji: '🎵', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '4 min',
    description: "Mukbang — eating broadcasts — started in Korea and became a global phenomenon. But why do people watch others eat?",
    intro: "Every night, millions of people around the world watch strangers eat enormous amounts of food on camera. This phenomenon started in Korea, and it's called mukbang (먹방).",
    sections: [
      { heading: 'How It Started', body: "Mukbang (먹방 = 먹는 방송, eating broadcast) began on Korean live-streaming platform AfreecaTV around 2010. Viewers would watch hosts eat large meals while chatting. The format exploded because of Korea's solo dining stigma — eating alone was considered sad, so watching someone eat online created a virtual dining companion." },
      { heading: 'The Global Spread', body: "ASMR mukbang (focusing on eating sounds) went viral on YouTube around 2018. Korean creators like Boki and Tzuyang have millions of subscribers. The genre has spawned sub-categories: ASMR mukbang, challenge mukbang (extreme amounts), cooking + mukbang, and review mukbang. Some top creators earn over $1 million per year." },
    ],
    funFact: "The Korean government considered regulating mukbang content due to concerns about promoting overeating and food waste.",
    koreanWord: { word: '먹방', romanized: 'meokbang', meaning: 'eating broadcast' },
    tags: ['mukbang', 'ASMR', 'YouTube', 'Korean content'],
  },
  {
    slug: 'webtoon-revolution', title: 'Webtoon: How Korea Changed Comics Forever', category: 'K-Culture', emoji: '🎵', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '4 min',
    description: "Korean webtoons killed the comic book format and created a new digital art form that's taking over the world.",
    intro: "Forget manga pages and Marvel issues. Korean webtoons are vertical-scrolling, full-color, mobile-first comics that have revolutionized how the world reads comics.",
    sections: [
      { heading: 'What Makes Webtoons Different', body: "Traditional comics are designed for print — horizontal pages, panels side by side. Webtoons are designed for phones — you scroll down through a single vertical strip. This simple change transformed the reading experience. Colors are standard (manga is black and white). Episodes release weekly and are free to read (with paid early access). The vertical format enables cinematic pacing impossible in print." },
      { heading: 'The Industry', body: "Naver Webtoon and Kakao Webtoon dominate Korea. The platform has over 80 million monthly users globally. Successful webtoons get adapted into K-Dramas (Sweet Home, True Beauty, All of Us Are Dead), movies, and games. Top webtoon artists earn millions. The industry is worth over $3 billion and growing 20%+ annually." },
    ],
    funFact: "The webtoon 'Tower of God' was so popular that its anime adaptation trended #1 on Crunchyroll globally.",
    koreanWord: { word: '웹툰', romanized: 'webtun', meaning: 'webtoon (digital comic)' },
    tags: ['webtoon', 'comics', 'Naver', 'digital art'],
  },
  {
    slug: 'korean-beauty-skincare', title: 'K-Beauty: The 10-Step Skincare Routine Explained', category: 'K-Culture', emoji: '🎵', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '5 min',
    description: "The famous Korean skincare routine that conquered the world. Here's what each step actually does.",
    intro: "Korean skincare isn't about covering imperfections — it's about preventing them. The famous 10-step routine might sound excessive, but each step has a purpose.",
    sections: [
      { heading: 'The 10 Steps', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a0d519?w=700&q=75', imageAlt: 'Korean skincare products', body: "1. Oil cleanser — Dissolves makeup and sunscreen.\n2. Water cleanser — Removes remaining impurities.\n3. Exfoliant — Removes dead skin cells (2-3x per week).\n4. Toner — Balances pH and prepares skin.\n5. Essence — The heart of Korean skincare. Hydrating and repairing.\n6. Serum/Ampoule — Concentrated active ingredients.\n7. Sheet mask — Intense hydration boost (2-3x per week).\n8. Eye cream — Delicate under-eye area care.\n9. Moisturizer — Locks everything in.\n10. Sunscreen — Non-negotiable, even on cloudy days." },
      { heading: 'Why It Works', body: "The Korean approach focuses on prevention over correction, hydration over drying, and layering lightweight products over using one heavy cream. Korean sunscreen technology is years ahead of Western brands — lightweight, no white cast, comfortable for daily wear. This is why Korean skin appears 'glass-like' — it's genuinely well-hydrated, not just filtered." },
    ],
    funFact: "Korean sunscreen is so popular that some formulas are banned in the EU because they contain filters not yet approved there — despite being proven safe in Korea for years.",
    koreanWord: { word: '피부', romanized: 'pibu', meaning: 'skin' },
    tags: ['K-Beauty', 'skincare', 'routine', 'sunscreen'],
  },
  // ═══ Additional Travel ═══
  {
    slug: 'dmz-visit-guide', title: 'Visiting the DMZ: The Most Tense Border on Earth', category: 'Travel', emoji: '🏙️', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=75', readTime: '5 min',
    description: "The Korean DMZ is the world's most heavily fortified border. And you can visit it on a day trip from Seoul.",
    intro: "Just 50 km north of Seoul — one of the world's most modern cities — lies the DMZ, a 4km-wide strip dividing North and South Korea since 1953. It's surreal, sobering, and one of Korea's most visited sites.",
    sections: [
      { heading: 'What You Can See', image: 'https://images.unsplash.com/photo-1591116303850-aa959bf6dad3?w=700&q=75', imageAlt: 'DMZ border area', body: "Joint Security Area (JSA/Panmunjom): Stand in the blue UN buildings that straddle the border. One foot in North Korea, one in South. The Third Tunnel: A North Korean invasion tunnel discovered in 1978, 73 meters underground. Dora Observatory: Look into North Korea through binoculars. Dorasan Station: A train station built for future reunification, with tracks leading to Pyongyang." },
      { heading: 'How to Visit', body: "You cannot visit the DMZ independently — a guided tour is required. Tours leave from Seoul daily and cost $40-80. Passport is required. There's a strict dress code (no flip-flops, shorts, or sleeveless tops). Photography is restricted in certain areas. Book through USO, Koridoor, or other authorized operators." },
    ],
    funFact: "The DMZ has become an accidental nature reserve — 70 years without human activity has created a thriving ecosystem with endangered species.",
    koreanWord: { word: '비무장지대', romanized: 'bi-mu-jang-ji-dae', meaning: 'Demilitarized Zone (DMZ)' },
    tags: ['DMZ', 'North Korea', 'border', 'JSA', 'day trip'],
  },
  {
    slug: 'korean-jjimjilbang', title: 'Korean Jjimjilbang: The Complete Sauna & Spa Guide', category: 'Travel', emoji: '🏙️', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=75', readTime: '4 min',
    description: "Jjimjilbang is Korea's public bathhouse culture. Naked bathing, heated rooms, and sleeping overnight for $10.",
    intro: "A jjimjilbang (찜질방) is part spa, part sauna, part sleepover, and part social club. For about $10-15, you get access to hot baths, saunas, heated rooms, and a place to sleep overnight.",
    sections: [
      { heading: 'How It Works', body: "Pay at the entrance and receive a locker key and matching t-shirt/shorts set. The bathhouse section is gender-separated and nude — yes, completely naked. Hot tubs, cold plunge, steam room, and scrubbing stations. After bathing, change into the provided clothes and enter the co-ed common area with heated rooms (jade room, salt room, ice room), a snack bar, TV areas, and sleeping mats." },
      { heading: 'The Experience', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=700&q=75', imageAlt: 'Korean spa relaxation', body: "Must-try: The sheep head towel (양머리, a towel twisted into a sheep shape on your head), baked eggs (맥반석 계란, eggs slow-cooked in the sauna), and sikhye (식혜, sweet rice drink). Many Koreans use jjimjilbang as cheap overnight accommodation. The atmosphere is surprisingly relaxed — families, friends, and couples all hang out together." },
    ],
    funFact: "Dragon Hill Spa in Seoul is 7 floors and includes a swimming pool, cinema, rooftop garden, and golf driving range — all for about $12 entry.",
    koreanWord: { word: '찜질방', romanized: 'jjimjilbang', meaning: 'heated room / Korean spa' },
    tags: ['jjimjilbang', 'spa', 'sauna', 'bathhouse'],
  },
  // ═══ Additional Language ═══
  {
    slug: 'korean-texting-decoded', title: 'ㅋㅋㅋ ㅎㅎ ㅠㅠ — Korean Texting Decoded', category: 'Language', emoji: '🗣️', image: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&q=75', readTime: '3 min',
    description: "Korean texting uses consonants as shorthand. Here's what ㅋㅋㅋ, ㅎㅎ, and ㅠㅠ mean.",
    intro: "If a Korean texts you 'ㅋㅋㅋㅋㅋ', don't panic. It's laughter. Korean texting uses individual consonants as emotional shorthand in a way that's uniquely Korean.",
    sections: [
      { heading: 'The Basics', body: "ㅋㅋㅋ (kkk) = laughter (like 'hahaha'). More ㅋs = funnier.\nㅎㅎ (hh) = soft laughter/smile (like 'hehe').\nㅠㅠ (yy) = crying/sad face. The ㅠ looks like tears running down.\nㅇㅇ (oo) = yes/agreement (shortened 응/eung).\nㄴㄴ (nn) = no (shortened 노노).\nㅇㅋ (ok) = OK.\nㄱㅅ (gs) = thanks (shortened 감사).\nㅎㄷㄷ (hdd) = shivering/shocked." },
      { heading: 'Advanced Level', body: "ㅂㅂ = bye bye. ㄷㄷ = trembling (scared/impressed). ㅁㅊ = crazy (먼저 — actually rude, use carefully). ㅈㅅ = sorry (죄송). ㅊㅋ = congrats (축하). The number of consonants matters: ㅋ = mild, ㅋㅋ = normal, ㅋㅋㅋㅋㅋ = hilarious. Just one ㅋ can feel passive-aggressive." },
    ],
    funFact: "A single 'ㅋ' in Korean texting can be interpreted as sarcastic or cold — similar to replying 'k' in English.",
    koreanWord: { word: 'ㅋㅋㅋ', romanized: 'kkk', meaning: 'hahaha (text laughter)' },
    tags: ['texting', 'slang', 'Korean text', 'ㅋㅋㅋ'],
  },
  {
    slug: 'nunchi-social-skill', title: "Nunchi: Korea's Secret Social Superpower", category: 'Language', emoji: '🗣️', image: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&q=75', readTime: '3 min',
    description: "Nunchi is the Korean art of reading the room. It's the most important social skill in Korea — and you've never heard of it.",
    intro: "In Korea, the ability to 'read the room' has a name: nunchi (눈치). It's not just a nice skill to have — it's considered essential for survival in Korean society.",
    sections: [
      { heading: 'What Is Nunchi?', body: "Nunchi literally means 'eye-measure' — the ability to gauge others' thoughts, feelings, and the overall mood of a room without explicit communication. A person with good nunchi (눈치가 빠르다) picks up on subtle cues: who's uncomfortable, what's not being said, when to speak, and when to stay quiet." },
      { heading: 'Why It Matters', body: "In Korean culture, direct confrontation is avoided. People rarely say exactly what they mean. Nunchi fills the gap — it's how Koreans navigate social situations without explicit communication. Having bad nunchi (눈치가 없다) is one of the worst social criticisms in Korea. It means you're oblivious, insensitive, and difficult to be around." },
    ],
    funFact: "Korean mothers teach nunchi from early childhood. 'Nunchi bwa!' (눈치 봐!) — 'Read the room!' — is one of the most common phrases Korean children hear.",
    koreanWord: { word: '눈치', romanized: 'nunchi', meaning: 'eye-measure / the art of reading the room' },
    tags: ['nunchi', 'social skills', 'communication', 'Korean concept'],
  },
  // ═══ Additional Work ═══
  {
    slug: 'chaebol-explained', title: "Chaebol: Samsung, Hyundai & Korea's Family Empires", category: 'Work', emoji: '💼', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=75', readTime: '4 min',
    description: "Five family-owned conglomerates control over 50% of Korea's GDP. Here's how chaebol work.",
    intro: "Samsung alone accounts for about 20% of South Korea's GDP. Add Hyundai, SK, LG, and Lotte, and five families essentially run the Korean economy. These family empires are called chaebol (재벌).",
    sections: [
      { heading: 'What Are Chaebol?', body: "Chaebol are massive family-controlled conglomerates. Samsung isn't just phones — it's construction, insurance, hospitals, theme parks, and even military equipment. Hyundai isn't just cars — it's shipbuilding, department stores, and construction. These companies were built during Korea's rapid industrialization (1960s-80s) with heavy government support." },
      { heading: 'Love-Hate Relationship', body: "Koreans have a complex relationship with chaebol. They created Korea's economic miracle, provide the best jobs, and are sources of national pride. But they also have incredible political influence, family succession scandals, and create an economy where small businesses struggle. Working at a top chaebol (삼성, 현대, SK) is the ultimate career goal for most Korean graduates." },
    ],
    funFact: "Samsung's Lee family has been involved in multiple corruption and tax evasion scandals, yet Samsung remains Korea's most desired employer.",
    koreanWord: { word: '재벌', romanized: 'jaebeol', meaning: 'wealthy family / conglomerate' },
    tags: ['chaebol', 'Samsung', 'Hyundai', 'Korean economy'],
  },
  // ═══ Additional Tech ═══
  {
    slug: 'fastest-internet-korea', title: 'Why Korea Has the World\'s Fastest Internet', category: 'Tech', emoji: '📱', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=75', readTime: '3 min',
    description: "Average internet speed in Korea is 200+ Mbps. Most homes have gigabit fiber. Here's how it happened.",
    intro: "While many countries still struggle with broadband, Korea achieved near-universal gigabit internet years ago. The average Korean internet speed is over 200 Mbps — many homes have 1 Gbps or even 10 Gbps connections.",
    sections: [
      { heading: 'How Korea Did It', body: "In the late 1990s, the Korean government made a strategic decision to invest heavily in broadband infrastructure as a national priority. The dense urban population helped — running fiber to apartment buildings (where 60%+ of Koreans live) is efficient. Competition between three major ISPs (KT, SK Broadband, LG U+) drove prices down and speeds up." },
      { heading: 'The Impact', body: "Fast internet enabled Korea's digital economy: e-sports (Korea was the birthplace of professional gaming), streaming culture, online shopping (Korea's e-commerce penetration is among the highest globally), and the app ecosystem (KakaoTalk, Naver, delivery apps). Korean internet culture moves fast — trends emerge and die within days." },
    ],
    funFact: "Korean internet is so fast that when Koreans travel abroad, the biggest culture shock is often slow WiFi.",
    koreanWord: { word: '인터넷', romanized: 'inteonet', meaning: 'internet' },
    tags: ['internet', 'broadband', 'technology', 'infrastructure'],
  },
  // ═══ Comparison ═══
  {
    slug: 'korea-vs-japan', title: 'Korea vs Japan: Cultural Differences Explained', category: 'Comparison', emoji: '🤔', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '5 min',
    description: "Korea and Japan are neighbors but culturally distinct. Here are the key differences tourists notice.",
    intro: "Korea and Japan are geographically close and share some cultural roots, but the differences are striking. Tourists who visit both often say they feel like completely different worlds.",
    sections: [
      { heading: 'Key Differences', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=700&q=75', imageAlt: 'Seoul vs Tokyo comparison', body: "Food: Korean food is bold, spicy, and communal (sharing dishes). Japanese food is subtle, delicate, and individual portions.\nSocial: Koreans are direct and emotionally expressive. Japanese are indirect and reserved.\nDrinking: Koreans drink socially and loudly. Japanese drink more quietly.\nBeauty: Korean beauty emphasizes dewy, glass skin. Japanese beauty emphasizes natural, matte looks.\nTechnology: Korea is mobile-first (KakaoTalk). Japan still uses fax machines and cash.\nAge: Korea uses Korean age (1 year older at birth). Japan uses Western age." },
      { heading: 'The Rivalry', body: "The Korea-Japan relationship is complex, shaped by Japan's colonial occupation of Korea (1910-1945). This history affects everything from politics to pop culture. Koreans and Japanese generally get along as individuals, but national sentiment can be intense, especially around historical issues. Both countries produce world-class entertainment, technology, and cuisine — the friendly competition benefits everyone." },
    ],
    funFact: "Korean and Japanese grammar structures are remarkably similar (subject-object-verb), making each language relatively easier for speakers of the other to learn.",
    koreanWord: { word: '한일관계', romanized: 'han-il-gwangye', meaning: 'Korea-Japan relations' },
    tags: ['Korea vs Japan', 'cultural difference', 'comparison', 'travel'],
  },
  {
    slug: 'korean-age-explained', title: 'Korean Age vs International Age: Why You\'re Older in Korea', category: 'Comparison', emoji: '🤔', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '3 min',
    description: "In Korea, you're 1 year old at birth and everyone ages up on January 1. Here's the confusing system explained.",
    intro: "Tell a Korean your birthday and they might say you're a different age than you think. Until 2023, Korea used a unique age system where everyone was born at age 1.",
    sections: [
      { heading: 'The Old System', body: "Korean age (만 나이 vs 세는 나이): You were 1 when born (counting time in the womb). Everyone aged up together on January 1 — not on their birthday. So a baby born on December 31 would be 2 years old the next day. This meant Koreans were 1-2 years 'older' than their international age." },
      { heading: 'The 2023 Change', body: "In June 2023, Korea officially switched to international age for legal and administrative purposes. But in daily conversation, many Koreans still use the old system — especially when determining social hierarchy. Age matters enormously in Korean culture (it determines speech level, who pours drinks, who pays), so the 'Korean age' concept persists socially even if it's no longer legal." },
    ],
    funFact: "Before the 2023 change, a Korean could have three different ages: Korean age, calendar age, and international age — all at the same time.",
    koreanWord: { word: '만 나이', romanized: 'man nai', meaning: 'international age (full age)' },
    tags: ['Korean age', 'age system', 'culture', 'comparison'],
  },
  {
    slug: 'korea-safety', title: "Why Korea is One of the Safest Countries in the World", category: 'Comparison', emoji: '🤔', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '3 min',
    description: "Lost wallets get returned, women walk alone at night, and violent crime is rare. Korea's safety is remarkable.",
    intro: "Leave your laptop at a cafe table and go to the restroom. Walk alone at 3 AM through Seoul's streets. Drop your wallet and expect it back. Korea's safety level genuinely surprises foreigners.",
    sections: [
      { heading: 'How Safe Is It?', body: "Korea's violent crime rate is one of the lowest among developed nations. Murder rate is about 0.6 per 100,000 — compared to 6.3 in the US. Theft is rare — Koreans commonly leave bags, phones, and laptops unattended in cafes. Public transportation runs safely 24/7. Convenience stores and restaurants are open all night. Women can walk alone at night in most areas without concern (though caution is always wise)." },
      { heading: 'Why?', body: "Several factors contribute: CCTV is everywhere (Seoul has over 1 million cameras). Community-oriented culture creates social pressure against crime. Gun ownership is virtually nonexistent. Police presence is visible. The homogeneous culture creates strong social trust. And Korea's confucian values emphasize social harmony and shame avoidance." },
    ],
    funFact: "Korea's 'lost and found' culture is remarkable — about 80% of lost wallets are returned to their owners, often with all cash intact.",
    koreanWord: { word: '안전', romanized: 'anjeon', meaning: 'safety/security' },
    tags: ['safety', 'crime rate', 'comparison', 'Korea vs world'],
  },
  {
    slug: 'no-tipping-korea', title: 'Why You Don\'t Tip in Korea', category: 'Comparison', emoji: '🤔', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '3 min',
    description: "Tipping is not just unnecessary in Korea — it can be confusing or even insulting. Here's why.",
    intro: "Coming from a tipping culture? Leave the tip calculator at home. In Korea, tipping doesn't exist — and trying to tip can create awkward situations.",
    sections: [
      { heading: 'No Tipping Culture', body: "Restaurants: No tip expected. Ever. The price on the menu is what you pay. Taxis: No tip. Round up if you want, but drivers don't expect it. Hotels: No tip for bellboys or housekeeping. Delivery: No tip. Hair salons: No tip. The service charge, if any, is already included in the price." },
      { heading: 'Why It Works', body: "Korean service workers are paid a proper wage — they don't depend on tips. Service quality is consistently high because it's expected as professional standard, not incentivized by tips. Tipping can actually be awkward: some service workers will chase you down to return money they think you accidentally left behind. In high-end restaurants, leaving cash on the table might confuse staff." },
    ],
    funFact: "Some Korean restaurants will literally run after you if you leave cash on the table, thinking you forgot your money.",
    koreanWord: { word: '팁', romanized: 'tip', meaning: 'tip (a foreign concept in Korea)' },
    tags: ['tipping', 'no tip', 'dining', 'Korean customs'],
  },
  // ═══ Lifestyle ═══
  {
    slug: 'korean-couple-culture', title: 'Korean Couple Culture: Matching Outfits & 100-Day Anniversary', category: 'Lifestyle', emoji: '🏠', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '4 min',
    description: "Korean couples wear matching outfits, celebrate in 100-day increments, and follow unique dating customs.",
    intro: "See two people wearing identical outfits in Korea? They're a couple, and it's completely normal. Korean couple culture is intense, public, and full of unique customs.",
    sections: [
      { heading: 'Couple Customs', body: "Matching outfits (커플룩): Couples wear identical clothes, shoes, or phone cases. Not just shirts — full matching outfits. Anniversary system: Koreans celebrate 100 days, 200 days, 300 days, and so on. The 100-day anniversary (백일) is the first major milestone. Couple rings: Many couples exchange rings early in the relationship. Couple photos: Professional photoshoots in matching outfits are common." },
      { heading: 'Dating Holidays', body: "Valentine's Day (Feb 14): Women give chocolate to men. White Day (Mar 14): Men give candy to women. Black Day (Apr 14): Single people eat black bean noodles together. Rose Day (May 14): Exchange roses. Kiss Day (Jun 14): Self-explanatory. Silver Day (Jul 14): Exchange silver accessories. And it continues every month on the 14th all year." },
    ],
    funFact: "Korean couples have a 'couple phone case' culture — many phone case shops sell identical cases in two colors specifically for couples.",
    koreanWord: { word: '커플룩', romanized: 'keopeul-luk', meaning: 'couple look (matching outfits)' },
    tags: ['dating', 'couple culture', 'relationship', 'Korean customs'],
  },
  {
    slug: 'korean-military-service', title: "Korean Military Service: Every Man's Duty", category: 'Lifestyle', emoji: '🏠', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '4 min',
    description: "All Korean men must serve 18-21 months in the military. It affects K-Pop, careers, and relationships.",
    intro: "Every able-bodied Korean man must serve in the military for 18-21 months. There are no exceptions — even K-Pop idols must go. It's the most significant shared experience among Korean men.",
    sections: [
      { heading: 'How It Works', body: "Men must enlist before age 28 (with some extensions). Army: 18 months. Navy: 20 months. Air Force: 21 months (hardest to get into — it's the cushiest). Marines: 18 months (toughest). Basic training is 5 weeks, followed by assignment to a unit. Pay is minimal — about $600/month (recently increased from $100). Phone use is now allowed after hours (a recent change that was hugely celebrated)." },
      { heading: 'The Impact', body: "Military service creates a gap in every Korean man's life. University students typically go during their studies, creating '군휴학' (military leave). K-Pop idols lose 18 months of their career — BTS members' enlistment was national news. Career-wise, employers understand the gap. Socially, military experience is a bonding topic among Korean men. Women do not have mandatory service, though voluntary service is available." },
    ],
    funFact: "BTS's military service exemption was debated in Korean parliament — they ultimately served, with all members enlisting by 2023.",
    koreanWord: { word: '군대', romanized: 'gundae', meaning: 'military / army' },
    tags: ['military', 'conscription', 'Korean men', 'BTS'],
  },
  {
    slug: 'korean-apartment-life', title: 'Korean Apartment Life: Why Everyone Lives in High-Rises', category: 'Lifestyle', emoji: '🏠', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '4 min',
    description: "Over 60% of Koreans live in apartments. The apartment complex is Korea's defining housing form.",
    intro: "Look at any Korean city skyline and you'll see endless rows of identical apartment towers. Over 60% of South Koreans live in apartments — it's not just housing, it's a lifestyle.",
    sections: [
      { heading: 'Why Apartments?', body: "Korea urbanized rapidly in the 1970s-80s, and apartments were the fastest way to house millions of rural-to-urban migrants. Today, Korean apartments (아파트) are typically 20-30 story towers in large complexes with shared facilities: playgrounds, fitness centers, convenience stores, and underground parking. Brand-name apartments (Samsung, Hyundai, Lotte) are status symbols — the brand matters as much as the location." },
      { heading: 'The Jeonse System', body: "Korea's unique jeonse (전세) rental system: instead of monthly rent, you give the landlord a massive deposit (often 50-80% of the apartment's value). You live rent-free, and when you leave, you get the deposit back. The landlord invests the deposit and keeps the returns. This system is uniquely Korean and is being challenged by rising prices, but it still dominates." },
    ],
    funFact: "Korean apartments are measured in 평 (pyeong) — one pyeong is about 3.3 square meters. A '30-pyeong' apartment (about 100 sqm) is considered a good family size.",
    koreanWord: { word: '아파트', romanized: 'apateu', meaning: 'apartment' },
    tags: ['apartment', 'housing', 'jeonse', 'Korean life'],
  },
  // ═══ Final 5 to reach 50 ═══
  {
    slug: 'korean-school-lunch', title: 'Korean School Lunch: Best in the World?', category: 'Food', emoji: '🍜', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=75', readTime: '4 min',
    description: "Korean school lunches are nutritious, varied, and free. Many foreigners say they're better than restaurant food.",
    intro: "Forget soggy pizza and mystery meat. Korean school lunches include fresh kimchi, grilled fish, seasonal vegetables, rice, and soup — served free to all students, every day.",
    sections: [
      { heading: 'What Students Eat', body: "A typical Korean school lunch includes: steamed rice, soup (doenjang-jjigae, kimchi-jjigae, etc.), a main dish (grilled fish, bulgogi, dakgalbi), 2-3 banchan (side dishes), kimchi, and sometimes fruit or dessert. The menu changes daily. Meals are nutritionally balanced and follow government guidelines. Everything is cooked fresh on-site by professional kitchen staff." },
      { heading: 'Why It Works', body: "Korea made school lunches free nationwide in stages from 2011-2021. The government invests heavily in nutrition standards. School nutritionists plan menus monthly, incorporating seasonal ingredients and local produce. Students eat together in cafeterias with teachers. The result: Korean children have among the lowest obesity rates in the OECD." },
    ],
    funFact: "Korean school lunch menus are posted on an app called '스쿨런치' so parents can see exactly what their children ate.",
    koreanWord: { word: '급식', romanized: 'geup-sik', meaning: 'school lunch / institutional meal' },
    tags: ['school lunch', 'education', 'food', 'nutrition'],
  },
  {
    slug: 'korean-noraebang', title: "Noraebang: Korea's Karaoke Room Culture", category: 'Lifestyle', emoji: '🏠', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '3 min',
    description: "In Korea, karaoke means private rooms with friends, not singing in front of strangers. Noraebang is a national pastime.",
    intro: "Noraebang (노래방, literally 'singing room') is everywhere in Korea — there are over 30,000 of them. Unlike Western-style karaoke bars, Korean noraebang gives you a private room with just your friends.",
    sections: [
      { heading: 'How It Works', body: "Pay by the hour ($10-15 per room), get a private room with a massive song catalog (Korean, English, Japanese, Chinese), two microphones, a TV screen, tambourines, and mood lighting. Most noraebangs have a coin system — insert coins for extra time. The song catalog includes everything from BTS to Queen to Disney songs. Scoring systems rate your singing and create friendly competition." },
      { heading: 'Coin Noraebang', body: "Coin noraebang (코인노래방) is the solo version — tiny booths for 1-2 people where you pay per song ($1-2). They're everywhere near subway stations and are perfect for practicing alone. No judgment, no audience — just you and the microphone. Many Koreans use coin noraebang as stress relief after work or school." },
    ],
    funFact: "The most-sung song in Korean noraebang history is reportedly 'Love Confession' (사랑 고백) by MBC's Kim Dong-ryul.",
    koreanWord: { word: '노래방', romanized: 'noraebang', meaning: 'singing room (karaoke)' },
    tags: ['noraebang', 'karaoke', 'entertainment', 'nightlife'],
  },
  {
    slug: 'korean-pc-bang', title: "PC Bang: Korea's 24/7 Gaming Cafes", category: 'Lifestyle', emoji: '🏠', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '4 min',
    description: "High-end gaming PCs, cup ramen, and all-night sessions for $1/hour. PC Bangs are where Korean esports culture was born.",
    intro: "Walk into a Korean PC Bang (PC방) and you'll find rows of high-spec gaming PCs, ergonomic chairs, and gamers playing League of Legends at 3 AM while eating cup ramen. Welcome to Korea's gaming culture.",
    sections: [
      { heading: 'The Experience', body: "PC Bangs charge about $1-1.50 per hour. Every PC has top-tier specs (RTX 4070+, 240Hz monitors, mechanical keyboards). All popular games are pre-installed. You can order food directly to your station — ramen, fried rice, tteokbokki, soft drinks. Many operate 24/7. Some have 'premium' sections with better chairs and larger monitors. The atmosphere is dark, neon-lit, and intensely focused." },
      { heading: 'Cultural Impact', body: "PC Bangs birthed Korean esports. StarCraft, League of Legends, and Overwatch all became massive in Korea through PC Bang culture. During the 1997 financial crisis, unemployed young people flocked to cheap PC Bangs, creating a generation of hardcore gamers. Today Korea has about 20,000 PC Bangs, and they remain central to gaming culture even as home PCs become more powerful." },
    ],
    funFact: "The Korean government passed a 'Cinderella Law' (2011-2021) that banned minors from gaming at PC Bangs between midnight and 6 AM.",
    koreanWord: { word: 'PC방', romanized: 'pi-ssi-bang', meaning: 'PC room (gaming cafe)' },
    tags: ['PC Bang', 'gaming', 'esports', 'Korean culture'],
  },
  {
    slug: 'han-river-culture', title: 'Han River: Where All of Seoul Comes to Relax', category: 'Travel', emoji: '🏙️', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=75', readTime: '3 min',
    description: "Ordering chicken to a riverside park, cycling 40km paths, and watching the sunset — Han River is Seoul's living room.",
    intro: "The Han River isn't just a river — it's Seoul's central park, picnic ground, cycling highway, and social hub. On any warm evening, thousands of Seoulites gather along its banks.",
    sections: [
      { heading: 'What People Do', image: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=700&q=75', imageAlt: 'Han River park in Seoul', body: "Order delivery chicken and beer (치맥) to your exact GPS location by the river. Rent bicycles and ride the 40km riverside path. Watch the Banpo Bridge Rainbow Fountain (the world's longest bridge fountain). Rent camping mats and tents at riverside parks. Play badminton, rollerblade, or fly kites. Watch buskers perform near bridges. Simply sit and watch the sunset over the Seoul skyline." },
      { heading: 'Best Spots', body: "Yeouido Hangang Park — Most popular, closest to downtown. Banpo Hangang Park — Rainbow fountain, floating islands. Ttukseom — Water sports, swimming pool in summer. Mangwon Hangang Park — Less crowded, local vibe. Nanji Hangang Park — Near World Cup Stadium, great sunset views. Each park has convenience stores, restrooms, and bike rental stations." },
    ],
    funFact: "Eating ramyeon by the Han River is such an iconic Korean experience that instant noodle vending machines are installed at every riverside park.",
    koreanWord: { word: '한강', romanized: 'Han-gang', meaning: 'Han River' },
    tags: ['Han River', 'Seoul', 'parks', 'picnic', 'cycling'],
  },
  {
    slug: 'korean-photo-booth', title: "Korean Photo Booths: Why 4-Cut Photos Are Everywhere", category: 'Lifestyle', emoji: '🏠', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=75', readTime: '3 min',
    description: "인생네컷, Photoism, Haru Film — Korea's photo booth craze is more than a trend. It's a cultural phenomenon.",
    intro: "Walk through any Korean shopping district and you'll see them: colorful photo booth shops packed with young Koreans taking '4-cut' photos (네컷사진). It's not just a fad — it's become a core part of Korean social life.",
    sections: [
      { heading: 'The Culture', body: "Korean photo booths (인생네컷, Photoism, Haru Film, etc.) take 4 photos in sequence, printed as a strip. But unlike Western photo booths, Korean versions offer: frame selection (hundreds of designs, including K-Pop collaborations), beauty filters applied in real-time, props and costumes, and a digital copy sent to your phone. A session costs $3-5." },
      { heading: 'Why So Popular', body: "Photo booths serve a specific social function in Korea: they create physical mementos of friendships and dates. Koreans collect photo strips in wallets, on phone cases, and on bedroom walls. It's the analog counterpart to digital selfies — something tangible to keep. Couples take them on every date. Friends take them at every gathering. Even corporate teams take group photo booth shots." },
    ],
    funFact: "인생네컷 (Life 4 Cuts) — the biggest chain — takes over 10 million photos per month across Korea.",
    koreanWord: { word: '인생네컷', romanized: 'insaeng-ne-keot', meaning: 'life four cuts (photo booth brand)' },
    tags: ['photo booth', 'selfie', 'Korean trend', '인생네컷'],
  },
];

export function getKoreaPostBySlug(slug: string): KoreaPost | undefined {
  return koreaPosts.find(p => p.slug === slug);
}

export function getPostsByCategory(category: string): KoreaPost[] {
  return koreaPosts.filter(p => p.category === category);
}
