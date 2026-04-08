# DAILY BRIEF FORMAT PROPOSAL — DHLM Studio

> **Date:** 2026-04-08
> **Author:** Brutal AI™ Editorial Research (under human editorial oversight)
> **Status:** Proposal for human editor approval before /daily implementation
> **Companion document:** [LEARNING_DAILY_BRIEF_FORMAT_20260408.md](LEARNING_DAILY_BRIEF_FORMAT_20260408.md)

---

## 1. Executive Summary

This document proposes the production format for DHLM Studio Daily Brief based on benchmark analysis of 14 leading daily financial publications. The format is designed to occupy a deliberately empty position in the market: **institutional-grade data density combined with retail-friendly explanation depth**, written in the BAAF voice that makes DHLM Studio recognizable across all content surfaces.

**Key design decisions:**

- **Length:** 1,000-1,300 words per weekday issue
- **Publish time:** 7:30 AM ET / 8:30 PM KST
- **Frequency:** Mon-Fri daily, plus Sat Weekly Deep Analysis and Sun Week Ahead Preview
- **Voice:** AI-assisted under human editorial oversight, BAAF tone, "informational and educational"
- **Audience:** 25-40 year old English-speaking individual investor (Alex persona from Master Roadmap)
- **Differentiation:** "The brief that explains *why* better than Bloomberg and *what* better than Morning Brew"

---

## 2. Section Specification

### Section 1 — MARKET SNAPSHOT

**Purpose:** Visual scan of overnight market state in under 10 seconds.
**Format:** HTML/JSX table with 3 horizontal groups.
**Word count target:** 60-100 words including labels.
**Data refresh:** Pulled at 7:00 AM ET via daily-brief.yml cron.

**Layout:**

| Group | Instruments | Display |
|---|---|---|
| US Indices | S&P 500, Nasdaq Composite, Dow Jones | Last close, daily %, YTD % |
| Macro | WTI Oil, Gold (spot), VIX, US 10Y yield | Last close, daily change |
| Crypto | BTC, ETH | Last close, 24h % |
| Sentiment | Fear & Greed Index | Score 0-100 with label |

**Data sources:**
- US Indices + Macro: FMP API `/v3/quote/^GSPC,^IXIC,^DJI,GCUSD,WTIUSD,^VIX,^TNX`
- Crypto: CoinGecko `/api/v3/simple/price?ids=bitcoin,ethereum`
- Fear & Greed: alternative.me `/fng/`

**Fallback rule:** If any API call fails, display the most recent successful value with a small `(as of [timestamp])` note. Never display "Loading..." or empty cells.

**Visual treatment:** Compact monospace table. Green for positive moves, red for negative, neutral gray for unchanged. Same color scheme as TickerMarquee component for consistency.

---

### Section 2 — TODAY'S STORY

**Purpose:** Single narrative anchor that explains the most important market development of the previous 24 hours.
**Word count target:** 500-800 words.
**Voice:** BAAF — institutional-grade with personality.

**Required structure:**

1. **Lead paragraph (100-150 words)** — Bloomberg-quotable opening sentence with at least 5 specific numbers. State the news, the size of the move, the immediate cause.
2. **Causal chain paragraph (150-200 words)** — Explain *why* this happened. Walk through the chain: macro event → sector reaction → individual stock impact. Minimum 3 specific data points.
3. **Bull and Bear interpretation (200-300 words)** — Two paragraphs presenting the optimistic and pessimistic readings of the same event. Equal length, equal force, no editorial preference.
4. **Internal link** — At least one direct link to a relevant /reports/[slug] Deep Dive when applicable.

**Tone rules (from BAAF 7 Principles):**
- Every claim has a number
- Every quoted source is named specifically (not "analysts said")
- No "buy", "sell", "invest", "recommend" language
- "Informational and educational" framing in any opinion section
- Bull and bear cases must be equally compelling

**Example opening (DHLM Studio standard):**

> The S&P 500 closed down 2.4 percent at 5,612, the worst single-day decline since February 4. Three forces converged: Chinese industrial production printed at 4.2 percent year over year (consensus 5.1 percent), Salesforce missed Q4 revenue by 1.8 percent and guided fiscal 2027 below the Street, and Fed Governor Bowman told the New York Economic Club that "two more cuts in 2026 would be appropriate only if inflation declines materially from here." The 10-year yield jumped 11 basis points to 4.42 percent, and the VIX closed at 23.7, the highest reading since the February correction.

---

### Section 3 — MOVERS & SHAKERS

**Purpose:** Quick scan of which individual stocks moved and why.
**Format:** 3-column HTML table.
**Word count target:** 120-180 words across 5-7 rows.

**Columns:**

| Column | Format |
|---|---|
| Stock | Ticker + company name (link to /markets/[ticker]) |
| Change | Percentage with directional color |
| Why | One-sentence reason (15-25 words) |

**Selection rules:**
1. Minimum 5 stocks, maximum 7
2. At least 2 from megacap technology (NVDA, AAPL, MSFT, GOOGL, AMZN, META, TSLA)
3. At least 1 from a non-tech sector to avoid the "tech bubble" perception
4. At least 1 with an absolute move greater than 5 percent (the day biggest mover)
5. If a stock has a published Deep Dive, the "Why" column must link to /reports/[slug]

---

### Section 4 — SECTOR PULSE

**Purpose:** Identify which sectors are leading or lagging, with one-sentence reason.
**Word count target:** 100-130 words.

**Format:**

```
STRONGEST TODAY
- [Sector 1]: +X.X% — [one sentence reason]
- [Sector 2]: +X.X% — [one sentence reason]
- [Sector 3]: +X.X% — [one sentence reason]

WEAKEST TODAY
- [Sector 1]: -X.X% — [one sentence reason]
- [Sector 2]: -X.X% — [one sentence reason]
- [Sector 3]: -X.X% — [one sentence reason]
```

**Data source:** FMP API sector performance endpoint or computed from S&P 500 sector ETFs (XLK, XLF, XLE, XLV, XLY, XLP, XLI, XLB, XLU, XLRE, XLC).

---

### Section 5 — WEEK AHEAD

**Purpose:** Set expectations for the next 5 trading days.
**Format:** Calendar table.
**Word count target:** 80-120 words.

**Columns:**

| Date | Event | Why It Matters |
|---|---|---|
| Mon Apr 14 | Goldman Sachs Q1 earnings | First major US bank earnings, will set sector tone |
| Tue Apr 15 | Retail sales (March) | Consumer spending health check ahead of Q1 GDP |

**Selection rules:**
1. 3-5 events per issue
2. Mix of earnings (1-2), economic data (1-2), and Fed/policy events (0-1)
3. Always include the most market-moving event of the upcoming week first

---

### Section 6 — BRUTAL AI VERDICT

**Purpose:** Memorable closing line that gives the reader a reason to remember the brand.
**Word count target:** 30-60 words. **Single sentence preferred.**
**Voice:** Brutal AI voice — opinionated, number-backed, no investment recommendation.

**Mandatory rules:**
- At least one specific number
- No "buy", "sell", "invest", "recommend"
- Pass the Bloomberg quotability test (could a Bloomberg journalist quote this without changing it?)
- One distinct angle per day — never repeat the previous day verdict structure

**Examples (model standard):**

> One bad CPI print, one Fed governor with a hot mic, and 380 billion dollars of market cap evaporates in a single session — the AI mega-caps trading at 45x forward earnings have a precision intolerance for any macro volatility, and Bowman just reminded everyone the Fed is not their friend.

> NVIDIA at $4.2 trillion is now larger than the entire German DAX index combined, which is either the most extraordinary capital allocation moment of the decade or the cleanest top signal in financial history — and the BAAF score of 83 says we genuinely do not know which.

---

### Section 7 — RELATED DEEP DIVES

**Purpose:** Internal link prompts to drive readers from daily content to evergreen Deep Dive reports.
**Word count target:** 30-50 words.
**Format:** 2-3 link tiles or bullet links.

**Selection rules:**
1. Always link to at least one Deep Dive mentioned in the day Today Story
2. If the Verdict references a specific stock with a published Deep Dive, link it
3. Rotate fresh recommendations to avoid repetition across consecutive days

---

## 3. Total Issue Specification

| Section | Word Target | Cumulative |
|---|---:|---:|
| 1. Market Snapshot | 80 | 80 |
| 2. Today's Story | 650 | 730 |
| 3. Movers & Shakers | 150 | 880 |
| 4. Sector Pulse | 115 | 995 |
| 5. Week Ahead | 100 | 1,095 |
| 6. Brutal AI Verdict | 50 | 1,145 |
| 7. Related Deep Dives | 40 | 1,185 |

**Target total:** 1,000-1,300 words per issue.

---

## 4. Visual and Layout Decisions

### 4.1 Color System
- Reuse the existing DHLM Studio color tokens (--mono, --serif, --sans, brand red #C73E3A, accent gold #D4A843, success green #00D474, danger red #FF4545)
- No new color additions for daily brief — consistency with rest of site

### 4.2 Typography
- Section headings: var(--mono) uppercase letterspacing 3, color brand red
- Body: var(--sans) 15px line-height 1.7
- Numbers in data tables: var(--mono) for precise alignment
- Matches the existing reports/[slug]/page.tsx treatment for consistency

### 4.3 Mobile Optimization
- All tables collapse to stacked card view below 640px breakpoint
- Section dividers use horizontal rules at 32px vertical spacing
- Body font size 14px on mobile, 15px on desktop
- Maximum content width 720px on desktop (matches reports template)

### 4.4 Email Version (Phase 2 — May)
- Resend HTML template generated from same content source
- Subject line format: `🔥 Brutal AI Daily — Apr 8: VIX 23.7, Oil $112`
- Preview text: First 90 characters of Today Story lead paragraph
- All internal links use full https://dhlm-studio.com URLs
- Single inline image per issue (the lead chart) for spam filter friendliness

---

## 5. Brutal AI Voice Auto-Generation Rules

The Verdict and certain Today's Story openings will use auto-generated BAAF commentary based on market state. The rules below define triggers and templates.

### 5.1 Trigger Conditions

| Condition | Trigger | Comment Type |
|---|---|---|
| VIX > 30 | High fear | Extreme fear template |
| VIX < 15 | Complacency | "Calm before storm" template |
| Oil > 100 | Energy shock | Oil price shock template |
| S&P daily change < -2% | Major sell-off | Sell-off template |
| S&P daily change > +2% | Major rally | Rally template |
| BTC 24h < -5% | Crypto fear | Crypto sell-off template |
| Fear & Greed < 25 | Extreme fear | Sentiment trough template |
| Fear & Greed > 75 | Extreme greed | Sentiment peak template |

### 5.2 Manual Override
The human editor must be able to override any auto-generated verdict before publication via a manual edit step. The cron job produces a draft, not a final issue. Human review is required for the BAAF Bloomberg quotability test.

---

## 6. Production Pipeline

### 6.1 Cron Job: daily-brief.yml

**Schedule:** `30 11 * * 1-5` (UTC) = 7:30 AM ET Mon-Fri

**Steps:**

1. Pull market data (FMP, CoinGecko, alternative.me)
2. Compute Brutal AI verdict trigger conditions
3. Generate draft Markdown file at `src/content/daily/YYYY-MM-DD.md`
4. Run sanity checks (numbers present, no "buy/sell" language, links resolve)
5. Commit draft to repo
6. Create GitHub Issue assigned to editor for review
7. On editor approval (label `approved`), trigger publish workflow
8. Publish workflow rebuilds /daily and /daily/[date], pushes to main, triggers Vercel deploy
9. Phase 2: Resend API call to send email to subscriber list

### 6.2 Failure Handling
- Any cron step failure triggers email to dhlmstudio2026@gmail.com
- The /daily index page must always show the most recent published issue, never a 404
- If today issue is delayed, the page header shows "Today's brief publishes at 7:30 AM ET"

---

## 7. Open Decisions Required from Human Editor

The following design choices need explicit editor approval before implementation begins. Each decision is binary and the recommended option is starred.

1. **Single sentence verdict vs 2-3 sentence verdict?**
   - ★ Single sentence — easier to make memorable, harder to write
   - 2-3 sentences — more room for context but dilutes impact

2. **Sector Pulse: 3+3 or 5+5?**
   - ★ 3+3 — keeps issue compact, forces selection discipline
   - 5+5 — more comprehensive but doubles section length

3. **Movers & Shakers: 5 stocks or 7 stocks?**
   - ★ 5 stocks — tighter focus
   - 7 stocks — more discovery surface

4. **Email subject line emoji: yes or no?**
   - ★ Yes (🔥) — improves open rate per HubSpot 2024 newsletter benchmarks
   - No — more institutional tone

5. **Premium teaser at footer: from Day 1 or only after Hot Sector Reports launch in July?**
   - ★ Only after July — avoid premium ask before product exists
   - Day 1 — start setting expectations early

---

## 8. Adoption Timeline

| Date | Milestone |
|---|---|
| 2026-04-08 | Format proposal published (this document) |
| 2026-04-09 | Editor review and decisions on §7 open questions |
| 2026-04-10 | /daily page template implementation begins |
| 2026-04-11 | Cron job daily-brief.yml drafted |
| 2026-04-14 | First manual Daily Brief published (Mon Apr 14) |
| 2026-04-21 | First fully automated Daily Brief via cron |
| 2026-05-01 | Resend email integration live |
| 2026-07-01 | Premium Hot Sector teaser added to Friday issue footer |

---

## 9. Success Metrics (Tied to Master Roadmap KPI)

The Daily Brief success will be measured against the 6 leading indicators in the Master Roadmap memory:

1. **Indexing rate:** New /daily/[date] pages indexed within 7 days of publication
2. **Impressions:** Weekly impressions on `/daily*` URLs in Google Search Console
3. **Average CTR:** Weekly CTR for /daily URLs versus site average
4. **Top 20 query count:** Number of distinct queries where /daily ranks in top 20
5. **Time on page:** GA4 average engagement time for /daily/[date] pages
6. **Newsletter subscriptions:** Net new subscribers per week attributed to /daily traffic

The May 31, 2026 review threshold of 10 daily visits applies to the entire site, not just /daily. /daily contribution to that threshold is one component, not the whole.

---

## 10. Companion Documents

- [LEARNING_DAILY_BRIEF_FORMAT_20260408.md](LEARNING_DAILY_BRIEF_FORMAT_20260408.md) — full benchmark study of 14 publications
- [BAAF_FRAMEWORK.md](../frameworks/BAAF_FRAMEWORK.md) — scoring framework referenced in Today Story sections
- Master Roadmap (in project memory) — defines target persona, KPI, premium model timeline

---

*This proposal is the recommended format. Implementation will not begin until the human editor confirms the open decisions in section 7. The proposal may be revised based on editor feedback before any code is written.*
