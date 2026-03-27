import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('src/data/monthly-events.ts', 'utf-8');

const blogMap = {
  '설날': '/blog/events/seollal',
  '화천 산천어축제': '/blog/events/hwacheon-ice-festival',
  '태백산 눈축제': '/blog/events/taebaeksan-snow-festival',
  '제주 들불축제': '/blog/events/jeju-fire-festival',
  '발렌타인데이': '/blog/events/valentines-day-korea',
  '평창 송어축제': '/blog/events/hwacheon-ice-festival',
  '삼일절': '/blog/events/seollal',
  '진해 군항제': '/blog/events/jinhae-cherry-blossom',
  '제주 유채꽃': '/blog/events/jinhae-cherry-blossom',
  '서울 벚꽃 만개': '/blog/events/seoul-cherry-blossom',
  '부처님 오신 날 준비': '/blog/events/seoul-cherry-blossom',
  '어린이날': '/blog/events/chuseok',
  '어버이날': '/blog/events/chuseok',
  '부처님 오신 날': '/blog/events/seoul-cherry-blossom',
  '현충일': '/blog/events/seollal',
  '장마 시작': '/blog/events/boryeong-mud-festival',
  '보령 머드축제': '/blog/events/boryeong-mud-festival',
  '해수욕장 개장': '/blog/events/boryeong-mud-festival',
  '광복절': '/blog/events/seollal',
  '인천펜타포트': '/blog/events/busan-film-festival',
  '추석': '/blog/events/chuseok',
  '안동 탈춤축제': '/blog/events/chuseok',
  '단풍 시작': '/blog/events/autumn-foliage',
  '단풍 절정': '/blog/events/autumn-foliage',
  '한글날': '/blog/events/autumn-foliage',
  '부산국제영화제': '/blog/events/busan-film-festival',
  '수능': '/blog/events/christmas-korea',
  '빼빼로데이': '/blog/events/valentines-day-korea',
  '김장철': '/blog/events/chuseok',
  '크리스마스': '/blog/events/christmas-korea',
  '서울빛초롱축제': '/blog/events/christmas-korea',
  '연말 가요대전': '/blog/events/christmas-korea',
};

// Process line by line
const lines = c.split('\n');
const result = lines.map(line => {
  // Only process event lines (have period: and url:)
  if (!line.includes('period:') || !line.includes('url:')) return line;

  for (const [nameKr, blogUrl] of Object.entries(blogMap)) {
    if (line.includes(`nameKr: '${nameKr}'`)) {
      return line.replace(/url: '[^']*'/, `url: '${blogUrl}'`);
    }
  }
  return line;
});

writeFileSync('src/data/monthly-events.ts', result.join('\n'));
console.log('Done');
