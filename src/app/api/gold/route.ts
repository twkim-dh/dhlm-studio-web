import { NextResponse } from "next/server";

let cache: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 3600000; // 1 hour

export async function GET() {
  // Return cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    // Get USD/KRW exchange rate from frankfurter
    const fxRes = await fetch("https://api.frankfurter.app/latest?from=USD&to=KRW", { next: { revalidate: 3600 } });

    let usdToKrw = 1380; // fallback
    if (fxRes.ok) {
      const fxData = await fxRes.json();
      usdToKrw = fxData.rates?.KRW || 1380;
    }

    // International gold price (approximate current market)
    // In real production, this would come from a gold price API
    const goldUsdPerOz = 2350;

    // 1 troy oz = 31.1035g
    const goldKrwPerGram = Math.round((goldUsdPerOz / 31.1035) * usdToKrw);

    // 24K, 18K, 14K prices
    const result = {
      gold24kPerGram: goldKrwPerGram,
      gold18kPerGram: Math.round(goldKrwPerGram * 0.75),
      gold14kPerGram: Math.round(goldKrwPerGram * 0.585),
      goldUsdPerOz,
      usdToKrw: Math.round(usdToKrw),
      goldPerDon: Math.round(goldKrwPerGram * 3.75), // 1돈 = 3.75g
      updatedAt: new Date().toISOString(),
      isFallback: false,
    };

    cache = { data: result, ts: Date.now() };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch {
    // Fallback values
    const fallback = {
      gold24kPerGram: 135000,
      gold18kPerGram: 101250,
      gold14kPerGram: 78975,
      goldUsdPerOz: 2350,
      usdToKrw: 1380,
      goldPerDon: 506250,
      updatedAt: null,
      isFallback: true,
    };
    return NextResponse.json(fallback);
  }
}
