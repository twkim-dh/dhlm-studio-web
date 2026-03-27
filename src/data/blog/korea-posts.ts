export interface KoreaPost {
  slug: string;
  title: string;
  category: string;
  emoji: string;
  readTime: string;
  description: string;
  intro: string;
  sections: { heading: string; body: string }[];
  funFact: string;
  koreanWord: { word: string; romanized: string; meaning: string };
  tags: string[];
}

export const koreaPosts: KoreaPost[] = [
  // ═══ Beliefs & Superstitions ═══
  {
    slug: 'red-ink-death', title: 'Why Koreans Never Write Names in Red Ink', category: 'Beliefs', emoji: '🔮', readTime: '3 min',
    description: 'In Korea, writing someone\'s name in red ink is associated with death. Learn the history behind this superstition.',
    intro: 'Hand someone a red pen in Korea and ask them to write their name. Watch their reaction — most will politely refuse. Writing a living person\'s name in red ink is one of Korea\'s strongest taboos.',
    sections: [
      { heading: 'The Origin', body: 'In traditional Korea, the names of deceased people were written in red ink on family registers and funeral banners. Red ink on a name essentially marked that person as dead. This practice dates back centuries to Confucian record-keeping traditions.' },
      { heading: 'Modern Korea', body: 'Even today, most Koreans avoid red ink for names. Teachers never grade papers with red-inked names. Business cards in red would be shocking. The superstition is so deeply embedded that even young Koreans who don\'t believe in it still feel uncomfortable.' },
    ],
    funFact: 'Korean prison documents historically used red ink for death row inmates\' names.',
    koreanWord: { word: '빨간색', romanized: 'ppalgansaek', meaning: 'red color' },
    tags: ['superstition', 'red ink', 'Korean culture', 'death taboo'],
  },
  {
    slug: 'fan-death', title: 'Fan Death: Korea\'s Most Famous Urban Legend', category: 'Beliefs', emoji: '🔮', readTime: '4 min',
    description: 'Many Koreans believe sleeping with an electric fan on in a closed room can kill you. Here\'s why.',
    intro: 'Ask any Korean about sleeping with a fan on in a closed room. Many will genuinely warn you it could be fatal. Welcome to "fan death" — Korea\'s most uniquely Korean urban legend.',
    sections: [
      { heading: 'The Belief', body: 'Fan death (선풍기 사망) is the belief that an electric fan running overnight in a sealed room can cause death by hypothermia or suffocation. Korean media has reported fan death cases for decades, and many electric fans sold in Korea come with auto-off timers specifically for this reason.' },
      { heading: 'Why It Persists', body: 'Scientists have debunked fan death repeatedly, but the belief persists. Some theories suggest the government promoted the myth during energy crises to reduce electricity usage. Others point to confirmation bias — when someone dies in a room with a fan, the fan gets blamed.' },
    ],
    funFact: 'Korean electric fans are often sold with built-in timers that automatically shut off after a set period.',
    koreanWord: { word: '선풍기', romanized: 'seonpunggi', meaning: 'electric fan' },
    tags: ['urban legend', 'fan death', 'Korean belief', 'superstition'],
  },
  {
    slug: 'number-four', title: 'Why Korean Buildings Skip the 4th Floor', category: 'Beliefs', emoji: '🔮', readTime: '3 min',
    description: 'The number 4 sounds like "death" in Korean. Many buildings skip the 4th floor entirely.',
    intro: 'Step into a Korean elevator and look at the buttons. You might notice something odd: there\'s no 4th floor. Instead, you\'ll see "F" — or the floor simply doesn\'t exist.',
    sections: [
      { heading: 'Why Four is Feared', body: 'The Korean word for four (사, sa) sounds identical to the word for death (死, sa). This tetraphobia (fear of four) is shared across East Asia but is particularly strong in Korea. Many buildings, hospitals, and apartments skip the 4th floor entirely, labeling it "F" (for four) instead.' },
      { heading: 'How Deep It Goes', body: 'The avoidance extends beyond buildings. Many Koreans avoid giving gifts in sets of four. Phone numbers with multiple 4s are considered unlucky. Hospital rooms ending in 4 are often avoided. Some apartment complexes skip all floors with 4 — no 4th, 14th, 24th, or 34th floors.' },
    ],
    funFact: 'Some Korean hospitals skip room numbers containing 4 entirely, jumping from 403 to 405.',
    koreanWord: { word: '사', romanized: 'sa', meaning: 'four / death' },
    tags: ['number 4', 'tetraphobia', 'elevator', 'death'],
  },
  {
    slug: 'dream-pigs', title: 'Dreaming of Pigs Means You\'ll Get Rich', category: 'Beliefs', emoji: '🔮', readTime: '3 min',
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
    slug: 'shoe-gift', title: 'Never Gift Shoes to Your Korean Lover', category: 'Beliefs', emoji: '🔮', readTime: '3 min',
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
    slug: 'korean-bbq-guide', title: 'Korean BBQ: The Complete Guide for Beginners', category: 'Food', emoji: '🍜', readTime: '5 min',
    description: 'Everything you need to know about Korean BBQ — from ordering to grilling to the unwritten rules.',
    intro: 'Korean BBQ is more than a meal — it\'s a social ritual. Grilling meat at your table, wrapping it in lettuce with garlic and ssamjang, and sharing soju with friends. Here\'s how to do it right.',
    sections: [
      { heading: 'How to Order', body: 'Most Korean BBQ restaurants require a minimum of 2 servings per meat type. Popular cuts include samgyeopsal (pork belly), galbi (marinated short ribs), and chadol (beef brisket). Don\'t worry about grilling — the staff usually handles the first round.' },
      { heading: 'The Art of the Wrap', body: 'Take a piece of lettuce (ssam), add a slice of grilled meat, a thin slice of raw garlic, a dab of ssamjang (spicy paste), and optionally some rice. Fold it into a neat pocket and eat in one bite. Never take two bites — it\'s considered bad form.' },
      { heading: 'Unwritten Rules', body: 'The youngest person pours drinks for elders. Turn your head away when drinking with someone older. Don\'t start eating until the eldest person begins. And most importantly — don\'t flip the meat too often. Once on each side is ideal.' },
    ],
    funFact: 'Koreans consume about 27kg of pork per person annually, making Korea one of the world\'s top pork consumers.',
    koreanWord: { word: '삼겹살', romanized: 'samgyeopsal', meaning: 'three-layer pork belly' },
    tags: ['BBQ', 'Korean food', 'samgyeopsal', 'dining guide'],
  },
  {
    slug: 'soju-drinking-rules', title: 'Soju Drinking Rules: 7 Things You Must Know', category: 'Food', emoji: '🍜', readTime: '4 min',
    description: 'Korean drinking culture has strict unwritten rules. Break them and you\'ll get looks. Here\'s the survival guide.',
    intro: 'Soju is Korea\'s national drink — a clear spirit that fuels every Korean social gathering. But drinking soju comes with a set of unwritten rules that every foreigner should know.',
    sections: [
      { heading: 'The 7 Rules', body: '1. Never pour your own drink — wait for someone else to pour for you.\n2. When someone older pours for you, hold your glass with both hands.\n3. Turn away from elders when you drink.\n4. The youngest person at the table pours for everyone else.\n5. Never let someone\'s glass stay empty.\n6. The first shot is done together — everyone cheers and drinks at once.\n7. Don\'t refuse the first drink offered by a senior.' },
      { heading: 'Why It Matters', body: 'Korean drinking culture is deeply tied to hierarchy and respect. These rules aren\'t just etiquette — they demonstrate awareness of social relationships. Following them shows respect, and Koreans will genuinely appreciate a foreigner who knows the customs.' },
    ],
    funFact: 'Jinro Soju is the world\'s best-selling spirit brand, outselling even vodka globally.',
    koreanWord: { word: '건배', romanized: 'geonbae', meaning: 'cheers (empty glass)' },
    tags: ['soju', 'drinking culture', 'etiquette', 'Korean rules'],
  },
  {
    slug: 'street-food-top10', title: 'Top 10 Korean Street Foods You Must Try', category: 'Food', emoji: '🍜', readTime: '4 min',
    description: 'From tteokbokki to hotteok, the definitive guide to Korean street food.',
    intro: 'Korean street food is legendary. Every market, subway exit, and university area has vendors selling snacks that are cheap, delicious, and uniquely Korean.',
    sections: [
      { heading: 'The Essential 10', body: '1. Tteokbokki (떡볶이) — Spicy rice cakes in gochujang sauce. The #1 street food.\n2. Hotteok (호떡) — Sweet pancakes filled with brown sugar and nuts.\n3. Eomuk (어묵) — Fish cake skewers in warm broth. Perfect in winter.\n4. Sundae (순대) — Korean blood sausage with glass noodles. Better than it sounds.\n5. Tornado Potato — Spiral-cut potato on a stick. Crispy and fun.\n6. Bungeoppang (붕어빵) — Fish-shaped pastry with red bean filling.\n7. Gyeranppang (계란빵) — Egg bread. A whole egg baked into sweet bread.\n8. Ttankkongppang (땅콩빵) — Peanut bread. Cute peanut shape.\n9. Dakkochi (닭꼬치) — Sweet-spicy chicken skewers.\n10. Gimbap (김밥) — Korean rice rolls. The perfect grab-and-go food.' },
      { heading: 'Where to Find Them', body: 'The best street food areas in Seoul: Gwangjang Market (the OG), Myeongdong (tourist-friendly), Hongdae (university vibes), and Dongdaemun (late-night). Each market has its own specialty — Gwangjang is famous for bindaetteok (mung bean pancakes), while Myeongdong excels at egg bread.' },
    ],
    funFact: 'Tteokbokki was originally a royal court dish made with soy sauce, not gochujang. The spicy version we know today was invented in the 1950s.',
    koreanWord: { word: '떡볶이', romanized: 'tteokbokki', meaning: 'spicy stir-fried rice cakes' },
    tags: ['street food', 'tteokbokki', 'market', 'snacks'],
  },
  {
    slug: 'korean-fried-chicken', title: 'Why Korean Fried Chicken Conquered the World', category: 'Food', emoji: '🍜', readTime: '4 min',
    description: 'Korean fried chicken is different. Double-fried for extra crunch, glazed with addictive sauces. Here\'s the story.',
    intro: 'There\'s a reason Korean fried chicken has gone global. The secret? It\'s fried twice — resulting in an impossibly crispy exterior that stays crunchy even after being drenched in sauce.',
    sections: [
      { heading: 'The Double-Fry Secret', body: 'Korean fried chicken is fried at a lower temperature first, then fried again at a higher temperature. This double-frying technique renders out more fat and creates a thin, glass-like crust that stays crispy for hours. Japanese karaage is fried once; American fried chicken uses thick batter. Korean chicken is thin-crusted and crackling.' },
      { heading: 'The Culture of Chimaek', body: 'Chimaek (치맥) = chicken + maekju (beer). It\'s not just food — it\'s a Korean institution. Koreans order fried chicken delivery to parks, rivers, and even movie theaters. Eating fried chicken while watching Korean baseball or soccer is a national pastime. The delivery culture means fresh fried chicken arrives at your door in 30 minutes.' },
    ],
    funFact: 'Korea has more fried chicken restaurants than McDonald\'s locations worldwide.',
    koreanWord: { word: '치맥', romanized: 'chimaek', meaning: 'chicken + beer (the ultimate combo)' },
    tags: ['fried chicken', 'chimaek', 'Korean food', 'delivery'],
  },
  {
    slug: 'korean-convenience-store', title: 'Korean Convenience Store Food: Better Than Restaurants?', category: 'Food', emoji: '🍜', readTime: '4 min',
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
    slug: 'kpop-trainee-life', title: 'K-Pop Trainee Life: 7 Years of Practice', category: 'K-Culture', emoji: '🎵', readTime: '5 min',
    description: 'What does it take to become a K-Pop idol? Years of training, strict diets, and an uncertain future.',
    intro: 'Behind every K-Pop group\'s perfect performance are years of grueling training. Most trainees start at 13-15 years old, practice 12+ hours daily, and many never debut.',
    sections: [
      { heading: 'The Training System', body: 'K-Pop agencies (like HYBE, SM, JYP, YG) recruit trainees through auditions. Once selected, trainees move into dormitories and follow a strict schedule: vocal lessons, dance practice, language classes (Japanese, English, Chinese), and sometimes acting lessons. The average training period is 3-7 years. Some trainees train for over a decade.' },
      { heading: 'The Dark Side', body: 'Training isn\'t free — some companies charge trainees for training costs, which must be repaid from future earnings. Diet restrictions are extreme. Privacy is limited. And after years of training, many are eliminated before debut. The pressure creates immense stress, and the industry has faced criticism for its treatment of young trainees.' },
    ],
    funFact: 'BTS member Jungkook was scouted by 7 different agencies after his audition, but chose HYBE (then Big Hit) because of RM.',
    koreanWord: { word: '연습생', romanized: 'yeonseup-saeng', meaning: 'trainee (practice student)' },
    tags: ['K-Pop', 'trainee', 'idol', 'HYBE', 'SM'],
  },
  {
    slug: 'kdrama-tropes', title: '10 K-Drama Tropes That Always Happen', category: 'K-Culture', emoji: '🎵', readTime: '4 min',
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
    slug: 'hallyu-wave', title: 'Hallyu Wave: How Korean Culture Took Over the World', category: 'K-Culture', emoji: '🎵', readTime: '5 min',
    description: 'From BTS to Squid Game to K-Beauty — how Korea became the world\'s cultural superpower.',
    intro: 'In 2000, almost nobody outside Asia knew Korean pop culture existed. By 2025, BTS sells out stadiums worldwide, Korean dramas dominate Netflix, and Korean skincare is in every bathroom. What happened?',
    sections: [
      { heading: 'The Three Waves', body: 'Wave 1 (late 1990s): K-Dramas spread across Asia, starting with "Winter Sonata" in Japan. Wave 2 (2010s): K-Pop goes global — PSY\'s Gangnam Style, BTS, BLACKPINK. Wave 3 (2020s): Korean content dominates streaming — Squid Game, Parasite wins Oscar, K-Beauty and K-Food become global trends.' },
      { heading: 'Why Korea Succeeded', body: 'Korea invested heavily in cultural exports as a national strategy. The government supports the entertainment industry. Korean companies perfected the "idol system" for K-Pop. And Korean content fills a gap — it\'s emotionally rich, production quality is high, and it offers a perspective different from Hollywood. The internet and streaming platforms removed distribution barriers, allowing Korean content to reach global audiences directly.' },
    ],
    funFact: 'The Korean Wave generates over $12 billion annually in exports, and K-Pop alone accounts for about $5 billion.',
    koreanWord: { word: '한류', romanized: 'hallyu', meaning: 'Korean Wave (cultural influence)' },
    tags: ['Hallyu', 'Korean Wave', 'BTS', 'cultural export'],
  },
  // ═══ Travel ═══
  {
    slug: 'seoul-neighborhoods', title: 'Seoul Neighborhoods Guide: 15 Areas Explained', category: 'Travel', emoji: '🏙️', readTime: '6 min',
    description: 'Each Seoul neighborhood has its own personality. Gangnam is different from Hongdae is different from Itaewon.',
    intro: 'Seoul isn\'t one city — it\'s dozens of distinct neighborhoods, each with its own vibe. Knowing which area suits you can make or break your trip.',
    sections: [
      { heading: 'The Key Areas', body: 'Gangnam — Luxury, K-Pop agencies, high-end shopping. Think Apgujeong and Cheongdam.\nHongdae — University area, indie music, street art, nightlife.\nItaewon — International food, diverse crowd, LGBTQ-friendly.\nMyeongdong — Shopping and street food mecca for tourists.\nInsadong — Traditional crafts, tea houses, galleries.\nBukchon — Hanok village, Instagram-worthy traditional houses.\nSeongsu — "Brooklyn of Seoul." Cafes, art spaces, pop-ups.\nYeonnam-dong — Quiet cafes, local food, relaxed vibes.\nGwangjang Market — The original street food market.\nDongdaemun — Fashion wholesale, 24-hour shopping.\nJamsil — Lotte World, sports stadiums, family-friendly.\nYeouido — Business district, Han River park, cherry blossoms.\nHaebangchon — Expat neighborhood, rooftop bars.\nMangwon — Local markets, bakeries, residential charm.\nSamcheong-dong — Art galleries, quiet streets near palaces.' },
    ],
    funFact: 'Seoul\'s subway has 23 lines and over 700 stations, making it one of the world\'s most comprehensive metro systems.',
    koreanWord: { word: '동네', romanized: 'dongne', meaning: 'neighborhood' },
    tags: ['Seoul', 'neighborhoods', 'Gangnam', 'Hongdae', 'travel guide'],
  },
  {
    slug: 'jeju-island-guide', title: 'Jeju Island: Korea\'s Hawaii', category: 'Travel', emoji: '🏙️', readTime: '5 min',
    description: 'Volcanic landscapes, tangerine groves, and pristine beaches. Jeju is Korea\'s tropical paradise.',
    intro: 'Jeju Island is where Koreans go to escape. A volcanic island off the southern coast, it offers stunning scenery, unique food, and a laid-back atmosphere completely different from mainland Korea.',
    sections: [
      { heading: 'Must-See Spots', body: 'Hallasan Mountain — Korea\'s highest peak. Hike to the crater lake at the summit.\nSeongsan Ilchulbong — Dramatic volcanic crater by the sea. Best at sunrise.\nManjanggul Cave — One of the world\'s longest lava tubes.\nCheonjiyeon Waterfall — Surrounded by subtropical forest.\nHyeopjae Beach — Turquoise water with Hallasan views.\nJeju Haenyeo — Watch the famous female divers harvest seafood.' },
      { heading: 'What to Eat', body: 'Jeju black pork (흑돼지) — Grilled at your table, incredibly flavorful. Abalone porridge (전복죽) — Jeju\'s signature breakfast. Hallabong tangerines — Sweet citrus only grown on Jeju. Haemul-tang (해물탕) — Seafood stew with everything fresh from the ocean.' },
    ],
    funFact: 'Jeju has its own language (Jejueo) which is so different from Korean that UNESCO classified it as a critically endangered language.',
    koreanWord: { word: '해녀', romanized: 'haenyeo', meaning: 'female diver (Jeju diving women)' },
    tags: ['Jeju', 'island', 'travel', 'Hallasan', 'beach'],
  },
  {
    slug: 'korean-temple-stay', title: 'Korean Temple Stay: What to Expect', category: 'Travel', emoji: '🏙️', readTime: '4 min',
    description: 'Sleep in a Buddhist temple, wake at 4 AM for chanting, eat temple food, and find inner peace.',
    intro: 'Templestay is one of Korea\'s most unique experiences. For $30-60, you sleep in a 1,000-year-old temple, eat vegetarian temple food, and follow the monks\' daily routine.',
    sections: [
      { heading: 'A Typical Day', body: '3:30 AM — Wake up bell. 4:00 AM — Morning chanting (yebul). 6:00 AM — Breakfast (temple food — all vegetarian, no garlic/onion). 8:00 AM — Tea ceremony with a monk. 10:00 AM — Meditation or hiking. 12:00 PM — Lunch. 2:00 PM — Lotus lantern making or Buddhist bead crafting. 5:00 PM — Dinner (the last meal of the day). 7:00 PM — Evening meditation. 9:00 PM — Lights out.' },
      { heading: 'Temple Food', body: 'Korean temple food (사찰음식) is a UNESCO-recognized culinary tradition. No meat, no garlic, no onion, no leek, no green onion — yet it\'s incredibly flavorful. Monks use fermentation, wild herbs, and seasonal ingredients. The food is so respected that some temple food restaurants in Seoul have Michelin stars.' },
    ],
    funFact: 'Jogyesa Temple in central Seoul is only 10 minutes from the busiest shopping district, Myeongdong.',
    koreanWord: { word: '사찰', romanized: 'sachal', meaning: 'Buddhist temple' },
    tags: ['temple stay', 'Buddhism', 'meditation', 'temple food'],
  },
  // ═══ Language ═══
  {
    slug: 'hangul-one-hour', title: 'Learn Hangul in 1 Hour: The Complete Guide', category: 'Language', emoji: '🗣️', readTime: '5 min',
    description: 'Korean alphabet is considered the most scientific writing system in the world. And you can learn it in an hour.',
    intro: 'Hangul, the Korean alphabet, was designed by King Sejong in 1443 specifically to be easy to learn. Unlike Chinese characters or Japanese kanji, Hangul is logical, phonetic, and learnable in a single afternoon.',
    sections: [
      { heading: 'The Basics', body: '14 consonants and 10 vowels — that\'s all you need. The consonants are designed to mimic the shape of your mouth when you make the sound. ㄱ (g) looks like the back of the tongue. ㄴ (n) looks like the tongue touching the roof of the mouth. ㅁ (m) looks like lips together. It\'s literally a diagram of how to make the sound.' },
      { heading: 'Building Blocks', body: 'Korean syllables are built in blocks: consonant + vowel (+ optional final consonant). For example: 한 = ㅎ(h) + ㅏ(a) + ㄴ(n) = "han". 국 = ㄱ(g) + ㅜ(u) + ㄱ(k) = "guk". Put them together: 한국 = "Hanguk" = Korea. Once you understand the system, you can sound out any Korean word.' },
    ],
    funFact: 'UNESCO created the King Sejong Literacy Prize in honor of Hangul\'s contribution to global literacy.',
    koreanWord: { word: '한글', romanized: 'Hangeul', meaning: 'Korean alphabet' },
    tags: ['Hangul', 'Korean alphabet', 'learn Korean', 'King Sejong'],
  },
  {
    slug: 'oppa-meaning', title: 'What Does "Oppa" Really Mean?', category: 'Language', emoji: '🗣️', readTime: '3 min',
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
    slug: 'hoesik-work-dinner', title: 'Hoesik: Korea\'s Mandatory Work Dinners', category: 'Work', emoji: '💼', readTime: '4 min',
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
    slug: 'ppalli-ppalli', title: 'Ppalli Ppalli: Korea\'s Obsession with Speed', category: 'Work', emoji: '💼', readTime: '3 min',
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
    slug: 'kakao-everything', title: 'KakaoTalk: The App That Runs Korea', category: 'Tech', emoji: '📱', readTime: '4 min',
    description: 'Forget WhatsApp. In Korea, KakaoTalk is messaging, banking, taxi, shopping, and everything else.',
    intro: '93% of South Koreans use KakaoTalk. It\'s not just a messaging app — it\'s the operating system of Korean daily life. If you\'re not on Kakao, you basically don\'t exist in Korea.',
    sections: [
      { heading: 'More Than Messaging', body: 'KakaoTalk started as a simple messenger in 2010. Today the Kakao ecosystem includes: KakaoBank (banking), KakaoTaxi (like Uber), KakaoPay (mobile payments), KakaoMap (navigation), KakaoStyle (fashion), and dozens more. Businesses send official messages through Kakao. Government notifications come through Kakao. Even your building\'s security system connects to Kakao.' },
      { heading: 'Why Not WhatsApp/Line?', body: 'KakaoTalk won Korea because it was free at a time when Korean carriers charged per text message. By offering free messaging over WiFi, Kakao exploded overnight. By the time competitors arrived, Kakao had become too embedded in Korean infrastructure to replace. The network effect is absolute — everyone is on Kakao because everyone is on Kakao.' },
    ],
    funFact: 'When KakaoTalk servers went down for a few hours in 2022, it caused national disruption — people couldn\'t access banking, taxis, or even government services.',
    koreanWord: { word: '카톡', romanized: 'ka-tok', meaning: 'KakaoTalk (abbreviated)' },
    tags: ['KakaoTalk', 'Korean apps', 'technology', 'messaging'],
  },
  {
    slug: 'naver-not-google', title: 'Why Koreans Use Naver, Not Google', category: 'Tech', emoji: '📱', readTime: '3 min',
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
];

export function getKoreaPostBySlug(slug: string): KoreaPost | undefined {
  return koreaPosts.find(p => p.slug === slug);
}

export function getPostsByCategory(category: string): KoreaPost[] {
  return koreaPosts.filter(p => p.category === category);
}
