// World Lottery data & generator — uses crypto.getRandomValues()

export interface LotteryDef {
  id: string;
  name: string;
  country: string;
  flag: string;
  mainNumbers: { min: number; max: number; count: number };
  bonusNumbers: { min: number; max: number; count: number; name: string } | null;
  drawDays: string[];
  color: string;
  seoTitle: string;
  seoDesc: string;
  ageRestriction: string;
  // Localized UI strings
  lang: {
    title: string;        // page title in local language
    generate: string;     // "Generate" button
    copy: string;         // "Copy" button
    share: string;        // "Share" button
    sets: string;         // "Sets" label
    numbers: string;      // "numbers" label
    draw: string;         // "Draw days" label
    result: string;       // "Your numbers" label
    disclaimer: string;   // disclaimer text
    otherLotteries: string; // "Other lotteries"
  };
}

export interface GeneratedResult {
  main: number[];
  bonus: number[] | null;
  bonusName: string | null;
}

function cryptoPick(min: number, max: number, count: number): number[] {
  const range = max - min + 1;
  const result: number[] = [];
  while (result.length < count) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const n = (arr[0] % range) + min;
    if (!result.includes(n)) result.push(n);
  }
  return result.sort((a, b) => a - b);
}

export function generateLottery(lottery: LotteryDef, sets: number = 1): GeneratedResult[] {
  const results: GeneratedResult[] = [];
  for (let i = 0; i < sets; i++) {
    const main = cryptoPick(lottery.mainNumbers.min, lottery.mainNumbers.max, lottery.mainNumbers.count);
    let bonus: number[] | null = null;
    if (lottery.bonusNumbers) {
      bonus = cryptoPick(lottery.bonusNumbers.min, lottery.bonusNumbers.max, lottery.bonusNumbers.count);
    }
    results.push({ main, bonus, bonusName: lottery.bonusNumbers?.name || null });
  }
  return results;
}

const EN = { title: 'Lucky Numbers', generate: 'Generate', copy: 'Copy', share: 'Share', sets: 'Sets', numbers: 'numbers', draw: 'Draw', result: 'Your Numbers', disclaimer: 'Random number generator for entertainment only. Not affiliated with any official lottery.', otherLotteries: 'Other Lotteries' };

export const worldLotteries: LotteryDef[] = [
  {
    id: 'korea-lotto',
    name: 'Lotto 6/45',
    country: '🇰🇷',
    flag: 'kr',
    mainNumbers: { min: 1, max: 45, count: 6 },
    bonusNumbers: null,
    drawDays: ['토요일'],
    color: '#8B2500',
    seoTitle: 'Korea Lotto 6/45 Number Generator',
    seoDesc: 'Generate random Korea Lotto 6/45 numbers. Free lottery number picker with secure random generation.',
    ageRestriction: '만 18세 이상',
    lang: { title: '행운의 번호', generate: '번호 생성', copy: '복사', share: '공유', sets: '세트', numbers: '개 번호', draw: '추첨일', result: '당신의 번호', disclaimer: '번호 생성만 제공하며 구매 대행은 하지 않습니다.', otherLotteries: '다른 복권' },
  },
  {
    id: 'us-powerball',
    name: 'Powerball',
    country: '🇺🇸',
    flag: 'us',
    mainNumbers: { min: 1, max: 69, count: 5 },
    bonusNumbers: { min: 1, max: 26, count: 1, name: 'Powerball' },
    drawDays: ['Mon', 'Wed', 'Sat'],
    color: '#DC2626',
    seoTitle: 'Free Powerball Number Generator',
    seoDesc: 'Generate random Powerball numbers instantly. Pick 5 numbers (1-69) + 1 Powerball (1-26). Free & secure.',
    ageRestriction: '18+ (varies by state)',
    lang: EN,
  },
  {
    id: 'us-megamillions',
    name: 'Mega Millions',
    country: '🇺🇸',
    flag: 'us',
    mainNumbers: { min: 1, max: 70, count: 5 },
    bonusNumbers: { min: 1, max: 25, count: 1, name: 'Mega Ball' },
    drawDays: ['Tue', 'Fri'],
    color: '#F59E0B',
    seoTitle: 'Free Mega Millions Number Generator',
    seoDesc: 'Generate Mega Millions numbers. Pick 5 (1-70) + 1 Mega Ball (1-25). Cryptographically secure random.',
    ageRestriction: '18+ (varies by state)',
    lang: EN,
  },
  {
    id: 'euromillions',
    name: 'EuroMillions',
    country: '🇪🇺',
    flag: 'eu',
    mainNumbers: { min: 1, max: 50, count: 5 },
    bonusNumbers: { min: 1, max: 12, count: 2, name: 'Lucky Stars' },
    drawDays: ['Mar', 'Ven'],
    color: '#2563EB',
    seoTitle: 'Free EuroMillions Number Generator',
    seoDesc: 'Générateur de numéros EuroMillions. 5 numéros (1-50) + 2 étoiles (1-12). Gratuit et sécurisé.',
    ageRestriction: '18+',
    lang: { title: 'Vos numéros chanceux', generate: 'Générer', copy: 'Copier', share: 'Partager', sets: 'Grilles', numbers: 'numéros', draw: 'Tirage', result: 'Vos numéros', disclaimer: 'Générateur aléatoire à but récréatif uniquement. Non affilié à une loterie officielle.', otherLotteries: 'Autres loteries' },
  },
  {
    id: 'eurojackpot',
    name: 'EuroJackpot',
    country: '🇪🇺',
    flag: 'eu',
    mainNumbers: { min: 1, max: 50, count: 5 },
    bonusNumbers: { min: 1, max: 12, count: 2, name: 'Euro Numbers' },
    drawDays: ['Di', 'Fr'],
    color: '#7C3AED',
    seoTitle: 'Kostenloser EuroJackpot Zahlengenerator',
    seoDesc: 'EuroJackpot Zahlen generieren. 5 Zahlen (1-50) + 2 Eurozahlen (1-12). Kostenlos & sicher.',
    ageRestriction: '18+',
    lang: { title: 'Ihre Glückszahlen', generate: 'Generieren', copy: 'Kopieren', share: 'Teilen', sets: 'Tipps', numbers: 'Zahlen', draw: 'Ziehung', result: 'Ihre Zahlen', disclaimer: 'Zufallsgenerator nur zur Unterhaltung. Nicht mit einer offiziellen Lotterie verbunden.', otherLotteries: 'Andere Lotterien' },
  },
  {
    id: 'uk-lottery',
    name: 'UK National Lottery',
    country: '🇬🇧',
    flag: 'gb',
    mainNumbers: { min: 1, max: 59, count: 6 },
    bonusNumbers: null,
    drawDays: ['Wed', 'Sat'],
    color: '#1D4ED8',
    seoTitle: 'Free UK Lottery Number Generator',
    seoDesc: 'Generate UK National Lottery numbers. Pick 6 numbers from 1-59. Free random number generator.',
    ageRestriction: '18+',
    lang: EN,
  },
  {
    id: 'japan-loto6',
    name: 'ロト6',
    country: '🇯🇵',
    flag: 'jp',
    mainNumbers: { min: 1, max: 43, count: 6 },
    bonusNumbers: null,
    drawDays: ['月曜', '木曜'],
    color: '#DC2626',
    seoTitle: 'ロト6 番号ジェネレーター — 無料',
    seoDesc: 'ロト6の番号を無料で生成。1～43から6つの番号をランダムに選択。安全な乱数生成。',
    ageRestriction: '20歳以上',
    lang: { title: 'ラッキーナンバー', generate: '番号生成', copy: 'コピー', share: '共有', sets: '口数', numbers: 'つの番号', draw: '抽選日', result: 'あなたの番号', disclaimer: '娯楽目的のランダム番号生成器です。公式の宝くじとは関係ありません。', otherLotteries: '他のくじ' },
  },
  {
    id: 'australia-powerball',
    name: 'Powerball AU',
    country: '🇦🇺',
    flag: 'au',
    mainNumbers: { min: 1, max: 35, count: 7 },
    bonusNumbers: { min: 1, max: 20, count: 1, name: 'Powerball' },
    drawDays: ['Thu'],
    color: '#16A34A',
    seoTitle: 'Free Australian Powerball Number Generator',
    seoDesc: 'Generate Australian Powerball numbers. Pick 7 (1-35) + 1 Powerball (1-20). Free & secure.',
    ageRestriction: '18+',
    lang: EN,
  },
  {
    id: 'brazil-megasena',
    name: 'Mega-Sena',
    country: '🇧🇷',
    flag: 'br',
    mainNumbers: { min: 1, max: 60, count: 6 },
    bonusNumbers: null,
    drawDays: ['Qua', 'Sáb'],
    color: '#16A34A',
    seoTitle: 'Gerador de Números da Mega-Sena — Grátis',
    seoDesc: 'Gere números da Mega-Sena. Escolha 6 números de 1 a 60. Gerador aleatório gratuito e seguro.',
    ageRestriction: '18+',
    lang: { title: 'Seus números da sorte', generate: 'Gerar', copy: 'Copiar', share: 'Compartilhar', sets: 'Jogos', numbers: 'números', draw: 'Sorteio', result: 'Seus números', disclaimer: 'Gerador aleatório apenas para entretenimento. Não é afiliado a nenhuma loteria oficial.', otherLotteries: 'Outras loterias' },
  },
  {
    id: 'canada-lottomax',
    name: 'Lotto Max',
    country: '🇨🇦',
    flag: 'ca',
    mainNumbers: { min: 1, max: 50, count: 7 },
    bonusNumbers: null,
    drawDays: ['Tue', 'Fri'],
    color: '#DC2626',
    seoTitle: 'Free Lotto Max Number Generator',
    seoDesc: 'Generate Lotto Max numbers. Pick 7 from 1-50. Free Canadian lottery number picker.',
    ageRestriction: '18+',
    lang: EN,
  },
  // ═══ Europe ═══
  {
    id: 'germany-6aus49', name: 'Lotto 6aus49', country: '🇩🇪', flag: 'de',
    mainNumbers: { min: 1, max: 49, count: 6 },
    bonusNumbers: { min: 0, max: 9, count: 1, name: 'Superzahl' },
    drawDays: ['Mi', 'Sa'], color: '#DC2626',
    seoTitle: 'Kostenloser Lotto 6aus49 Zahlengenerator',
    seoDesc: 'Lotto 6aus49 Zahlen kostenlos generieren. 6 aus 49 + Superzahl. Sicherer Zufallsgenerator.',
    ageRestriction: '18+',
    lang: { title: 'Ihre Glückszahlen', generate: 'Generieren', copy: 'Kopieren', share: 'Teilen', sets: 'Tipps', numbers: 'Zahlen', draw: 'Ziehung', result: 'Ihre Zahlen', disclaimer: 'Zufallsgenerator nur zur Unterhaltung. Nicht mit einer offiziellen Lotterie verbunden.', otherLotteries: 'Andere Lotterien' },
  },
  {
    id: 'france-loto', name: 'France Loto', country: '🇫🇷', flag: 'fr',
    mainNumbers: { min: 1, max: 49, count: 5 },
    bonusNumbers: { min: 1, max: 10, count: 1, name: 'Numéro Chance' },
    drawDays: ['Lun', 'Mer', 'Sam'], color: '#2563EB',
    seoTitle: 'Générateur de numéros France Loto — Gratuit',
    seoDesc: 'Générez vos numéros France Loto. 5 numéros (1-49) + 1 Numéro Chance (1-10). Gratuit.',
    ageRestriction: '18+',
    lang: { title: 'Vos numéros chanceux', generate: 'Générer', copy: 'Copier', share: 'Partager', sets: 'Grilles', numbers: 'numéros', draw: 'Tirage', result: 'Vos numéros', disclaimer: 'Générateur aléatoire à but récréatif uniquement.', otherLotteries: 'Autres loteries' },
  },
  {
    id: 'italy-superenalotto', name: 'SuperEnalotto', country: '🇮🇹', flag: 'it',
    mainNumbers: { min: 1, max: 90, count: 6 },
    bonusNumbers: { min: 1, max: 90, count: 1, name: 'Jolly' },
    drawDays: ['Mar', 'Gio', 'Sab'], color: '#16A34A',
    seoTitle: 'Generatore numeri SuperEnalotto — Gratis',
    seoDesc: 'Genera numeri SuperEnalotto. 6 numeri (1-90) + Jolly. Generatore casuale gratuito e sicuro.',
    ageRestriction: '18+',
    lang: { title: 'I tuoi numeri fortunati', generate: 'Genera', copy: 'Copia', share: 'Condividi', sets: 'Giocate', numbers: 'numeri', draw: 'Estrazione', result: 'I tuoi numeri', disclaimer: 'Generatore casuale solo a scopo ricreativo. Non affiliato a nessuna lotteria ufficiale.', otherLotteries: 'Altre lotterie' },
  },
  {
    id: 'spain-primitiva', name: 'La Primitiva', country: '🇪🇸', flag: 'es',
    mainNumbers: { min: 1, max: 49, count: 6 },
    bonusNumbers: { min: 0, max: 9, count: 1, name: 'Reintegro' },
    drawDays: ['Jue', 'Sáb'], color: '#DC2626',
    seoTitle: 'Generador de números La Primitiva — Gratis',
    seoDesc: 'Genera números de La Primitiva. 6 números (1-49) + Reintegro (0-9). Generador aleatorio gratuito.',
    ageRestriction: '18+',
    lang: { title: 'Tus números de la suerte', generate: 'Generar', copy: 'Copiar', share: 'Compartir', sets: 'Apuestas', numbers: 'números', draw: 'Sorteo', result: 'Tus números', disclaimer: 'Generador aleatorio solo con fines recreativos. No afiliado a ninguna lotería oficial.', otherLotteries: 'Otras loterías' },
  },
  {
    id: 'irish-lotto', name: 'Irish Lotto', country: '🇮🇪', flag: 'ie',
    mainNumbers: { min: 1, max: 47, count: 6 },
    bonusNumbers: null, drawDays: ['Wed', 'Sat'], color: '#16A34A',
    seoTitle: 'Free Irish Lotto Number Generator',
    seoDesc: 'Generate Irish Lotto numbers. Pick 6 from 1-47. Free random number generator.',
    ageRestriction: '18+', lang: EN,
  },
  {
    id: 'netherlands-lotto', name: 'Lotto NL', country: '🇳🇱', flag: 'nl',
    mainNumbers: { min: 1, max: 45, count: 6 },
    bonusNumbers: null, drawDays: ['Za'], color: '#F59E0B',
    seoTitle: 'Gratis Lotto Nummergenerator',
    seoDesc: 'Genereer Lotto nummers. Kies 6 nummers van 1-45. Gratis en veilig.',
    ageRestriction: '18+',
    lang: { title: 'Uw geluksnummers', generate: 'Genereren', copy: 'Kopiëren', share: 'Delen', sets: 'Sets', numbers: 'nummers', draw: 'Trekking', result: 'Uw nummers', disclaimer: 'Willekeurige nummergenerator alleen voor vermaak.', otherLotteries: 'Andere loterijen' },
  },
  {
    id: 'poland-lotto', name: 'Lotto PL', country: '🇵🇱', flag: 'pl',
    mainNumbers: { min: 1, max: 49, count: 6 },
    bonusNumbers: null, drawDays: ['Wt', 'Cz', 'So'], color: '#DC2626',
    seoTitle: 'Darmowy generator liczb Lotto',
    seoDesc: 'Generuj liczby Lotto. Wybierz 6 z 49. Darmowy i bezpieczny generator losowy.',
    ageRestriction: '18+',
    lang: { title: 'Twoje szczęśliwe liczby', generate: 'Generuj', copy: 'Kopiuj', share: 'Udostępnij', sets: 'Zakłady', numbers: 'liczb', draw: 'Losowanie', result: 'Twoje liczby', disclaimer: 'Generator losowy wyłącznie w celach rozrywkowych.', otherLotteries: 'Inne loterie' },
  },
  {
    id: 'austria-lotto', name: 'Lotto AT', country: '🇦🇹', flag: 'at',
    mainNumbers: { min: 1, max: 45, count: 6 },
    bonusNumbers: null, drawDays: ['Mi', 'So'], color: '#DC2626',
    seoTitle: 'Kostenloser Lotto 6 aus 45 Zahlengenerator',
    seoDesc: 'Lotto 6 aus 45 Zahlen generieren. Kostenloser Zufallsgenerator.',
    ageRestriction: '18+',
    lang: { title: 'Ihre Glückszahlen', generate: 'Generieren', copy: 'Kopieren', share: 'Teilen', sets: 'Tipps', numbers: 'Zahlen', draw: 'Ziehung', result: 'Ihre Zahlen', disclaimer: 'Zufallsgenerator nur zur Unterhaltung.', otherLotteries: 'Andere Lotterien' },
  },
  {
    id: 'sweden-lotto', name: 'Lotto SE', country: '🇸🇪', flag: 'se',
    mainNumbers: { min: 1, max: 35, count: 7 },
    bonusNumbers: null, drawDays: ['Lör'], color: '#2563EB',
    seoTitle: 'Gratis Lotto Nummergenerator',
    seoDesc: 'Generera Lotto-nummer. Välj 7 av 35. Gratis och säker slumpgenerator.',
    ageRestriction: '18+',
    lang: { title: 'Dina lyckosiffror', generate: 'Generera', copy: 'Kopiera', share: 'Dela', sets: 'Rader', numbers: 'nummer', draw: 'Dragning', result: 'Dina nummer', disclaimer: 'Slumpgenerator endast för underhållning.', otherLotteries: 'Andra lotterier' },
  },
  {
    id: 'uk-thunderball', name: 'Thunderball', country: '🇬🇧', flag: 'gb',
    mainNumbers: { min: 1, max: 39, count: 5 },
    bonusNumbers: { min: 1, max: 14, count: 1, name: 'Thunderball' },
    drawDays: ['Tue', 'Wed', 'Fri', 'Sat'], color: '#F59E0B',
    seoTitle: 'Free Thunderball Number Generator',
    seoDesc: 'Generate Thunderball numbers. 5 (1-39) + 1 Thunderball (1-14). Free & secure.',
    ageRestriction: '18+', lang: EN,
  },
  // ═══ Asia & Others ═══
  {
    id: 'india-lottery', name: 'India Lottery', country: '🇮🇳', flag: 'in',
    mainNumbers: { min: 1, max: 50, count: 6 },
    bonusNumbers: null, drawDays: ['Daily'], color: '#F97316',
    seoTitle: 'Free India Lottery Number Generator',
    seoDesc: 'Generate India lottery numbers. Pick 6 from 1-50. Free random number generator.',
    ageRestriction: '18+',
    lang: { title: 'भाग्यशाली अंक', generate: 'उत्पन्न करें', copy: 'कॉपी', share: 'शेयर', sets: 'सेट', numbers: 'अंक', draw: 'ड्रा', result: 'आपके अंक', disclaimer: 'मनोरंजन के लिए यादृच्छिक संख्या जनरेटर।', otherLotteries: 'अन्य लॉटरी' },
  },
  {
    id: 'thai-lottery', name: 'Thai Lottery', country: '🇹🇭', flag: 'th',
    mainNumbers: { min: 0, max: 9, count: 6 },
    bonusNumbers: null, drawDays: ['1st', '16th'], color: '#2563EB',
    seoTitle: 'สร้างเลขลอตเตอรี่ไทย — ฟรี',
    seoDesc: 'สร้างเลขลอตเตอรี่ไทย 6 หลัก สุ่มตัวเลขฟรีและปลอดภัย',
    ageRestriction: '20+',
    lang: { title: 'เลขนำโชค', generate: 'สร้างเลข', copy: 'คัดลอก', share: 'แชร์', sets: 'ชุด', numbers: 'หลัก', draw: 'วันออก', result: 'เลขของคุณ', disclaimer: 'ตัวสร้างเลขสุ่มเพื่อความบันเทิงเท่านั้น', otherLotteries: 'ลอตเตอรี่อื่น' },
  },
  {
    id: 'philippines-lotto', name: 'Lotto 6/42', country: '🇵🇭', flag: 'ph',
    mainNumbers: { min: 1, max: 42, count: 6 },
    bonusNumbers: null, drawDays: ['Tue', 'Thu', 'Sat'], color: '#2563EB',
    seoTitle: 'Free Philippine Lotto 6/42 Number Generator',
    seoDesc: 'Generate Lotto 6/42 numbers. Pick 6 from 1-42. Free random number generator.',
    ageRestriction: '18+', lang: EN,
  },
  {
    id: 'newzealand-lotto', name: 'NZ Lotto', country: '🇳🇿', flag: 'nz',
    mainNumbers: { min: 1, max: 40, count: 6 },
    bonusNumbers: { min: 1, max: 10, count: 1, name: 'Powerball' },
    drawDays: ['Wed', 'Sat'], color: '#1A1A1A',
    seoTitle: 'Free NZ Lotto Number Generator',
    seoDesc: 'Generate New Zealand Lotto numbers. 6 (1-40) + Powerball (1-10). Free & secure.',
    ageRestriction: '18+', lang: EN,
  },
  {
    id: 'southafrica-lotto', name: 'SA Lotto', country: '🇿🇦', flag: 'za',
    mainNumbers: { min: 1, max: 52, count: 6 },
    bonusNumbers: null, drawDays: ['Wed', 'Sat'], color: '#16A34A',
    seoTitle: 'Free South Africa Lotto Number Generator',
    seoDesc: 'Generate SA Lotto numbers. Pick 6 from 1-52. Free random number generator.',
    ageRestriction: '18+', lang: EN,
  },
];

export function getLotteryById(id: string): LotteryDef | undefined {
  return worldLotteries.find((l) => l.id === id);
}

export const slugToId: Record<string, string> = {
  'powerball': 'us-powerball',
  'mega-millions': 'us-megamillions',
  'euromillions': 'euromillions',
  'eurojackpot': 'eurojackpot',
  'uk-lottery': 'uk-lottery',
  'japan-loto6': 'japan-loto6',
  'australia-powerball': 'australia-powerball',
  'mega-sena': 'brazil-megasena',
  'lotto-max': 'canada-lottomax',
  'germany-6aus49': 'germany-6aus49',
  'france-loto': 'france-loto',
  'italy-superenalotto': 'italy-superenalotto',
  'spain-primitiva': 'spain-primitiva',
  'irish-lotto': 'irish-lotto',
  'netherlands-lotto': 'netherlands-lotto',
  'poland-lotto': 'poland-lotto',
  'austria-lotto': 'austria-lotto',
  'sweden-lotto': 'sweden-lotto',
  'thunderball': 'uk-thunderball',
  'india-lottery': 'india-lottery',
  'thai-lottery': 'thai-lottery',
  'philippines-lotto': 'philippines-lotto',
  'newzealand-lotto': 'newzealand-lotto',
  'southafrica-lotto': 'southafrica-lotto',
};

export const idToSlug: Record<string, string> = Object.fromEntries(
  Object.entries(slugToId).map(([slug, id]) => [id, slug])
);

export function getLotteryBySlug(slug: string): LotteryDef | undefined {
  return getLotteryById(slugToId[slug] || '');
}

export function formatShareText(lottery: LotteryDef, result: GeneratedResult): string {
  const mainStr = result.main.join(', ');
  const bonusStr = result.bonus ? ` + ${result.bonusName}: ${result.bonus.join(', ')}` : '';
  return `${lottery.country} ${lottery.name}: ${mainStr}${bonusStr}\n\nhttps://dhlm-studio.com/lotto?game=${lottery.id}`;
}
