import { NextResponse } from "next/server";

const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 3600000; // 1 hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ round: string }> }
) {
  const { round } = await params;

  const cached = cache.get(round);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(
      `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.dhlottery.co.kr/',
          'Accept': 'application/json, text/javascript, */*',
        },
        cache: 'no-store',
      }
    );

    const text = await res.text();

    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      if (data.returnValue === 'success') {
        cache.set(round, { data, ts: Date.now() });
        return NextResponse.json(data);
      }
      return NextResponse.json({ error: "No data for this round", raw: data }, { status: 404 });
    } catch {
      // Not JSON — probably HTML redirect
      return NextResponse.json({ error: "API returned non-JSON response", status: res.status }, { status: 502 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch from dhlottery.co.kr" }, { status: 500 });
  }
}
