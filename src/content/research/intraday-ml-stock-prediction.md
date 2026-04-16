---
heroImage: "/images/content/paper-vs-profit-002-hero.png"
slug: "intraday-ml-stock-prediction"
title: "Paper vs. Profit #002: Can Machine Learning Predict Intraday Stock Moves Using High-Frequency Data?"
category: "Market Prediction"
date: "2026-04-16"
readTime: "9 min"
verdict: "MAYBE"
description: "Three Korean researchers built a Random Forest model that trades individual KOSPI/KOSDAQ stocks intraday using dollar bars, triple barrier labeling, and a meta-model. 57.4 percent accuracy. Sharpe 2.77. Costs included. Quant fund strategy, not Robinhood strategy."
paperTitle: "Machine Learning-Driven Intraday Stock Price Prediction: A Firm-Level Analysis Using High-Frequency Data"
paperAuthors: "Chansu Kim, Sunwoong Kim, Heungsik Choi"
paperYear: 2024
paperInstitution: "Journal of Intelligence and Information Systems, Vol. 30, No. 2, pp. 85-106"
seoTitle: "ML Intraday Stock Prediction Works? | Paper vs. Profit #002"
seoDescription: "2024 Korean paper used dollar bars + triple barrier + meta-model on KOSPI/KOSDAQ. 57.4 percent accuracy, Sharpe 2.77, costs included. Brutal Edge verdict: MAYBE."
relatedSlugs: ["fear-greed-index-stock-prediction"]
faqs: [{"q":"Can machine learning actually predict intraday stock moves?","a":"This 2024 paper achieved 57.4 percent accuracy on a 3-class problem (up, down, flat) with KOSPI and KOSDAQ stocks, well above the 33.3 percent random baseline. Sharpe ratio reached 2.77 over 7 years with 0.2 percent transaction costs included. The catch: it requires tick-level data, dollar bar construction, triple barrier labeling, and a meta-model. This is institutional-grade methodology, not something a retail trader can run on a laptop. See full breakdown in the article →"},{"q":"What is dollar bar sampling and why does it matter for ML?","a":"Dollar bars sample by dollar volume traded instead of by time. Each bar represents a fixed amount of money changing hands, which means more bars during active periods and fewer during dead zones. The result is a more statistically uniform dataset, which is exactly what machine learning models need. Time bars (1-min, 5-min candles) are inferior because they compress critical price action into single bars during volatile moments. See full breakdown in the article →"},{"q":"What is the triple barrier labeling method?","a":"Three barriers around each trade entry: an upper barrier (take profit), a lower barrier (stop loss), and a time barrier (maximum holding period). Whichever barrier gets hit first determines the label: up (+1), down (-1), or flat (0). The barriers are sized according to each stock individual volatility, so a volatile biotech gets wider barriers than a stable utility. This forces the model to learn volatility-adjusted patterns instead of absolute price moves. See full breakdown in the article →"}]
---

## The Paper

Three researchers from South Korea built a machine learning model that trades individual stocks intraday — not indices, not ETFs, but every single stock listed on KOSPI and KOSDAQ. They used seven years of tick-level data, a quant technique borrowed from hedge funds (dollar bars), and a labeling method designed to account for each stock's unique volatility. Then they backtested it with real transaction costs included.

This is the kind of paper that academic researchers usually do not write because the data infrastructure required is significant. It is also the kind of paper retail traders rarely read because the techniques are intimidating. Both groups should read it.

## The Claim

Using high-frequency intraday data and a Random Forest classifier, you can predict whether a Korean stock will go up, down, or stay flat after touching the lower Bollinger Band — and profit from it. The model does not just beat random chance. It beats the market benchmarks (KOSPI and KOSDAQ) over a 7-year period, even after accounting for 0.2 percent round-trip trading costs.

## The Method

This paper stands out because it uses techniques straight from Marcos Lopez de Prado's *Advances in Financial Machine Learning* — the quant bible that most retail traders have never heard of. Here is what the researchers did.

### Step 1: Dollar Bars Instead of Time Bars

Most traders look at 1-minute or 5-minute candles. That is a time bar — one bar per fixed time interval. The problem is that during quiet periods you get bars with almost no information, and during volatile moments critical price action gets compressed into a single bar.

Dollar bars fix this. Instead of sampling by time, you sample by dollar volume traded. Each bar represents a fixed amount of money changing hands. This means you get more bars during active periods and fewer during dead zones. The result is a more statistically uniform dataset — exactly what machine learning models need.

The researchers generated dollar bars from tick data for every stock on KOSPI and KOSDAQ from January 2017 through December 2023.

### Step 2: Bollinger Band Entry Signal

They did not predict randomly. They only made predictions when price touched the lower Bollinger Band — a classic oversold signal. This is smart for two reasons. It focuses the model on a specific, well-defined market condition. And it filters out the noise of predicting during trendless periods when nothing meaningful is happening.

### Step 3: Triple Barrier Labeling

Instead of a simple up or down label, they used the triple barrier method. Three barriers are set around each trade entry: an upper barrier (take profit), a lower barrier (stop loss), and a time barrier (maximum holding period). Whichever barrier gets hit first determines the label: up (+1), down (-1), or flat (0).

The genius of this approach is that the barriers are sized according to each stock's individual volatility. A volatile biotech stock gets wider barriers than a stable utility. This means the model learns volatility-adjusted patterns, not absolute price moves. The same 2 percent move means very different things in different names, and triple barrier labeling formalizes that intuition into the training data.

### Step 4: Feature Engineering

The model used 12 features including Bollinger Band width, entry time of day, price disparity ratio (how far price has deviated from its moving average), and several technical indicators. These were fed into a Random Forest classifier.

### Step 5: Meta-Model Layer

After building the primary model, the researchers added a meta-model — a second model that decides whether to trust the first model's signal on any given day. If the meta-model predicts that the primary model is likely wrong (especially on down days), it overrides the trade and stays in cash. This is a sophisticated risk management technique that most academic papers skip entirely. It is also exactly how real quant funds operate.

## The Numbers

### Prediction Accuracy: 57.4 percent

Across three classes (up, down, flat), accuracy was 57.4 percent. Precision, recall, and F1 score all measured 0.541.

For context, random guessing on a 3-class problem gives you 33.3 percent accuracy. So 57.4 percent represents a meaningful edge. In a 2-class problem (up/down only), this would roughly translate to 65 to 70 percent directional accuracy — which is exceptional in financial prediction.

### Feature Importance

Three variables dominated the model's decision-making.

| Feature | Why It Mattered |
|---|---|
| Bollinger Band Width | How stretched or compressed volatility is at entry |
| Entry Time | When during the trading day the signal fires |
| Price Disparity Ratio | How far price has deviated from its mean |

Interestingly, entry time was identified as an interaction variable — it becomes powerful when combined with other features, but is not strong on its own. This makes intuitive sense. The same Bollinger Band touch at 9:30 AM (market open chaos) means something very different than at 2:30 PM (institutional positioning before close).

### Backtest Results

| Metric | Value |
|---|---|
| Cumulative return | 34.77% |
| Sharpe ratio | 2.77 |
| Trading costs included | 0.2% per round trip |
| Benchmark | Outperformed both KOSPI and KOSDAQ buy-and-hold over the same period |

With probability-based filtering (only taking trades where the model's confidence exceeded a threshold), results improved further. With the meta-model active (avoiding trades on predicted down days), the strategy reduced drawdowns by staying in cash during unfavorable conditions, further improving risk-adjusted returns.

## The Brutal Truth

### Verdict: MAYBE

This is one of the better quant papers we have reviewed. The methodology is rigorous, the backtest includes costs, and the techniques are genuinely sophisticated. But let us separate what is impressive from what is practical.

### What Is Impressive

- Dollar bars + triple barrier labeling is institutional-grade methodology, not academic toy models
- 57.4 percent accuracy on a 3-class problem is genuinely meaningful
- Sharpe ratio of 2.77 is excellent — most hedge funds would kill for that consistency
- The meta-model concept of "knowing when you do not know" is exactly how real quant funds operate
- Transaction costs were included — many academic papers conveniently skip this

### What Is Concerning

- **The data is Korean market only.** KOSPI and KOSDAQ have different microstructure, liquidity patterns, and participant behavior than US markets. These results may not transfer to NYSE or NASDAQ.
- **Tick data access.** You need real-time, tick-level data for every stock in the market. That is not free, and it is not easy to process. This is not something you run on a laptop with Yahoo Finance data.
- **Execution assumptions.** Even with 0.2 percent costs included, the model assumes you can execute at or near the signal price. In reality, intraday slippage on Korean small-caps can eat that edge alive.
- **The 2017-2023 period** includes a massive bull run (2020-2021) and a sharp correction (2022). The 34.77 percent cumulative return sounds good, but KOSPI itself was roughly flat over this period, so the model's edge is real — just not spectacular on an absolute basis.
- **No out-of-sample validation.** The backtest is walk-forward, which is better than a simple train/test split, but true out-of-sample testing on 2024 data would be more convincing.
- **12 features, all technical.** No fundamental data, no sentiment, no macro indicators. The authors acknowledge this as a limitation and suggest adding macroeconomic data in future work.

### The Uncomfortable Truth

Even if this model works exactly as described, you cannot replicate it without institutional-grade data infrastructure, low-latency execution, and significant technical expertise. This is a quant fund strategy, not a Robinhood strategy.

## What This Means For You

Even if you cannot replicate the full model, there are practical takeaways.

**1. Bollinger Band touches are statistically meaningful.** The lower band is not just a line on a chart — this research confirms it represents a genuine statistical condition where mean reversion probability increases. When you see price at the lower band, pay attention.

**2. Time of day matters more than you think.** The same technical setup at market open versus mid-afternoon has different expected outcomes. If you are day trading, track when your signals work best and when they fail.

**3. Knowing when NOT to trade is as valuable as knowing when to trade.** The meta-model concept is the real gem here. If you could filter out just the worst 20 percent of your trades, your overall performance would improve dramatically. Ask yourself before every trade: what would make this signal wrong?

**4. Volatility-adjusted thinking beats absolute thinking.** A 2 percent move in a low-volatility utility stock is a big deal. A 2 percent move in a meme stock is noise. The triple barrier method formalizes this intuition. Adjust your expectations (and position sizes) to each stock's volatility.

**5. Cumulative edges compound.** 57.4 percent accuracy does not sound life-changing on any single trade. But applied consistently across thousands of trades with proper risk management, small edges create real wealth. The key is consistency and discipline, not any single prediction.

## Citation

Kim, C., Kim, S., & Choi, H. (2024). Machine Learning-Driven Intraday Stock Price Prediction: A Firm-Level Analysis Using High-Frequency Data. *Journal of Intelligence and Information Systems*, 30(2), 85-106. DOI: 10.13088/jiis.2024.30.2.085

---

*Paper vs. Profit is a weekly series where Brutal Edge dissects academic finance research and asks the only question that matters: would this make you money? Published every Wednesday. Not financial advice.*
