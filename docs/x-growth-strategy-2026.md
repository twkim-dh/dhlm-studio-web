# DHLM Studio / Brutal Edge — X (Twitter) 성장 마스터 전략 (2026)

**작성**: 김실장 (전략/총괄)
**작성일**: 2026-05-05 KST
**버전**: v1.0
**용도**: 5-14 AdSense 통과 후 본격 운영 + 장기 일관 방향

---

## I. 진단 — 현재 상황

### 1. 우리 계정 상태 (5-2 X Analytics 기준)

| 지표 | 값 | 평가 |
|---|---|---|
| Verified followers | 13/43 | X Premium 활성, 매우 작음 |
| 7일 Impressions | 743 | -98% (5-2 burst 페널티) |
| Engagement rate | 19.2% | +686% (매우 높은 audience 질) |
| Engagements | 143 | -85% |
| Profile visits | 0 | -100% |

### 2. 핵심 문제 진단

**A. 계정 연령 + 작은 팔로워 = 알고리즘 신뢰도 낮음**
- 4월 시작 (1개월) = TweepCred 점수 매우 낮음
- 임계값 65 이하 = **3개 포스트만 distribution 후보**
- = 우리 계정이 임계값 미달 가능성 매우 높음

**B. 5-2 burst 발송 = 알고리즘 spam 인식**
- 24시간 내 21개+ (thread 8개 + 댓글 13개+)
- "Author diversity penalty" 발동
- 하루 적정 = 2-3개 (10개+ = 페널티)

**C. Link 페널티 직격탄**
- 2026년 3월부터: **Non-Premium = link 포스트 = 0 median engagement** (사실상 invisible)
- Premium도 0.25~0.3% engagement (현저히 낮음)
- 우리 자체 포스트 link 포함 = Token Economy 5 views 결과

**D. 팔로우 이탈 발생 중**
- 우리 콘텐츠 quality는 좋음 (engagement 19.2%)
- 그러나 연속 thesis 반복 + burst 발송 = 따라오는 audience 피로
- = 자연스러운 churn

---

## II. X 알고리즘 2026 (1월 Grok 기반 재구축)

### 1. 핵심 변화

**A. Grok 기반 transformer 모델로 완전 교체** (2026.1)
- 기존 engagement 기반 → AI 톤/맥락 분석
- **부정/공격적 톤 = 노출 차단**
- **건설적 톤 = 노출 boost**

**B. Engagement 가중치 (공개 코드)**
```
Likes × 1
Retweets × 20    ← 가장 높음
Replies × 13.5   ← 두 번째
Profile Clicks × 12
Link Clicks × 11
Bookmarks × 10
```

= **단순 좋아요는 거의 무가치, replies + retweets가 핵심**

**C. Time spent on platform 추가**
- 단순 좋아요 후 스크롤 = 가치 낮음
- 답글 클릭 + thread 끝까지 읽음 + 영상 시청 = 가치 높음
- = **읽는 시간을 늘리는 콘텐츠 = 알고리즘 boost**

**D. Long-form > Thread** (2026 새 변화)
- 25,000자 long-form post = thread보다 우선 distribution
- X Premium+ = Article 기능 = 매거진/Substack 같은 레이아웃

**E. 외부 링크 페널티 강화**
- Non-Premium link 포스트 = **median engagement 0** (사실상 invisible)
- Premium link 포스트 = 0.25-0.3% (정상의 1/10)
- **권장**: 본문 link X → 첫 댓글에 link

**F. Author diversity penalty**
- 같은 계정의 포스트 = 한 세션에 2-3개만 표시
- 10개 포스트 = 알고리즘이 약한 7개 무시
- = **2-3개 quality 포스트 > 10개 mediocre**

### 2. TweepCred (계정 신뢰도)

```
점수 0-100 (PageRank 기반)
요인:
  - 계정 나이
  - 팔로워/팔로잉 비율
  - engagement quality
  - 고품질 계정과의 상호작용 패턴

임계값 65:
  - 65 이상 = 모든 포스트가 distribution 후보
  - 65 미만 = 3개 포스트만 후보
  
X Premium = +4~16점 boost
X Premium+ = 더 큰 boost
```

**우리 추정 위치**: 65 미만 → 3개만 후보 → distribution 매우 제한

---

## III. 벤치마킹 — 성공 사례

### 1. Shay Boloor (@StockSavvyShay) — 325K 팔로워

**시작**: 2019년 2월 → 6년간 누적
**현재**: Chief Market Strategist @ FuturumEquities, Reuters/Bloomberg/Forbes contributor

**전략 핵심**:
- 일관된 niche: AI / semiconductor / growth tech
- BEAF같은 자체 framework 사용 (P/E, FCF margin, growth CAGR 등)
- 전문가 톤 + data-driven (감정 X, 숫자 O)
- Bull/Bear thesis 양쪽 제시 (균형)
- Pinned post = "다음 챕터" 또는 핵심 portfolio 업데이트 (재방문 유도)
- Podcast (@FuturumEquities) 연계 = 다채널 권위
- Annual portfolio update + 분기별 thesis 업데이트 (예측 가능 콘텐츠)

### 2. Mariusz (@Mariusz_Invest) — 영국 투자자

**전략 핵심**:
- 개인 투자 회한/교훈 공유 ("Sold $GOOGL at 300, mistake")
- Vulnerable + relatable (감정적 호소)
- 대중적 인기 = 175K 조회 단일 포스트

### 3. 10-K Diver (@10kdiver) — 300K 팔로워

**전략 핵심**:
- 핵심 콘텐츠 = thread (강의 형식)
- 비유 + 단계별 추론
- 자체 웹사이트 = thread 모음집 (cross-platform 자산)
- Bookmarkable content

### 4. Ben Carlson (@awealthofcs) — Ritholtz Wealth Management

**전략 핵심**:
- Institutional research → retail 친화 번역
- 책 4권 + 팟캐스트 (Animal Spirits) = 다채널 권위

---

## IV. 통합 funnel 구조

```
[X audience funnel]
     ↓
  X 댓글 (다른 계정 포스트에 가치 추가)
     ↓
  Profile click → Pinned post 노출
     ↓
[자체 X 콘텐츠]
     ↓
  Thread (link 없이) 또는 Long-form post
     ↓
  첫 댓글에 사이트 link
     ↓
[사이트 방문]
     ↓
  Newsletter 구독 또는 직접 RSS
     ↓
[장기 audience]
     ↓
  AdSense 수익 + 콘텐츠 신뢰도 누적
```

---

## V. 12주 성장 로드맵

### Phase 1: AdSense 통과 우선 (5-3 ~ 5-21)
- 자체 포스트: 0-1개/주
- 댓글: 최소 (burst 페널티 회복)

### Phase 2: 본격 시작 (5-22 ~ 6-21)
- 자체 포스트: 5-7개/주
- 댓글: 150-200개/주 (25-30개/일)
- 타겟: 5K-100K 팔로워 finance 계정
- **30분 이내 댓글** (early reply boost)

### Phase 3: 권위 누적 (6-22 ~ 8-30)
- 자체 포스트: 7-10개/주
- 댓글: 200-300개/주
- 목표: 팔로워 200 → 1,000

### Phase 4: 권위 정착 (9월~12월)
- 목표: 1,000 → 5,000+ 팔로워

---

## VI. 절대 원칙

**일일 한도**:
- 자체 포스트: 최대 3개/일
- 댓글: 30-50개/일 (간격 20분+)

**콘텐츠 규칙**:
- ❌ 본문에 link 절대 X
- ✅ 첫 댓글에 link
- ✅ 캐시태그 ($XXX) 3-5개
- ✅ Hook 문장 (첫 줄)
- ✅ answer-worthy question 끝에 추가

**boost 받는 톤**: 건설적 / 데이터 기반 / Bull-Bear 균형
**차단되는 톤**: 공격적 / 부정적 / 공포 조성

---

## VII. Bio + Pinned Tweet

**추천 Bio**:
```
Institutional-grade research on AI, semiconductors, 
quantum computing. BEAF Framework. 
Frameworks over forecasts. Signal over noise.
🔗 dhlm-studio.com
```

**Pinned Tweet (옵션 A — 정체성 manifesto)**:
```
Brutal Edge is built for serious long-term investors.

We don't predict prices. We build frameworks.
We don't follow narratives. We test them.
We don't summarize. We analyze.

BEAF Framework — 6 axes, 100 points, 
applied to every Deep Dive report.

🔗 dhlm-studio.com
```

---

## VIII. AdSense 통과 후 즉시 실행 7가지 (5-22)

1. Pinned tweet 갱신
2. Bio 업데이트
3. X Premium+ 업그레이드 검토 ($8 → $13/월)
4. 댓글 schedule 시작 (30개/일)
5. 자체 포스트 패턴 정착 (1일 1개, link 없음)
6. Cross-platform 시작 (LinkedIn, Reddit, Substack)
7. Repurpose system (사이트 콘텐츠 → X long-form)

---

## IX. 벤치마킹 댓글 타겟 계정

**5K-100K (주요 타겟)**:
@Mariusz_Invest, @gnoble79, @aakashgupta, @niccruzpatane,
@JonErlichman, @WadeMiller, @Dr_Crossroads, @TechInnovationz,
@SpaceInvestor_, @theaiportfolios

**100K+ (노출 어렵지만 타겟)**:
@KobeissiLetter, @MarioNawfal, @StockMKTNewz, @WatcherGuru,
@WOLF_Financial, @StockSavvyShay, @burrytracker, @TomLeeTracker

---

## X. 핵심 한 줄

> **Brutal Edge X 성장 = 시간 + 일관성 + niche depth + 사이트와의 통합**
> 단기 폭발 X = 90일 + 1년 + 6년 누적

---

*작성: 김실장, 2026-05-05 KST*
*다음 업데이트: 5-22 (통과 후 Phase 2 시작 시)*
