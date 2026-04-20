---
title: "How the Market Actually Works"
series: "Investing 101 — Beginner"
week: 2
slug: "investing-101-beginner-w2-how-the-market-actually-works"
description: "Click 'buy' and a share appears in your account in seconds. Behind that click is a hundred-year-old system of exchanges, market makers, and clearinghouses. Here is what actually happens."
publishDate: "2026-04-20"
readingTime: "13 min"
tags: ["Investing 101", "Beginner", "Market Structure", "Exchanges"]
---

# How the Market Actually Works

Last week we defined what a stock is: a legal claim on a fractional ownership of a real business. But knowing what the thing is does not tell you how it gets bought and sold. And if you are about to put real money into this market, you should understand the machinery you are stepping into.

Most people who trade stocks have no idea what happens in the one second between clicking "buy" and seeing the shares appear in their account. They assume there is some simple transaction, as if they walked up to a vending machine and pulled out a can of soda. The reality is stranger, older, and more interesting than that — and worth understanding, because the details explain a lot of the behavior you will see in the market later.

## The Stock Exchange Is a Place

Start here: a stock exchange is a marketplace. Not a metaphorical marketplace. A real one, with rules, matching systems, and historical roots that go back four centuries.

The Amsterdam Stock Exchange opened in 1602 to trade shares of the Dutch East India Company. The New York Stock Exchange began in 1792 when twenty-four stockbrokers signed an agreement under a buttonwood tree on what is now Wall Street. The London Stock Exchange traces its origins to coffee houses in the late 1600s where traders gathered to exchange government bonds and company shares. Every modern exchange is a direct descendant of these early gatherings.

The core function has not changed. An exchange is a place where buyers and sellers of ownership claims come together and agree on prices. What has changed is everything else — the physical location, the speed, the technology, the participants. Today, the "trading floor" is a data center. The "traders" are algorithms executing in microseconds. But the underlying logic — matching a buyer who wants to pay $X with a seller who wants to receive $X — is identical to the logic the Dutch were using in 1602.

There are currently dozens of stock exchanges around the world. The three you will hear about most often as a beginner are the New York Stock Exchange, the Nasdaq, and — to a lesser extent depending on where you live — regional exchanges like the London Stock Exchange, Tokyo Stock Exchange, or Euronext. Each exchange lists different companies. Apple trades on Nasdaq. JPMorgan trades on NYSE. Toyota trades on the Tokyo Stock Exchange. A single company usually lists on one primary exchange, though large multinationals sometimes cross-list on multiple exchanges in different countries.

When you buy a share, your order ultimately routes to whichever exchange that stock is listed on. You do not have to think about this as a beginner — your broker handles the routing — but it helps to know it is happening.

## The Order Book Is the Market

Here is the most important concept in this entire lesson: the order book.

At any given moment, for any given stock, there is a list of people who want to buy shares and a list of people who want to sell them. These lists live inside the exchange's matching system. The buyers specify how much they are willing to pay. The sellers specify how little they are willing to accept. The exchange matches buyers with sellers whenever the prices overlap.

If the highest price anyone is currently offering to pay for Apple is $180.00, and the lowest price anyone is currently willing to sell Apple at is $180.05, then the gap between those two numbers — five cents — is called the **bid-ask spread**. The $180.00 is the **bid** (what buyers are bidding). The $180.05 is the **ask** (what sellers are asking).

No trade happens until someone crosses the spread. A buyer has to agree to pay $180.05, or a seller has to agree to accept $180.00. The moment someone does, a transaction executes, both sides get what they wanted, and the order book updates — the next-highest bid and next-lowest ask become the new top of the book.

This is the engine. Every single price movement in every stock, every day, is the result of bids and asks colliding in order books at exchanges. When you see Apple's price tick from $180.00 to $180.01 to $180.02, you are watching the aggregate result of thousands of individual buy and sell decisions being matched in real time.

## What Happens When You Click "Buy"

Now trace the path of a single order. You open your brokerage app. Apple is trading at $180. You tap "buy one share" and hit confirm.

**Step 1 — Your broker receives the order.** This takes milliseconds. Your broker is a licensed intermediary — Fidelity, Schwab, Interactive Brokers, Robinhood, whoever you use — whose job is to take your instruction and convert it into an executable trade. They check that your account has enough cash, that the order is valid, and that you are permitted to trade this security.

**Step 2 — Your broker routes the order.** Here is where it gets interesting. Most retail brokers do not send your order directly to an exchange. They send it to a **wholesale market maker** — a specialized firm like Citadel Securities or Virtu Financial that agrees to handle retail order flow. These market makers pay brokers for the right to see and fill these orders. This is called **payment for order flow**, and it is why many brokers can offer "commission-free" trading. You are not literally paying a commission, but your order is being sold to someone who profits from executing it.

**Step 3 — The market maker fills your order.** The market maker looks at the current state of the market — the best bid and ask across all exchanges — and fills your order at or better than the publicly quoted price. For a single share of a liquid stock like Apple, this happens in milliseconds. You get your share. The market maker captures a tiny spread on the transaction, which is how they make money.

**Step 4 — The trade is reported.** The executed trade is reported to the public market data feeds almost instantly. This is the transaction you see reflected in the stock's volume and price history. The trade is also sent to the **clearinghouse**.

**Step 5 — Settlement.** This is the part almost nobody thinks about. When you buy a share, you do not actually *own* it the moment the trade executes. You have a *claim* to own it, which settles on the next business day. Settlement used to take three business days ("T+3"). In 2024 the United States moved to T+1 settlement. During this settlement window, the clearinghouse — the Depository Trust and Clearing Corporation in the US — is doing the back-office work of actually transferring ownership from the seller's custodian to yours, and moving the cash the other way.

The entire process, from click to confirmed trade, feels instantaneous. But behind that feeling is a chain of intermediaries — broker, market maker, exchange, clearinghouse, custodian — each doing their specific job, each regulated, each taking a tiny slice of economic value in exchange for making the system work.

## Market Makers and Liquidity

The word **liquidity** is going to come up constantly in your investing life, so let us define it precisely.

Liquidity is the ability to buy or sell an asset quickly without moving its price. A stock is highly liquid if there are always lots of buyers and sellers present, so you can enter or exit a position easily. A stock is illiquid if the order book is thin, meaning a single large order can move the price significantly.

Apple is extremely liquid. Tens of millions of shares trade every day. Your single-share order has no impact on the price. You can buy or sell essentially any reasonable quantity at the current market price without drama.

A tiny biotech with a $50 million market cap is illiquid. Maybe 20,000 shares trade per day. If you try to buy 10,000 shares at market, you will push the price up significantly as you consume the available ask-side liquidity. This is called **market impact**, and it is a real cost of trading in illiquid names.

Market makers exist to provide liquidity. Their business is to stand in the market continuously, offering both a bid and an ask on securities, ready to buy from anyone who wants to sell and sell to anyone who wants to buy. They profit from the spread between those two prices, and from the volume of trades they handle. In exchange for taking on that risk and providing that service, they are an essential part of why the market works smoothly.

For a beginner, the practical implication is simple: stick to liquid stocks. Names you have heard of, major companies, anything in the S&P 500 is liquid enough that market mechanics will not work against you. The moment you venture into micro-cap names, penny stocks, or thinly traded foreign listings, liquidity becomes a real problem and the clean execution you are used to disappears.

## Market Hours and What Happens After

US stock exchanges have regular trading hours of 9:30 AM to 4:00 PM Eastern Time, Monday through Friday, excluding holidays. This is when the main order books are open and most volume occurs.

There are also **pre-market** and **after-hours** trading sessions that extend the day, but these operate with significantly reduced liquidity and wider spreads. Institutional traders use them to react to news that breaks outside regular hours — earnings reports, for instance, which typically come out before the open or after the close. Retail investors can usually access these sessions, but should be cautious: prices in pre-market and after-hours can be wild and unrepresentative of where the stock will actually open or trade during regular hours.

When news hits during market hours, prices adjust in real time as traders update their bids and asks. When news hits outside market hours, all the reaction is compressed into the opening print — the first trade the next morning, which can gap significantly from the previous close. If a company reports terrible earnings after the close at 4:05 PM, the stock might open the next day 15% lower at 9:30 AM without a single trade in between. This is normal. The market is pricing in all the information that accumulated during the closure.

Weekends and holidays are the same idea on a longer time scale. Two days of news and events get priced in at the Monday open.

## The Orders You Can Place

For your first trades, you will mostly use one of two order types. Understanding the difference matters.

**A market order** says: "Fill this immediately at whatever the best available price is." It guarantees execution but not price. You are telling the system you care more about certainty of getting the trade done than about the exact price. For a liquid stock during regular hours, this is usually fine — you will get something very close to the last trade price.

**A limit order** says: "Fill this only if you can get me this price or better." It guarantees price but not execution. If you place a limit buy at $180 and the stock never trades down to $180, your order never fills. This is the right choice when you care about the specific price, when the stock is less liquid, or when you are trading outside regular hours.

There are fancier order types — stop orders, stop-limit orders, trailing stops, good-til-cancelled, fill-or-kill — but for a beginner, market and limit orders cover 95% of what you will ever need. The most common beginner mistake is using market orders on illiquid stocks or during thin pre-market trading, which can result in surprisingly bad fill prices. When in doubt, use a limit order.

## The Regulators Standing Behind All of This

One more piece of the machinery that most beginners never think about: the entire system is backed by a regulatory infrastructure designed to prevent fraud and maintain fair trading.

In the United States, the **Securities and Exchange Commission** oversees public markets, company disclosures, and broker conduct. The **Financial Industry Regulatory Authority** regulates brokers directly. The **Securities Investor Protection Corporation** insures customer accounts at member brokers up to $500,000 in the event the broker itself fails. Other countries have equivalent structures.

This infrastructure does not protect you from making bad investment decisions. If you buy a stock at $100 and it falls to $20 because the company's business deteriorated, nobody is going to make you whole. That is the risk of owning stock. What the regulatory system does protect is the integrity of the market itself — that the prices you see are real, that the company disclosures you read are truthful (or prosecutable if they are not), that your broker cannot disappear with your shares, that the exchanges are not rigged against retail participants.

This is a meaningful protection. It is also incomplete. Fraud still happens. Market manipulation still happens. But the baseline level of trust you can place in a regulated public market is very different from the baseline in, say, unregulated crypto markets or private company investments. Know what you are getting and what you are not.

## The Practical Picture

Zoom out and put it together.

You, as a retail investor, are going to use a regulated broker to place orders into a market made up of exchanges and market makers, backed by a clearinghouse and a regulatory system, to acquire legally registered ownership claims on publicly traded businesses. Your trades will execute in milliseconds. Your ownership will settle the next business day. The prices you see will reflect the aggregate decisions of millions of participants, from individual investors to pension funds to algorithmic traders, all bidding and asking in real time.

This is a system that has evolved over centuries to do one thing well: efficiently transfer ownership of businesses between willing buyers and willing sellers at transparent prices. It is not perfect. It has moments of panic, manipulation, and irrationality. But as a piece of commercial infrastructure, it is one of humanity's more impressive inventions, and learning to use it competently is a genuine life skill.

## What You Should Do This Week

You still do not need to buy anything. But you should do two things to make next week's lesson — opening your first brokerage account — easier.

**First**, pick a liquid stock you are interested in — one of the three companies you identified last week — and pull up its real-time quote on any free finance site. Watch the bid, ask, spread, and volume for a few minutes during regular market hours. See how the numbers move. See how tight or wide the spread is. You are watching the order book in action. This gives you a visceral feel for what liquid trading looks like.

**Second**, if you are in a country with multiple broker options, start thinking about which broker you want to use. The decision points are: commission structure (most major retail brokers in the US are now commission-free for stocks), platform quality, research tools, account types available (individual taxable, retirement, etc.), and minimum deposit requirements. We will go deeper on this next week.

## Looking Ahead

Next week: opening your first brokerage account. How to pick a broker, what account type to open, what documents you will need, what to watch out for in the account agreement, and the specific steps to go from nothing to "ready to place your first real trade."

For now, you have done the second piece of foundational work. You know what a stock is. You know how the market moves stocks between people. The next step is putting yourself on the network.

---

*Investing 101 — Beginner Series. Week 2 of 12.*

*Next week: Opening Your First Brokerage Account.*
