'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactionButtons from '@/components/ReactionButtons';

interface Mover {
  rank: number; ticker: string; name: string; price: number; change: number; volume: number;
  sector?: string; industry?: string; exchange?: string; ceo?: string; employees?: string;
  description?: string; image?: string; marketCap?: number; marketCapFmt?: string; range52w?: string;
  revenue?: string; netIncome?: string; eps?: string | number;
}

type TabId = 'gainers' | 'losers' | 'actives';

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generateRoast(s: Mover): { roast: string; rating: string; ratingColor: string; emoji: string } {
  const abs = Math.abs(s.change).toFixed(0);
  const name = s.name || s.ticker;
  const cap = s.marketCapFmt ? ` Cap: ${s.marketCapFmt}.` : '';

  if (s.change < -30) return { rating: 'DISASTER', ratingColor: '#FF4545', emoji: '💀', roast: pickRandom([
    `DOWN ${abs}%? That's not a dip — that's a CLIFF. ${name} just fell off a building and everyone's saying "buy the dip." You know what happens when you catch a FALLING KNIFE? You get CUT. The smart money LEFT yesterday. TOTAL DISASTER.`,
    `${name} lost ${abs}% in ONE DAY. I've seen buildings demolished slower than this. The CEO is probably updating their LinkedIn RIGHT NOW. If you bought this morning, I genuinely feel sorry for you. TRULY INCREDIBLE destruction of wealth.`,
    `${abs}% down? Listen, I've bankrupted casinos and even I wouldn't touch ${name} right now. This isn't a stock — it's a CRIME SCENE. Somebody call the SEC because shareholders just got ROBBED in broad daylight.`,
    `${name} dropping ${abs}% is like watching a plane crash in slow motion — everyone sees it, nobody can stop it. The INSIDERS sold last week. You're not buying the dip, you're buying the GRAVE. I've seen better investments in LOTTERY TICKETS.`,
    `MINUS ${abs} PERCENT. That's not a pullback, that's a FUNERAL. ${name} is DONE. The board is panicking, the shorts are FEASTING, and retail investors are holding bags heavier than my gold-plated toilet. PATHETIC.`,
    `I've fired people for losing less money than ${name} lost today. ${abs}% gone — POOF — like it never existed. This stock has more red flags than a Chinese military parade. GET OUT while you still have SOMETHING left.`,
  ]) };

  if (s.change < -15) return { rating: 'RUN', ratingColor: '#FF4545', emoji: '🏃', roast: pickRandom([
    `${name} dropped ${abs}% and people are PANICKING. But is it justified? ABSOLUTELY. When a stock drops this much, it's not "on sale" — it's BROKEN. Something is VERY wrong and the insiders already knew. RUN.`,
    `${name} down ${abs}%. You know who's NOT panicking? The executives who sold their shares LAST MONTH. They knew. They ALWAYS know. Meanwhile you're sitting there thinking "maybe it'll bounce back." It WON'T.`,
    `NEGATIVE ${abs}%? ${name} is bleeding like a stuck pig and the analysts are STILL saying "hold." These are the same geniuses who rated Enron a BUY. When the ship is sinking, you don't rearrange the deck chairs — you SWIM.`,
    `${name} just lost ${abs}% of its value and somewhere a hedge fund manager is buying his THIRD yacht with your money. Wall Street LOVES investors like you — loyal, hopeful, and WRONG. This stock needs a MIRACLE.`,
    `Down ${abs}%. Let me tell you something — I built a REAL ESTATE EMPIRE and never once did a building lose ${abs}% in a day. ${name} is proof that some companies should've stayed PRIVATE. The market is PUNISHING them and it's NOT done yet.`,
    `${name} lost ${abs}% today. That's not a correction, that's a CONFESSION. The market is telling you something very clearly: THIS COMPANY HAS PROBLEMS. The smartest thing you can do? Listen to the market, not Reddit.`,
  ]) };

  if (s.change > 100) return { rating: 'CASINO', ratingColor: '#FF4545', emoji: '🎲', roast: pickRandom([
    `Up ${s.change.toFixed(0)}%? I've made better deals buying BUILDINGS. ${name} just went VERTICAL and everyone's rushing in like Black Friday at Walmart. This is a CASINO, not investing. MASSIVELY DANGEROUS.`,
    `${name} gained ${s.change.toFixed(0)}% and Wall Street Bets is having a PARTY. But you know what happens after every party? THE HANGOVER. This stock went from "nobody cares" to "everybody's a genius" in one day. That's not investing — that's GAMBLING with extra steps.`,
    `PLUS ${s.change.toFixed(0)} PERCENT? Are you KIDDING me? ${name} moved like it found the cure for cancer, solved world hunger, AND discovered cold fusion — all before lunch. This isn't sustainable. This is PURE MANIA. The crash will be SPECTACULAR.`,
    `${name} up ${s.change.toFixed(0)}%. I've built skyscrapers that didn't go up this fast. Every cab driver and their grandmother is buying this stock right now. When the shoeshine boy gives you stock tips, it's time to SELL. Warren Buffett taught me that. Actually, I taught HIM that.`,
    `${s.change.toFixed(0)}% gain in a single day. That's not a stock, that's a MEME with a ticker symbol. ${name} has officially entered clown territory. The only people making money here are the ones who got in YESTERDAY and are selling to YOU right now.`,
  ]) };

  if (s.change > 30) return { rating: 'OVERHYPED', ratingColor: '#FF4545', emoji: '🔥', roast: pickRandom([
    `${name} surged ${abs}%. TREMENDOUS move. But when EVERYONE is buying, the smart people SELL. Pure MOMENTUM, not fundamentals. Hot things COOL DOWN. Every single time.`,
    `${abs}% up? ${name} is HOTTER than my Mar-a-Lago steak right now. But here's what they don't tell you on CNBC — for every person celebrating gains, there's a short seller planning the COUNTERATTACK. Gravity is UNDEFEATED.`,
    `${name} just popped ${abs}%. Beautiful. Magnificent. And completely UNSUSTAINABLE. I've seen this movie a THOUSAND times. Act one: euphoria. Act two: "it's different this time." Act three: "I should've sold at the top." You're in act ONE.`,
    `Up ${abs}%! ${name} is on FIRE and everyone's running TOWARD it instead of away. You know what else was hot? Pets.com. WeWork. FTX. Being hot doesn't mean being SMART. This stock needs to PROVE itself, not just PERFORM.`,
    `${name} gained ${abs}% today.${cap} Sounds great, right? WRONG. This kind of move attracts the WORST kind of investor — the ones who buy high and pray. The institutions are already setting their SELL orders. You're bringing a spoon to a KNIFE fight.`,
    `BOOM! ${name} explodes ${abs}%. I love it. TREMENDOUS energy. But you know what? Energy without fundamentals is just a FIREWORK — bright, loud, and gone in 30 seconds. Show me the EARNINGS. Show me the MOAT. Otherwise this is just NOISE.`,
    `${name} surges ${abs}%. Only in AMERICA can a stock go up this much in ONE DAY. 🇺🇸 God bless American capitalism. But remember — what goes up MUST come down. Unless you're the DOLLAR. The dollar NEVER loses. Well, almost never.`,
  ]) };

  if (s.change > 15) return { rating: 'RISKY', ratingColor: '#F59E0B', emoji: '⚠️', roast: pickRandom([
    `${name} up ${abs}%. Nice. But ${abs}% in one day means SOMEBODY knows something you don't. Institutional money moves FIRST.${cap} You're not investing, you're HOPING.`,
    `${name} climbed ${abs}%. Not bad. But when I see a stock jump this much, my FIRST question is: what do the insiders know that I DON'T? Because in this market, information is POWER, and retail investors are always LAST to the party.`,
    `Plus ${abs}% for ${name}. The talking heads on TV are probably calling this a "breakout." I call it SUSPICIOUS. Stocks don't move ${abs}% on vibes alone. Somebody KNOWS something. The question is: are YOU that somebody? Didn't think so.`,
    `${name} pops ${abs}%.${cap} Look, I respect a good rally. But I've been in business LONGER than most of these companies have EXISTED. A ${abs}% day usually means tomorrow is a 5% DOWN day. The market GIVETH and the market TAKETH away.`,
    `Up ${abs}%? ${name} is having a MOMENT. But moments are just that — MOMENTS. I didn't build a billion-dollar brand on moments. I built it on CONSISTENCY. Can ${name} be consistent? The chart says MAYBE. My gut says PROBABLY NOT.`,
    `${name} surged ${abs}% and your buddy who bought it last week won't shut up about it. But being early and being LUCKY are very different things. Ask yourself: would you buy it NOW at this price? If you hesitate, you have your ANSWER.`,
  ]) };

  if (s.change > 5) return { rating: 'DECENT', ratingColor: '#00D474', emoji: '👍', roast: pickRandom([
    `${name} gained ${abs}%. Solid, not spectacular. The real question: can they SUSTAIN this? History says probably not. DECENT play for the brave.`,
    `${name} up ${abs}%. That's what I call a RESPECTABLE day. Not gonna make you rich, not gonna make you poor. It's the stock market equivalent of a SOLID handshake — firm, confident, and forgettable by tomorrow.`,
    `Plus ${abs}% for ${name}. Decent. Not "quit your job" money, not "cry into your pillow" money. Just a nice, clean, modest gain. In THIS market? I'll take it. Sometimes boring is BEAUTIFUL.`,
    `${name} climbs ${abs}%.${cap} Look, this isn't gonna get you on the news. Nobody's writing Reddit posts about a ${abs}% gain. But you know what? The BEST investors are BORING investors. Slow and steady. Like a TURTLE with a Bloomberg terminal.`,
    `${abs}% up for ${name}. That's the kind of gain that makes you feel SMART but not smart enough to do anything STUPID. Keep it. Don't get greedy. I've seen more fortunes lost to GREED than to bad picks.`,
    `${name} adds ${abs}% today. That's what we call "walking money" — nothing to run about, nothing to cry about. If all your stocks moved like this every day, you'd be a BILLIONAIRE in... well, a very long time. But you'd GET there.`,
    `${name} up ${abs}%. 🇺🇸 MADE IN AMERICA, WINNING IN AMERICA. This is what happens when you invest in the GREATEST economy on earth. The rest of the world wishes they had a stock market like OURS.`,
  ]) };

  if (s.change < -5) return { rating: 'WATCH', ratingColor: '#F59E0B', emoji: '👀', roast: pickRandom([
    `${name} down ${Math.abs(s.change).toFixed(1)}%. Not GREAT, not TERRIBLE. Could be a buying opportunity, could be the START of something worse. Nobody knows. That's the honest truth.`,
    `${name} drops ${Math.abs(s.change).toFixed(1)}%. Is it a DIPPING sauce or is it actually ROTTING? Hard to tell. The optimists say "sale!" The realists say "there's a REASON." I say: wait for the EARNINGS call before you make any brave decisions.`,
    `Minus ${Math.abs(s.change).toFixed(1)}% for ${name}. Not catastrophic, but not great either. It's like getting a C+ on a test — your parents aren't angry, but they're DISAPPOINTED. And in the stock market, disappointment usually means MORE pain ahead.`,
    `${name} lost ${Math.abs(s.change).toFixed(1)}%.${cap} This is the stock market's way of saying "we're NOT angry, we're just CONFUSED." Something spooked investors and until we know WHAT, I'd keep this on the WATCHLIST, not the BUY list.`,
    `Down ${Math.abs(s.change).toFixed(1)}%. ${name} had a BAD day. Not a TERRIBLE day — bad. Like spilling coffee on your shirt before a meeting. You'll survive, but it's not a great LOOK. Watch the next few days CAREFULLY.`,
    `${name} slides ${Math.abs(s.change).toFixed(1)}%. This is the danger zone — not enough to panic, not enough to ignore. It's the stock market's way of WHISPERING that something might be wrong. And whispers in this business become SCREAMS real fast.`,
  ]) };

  return { rating: 'BORING', ratingColor: '#6B7280', emoji: '😴', roast: pickRandom([
    `${name} moved ${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}%. BORING. Your portfolio went from $10,000 to $10,${Math.abs(Math.round(s.change * 10))}. CONGRATULATIONS on your extra coffee.`,
    `${name}: ${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}%. I've had ELEVATORS move more than this stock. If you're watching this ticker for excitement, might I suggest PAINT DRYING? It's faster. Your time is worth more than this.`,
    `${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}% for ${name}. That's not a stock movement, that's a ROUNDING ERROR. My accountants wouldn't even bother LOGGING this. Go outside. Touch grass. This stock is as exciting as OATMEAL.`,
    `${name} changed ${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}%. WOW. INCREDIBLE. I'm on the EDGE of my seat. Said NOBODY. This stock is moving like a SLOTH on sedatives. If this is your portfolio's star performer, we need to TALK.`,
    `${name}: ${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}%. That's not investing, that's a SAVINGS ACCOUNT with extra anxiety. You could've made more money finding change in your COUCH CUSHIONS. At least THAT doesn't require a brokerage account.`,
    `Plus ${s.change.toFixed(1)}% for ${name}. Thrilling. Absolutely THRILLING. I've seen more action at a LIBRARY on a Tuesday afternoon. This stock is the human-resources-meeting of the financial world — technically important, practically ASLEEP.`,
  ]) };
}

const cardStyle = { background: '#111827', borderRadius: 18, border: '1px solid #1E293B', overflow: 'hidden' as const };

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '10px 8px', borderRadius: 10, background: '#0D1117', textAlign: 'center', border: '1px solid #1F2937' }}>
      <div style={{ fontSize: 9, color: '#6B7280', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', fontFamily: 'var(--mono)', marginTop: 3 }}>{value}</div>
    </div>
  );
}

function StockCard({ s }: { s: Mover }) {
  const [expanded, setExpanded] = useState(false);
  const [showRoast, setShowRoast] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const roast = generateRoast(s);
  const isUp = s.change >= 0;

  return (
    <div style={cardStyle}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0D1117', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#60A5FA', fontFamily: 'var(--mono)' }}>
          {s.image ? <Image src={s.image} alt={s.name || s.ticker} width={26} height={26} style={{ borderRadius: 5 }} unoptimized /> : s.ticker.slice(0, 4)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{s.name || s.ticker}</div>
          <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>{s.ticker}{s.sector ? ` · ${s.sector}` : ''}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9', fontFamily: 'var(--mono)' }}>${s.price.toFixed(2)}</div>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: isUp ? '#00D4741A' : '#FF45451A', color: isUp ? '#00D474' : '#FF4545', fontFamily: 'var(--mono)' }}>
            {isUp ? '+' : ''}{s.change.toFixed(1)}%
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid #1F2937' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, margin: '14px 0' }}>
            {s.marketCapFmt && <MetricBox label="Mkt Cap" value={s.marketCapFmt} />}
            {s.revenue && <MetricBox label="Revenue" value={s.revenue} />}
            {s.netIncome && <MetricBox label="Net Inc" value={s.netIncome} />}
            {s.eps && <MetricBox label="EPS" value={`$${typeof s.eps === 'number' ? s.eps.toFixed(2) : s.eps}`} />}
            {s.volume > 0 && <MetricBox label="Volume" value={`${(s.volume / 1e6).toFixed(1)}M`} />}
            {s.employees && <MetricBox label="Staff" value={Number(s.employees).toLocaleString()} />}
            {s.range52w && <MetricBox label="52W" value={s.range52w} />}
            {s.exchange && <MetricBox label="Exch" value={s.exchange} />}
          </div>
          {s.description && (
            <div style={{ padding: '10px 12px', borderRadius: 8, background: '#0D1117', border: '1px solid #1F2937', marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>{s.description}</p>
              {s.ceo && <p style={{ fontSize: 10, color: '#475569', margin: '4px 0 0' }}>CEO: {s.ceo}</p>}
            </div>
          )}
          {!showRoast ? (
            <button onClick={() => { setShowRoast(true); setTimeout(() => setRevealed(true), 300); }}
              style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg,#C73E3A,#E85D59)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              🔥 Get the Brutal AI Take
            </button>
          ) : (
            <div style={{ background: '#C73E3A08', borderRadius: 12, border: '1px solid #C73E3A20', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', background: '#C73E3A10', borderBottom: '1px solid #C73E3A15', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 18 }}>{roast.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#C73E3A', letterSpacing: 2, fontFamily: 'var(--mono)' }}>BRUTAL AI TAKE</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 5, background: `${roast.ratingColor}20`, color: roast.ratingColor, fontFamily: 'var(--mono)' }}>{roast.rating}</span>
              </div>
              <div style={{ padding: 14, opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.5s' }}>
                <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>"{roast.roast}"</p>
                <ReactionButtons ticker={s.ticker} />
              </div>
              <div style={{ padding: '8px 14px', borderTop: '1px solid #1F2937', background: '#0D111780' }}>
                <p style={{ fontSize: 8, color: '#475569', margin: 0, textAlign: 'center' }}>🤖 Satirical AI. Entertainment only. NOT investment advice.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MarketsPage() {
  const [data, setData] = useState<{ gainers: Mover[]; losers: Mover[]; actives: Mover[] }>({ gainers: [], losers: [], actives: [] });
  const [tab, setTab] = useState<TabId>('gainers');
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/markets')
      .then(r => r.json())
      .then(d => {
        if (d.gainers?.length > 0) {
          setData({ gainers: d.gainers, losers: d.losers || [], actives: d.actives || [] });
          setIsLive(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = data[tab];

  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>DHLM</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#C73E3A', letterSpacing: 2 }}>STUDIO</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--mono)' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {isLive && <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: '#00D47418', color: '#00D474', fontWeight: 700, fontFamily: 'var(--mono)' }}>● LIVE</span>}
          </div>
        </div>

        {/* Banner */}
        <div style={{ padding: '16px 18px', borderRadius: 14, background: 'linear-gradient(135deg,#C73E3A10,#C73E3A05)', border: '1px solid #C73E3A15', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 24 }}>🔥</span>
            <div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900, color: '#F1F5F9', margin: 0 }}>Today's Markets</h1>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#C73E3A', letterSpacing: 2, marginTop: 1 }}>BRUTAL AI COMMENTARY</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
            Click any stock → expand → hit <strong style={{ color: '#C73E3A' }}>"Brutal AI Take"</strong> for savage, unfiltered commentary.
          </p>
        </div>

        {/* Bless My Stock Link */}
        <Link href="/markets/bless" style={{ display: 'block', padding: '14px 18px', borderRadius: 14, background: 'linear-gradient(135deg, #D4A84310, #D4A84305)', border: '1px solid #D4A84320', marginBottom: 16, textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🙏</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#D4A843' }}>Bless My Stock</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>Light incense for your portfolio. 100% to charity.</div>
              </div>
            </div>
            <span style={{ fontSize: 12, color: '#D4A843', fontFamily: 'var(--mono)' }}>→</span>
          </div>
        </Link>

        {/* Quick Links */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {[
            { href: '/markets/gainers', label: '🟢 All Gainers' },
            { href: '/markets/losers', label: '🔴 All Losers' },
            { href: '/markets/most-active', label: '📊 Most Active' },
            { href: '/markets/search', label: '🔍 Search' },
            { href: '/markets/sectors', label: '🗺️ Sector Heatmap' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 11, color: '#475569', padding: '5px 12px', borderRadius: 20, background: '#111827', border: '1px solid #1E293B', fontFamily: 'var(--sans)' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Tabs: Gainers / Losers / Most Active */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#111827', borderRadius: 10, padding: 3, border: '1px solid #1E293B' }}>
          {([
            { id: 'gainers' as TabId, label: '🟢 Gainers', count: data.gainers.length },
            { id: 'losers' as TabId, label: '🔴 Losers', count: data.losers.length },
            { id: 'actives' as TabId, label: '📊 Most Active', count: data.actives.length },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
              background: tab === t.id ? '#1E293B' : 'transparent',
              color: tab === t.id ? '#F1F5F9' : '#6B7280',
              fontSize: 12, fontWeight: tab === t.id ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--sans)',
            }}>{t.label}{t.count > 0 ? ` (${t.count})` : ''}</button>
          ))}
        </div>

        {loading && <p style={{ fontSize: 13, color: '#64748B' }}>Loading live data...</p>}

        {/* Stock list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.length > 0 ? items.map(s => <StockCard key={s.ticker} s={s} />) : (
            !loading && <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: 40 }}>No data available. Try again later.</p>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 10, background: '#C73E3A08', border: '1px solid #C73E3A10' }}>
          <p style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.7, textAlign: 'center', margin: 0 }}>
            🤖 BRUTAL AI is satirical. <strong style={{ color: '#C73E3A' }}>NOT investment advice</strong>. Data: Alpha Vantage + FMP. Prices may be delayed.
          </p>
        </div>
      </div>
    </div>
  );
}
