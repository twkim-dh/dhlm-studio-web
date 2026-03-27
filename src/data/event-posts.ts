export interface EventPost {
  slug: string;
  title: string;
  titleKr: string;
  period: string;
  emoji: string;
  image: string;
  imageAlt: string;
  intro: string;
  body: string;
  tips: string[];
  location: string;
}

export const eventPosts: EventPost[] = [
  // January
  {
    slug: 'seollal', title: 'Seollal — Korean Lunar New Year', titleKr: '설날',
    period: 'Late January ~ Early February', emoji: '🎍',
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1200&q=80',
    imageAlt: 'Korean traditional ceremony',
    intro: "Seollal is Korea's most important holiday. Families travel across the country to reunite, pay respect to ancestors, and share traditional foods together.",
    body: "During Seollal, Koreans perform sebae (세배), a deep bow to elders, who then give money envelopes called sebaetdon. The essential dish is tteokguk (rice cake soup) — eating a bowl means you've aged one year. Families also play yutnori, a traditional board game, and wear hanbok.\n\nThe holiday lasts three days: the day before, the day of, and the day after. Traffic across Korea becomes extremely congested as millions travel to their hometowns. Seoul becomes quiet while smaller cities come alive.",
    tips: ['Try tteokguk at any Korean restaurant during this season', 'Visit Namsangol Hanok Village in Seoul for free cultural events', 'Expect many shops and restaurants to be closed during the holiday'],
    location: 'Nationwide',
  },
  {
    slug: 'hwacheon-ice-festival', title: 'Hwacheon Ice Festival', titleKr: '화천 산천어축제',
    period: 'January 6 ~ 28', emoji: '🐟',
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=1200&q=80',
    imageAlt: 'Winter ice fishing festival',
    intro: 'Catch mountain trout with your bare hands on a frozen river! The Hwacheon Sancheoneo Ice Festival is one of the most unique winter experiences in Korea.',
    body: "Every January, the small town of Hwacheon in Gangwon Province transforms into a winter wonderland. The river freezes solid enough for thousands of fishing holes to be drilled, and visitors try to catch sancheoneo (mountain trout) using simple fishing rods or even their bare hands.\n\nThe festival draws over 1 million visitors annually. Activities include ice sledding, ice soccer, and the famous bare-hand fishing experience where you wade into shallow icy water to grab fish. Caught fish can be grilled on-site for the freshest sashimi you'll ever taste.",
    tips: ['Dress in layers — temperatures drop to -15°C', 'Arrive early for bare-hand fishing slots', 'Take the shuttle bus from Seoul (about 2.5 hours)'],
    location: 'Hwacheon, Gangwon Province',
  },
  {
    slug: 'taebaeksan-snow-festival', title: 'Taebaeksan Snow Festival', titleKr: '태백산 눈축제',
    period: 'Mid January', emoji: '⛄',
    image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&q=80',
    imageAlt: 'Snow sculptures in Korea',
    intro: 'Giant snow sculptures, sledding, and mountain hiking in fresh powder. Taebaeksan Snow Festival celebrates winter at its finest.',
    body: "Taebaek, located in the mountains of Gangwon Province, receives some of the heaviest snowfall in Korea. The festival features massive snow and ice sculptures, snow slides, igloo-building, and traditional winter games.\n\nThe surrounding Taebaeksan Mountain offers stunning winter hiking trails covered in snow-laden trees. The area is also known for its clean air and stargazing opportunities.",
    tips: ['Combine with a visit to the nearby Taebaek Coal Museum', 'Winter hiking gear is essential for the mountain trails', 'The town is about 3 hours from Seoul by bus'],
    location: 'Taebaek, Gangwon Province',
  },
  // February
  {
    slug: 'jeju-fire-festival', title: 'Jeju Fire Festival', titleKr: '제주 들불축제',
    period: 'Late February', emoji: '🔥',
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=80',
    imageAlt: 'Jeju island landscape',
    intro: 'Watch an entire hillside set ablaze in a spectacular fire ceremony on Jeju Island. The Jeju Fire Festival is a centuries-old tradition that marks the start of spring.',
    body: "The festival takes place at Saebyeol Oreum, a volcanic cone on Jeju Island. The main event is the dramatic fire-setting of the oreum's grasslands, a traditional farming practice believed to drive out harmful insects and bring a good harvest.\n\nBeyond the fire ceremony, the festival includes traditional performances, local food stalls serving Jeju black pork and tangerines, and fireworks. The sight of flames sweeping across the hillside against the night sky is truly unforgettable.",
    tips: ['Book accommodation early — Jeju is very popular during festivals', 'Arrive before sunset to get a good viewing spot', 'Try Jeju black pork BBQ at the festival food stalls'],
    location: 'Saebyeol Oreum, Jeju Island',
  },
  {
    slug: 'valentines-day-korea', title: "Valentine's Day in Korea", titleKr: '발렌타인데이',
    period: 'February 14', emoji: '🍫',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=1200&q=80',
    imageAlt: 'Korean chocolate gifts',
    intro: "In Korea, Valentine's Day is when women give chocolate to men — not the other way around. Men return the favor on White Day (March 14).",
    body: "Korean Valentine's Day follows a unique pattern: women prepare handmade or luxury chocolates for boyfriends, crushes, or even male friends and colleagues. Shops overflow with elaborately packaged chocolate sets weeks before February 14.\n\nOne month later on March 14 (White Day), men reciprocate with candy, flowers, or gifts — often more expensive than what they received. And for those without a valentine? April 14 is 'Black Day,' when single people eat jajangmyeon (black bean noodles) together.",
    tips: ['Visit department store basement floors for premium Korean chocolates', 'Myeongdong and Gangnam have the most festive atmosphere', 'Many couples visit themed cafes for the occasion'],
    location: 'Nationwide',
  },
  // March
  {
    slug: 'jinhae-cherry-blossom', title: 'Jinhae Cherry Blossom Festival', titleKr: '진해 군항제',
    period: 'Late March ~ Early April', emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&q=80',
    imageAlt: 'Cherry blossoms in Korea',
    intro: "Korea's largest cherry blossom festival with 350,000 trees. The entire city of Jinhae turns pink for two weeks every spring.",
    body: "Jinhae Gunhangje is officially a military port festival, but it has become synonymous with cherry blossoms. The 350,000 cherry trees lining every street create pink tunnels that are breathtaking.\n\nThe most photographed spots are Yeojwacheon Stream (with cherry petals floating on water), Romance Bridge, and Gyeonghwa Station (a small train station surrounded by cherry trees). The festival draws over 2 million visitors in just 10 days.",
    tips: ['Visit on weekdays to avoid massive crowds', 'Gyeonghwa Station is best at dawn for photos without crowds', 'Take the train from Seoul to Changwon, then bus to Jinhae'],
    location: 'Jinhae, Changwon, South Gyeongsang Province',
  },
  // April
  {
    slug: 'seoul-cherry-blossom', title: 'Cherry Blossom Peak in Seoul', titleKr: '서울 벚꽃 만개',
    period: 'Early ~ Mid April', emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1200&q=80',
    imageAlt: 'Cherry blossoms along Seoul river',
    intro: "When cherry blossoms hit Seoul, the entire city transforms. Yeouido, Namsan, and Seokchon Lake become seas of pink petals.",
    body: "Seoul's cherry blossom season typically peaks in early to mid April. The most popular viewing spots are Yeouido Hangang Park (home to the Yeouido Spring Flower Festival), Seokchon Lake near Lotte World, Namsan Mountain paths, and the streets around Gyeongbokgung Palace.\n\nThe season is incredibly short — blossoms last only about 7-10 days before petals start falling. Koreans call the falling petals 'cherry blossom rain' (벚꽃비), and it's considered one of the most beautiful moments of spring.",
    tips: ['Check the Korean Meteorological Administration forecast for exact bloom dates', 'Yeouido is most magical at night with lighting', 'Bring a picnic blanket for Seokchon Lake'],
    location: 'Seoul (Yeouido, Namsan, Seokchon Lake)',
  },
  // July
  {
    slug: 'boryeong-mud-festival', title: 'Boryeong Mud Festival', titleKr: '보령 머드축제',
    period: 'Mid July', emoji: '🏖️',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    imageAlt: 'Beach festival in Korea',
    intro: "Korea's wildest festival! Get covered in mineral-rich mud at Daecheon Beach. Mud slides, mud wrestling, mud baths — pure chaos and fun.",
    body: "Started in 1998 to promote Boryeong's mineral-rich mud, the Boryeong Mud Festival has become Korea's most internationally famous festival, attracting over 3 million visitors including many foreigners.\n\nThe main attractions include giant mud slides, mud pools, mud wrestling arenas, and a mud prison. The festival also features live music, fireworks, and the famous 'mud king' competition. Boryeong mud is genuinely good for the skin — it's rich in germanium and bentonite.",
    tips: ['Wear old clothes you don\'t mind destroying', 'Book accommodation months in advance', 'Take the bus from Seoul Express Bus Terminal (about 2.5 hours)'],
    location: 'Daecheon Beach, Boryeong, South Chungcheong Province',
  },
  // September
  {
    slug: 'chuseok', title: 'Chuseok — Korean Thanksgiving', titleKr: '추석',
    period: 'September ~ October (Lunar)', emoji: '🌕',
    image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=1200&q=80',
    imageAlt: 'Korean traditional food for Chuseok',
    intro: "Chuseok is Korea's harvest festival and second-biggest holiday. Families reunite, visit ancestors' graves, and feast on songpyeon and seasonal foods.",
    body: "Chuseok falls on the 15th day of the 8th lunar month, during the full moon. Families gather to perform charye (ancestral rites), visit family graves for beolcho (grave maintenance), and share homemade songpyeon (half-moon rice cakes).\n\nThe three-day holiday sees massive traffic as millions travel to hometowns. Traditional activities include ganggangsullae (circle dance under the full moon), ssireum (Korean wrestling), and wearing hanbok. Modern celebrations include watching Chuseok TV specials and sharing gift sets of spam, tuna, or fruit.",
    tips: ['Experience traditional Chuseok activities at Namsangol Hanok Village', 'Many Seoul attractions offer free admission during Chuseok', 'Traffic is extreme — avoid driving on the first and last days'],
    location: 'Nationwide',
  },
  // October
  {
    slug: 'autumn-foliage', title: 'Autumn Foliage Peak', titleKr: '단풍 절정',
    period: 'Mid ~ Late October', emoji: '🍁',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&q=80',
    imageAlt: 'Korean autumn foliage',
    intro: "Korea's mountains explode with red, orange, and gold. Seoraksan, Naejangsan, and Bukhansan offer some of the most stunning fall colors in Asia.",
    body: "Korean autumn foliage typically starts in late September at Seoraksan in the north and moves southward, reaching peak around mid-to-late October in most areas. Naejangsan in the south peaks in early November.\n\nThe most popular spots include Seoraksan National Park (earliest and most dramatic), Naejangsan (famous for its tunnel of maple trees), Bukhansan near Seoul, and Gyeongju's historic sites surrounded by fall colors. The contrast of ancient temples against fiery red maples is uniquely Korean.",
    tips: ['Seoraksan peaks first (early Oct), Naejangsan last (early Nov)', 'Weekday visits are essential — weekend crowds are enormous', 'Bukhansan is the easiest option from Seoul (1 hour by subway)'],
    location: 'Seoraksan, Naejangsan, Bukhansan, Gyeongju',
  },
  {
    slug: 'busan-film-festival', title: 'Busan International Film Festival', titleKr: '부산국제영화제',
    period: 'Early October', emoji: '🎬',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80',
    imageAlt: 'Film festival red carpet',
    intro: "Asia's largest film festival brings movie stars, directors, and film lovers to Busan's Haeundae district every October.",
    body: "Founded in 1996, BIFF has grown into one of the world's most prestigious film festivals, screening over 300 films from 70+ countries. The main venue is the Busan Cinema Center, an architectural marvel in Centum City.\n\nBeyond screenings, BIFF features outdoor cinema at Haeundae Beach, the Asian Film Market, masterclasses with renowned directors, and of course, celebrity sightings on the red carpet. The festival creates a unique atmosphere where art-house cinema meets beach-town casual.",
    tips: ['Book tickets online early — popular screenings sell out fast', 'The outdoor screenings at Haeundae Beach are free', 'Combine with visiting Gamcheon Culture Village and Jagalchi Fish Market'],
    location: 'Busan Cinema Center, Haeundae, Busan',
  },
  // December
  {
    slug: 'christmas-korea', title: 'Christmas in Korea', titleKr: '크리스마스',
    period: 'December 25', emoji: '🎄',
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=1200&q=80',
    imageAlt: 'Christmas lights in Seoul',
    intro: "In Korea, Christmas is primarily a couple's holiday, not a family gathering. Think Valentine's Day with Christmas lights.",
    body: "While Christmas is a public holiday in Korea, it's celebrated quite differently from the West. Young couples dress up, exchange gifts, eat Christmas cake (usually a strawberry cream cake), and walk through illuminated streets.\n\nThe most popular Christmas date spots include Myeongdong (massive Christmas decorations), Cheonggyecheon Stream (Seoul Lantern Festival), Starfield Library in COEX, and various themed cafes. Families with young children might visit Lotte World or Everland. Church services on Christmas Eve are also well-attended, as about 30% of Koreans are Christian.",
    tips: ['Myeongdong has the most spectacular Christmas decorations', 'Reserve restaurants weeks in advance — it\'s the busiest dining night', 'Seoul Lantern Festival at Cheonggyecheon is free and beautiful'],
    location: 'Seoul (Myeongdong, Cheonggyecheon, Gangnam)',
  },
];

export function getEventBySlug(slug: string): EventPost | undefined {
  return eventPosts.find(p => p.slug === slug);
}
