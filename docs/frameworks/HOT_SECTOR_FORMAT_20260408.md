# HOT SECTOR FORMAT — DHLM Studio Premium

> **Date:** 2026-04-08
> **Author:** Brutal Edge™ Editorial Research (under editorial oversight)
> **Purpose:** Production format specification for weekly Hot Sector reports and monthly Hidden Gem reports
> **Status:** Approved framework for Phase 2 launch (July 2026)
> **Companion documents:**
>   - [LEARNING_PREMIUM_MODEL_20260408.md](../research/LEARNING_PREMIUM_MODEL_20260408.md)
>   - [hot-sector-system.md](../prompts/hot-sector-system.md)
>   - [BEAF_FRAMEWORK.md](BEAF_FRAMEWORK.md)
> **Master directive reference:** PART 13-E

---

## 1. Document Type Definitions

### 1.1 Hot Sector Report (Weekly)

A 2,000-3,000 word analysis of one industry sector, theme, or macro narrative that is currently moving markets. Published every Tuesday for premium subscribers. Covers 5 to 7 named stocks with a clear tactical top pick.

### 1.2 Hidden Gem Report (Monthly)

A 3,000-4,000 word deep focus on one specific small-to-mid-cap stock that the broader research community has not yet covered well. Published on the first Tuesday of each month. Covers a single stock in single-name depth.

Both formats share 90 percent of the structural and tone rules. Differences are noted explicitly where they apply.

---

## 2. Sector and Stock Selection Criteria

### 2.1 Sector Selection (Weekly Hot Sector)

A sector qualifies for coverage when at least 3 of these 5 conditions are true:

1. **Catalyst-driven price action** — sector ETF moved more than 5 percent in either direction in the past 14 trading days
2. **Earnings revision divergence** — analyst earnings estimates for the sector are diverging meaningfully from the broader market (FactSet weekly revisions report)
3. **Macro narrative connection** — the sector is the primary beneficiary or victim of an active macro story (rates, war, regulation, technology shift)
4. **Underowned by mainstream coverage** — the sector is not currently being covered as the headline story by Bloomberg, CNBC, and Wall Street Journal in the same week
5. **Reader request volume** — at least 3 of the top 10 most-requested tickers (`/api/request-deepdive`) belong to the sector

The third and fourth criteria together are critical. A "Hot Sector" report on technology in the middle of an AI rally is wasted effort because the entire financial press is already covering it. The right Hot Sector picks are those where the institutional research is happening but the retail-facing coverage is thin.

### 2.2 Stock Selection Within a Sector (Weekly)

For each Hot Sector report, select 5 to 7 stocks meeting these criteria:

1. **Market cap floor:** $5 billion (excludes micro-caps and most thinly traded names)
2. **Liquidity floor:** Average daily volume above 1 million shares (ensures readers can actually trade the names)
3. **At least 2 mega-cap names:** to anchor the report in stocks readers recognize
4. **At least 1 contrarian name:** a stock that is structurally exposed but the market has not priced in yet
5. **At least 1 short-thesis or bear-case stock:** even Hot Sector reports must present both sides; the highest-quality reports identify the loser within a winning sector
6. **Cover the value chain:** for industrial sectors, include upstream/midstream/downstream as applicable; for software, include infrastructure/platform/application
7. **Tactical top pick is mandatory:** every report must end with one specific named stock as the conviction call, with rationale

### 2.3 Stock Selection for Hidden Gem (Monthly)

A stock qualifies as a Hidden Gem when at least 4 of these 6 conditions are true:

1. **Market cap range:** $1 billion to $50 billion
2. **Sell-side analyst coverage:** fewer than 12 active analysts (Bloomberg analyst count)
3. **Recent catalyst:** earnings beat, FDA approval, contract win, management change, or strategic pivot in past 90 days
4. **Institutional accumulation:** 13F filings show net institutional buying in the past quarter
5. **Mainstream press coverage:** fewer than 5 articles in tier-1 financial press (Bloomberg, WSJ, FT, Reuters, Barron's) in past 90 days
6. **Reader interest signal:** at least one mention in `/api/request-deepdive` or qualitative observation that retail investors are starting to discover the name

The Hidden Gem is not a "moonshot" pick. It is a quality business that has not yet attracted broad coverage. The reader expects research, not lottery tickets.

---

## 3. Hot Sector Report Structure

### Section 1 — The Catalyst (300-400 words)

Open with the specific event that triggered the sector move. Named source for every claim. At least 5 specific numbers in the first 200 words.

**Required elements:**
- One Bloomberg-quotable opening sentence with the headline number
- The chronological reconstruction: catalyst → first reaction → current state
- The size of the move at the sector level (sector ETF move, sector P/E shift)
- One historical reference for context (named year, named outcome)

### Section 2 — The Three Forces (400-500 words)

Identify the three specific drivers that explain why the sector is moving. Each driver gets 1 paragraph with named data.

**Required elements:**
- Each force has a quantified mechanism (not "demand is growing" but "demand grew 18 percent in Q4 per FactSet")
- At least 6 specific data points across the section
- At least 2 named sources

### Section 3 — Stock-by-Stock Analysis (1,000-1,500 words)

For each of the 5 to 7 stocks selected, write 150 to 250 words covering:

**Required structure for each stock:**
1. One sentence positioning the stock within the sector thesis
2. The two or three numbers that define this name's exposure (revenue concentration, margin profile, debt level, segment percentage)
3. The bull case in 2-3 sentences with named drivers
4. The bear case in 2-3 sentences with named risks
5. The verdict: hold up under continued momentum, hold up under reversal, or only works in one scenario

### Section 4 — Comparison Table (mandatory visual)

A markdown table with the 5-7 stocks across these mandatory columns:

| Stock | Price | YTD % | Trailing P/E | Forward P/E | Div. Yield | Since [event date] |

Optional additional columns based on sector:
- Energy: gross margin, refining capacity
- Tech: ARR growth, gross margin
- Healthcare: pipeline, FDA milestones
- Financials: efficiency ratio, NIM, CET1

### Section 5 — Historical Parallel (200-300 words)

One specific past sector cycle that informs the current setup. Named year, named outcome, named lesson. The reader should be able to look up the exact historical episode after reading.

### Section 6 — Scenario Table (mandatory visual)

A 3-scenario, 3-stock table showing approximate price impact ranges:

| Scenario | Catalyst Variable | Mega-cap Pick | Mid-cap Pick | High-beta Pick |

Three scenarios required: continuation, mean reversion, tail event. Three named stocks per row.

### Section 7 — Tactical Top Pick (200-300 words)

The single specific stock that the report puts forward as the highest-conviction tactical idea for the next 4 to 12 weeks. The pick must be one of the 5 to 7 names already analyzed (no new names introduced here).

**Required structure:**
- The pick name
- The asymmetry argument (why this name has better risk/reward than the alternatives)
- The expected upside scenario with rough magnitude
- The risk that would invalidate the call
- The position sizing implication (core hold vs trading idea)

### Section 8 — Brutal Edge Verdict (one paragraph, 100-150 words)

A single closing paragraph in Brutal Edge™ voice. This is the only section where the personality budget is spent. One memorable closing line. No metaphors stronger than "the data shows."

### Section 9 — FAQ (3-5 questions)

Each question is one sentence. Each answer is 50-100 words with at least one specific number and a "See full analysis in our Deep Dive →" or similar internal link bridge.

### Section 10 — Sources and Methodology (50-100 words)

Bullet list of named sources used. At least 8 specific named sources required for a Hot Sector report.

---

## 4. Hidden Gem Report Structure

### Section 1 — Why This Stock, Why Now (400-500 words)

Open with the specific catalyst that puts this stock on the radar. Named source for every claim.

### Section 2 — The Business (500-700 words)

The business model in plain language. Revenue model, customer base, unit economics, competitive moat. Named customers if disclosed.

### Section 3 — The Numbers (500-700 words)

Full BEAF 6-axis breakdown with calculation transparency. The reader should see exactly how the BEAF score was computed, not just the final number.

### Section 4 — Bull Case (500-700 words)

The strongest argument for upside. Named drivers, named comparable companies, named price targets where applicable. Equal length to the bear case.

### Section 5 — Bear Case (500-700 words)

The strongest argument for downside. Named risks, named historical analogs of similar businesses that failed, named structural concerns.

### Section 6 — Three Catalysts to Watch (300-400 words)

Three specific events in the next 6 to 12 months that will validate or invalidate the thesis. Each catalyst has a date or expected window, the metric to watch, and the threshold that matters.

### Section 7 — Verdict (one paragraph)

The synthesis. Conviction level explicitly stated (high / medium / speculative).

### Section 8 — FAQ (3-5 questions)

### Section 9 — Sources and Methodology

---

## 5. Tone and Voice Rules

These rules apply to both Hot Sector and Hidden Gem reports. They are stricter than the rules for free Deep Dive content because premium subscribers are paying specifically for analytical rigor.

### 5.1 Tone Ratio: 90 Percent Professionalism, 10 Percent Humor

The personality budget is spent in exactly two locations:

1. The opening line of Section 1 (one well-crafted observation that hooks the reader)
2. The closing line of Section 8 (one memorable verdict line)

Everything else is pure analysis. No metaphors stronger than "the data shows." No casual asides. No parenthetical jokes. No emoji outside the section header decoration. No exclamation points outside of direct quotes.

### 5.2 Forbidden Patterns

- "to the moon", "diamond hands", "HODL", "stonks" — banned
- "Buy now before it's too late" — banned
- Investment recommendations: never use "buy", "sell", "invest", "recommend"
- Speculative price targets without methodology — banned
- "This is genuinely insane" or similar Brutal Edge™ catchphrases outside the two designated humor slots — banned
- Comparisons to celebrities, movies, memes, or pop culture references — banned
- Casual expletives or slang — banned
- Second-person address ("you might be wondering...") — banned

### 5.3 The Goldman Sachs MD Test

Before publishing any Hot Sector or Hidden Gem report, the editor must answer this question:

> "Could this report be shown to a Goldman Sachs sector analyst's managing director without revisions?"

If the answer is no, the report must be edited until the answer is yes. This is the bar.

### 5.4 The Number-to-Prose Ratio

Premium reports must contain at least one specific numerical claim for every 30 words of prose. Below that ratio, the report has crossed the line from analysis into opinion. Verify by counting numbers in the final draft and dividing word count by number count.

### 5.5 Source Density Requirement

- Hot Sector report: at least 8 named sources across the report
- Hidden Gem report: at least 12 named sources across the report

A "named source" is one that includes a person, a company, a publication, or a specific document — not "analysts say" or "the market thinks."

---

## 6. Internal Linking Rules

Every premium report must include:

1. **At least 3 links to existing /reports/ Deep Dives** when the stocks mentioned have published Deep Dive coverage
2. **At least 1 link to the previous Hot Sector report** so the archive builds reader habit
3. **At least 1 link to the most recent Daily Brief** that contains data referenced in the report
4. **One link to the Editorial Policy page** in the footer to anchor the editorial commitment

---

## 7. Disclaimer Footer (Mandatory)

Every Hot Sector and Hidden Gem report must end with this footer (DHLM Studio holds no positions clause is mandatory for premium reports specifically):

> *Analysis under editorial oversight, for informational and educational purposes. NOT investment advice. DHLM Studio holds no positions in any security mentioned in this report. Always do your own research and consult a qualified financial advisor before making investment decisions.*

---

## 8. Production Workflow

### 8.1 Drafting (Local)
1. Editor selects sector or stock per Section 2 criteria
2. Local generates initial draft per Section 3 or Section 4 structure
3. Local applies BEAF scoring to each stock
4. Local builds comparison table and scenario table
5. Local writes draft tactical top pick / verdict

### 8.2 Editorial Review (Editor)
1. Editor verifies all data points against primary sources
2. Editor checks tone ratio (count humor instances, must be 2)
3. Editor runs Goldman Sachs MD test
4. Editor verifies source density (count named sources)
5. Editor verifies number-to-prose ratio
6. Editor checks internal links resolve
7. Editor approves or returns for revision

### 8.3 Publishing
1. File saved to `src/content/reports/<slug>.md`
2. Frontmatter type set to `hot-sector` or `hidden-gem`
3. Tickers array set to all covered stocks
4. Sector field set
5. Premium flag set to `true` (Phase 2 only — gating logic to be added)
6. Commit pushed to main, Vercel auto-deploys
7. IndexNow notified of new URL
8. Email sent to premium subscribers via send-daily-email pattern
9. Friday Daily Brief includes teaser to next week's Hot Sector

### 8.4 Post-Publication Tracking
- Open rate of premium email
- Click-through rate from teaser to full report
- Time on page for premium readers
- Comments and request volume on the topic
- Stock performance of tactical top pick over 4-week and 12-week windows (feeds BEAF Performance Tracker)

---

## 9. First Three Premium Reports (Planning Sketch)

These are illustrative ideas, not commitments. The editor selects final topics closer to publication.

| Date | Type | Working Topic |
|---|---|---|
| 2026-07-08 | Hot Sector | Cybersecurity post-NVDA-CRWD alliance |
| 2026-07-15 | Hot Sector | GLP-1 weight loss drugs beyond Lilly |
| 2026-07-22 | Hot Sector | Data center cooling and power infrastructure |
| 2026-07-29 | Hidden Gem | One specific industrial automation small-cap |
| 2026-08-05 | Hot Sector | Defense procurement post-Iran ceasefire |

The Energy report published as the dry run on 2026-04-08 ([hot-sector-energy-april-2026](../../src/content/reports/hot-sector-energy-april-2026.md)) is the format reference. New reports should match its structure, depth, and tone exactly.

---

*This framework is the production rulebook. Any deviation requires editor approval and a documented reason. The framework will be reviewed quarterly and updated as needed based on subscriber feedback and conversion data.*
