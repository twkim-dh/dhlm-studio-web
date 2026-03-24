import { NextRequest } from 'next/server';

// In-memory cache to avoid repeated calls
const cache = new Map<
  number,
  { data: Record<string, unknown>; timestamp: number }
>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Estimate latest draw number based on date
function estimateLatestRound(): number {
  const firstDraw = new Date('2002-12-07').getTime();
  const now = Date.now();
  const diffWeeks = Math.floor((now - firstDraw) / (7 * 24 * 60 * 60 * 1000));
  return diffWeeks + 1;
}

interface DhlotteryResponse {
  returnValue: string;
  drwNo: number;
  drwNoDate: string;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  firstWinamnt: number;
  firstPrzwnerCo: number;
  firstAccumamnt: number;
  totSellamnt: number;
}

function toCleanJSON(data: DhlotteryResponse) {
  return {
    round: data.drwNo,
    date: data.drwNoDate,
    numbers: [
      data.drwtNo1,
      data.drwtNo2,
      data.drwtNo3,
      data.drwtNo4,
      data.drwtNo5,
      data.drwtNo6,
    ],
    bonus: data.bnusNo,
    prize1Amount: data.firstWinamnt,
    prize1Winners: data.firstPrzwnerCo,
    totalSales: data.totSellamnt,
    // Also include raw fields for backward compatibility
    returnValue: data.returnValue,
    drwNo: data.drwNo,
    drwNoDate: data.drwNoDate,
    drwtNo1: data.drwtNo1,
    drwtNo2: data.drwtNo2,
    drwtNo3: data.drwtNo3,
    drwtNo4: data.drwtNo4,
    drwtNo5: data.drwtNo5,
    drwtNo6: data.drwtNo6,
    bnusNo: data.bnusNo,
    firstWinamnt: data.firstWinamnt,
    firstPrzwnerCo: data.firstPrzwnerCo,
    firstAccumamnt: data.firstAccumamnt,
    totSellamnt: data.totSellamnt,
  };
}

async function fetchRound(round: number): Promise<DhlotteryResponse | null> {
  // Check cache
  const cached = cache.get(round);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as unknown as DhlotteryResponse;
  }

  try {
    const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) return null;

    const data: DhlotteryResponse = await res.json();

    if (data.returnValue === 'success') {
      cache.set(round, { data: data as unknown as Record<string, unknown>, timestamp: Date.now() });
      return data;
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roundParam = searchParams.get('round');
  const round = roundParam ? parseInt(roundParam, 10) : estimateLatestRound();

  if (isNaN(round) || round < 1) {
    return Response.json({ error: 'Invalid round number' }, { status: 400 });
  }

  try {
    let data = await fetchRound(round);

    // If the estimated round doesn't exist yet, try previous round
    if (!data && !roundParam) {
      data = await fetchRound(round - 1);
      if (!data) {
        data = await fetchRound(round - 2);
      }
    }

    if (data) {
      return Response.json(toCleanJSON(data));
    }

    return Response.json(
      { error: 'Draw result not found', returnValue: 'fail' },
      { status: 404 }
    );
  } catch {
    return Response.json(
      { error: 'Failed to fetch draw results' },
      { status: 500 }
    );
  }
}
