---
slug: "fear-greed-index-stock-prediction"
title: "Paper vs. Profit #001: Does the Fear & Greed Index Actually Predict Stock Returns?"
category: "Sentiment"
date: "2026-04-09"
readTime: "8 min"
verdict: "MAYBE"
description: "Soongsil University researcher reverse-engineered CNN's Fear & Greed Index, broke it into 7 components, and threw every machine learning model at it. The Stock Price Strength sub-indicator dominated. Direction prediction beat magnitude prediction. R-squared stayed under 0.20."
paperTitle: "Stock Return Prediction Model using Fear and Greed Index"
paperAuthors: "In Sil Choi"
paperYear: 2024
paperInstitution: "Soongsil University, Graduate School of Information Science"
paperAdvisor: "Prof. Jae Man Jung"
seoTitle: "Fear & Greed Index Predict Stock Returns? | Paper vs. Profit #001"
seoDescription: "Soongsil University paper tested whether CNN's Fear & Greed Index can predict S&P 500 returns. R-squared 0.05-0.26. Stock Price Strength dominated. Brutal AI verdict: MAYBE."
relatedSlugs: []
faqs: [{"q":"Can the Fear & Greed Index predict stock returns?","a":"Partially. The 2024 Soongsil University paper found R-squared values of 0.05 to 0.26 across quarters when using machine learning models on the 7 sub-indicators. That means 80 percent of daily returns remained unexplained. Direction prediction (up vs down) showed more promise than magnitude prediction. See full breakdown in the article →"},{"q":"Which Fear & Greed sub-indicator is most predictive?","a":"Stock Price Strength — the ratio of NYSE 52-week highs to lows. Across both linear and non-linear ML models, this single sub-indicator had a feature importance roughly 3x larger than any other variable. Market Volatility (VIX) and Put/Call options ranked second and third. See full breakdown in the article →"},{"q":"Can I use the Fear & Greed Index to make money?","a":"The paper does not prove this. R-squared of 0.10 to 0.20 means 80 to 90 percent of daily returns are unexplained, and the paper did not model transaction costs or slippage. The honest framing is that the index is a sentiment thermometer, not a trading signal — useful as a confirming filter, not as a buy/sell trigger. See full breakdown in the article →"}]
---

## The Paper

A Soongsil University researcher took CNN's famous Fear & Greed Index apart, reverse-engineered each of its 7 sub-indicators from raw market data, rebuilt the entire index from scratch, and then threw every machine learning model she could find at it to see if it could predict S&P 500 returns.

This was not a casual study. The methodology section alone is the kind of careful work that academic finance papers usually skip.

## The Claim

The Fear & Greed Index — that gauge CNN puts on their website that swings between "Extreme Fear" and "Extreme Greed" — contains meaningful information about future stock returns. The paper argues that by breaking the index into its 7 components and feeding them individually into ML models (instead of using the single composite number), you can build a model that predicts next-day S&P 500 returns better than random chance.

## The Method

### Step 1: Reverse Engineering CNN's Index

CNN publishes the Fear & Greed score daily but does not reveal its exact formula. The researcher collected data from 8 different sources (CNN, Kiwoom Securities, Investing.com, Yahoo Finance, CBOE, FRED, Dataguide, MacroMicro) and reconstructed each of the 7 sub-indicators:

| Sub-Indicator | Calculation |
|---|---|
| Market Momentum | S&P 500 price vs. its 125-day moving average |
| Stock Price Strength | Ratio of NYSE stocks hitting 52-week highs vs. lows |
| Stock Price Breadth | McClellan Volume Summation Index |
| Put/Call Options | 5-day average put/call ratio (inverted) |
| Market Volatility | VIX vs. its 50-day moving average (inverted) |
| Safe Haven Demand | 20-day stock returns minus bond returns |
| Junk Bond Demand | Yield spread between junk bonds and treasuries (inverted) |

### Step 2: Validation

The newly constructed index showed a 0.77 correlation with CNN's official index. Per quarter, the correlation averaged 0.80 — strong enough to confirm the reconstruction was legitimate.

### Step 3: Model Building

Using data from February 2021 to February 2024 (769 trading days), the researcher tested:

- **Linear models:** Ridge, Lasso, ElasticNet
- **Non-linear models:** Random Forest, XGBoost, K-Neighbors, SVR, Decision Tree, Voting Regressor

All models used Time Series Split (13 quarters) with GridSearchCV for hyperparameter optimization and 5-fold cross-validation.

### Step 4: Four Input Configurations Tested

1. CNN's original Fear & Greed Index alone
2. The reconstructed New Fear & Greed Index alone
3. All 7 sub-indicators without the composite index
4. All 7 sub-indicators plus the composite index

## The Numbers

Here is where it gets real. And honestly, a bit sobering.

### R-squared Scores (How Much Variance the Model Explains)

Best linear model performance ranged from 0.05 to 0.26 across quarters. The average sat well below 0.20. In plain English: the models explained less than 20 percent of what actually drives daily returns. On some quarters, R-squared went negative — meaning the model performed worse than simply guessing the average.

### Key Finding 1: Sub-Indicators Beat the Composite Index

When the 7 sub-indicators were used individually as inputs, models performed significantly better than when using CNN's single composite score. This makes intuitive sense — forcing 7 different market signals into one number destroys information. The equal-weight averaging that CNN uses to create the index is the problem. Some sub-indicators matter far more than others.

### Key Finding 2: Stock Price Strength Dominated

Across both linear and non-linear models, Sub Index 2 (Stock Price Strength — the ratio of 52-week highs to lows on NYSE) consistently emerged as the most important predictor. In linear models, its regression coefficient averaged 0.39 — roughly 3x larger than any other variable. In non-linear models, its feature importance averaged 0.17, again the highest by a wide margin.

### Key Finding 3: Market Volatility and Put/Call Options Also Mattered

VIX-based indicators and options market data ranked second and third in importance. Safe Haven Demand and Stock Price Breadth were largely irrelevant.

### Key Finding 4: Non-Linear Models Outperformed Linear Ones

SVR (Support Vector Regression) was the most consistent performer, delivering the best results in 4 out of 12 test quarters. The comparison showed non-linear models won 7 out of 12 quarters against linear models.

### Key Finding 5: Direction Prediction Was Better Than Magnitude Prediction

The Concordance Index (measuring whether the model correctly predicts up vs. down moves) showed more promise than R-squared. SVR hit 0.85 in one quarter, and Random Forest reached 0.76. Several models consistently beat the 0.50 random baseline.

### What About Weekly and Monthly Predictions?

They were worse. Much worse. Despite showing stronger correlations in the initial analysis, the 1-week and 1-month prediction models produced negative R-squared values. The correlation was there, but it was not stable enough to translate into reliable predictions.

## The Brutal Truth

### Verdict: MAYBE

Let us be honest about what this paper proved and what it did not.

### What It Proved

- CNN's Fear & Greed Index does contain some useful information about future returns
- Breaking the index into components and weighting them differently is strictly better than using the composite number
- Stock Price Strength (52-week high/low ratio) is the single most predictive sub-indicator
- Non-linear models capture market dynamics better than linear regression
- Predicting market direction (up/down) is more achievable than predicting exact returns

### What It Did Not Prove

- That you can make money with this. An R-squared of 0.10 to 0.20 leaves 80 to 90 percent of daily returns unexplained
- That this works in real-time trading (no transaction costs, slippage, or execution delays were modeled)
- That the relationships are stable over time (the model needed retraining every quarter)
- That longer-term predictions work (1-week and 1-month models failed)

### The Uncomfortable Truth

The Fear & Greed Index is a sentiment thermometer, not a crystal ball. It tells you the market's emotional temperature. That is useful context, not a trading signal. Markets can stay irrational longer than any model can stay solvent.

## What This Means For You

If you are a regular investor checking CNN's Fear & Greed Index before making decisions, here is what you should actually take away.

**1. Do not trade on the composite number alone.** The single Fear & Greed score is a lossy compression of 7 different signals. If you are going to use sentiment data, look at the components — especially the 52-week high/low ratio and VIX trends.

**2. Extreme readings are more useful than moderate ones.** The research showed stronger correlations at market extremes. When the index hits "Extreme Fear" or "Extreme Greed," the signal-to-noise ratio improves. In the mushy middle, it is basically noise.

**3. Use it as a filter, not a trigger.** The best practical application is not "buy when Fear & Greed says fear." It is "when I already want to buy based on fundamentals, check if sentiment is confirming or contradicting my thesis."

**4. The 52-week high/low ratio deserves your attention.** This was the standout variable in every model. When more NYSE stocks are hitting 52-week highs relative to lows, it is a genuine breadth signal. You can track this yourself — it is publicly available data.

**5. Do not try to predict exact returns.** Even with 7 indicators and sophisticated ML models, daily return prediction was poor. Direction prediction showed more promise. The market's daily magnitude is essentially unpredictable from sentiment alone.

## Citation

Choi, I.S. (2024). *Stock Return Prediction Model using Fear and Greed Index* (Master's thesis). Soongsil University, Graduate School of Information Science, Department of Artificial Intelligence. Advisor: Prof. Jae Man Jung.

---

*Paper vs. Profit is a weekly series where Brutal AI dissects academic finance research and asks the only question that matters: would this make you money? Published every Wednesday. Not financial advice.*
