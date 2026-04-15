# Brutal Edge™ Identity Guide

> **모든 리포트 작성 전 반드시 참조. 이 가이드는 DHLM Studio의 영구 품질 기준입니다.**

---

## 1. Brutal Edge Voice (우리의 핵심 톤)

- **날카롭지만 스마트하지 않다.** 의견이 있지만 독자를 깔보지 않는다.
- **데이터가 먼저, 판단이 두 번째.** 숫자 없는 주장은 없다.
- **한 문장으로 말할 수 있으면 두 문장 쓰지 않는다.**
- **"우리 생각에"가 아니라 "데이터가 말해주는 것은"으로 시작한다.**
- **독자를 투자자로 대한다.** 이보자 설명을 하되, 수준을 낮추지 않는다.

**금지 표현:**
- "In plain English" → 삭제하거나 그냥 직접 써라
- "Put plainly" → 한 리포트에 1회까지만 허용
- "To be clear" → 그냥 명확하게 쓰면 된다
- "It's worth noting" → 중요하면 그냥 넣어라
- "Interestingly" → 내용이 흥미롭다면 텍스트가 말해준다

---

## 2. Report Structure (모든 리포트 공통 구조)

```
🔥 BRUTAL EDGE™ VERDICT  ← 리포트 전체를 관통하는 1~2문장 핵심 판단

## [Section Name]         ← 직접적 명사형 ("The Business Model", "The Risk Stack")
   본문...

## Bottom Line            ← 항상 마지막 섹션, 항상 이 이름 사용
```

**섹션 이름 규칙:**
- ✅ "The Company", "The Traction", "The Risk Stack", "The Investment Case"
- ❌ "What Anthropic actually is" (질문형/서술형 금지)
- ❌ "Why investors care so much" (감정적 표현 금지)

---

## 3. Verdict 작성 규칙

- 반드시 `🔥 BRUTAL EDGE™ VERDICT` 마크와 함께
- 1~2문장. 리포트의 결론을 압축.
- 핵심: 독자가 "아, 이거 한 줄이면 됐다"고 느낄 것
- 독자가 "Yes, 이거 한 줄이면 된다"고 느낄 수 있어야 함.

**예시:**
- `"Anthropic at $380B is not a hidden gem — it's a confirmed platform play priced like one."`
- `"Crypto treasury stocks are not equity investments. They are leveraged conviction trades wearing a stock ticker."`
- `"The quantum sector sits not between fraud and revolution, but between revolution and overvaluation."`

---

## 4. BEAF / Rating 처리

| 유형 | 표시 방법 |
|------|-----------|
| 상장 종목 (데이터 충분) | BEAF XX/100 (등급) |
| 비상장 기업 | Private — Not Rated |
| 섹터 리포트 | Sector — Not Rated |
| 교육 콘텐츠 | 표시 없음 |

---

## 5. 리포트 카테고리 체계

| 카테고리 | 설명 | 예시 |
|----------|------|------|
| Deep Dive | 상장 종목 심층 분석 | NVDA, MSFT, PLTR |
| Special Report | 섹터/테마/비상장 분석 | Quantum, Crypto Treasury, Anthropic |
| Investing 101 | 투자 교육 시리즈 | Week 1: What Is a Stock? |
| Paper vs. Profit | 학술 논문 vs 실제 검증 | 매주 발행 |
| Hot Sector | 섹터 스냅샷 | Energy, BTC |

> **"Company Spotlight"은 Special Report에 통합. 별도 카테고리 불필요.**

---

## 6. 차별화 원칙 — "어디서도 볼 수 없는 리포트"

| 다른 사이트가 하는 것 | Brutal Edge가 하는 것 |
|----------------------|----------------------|
| 뉴스 나열 ("X가 Y를 했다") | 투자 판단 프레임워크 제공 ("이 지표로 전체를 읽어라") |
| 개별 종목 분석 | 섹터 비교 + 핵심 지표 교육 |
| 감정적 헤드라인 ("폭등!", "충격!") | 냉정한 한 줄 판단 (Verdict) |
| 결론 없음 | 반드시 Bottom Line에서 판단 |
| Polymarket/외부 데이터 무시 | 외부 확률 데이터 인용으로 차별화 |

---

## 7. Polymarket 확률 인용 규칙

- Daily Brief, 리포트, X 댓글에서 활용 가능
- 형식: `"Polymarket prices [이벤트] at [X]%"`
- 링크 삽입 불필요 (우리 사이트에서 트래픽 유출 방지)
- 위젯/임베드 절대 금지

---

## 8. Frontmatter 표준

```yaml
---
slug: "deep-dive-nvda-april-2026"
title: "NVIDIA: [핵심 메시지]"
ticker: "NVDA"
date: "2026-04-15"
readTime: "15 min"
category: "Deep Dive"          # Deep Dive | Special Report | Hot Sector
catColor: "#색상코드"
grade: "A"                     # A~F | "—" (비상장) | ""
beafScore: 87                  # 0~100 | 0 (비상장/섹터)
type: "deep-dive"              # deep-dive | special-report | hot-sector
homeRank: 1                    # Featured Analysis 순서 (낮을수록 우선, 생략 시 날짜 기준)
tickers: ["NVDA"]              # 복수 종목 리포트의 경우
description: "140자 내외 설명"
heroImage: "/images/content/deep-dive-report.png"  # 없을 경우 unsplash-manifest에 등록
---
```

**homeRank 사용 기준:**
- Featured Analysis에 고정 표시할 리포트에만 사용
- 값이 낮을수록 먼저 표시 (1 = 최우선)
- 14일 이상 된 리포트는 Featured에서 자동 제외됨 (`daysAgo <= 14`)

---

## 9. 3,000단어+ 기준 (Deep Dive)

Deep Dive는 최소 3,000단어를 목표로 한다. 이유:
- SEO 장기 트래픽의 기반
- 독자가 "이거 하나 읽으면 충분하다"는 신뢰 형성
- Brutal Edge의 핵심 USP

Quick Take (5분)는 단독 콘텐츠보다 Deep Dive의 트레일러로 활용.
