import { NextResponse } from "next/server";

const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 3600000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ round: string }> }
) {
  const { round } = await params;
  const cached = cache.get(round);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // Try multiple endpoints
  const urls = [
    `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`,
    `http://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': 'https://www.dhlottery.co.kr/gameResult.do?method=byWin',
          'X-Requested-With': 'XMLHttpRequest',
        },
        redirect: 'follow',
        cache: 'no-store',
      });

      const text = await res.text();

      // Check if it starts with { (JSON)
      if (text.trim().startsWith('{')) {
        try {
          const data = JSON.parse(text);
          if (data.returnValue === 'success') {
            cache.set(round, { data, ts: Date.now() });
            return NextResponse.json(data);
          }
        } catch {}
      }
    } catch {}
  }

  return NextResponse.json({ error: "Unable to fetch lottery data. The lottery server may be blocking requests." }, { status: 503 });
}
