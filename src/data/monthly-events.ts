export interface EventItem { name: string; nameKr: string; desc: string; period: string; emoji: string; url: string }
export interface FoodItem { name: string; nameKr: string; desc: string; emoji: string }
export interface MonthData { events: EventItem[]; foods: FoodItem[] }

const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthNamesKr = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export function getMonthName(m: number) { return monthNames[m]; }
export function getMonthNameKr(m: number) { return monthNamesKr[m]; }

export const monthlyEvents: Record<number, MonthData> = {
  1: {
    events: [
      { name: 'Seollal (Lunar New Year)', nameKr: '설날', desc: "Korea's biggest holiday. Families eat tteokguk and play yutnori.", period: 'Late Jan ~ Early Feb', emoji: '🎍', url: 'https://www.google.com/search?q=설날+Seollal+Korea&tbm=isch' },
      { name: 'Hwacheon Ice Festival', nameKr: '화천 산천어축제', desc: 'Catch trout with bare hands on a frozen river!', period: 'Jan 6 ~ 28', emoji: '🐟', url: 'https://www.narafestival.com/festival/hwacheon' },
      { name: 'Taebaeksan Snow Festival', nameKr: '태백산 눈축제', desc: 'Snow sculptures and winter activities in the mountains.', period: 'Mid Jan', emoji: '⛄', url: 'https://www.google.com/search?q=%ED%83%9C%EB%B0%B1%EC%82%B0%20%EB%88%88%EC%B6%95%EC%A0%9C%20Taebaeksan%20Snow%20Festival%20Korea&tbm=isch' },
    ],
    foods: [
      { name: 'Tteokguk', nameKr: '떡국', desc: 'Rice cake soup. Eating it means gaining one year of age.', emoji: '🍜' },
      { name: 'Mandu', nameKr: '만두', desc: 'Korean dumplings. Must-eat during Lunar New Year.', emoji: '🥟' },
      { name: 'Gwamegi', nameKr: '과메기', desc: 'Semi-dried herring. A Pohang winter delicacy.', emoji: '🐟' },
    ],
  },
  2: {
    events: [
      { name: 'Jeju Fire Festival', nameKr: '제주 들불축제', desc: 'Spectacular fire ceremony on Saebyeol Oreum.', period: 'Late Feb', emoji: '🔥', url: 'https://www.visitjeju.net' },
      { name: "Valentine's Day", nameKr: '발렌타인데이', desc: 'Women give chocolate to men. (Men return on White Day, Mar 14)', period: 'Feb 14', emoji: '🍫', url: 'https://www.google.com/search?q=Valentine+Day+Korea&tbm=isch' },
      { name: 'Pyeongchang Trout Festival', nameKr: '평창 송어축제', desc: 'Ice fishing and eating fresh trout sashimi.', period: 'Early Feb', emoji: '🎣', url: 'https://www.google.com/search?q=%ED%8F%89%EC%B0%BD%20%EC%86%A1%EC%96%B4%EC%B6%95%EC%A0%9C%20Pyeongchang%20Trout%20Festival%20Korea&tbm=isch' },
    ],
    foods: [
      { name: 'Strawberries', nameKr: '딸기', desc: 'Korean strawberries peak in winter. Sweet and juicy.', emoji: '🍓' },
      { name: 'Chocolate', nameKr: '초콜릿', desc: "Valentine's season. Handmade chocolate culture.", emoji: '🍫' },
      { name: 'Hotteok', nameKr: '호떡', desc: 'Sweet pancake filled with sugar and nuts.', emoji: '🥞' },
    ],
  },
  3: {
    events: [
      { name: 'Samil Independence Day', nameKr: '삼일절', desc: 'National holiday commemorating the 1919 independence movement.', period: 'Mar 1', emoji: '🇰🇷', url: 'https://www.google.com/search?q=%EC%82%BC%EC%9D%BC%EC%A0%88%20Samil%20Independence%20Day%20Korea&tbm=isch' },
      { name: 'Jinhae Cherry Blossom Festival', nameKr: '진해 군항제', desc: "Korea's biggest cherry blossom festival. 350,000 trees.", period: 'Late Mar ~ Early Apr', emoji: '🌸', url: 'https://www.changwon.go.kr' },
      { name: 'Jeju Canola Flower Season', nameKr: '제주 유채꽃', desc: 'Bright yellow canola fields all over Jeju Island.', period: 'Mar ~ Apr', emoji: '🌼', url: 'https://www.google.com/search?q=%EC%A0%9C%EC%A3%BC%20%EC%9C%A0%EC%B1%84%EA%BD%83%20Jeju%20Canola%20Flower%20Season%20Korea&tbm=isch' },
    ],
    foods: [
      { name: 'Ssuk (Mugwort)', nameKr: '쑥', desc: 'Spring herb. Used in rice cakes and soups.', emoji: '🌿' },
      { name: 'Dalrae (Wild Chives)', nameKr: '달래', desc: 'Spring wild vegetable. Mixed with soy sauce as banchan.', emoji: '🧅' },
      { name: 'Jjukkumi', nameKr: '쭈꾸미', desc: 'Small octopus. Peak season in spring.', emoji: '🐙' },
    ],
  },
  4: {
    events: [
      { name: 'Cherry Blossom Peak in Seoul', nameKr: '서울 벚꽃 만개', desc: 'Yeouido, Namsan, Seokchon Lake turn pink.', period: 'Early ~ Mid Apr', emoji: '🌸', url: 'https://www.google.com/search?q=%EC%84%9C%EC%9A%B8%20%EB%B2%9A%EA%BD%83%20%EB%A7%8C%EA%B0%9C%20Cherry%20Blossom%20Peak%20in%20Seoul%20Korea&tbm=isch' },
      { name: "Buddha's Birthday Prep", nameKr: '부처님 오신 날 준비', desc: 'Temples hang colorful lanterns across the country.', period: 'Late Apr', emoji: '🏮', url: 'https://www.google.com/search?q=부처님오신날+Buddha+Birthday+Korea+Lantern&tbm=isch' },
    ],
    foods: [
      { name: 'Spring Greens', nameKr: '봄나물', desc: 'Namul season! Gosari, chwinamul, and more wild vegetables.', emoji: '🌱' },
      { name: 'Strawberry (Late)', nameKr: '딸기', desc: 'Last chance for Korean strawberries before summer.', emoji: '🍓' },
      { name: 'Flounder Soup', nameKr: '도다리쑥국', desc: 'Flounder and mugwort soup. Spring delicacy.', emoji: '🐟' },
    ],
  },
  5: {
    events: [
      { name: "Children's Day", nameKr: '어린이날', desc: 'National holiday. Theme parks packed, special events for kids.', period: 'May 5', emoji: '👦', url: 'https://www.google.com/search?q=어린이날+Children+Day+Korea&tbm=isch' },
      { name: "Parents' Day", nameKr: '어버이날', desc: 'Give carnations and cash gifts to parents.', period: 'May 8', emoji: '🌹', url: 'https://www.google.com/search?q=어버이날+Parents+Day+Korea&tbm=isch' },
      { name: "Buddha's Birthday", nameKr: '부처님 오신 날', desc: 'Lantern festival at temples. Jogyesa Temple is stunning.', period: 'May (lunar)', emoji: '🏮', url: 'https://www.google.com/search?q=부처님오신날+Buddha+Birthday+Korea+Lantern&tbm=isch' },
    ],
    foods: [
      { name: 'Chamoe (Korean Melon)', nameKr: '참외', desc: 'Yellow Korean melon. Refreshing and sweet.', emoji: '🍈' },
      { name: 'Ssambap', nameKr: '쌈밥', desc: 'Wrap rice in fresh lettuce. Peak lettuce season.', emoji: '🥬' },
    ],
  },
  6: {
    events: [
      { name: 'Memorial Day', nameKr: '현충일', desc: 'National holiday honoring fallen soldiers.', period: 'Jun 6', emoji: '🇰🇷', url: 'https://www.google.com/search?q=%ED%98%84%EC%B6%A9%EC%9D%BC%20Memorial%20Day%20Korea&tbm=isch' },
      { name: 'Rainy Season Begins', nameKr: '장마 시작', desc: 'Korean monsoon season. Bring an umbrella!', period: 'Late Jun', emoji: '🌧️', url: 'https://www.google.com/search?q=%EC%9E%A5%EB%A7%88%20%EC%8B%9C%EC%9E%91%20Rainy%20Season%20Begins%20Korea&tbm=isch' },
    ],
    foods: [
      { name: 'Watermelon', nameKr: '수박', desc: 'Summer starts! Korean watermelon is incredibly sweet.', emoji: '🍉' },
      { name: 'Kongguksu', nameKr: '콩국수', desc: 'Cold soy milk noodles. The ultimate summer dish.', emoji: '🍜' },
      { name: 'Cherries', nameKr: '체리', desc: 'Korean cherry season begins.', emoji: '🍒' },
    ],
  },
  7: {
    events: [
      { name: 'Boryeong Mud Festival', nameKr: '보령 머드축제', desc: "Korea's most famous festival. Mud slides, wrestling, baths.", period: 'Mid Jul', emoji: '🏖️', url: 'https://www.boryeong.go.kr' },
      { name: 'Beach Season', nameKr: '해수욕장 개장', desc: 'Haeundae, Gwangalli, and Jeju beaches open.', period: 'Jul ~ Aug', emoji: '🏖️', url: 'https://www.google.com/search?q=%ED%95%B4%EC%88%98%EC%9A%95%EC%9E%A5%20%EA%B0%9C%EC%9E%A5%20Beach%20Season%20Korea&tbm=isch' },
    ],
    foods: [
      { name: 'Samgyetang', nameKr: '삼계탕', desc: 'Ginseng chicken soup. Koreans eat it on the hottest days.', emoji: '🐔' },
      { name: 'Naengmyeon', nameKr: '냉면', desc: 'Ice-cold buckwheat noodles. Essential summer food.', emoji: '🍜' },
      { name: 'Bingsu', nameKr: '빙수', desc: 'Shaved ice dessert with red beans, fruit, and mochi.', emoji: '🍧' },
    ],
  },
  8: {
    events: [
      { name: 'Liberation Day', nameKr: '광복절', desc: 'National holiday celebrating independence from Japan (1945).', period: 'Aug 15', emoji: '🇰🇷', url: 'https://www.google.com/search?q=%EA%B4%91%EB%B3%B5%EC%A0%88%20Liberation%20Day%20Korea&tbm=isch' },
      { name: 'Pentaport Rock Festival', nameKr: '인천펜타포트', desc: "Korea's biggest rock music festival.", period: 'Early Aug', emoji: '🎸', url: 'https://www.pentaportrock.com' },
    ],
    foods: [
      { name: 'Peaches', nameKr: '복숭아', desc: 'Korean white peaches. Incredibly juicy and fragrant.', emoji: '🍑' },
      { name: 'Shine Muscat', nameKr: '샤인머스캣', desc: "Korea's premium grapes. Sweet and crisp.", emoji: '🍇' },
    ],
  },
  9: {
    events: [
      { name: 'Chuseok', nameKr: '추석', desc: 'Korean Thanksgiving. Families gather, eat songpyeon, visit ancestors.', period: 'Sep ~ Oct (lunar)', emoji: '🌕', url: 'https://www.google.com/search?q=%EC%B6%94%EC%84%9D%20Chuseok%20Korea&tbm=isch' },
      { name: 'Andong Mask Dance Festival', nameKr: '안동 탈춤축제', desc: 'Traditional mask dance performances and cultural events.', period: 'Late Sep', emoji: '🎭', url: 'https://www.google.com/search?q=%EC%95%88%EB%8F%99%20%ED%83%88%EC%B6%A4%EC%B6%95%EC%A0%9C%20Andong%20Mask%20Dance%20Festival%20Korea&tbm=isch' },
      { name: 'Autumn Foliage Begins', nameKr: '단풍 시작', desc: 'Starts in Seoraksan, moves south.', period: 'Late Sep', emoji: '🍂', url: 'https://www.google.com/search?q=%EB%8B%A8%ED%92%8D%20%EC%8B%9C%EC%9E%91%20Autumn%20Foliage%20Begins%20Korea&tbm=isch' },
    ],
    foods: [
      { name: 'Songpyeon', nameKr: '송편', desc: 'Half-moon rice cake. Chuseok essential.', emoji: '🍡' },
      { name: 'Japchae', nameKr: '잡채', desc: 'Glass noodles stir-fried with vegetables.', emoji: '🍝' },
      { name: 'Jeon', nameKr: '전', desc: 'Korean pancakes — kimchi, seafood, zucchini.', emoji: '🥞' },
    ],
  },
  10: {
    events: [
      { name: 'Autumn Foliage Peak', nameKr: '단풍 절정', desc: 'Seoraksan, Naejangsan turn red and gold.', period: 'Mid ~ Late Oct', emoji: '🍁', url: 'https://www.google.com/search?q=%EB%8B%A8%ED%92%8D%20%EC%A0%88%EC%A0%95%20Autumn%20Foliage%20Peak%20Korea&tbm=isch' },
      { name: 'Hangeul Day', nameKr: '한글날', desc: 'Celebrating the Korean alphabet. National holiday.', period: 'Oct 9', emoji: '🇰🇷', url: 'https://www.google.com/search?q=%ED%95%9C%EA%B8%80%EB%82%A0%20Hangeul%20Day%20Korea&tbm=isch' },
      { name: 'Busan Film Festival', nameKr: '부산국제영화제', desc: "Asia's biggest film festival.", period: 'Early Oct', emoji: '🎬', url: 'https://www.biff.kr' },
    ],
    foods: [
      { name: 'Apples', nameKr: '사과', desc: 'Korean apples peak in autumn. Crisp and sweet.', emoji: '🍎' },
      { name: 'Persimmon', nameKr: '감', desc: 'Dried persimmon (gotgam) is a traditional delicacy.', emoji: '🟠' },
      { name: 'Ganjang Gejang', nameKr: '간장게장', desc: 'Soy-marinated raw crab. Autumn crab season.', emoji: '🦀' },
    ],
  },
  11: {
    events: [
      { name: 'Suneung (College Exam)', nameKr: '수능', desc: 'Most important day for Korean students. The country goes quiet.', period: '3rd Thu of Nov', emoji: '📝', url: 'https://www.google.com/search?q=%EC%88%98%EB%8A%A5%20Suneung%20(College%20Exam)%20Korea&tbm=isch' },
      { name: 'Pepero Day', nameKr: '빼빼로데이', desc: '11/11 looks like Pepero sticks. Exchange snacks.', period: 'Nov 11', emoji: '🍫', url: 'https://www.google.com/search?q=%EB%B9%BC%EB%B9%BC%EB%A1%9C%EB%8D%B0%EC%9D%B4%20Pepero%20Day%20Korea&tbm=isch' },
      { name: 'Kimjang Season', nameKr: '김장철', desc: 'Families make a year\'s supply of kimchi together.', period: 'Nov ~ Dec', emoji: '🥬', url: 'https://www.google.com/search?q=김장+Kimjang+Korea&tbm=isch' },
    ],
    foods: [
      { name: 'Fresh Kimchi', nameKr: '김장 김치', desc: 'Freshly made kimjang kimchi. Best taste of the year.', emoji: '🥬' },
      { name: 'Tangerines', nameKr: '귤', desc: "Jeju tangerines start arriving. Korea's winter fruit.", emoji: '🍊' },
      { name: 'Hodugwaja', nameKr: '호두과자', desc: 'Walnut-shaped pastry. Popular road trip snack.', emoji: '🥜' },
    ],
  },
  12: {
    events: [
      { name: 'Christmas', nameKr: '크리스마스', desc: "In Korea, Christmas is a couple's holiday more than family.", period: 'Dec 25', emoji: '🎄', url: 'https://www.google.com/search?q=Christmas+Korea+Seoul&tbm=isch' },
      { name: 'Seoul Lantern Festival', nameKr: '서울빛초롱축제', desc: 'Cheonggyecheon stream lit up with beautiful lanterns.', period: 'Dec', emoji: '🏮', url: 'https://www.google.com/search?q=%EC%84%9C%EC%9A%B8%EB%B9%9B%EC%B4%88%EB%A1%B1%EC%B6%95%EC%A0%9C%20Seoul%20Lantern%20Festival%20Korea&tbm=isch' },
      { name: 'Year-End Concerts', nameKr: '연말 가요대전', desc: 'K-pop year-end concerts (MBC, KBS, SBS).', period: 'Late Dec', emoji: '🎉', url: 'https://www.google.com/search?q=%EC%97%B0%EB%A7%90%20%EA%B0%80%EC%9A%94%EB%8C%80%EC%A0%84%20Year-End%20Concerts%20Korea&tbm=isch' },
    ],
    foods: [
      { name: 'Tangerines', nameKr: '귤', desc: 'Jeju tangerines everywhere. Eaten under heated blankets.', emoji: '🍊' },
      { name: 'Bungeoppang', nameKr: '붕어빵', desc: 'Fish-shaped pastry with red bean. Best winter street food.', emoji: '🐟' },
      { name: 'Hotteok', nameKr: '호떡', desc: 'Sweet pancake with melted sugar. Street food heaven.', emoji: '🥞' },
    ],
  },
};
