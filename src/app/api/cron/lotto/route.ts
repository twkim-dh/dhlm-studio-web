import { NextResponse } from 'next/server';

// Vercel Cron: every Saturday at 22:00 KST (13:00 UTC)
// vercel.json: { "crons": [{ "path": "/api/cron/lotto", "schedule": "0 13 * * 6" }] }

// This endpoint fetches the latest lotto results from dhlottery.co.kr
// and returns the data. The actual blog page renders from all-draws.json + API.

export async function GET(request: Request) {
  // Verify cron secret (optional security)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find latest round by trying recent numbers
    const today = new Date();
    const startDate = new Date('2002-12-07');
    const weeksDiff = Math.floor((today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const estimatedRound = weeksDiff + 1;

    // Try fetching the estimated round
    const res = await fetch(
      `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${estimatedRound}`,
      { cache: 'no-store' }
    );
    const data = await res.json();

    if (data.returnValue !== 'success') {
      // Try previous round
      const prevRes = await fetch(
        `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${estimatedRound - 1}`,
        { cache: 'no-store' }
      );
      const prevData = await prevRes.json();
      return NextResponse.json(prevData);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lotto data' }, { status: 500 });
  }
}
