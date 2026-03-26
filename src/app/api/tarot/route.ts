import { NextResponse } from "next/server";

const DAILY_LIMIT = 3;
const rateLimitMap = new Map<string, { count: number; date: string }>();

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI 서비스가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const today = new Date().toISOString().slice(0, 10);

  const entry = rateLimitMap.get(ip);
  if (entry && entry.date === today && entry.count >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: `하루 ${DAILY_LIMIT}회 무료 제한을 초과했습니다.` },
      { status: 429 }
    );
  }

  let body: { cards: string[]; concern?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.cards || body.cards.length !== 3) {
    return NextResponse.json(
      { error: "카드 3장이 필요합니다." },
      { status: 400 }
    );
  }

  const prompt = `당신은 따뜻하고 긍정적인 타로 마스터입니다. 사용자가 선택한 타로 카드 3장을 해석해주세요.

과거: ${body.cards[0]}
현재: ${body.cards[1]}
미래: ${body.cards[2]}
${body.concern ? `고민: ${body.concern}` : ""}

각 카드의 의미를 과거/현재/미래 흐름으로 연결해서 해석해주세요.
따뜻하고 긍정적인 톤으로, 용기를 주는 메시지를 담아주세요.
300자 이내로 간결하게 답변하세요. 마크다운 없이 일반 텍스트로.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Claude API error:", errText);
      return NextResponse.json(
        { error: "AI 해석에 실패했습니다." },
        { status: 500 }
      );
    }

    const data = await res.json();
    const text =
      data.content?.[0]?.text || "카드 해석을 가져올 수 없습니다.";

    // Update rate limit
    if (entry && entry.date === today) {
      entry.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, date: today });
    }

    return NextResponse.json({ interpretation: text });
  } catch (err) {
    console.error("Tarot API error:", err);
    return NextResponse.json(
      { error: "AI 서비스 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
