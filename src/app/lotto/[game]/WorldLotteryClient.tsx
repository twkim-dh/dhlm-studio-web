'use client';

import { useState } from 'react';
import Link from 'next/link';
import { worldLotteries, getLotteryById, generateLottery, formatShareText, type LotteryDef, type GeneratedResult } from '@/lib/world-lottery';

function BallColor(n: number, max: number): string {
  const pct = n / max;
  if (pct <= 0.2) return '#FBBF24';
  if (pct <= 0.4) return '#3B82F6';
  if (pct <= 0.6) return '#EF4444';
  if (pct <= 0.8) return '#9CA3AF';
  return '#22C55E';
}

function LotteryBall({ n, max, size = 40, isBonus = false }: { n: number; max: number; size?: number; isBonus?: boolean }) {
  return (
    <div className="inline-flex items-center gap-1">
      {isBonus && <span className="text-gray-400 font-bold text-xs">+</span>}
      <div className="rounded-full flex items-center justify-center font-bold text-white text-sm"
        style={{ width: size, height: size, background: isBonus ? '#C5981A' : BallColor(n, max), boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)' }}>
        {n}
      </div>
    </div>
  );
}

export default function WorldLotteryClient({ lotteryId }: { lotteryId: string }) {
  const [selectedId, setSelectedId] = useState(lotteryId);
  const [sets, setSets] = useState(1);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [msg, setMsg] = useState('');

  const lottery = getLotteryById(selectedId)!;

  const generate = () => {
    setResults(generateLottery(lottery, sets));
    setMsg('');
  };

  const handleShare = async () => {
    if (!results.length) return;
    const text = results.map((r) => formatShareText(lottery, r)).join('\n\n');
    if (navigator.share) { try { await navigator.share({ title: `${lottery.name} Numbers`, text }); return; } catch {} }
    await navigator.clipboard.writeText(text);
    setMsg('Copied!');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">🌍 World Lottery</h1>
        <p className="text-gray-500 text-sm mt-1">Choose your lottery & generate numbers</p>
      </div>

      {/* Lottery selector grid */}
      <div className="grid grid-cols-5 gap-1.5 mb-6">
        {worldLotteries.map((l) => (
          <button key={l.id} onClick={() => { setSelectedId(l.id); setResults([]); }}
            className={`py-2 px-1 rounded-lg text-center transition ${
              selectedId === l.id ? 'ring-2 ring-blue-500 ring-offset-1 bg-white shadow-sm' : 'bg-gray-50 hover:bg-gray-100'
            }`}>
            <span className="text-lg block">{l.country}</span>
            <span className="text-[9px] font-medium text-gray-700 block leading-tight">{l.name.length > 10 ? l.name.split(' ')[0] : l.name}</span>
          </button>
        ))}
      </div>

      {/* Selected lottery info */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{lottery.country}</span>
          <div>
            <h2 className="font-bold text-lg">{lottery.name}</h2>
            <p className="text-xs text-gray-500">
              {lottery.mainNumbers.count} numbers ({lottery.mainNumbers.min}-{lottery.mainNumbers.max})
              {lottery.bonusNumbers && ` + ${lottery.bonusNumbers.count} ${lottery.bonusNumbers.name} (${lottery.bonusNumbers.min}-${lottery.bonusNumbers.max})`}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Draw: {lottery.drawDays.join(', ')} · Age: {lottery.ageRestriction}
        </p>
      </div>

      {/* Sets + Generate */}
      <div className="flex gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3">
          <span className="text-xs text-gray-500">Sets</span>
          {[1, 3, 5].map((n) => (
            <button key={n} onClick={() => setSets(n)}
              className={`w-7 h-7 rounded text-xs font-bold transition ${sets === n ? 'text-white' : 'text-gray-500 hover:bg-gray-200'}`}
              style={sets === n ? { background: lottery.color } : {}}>
              {n}
            </button>
          ))}
        </div>
        <button onClick={generate}
          className="flex-1 py-3 text-white rounded-lg font-bold text-sm transition active:scale-[0.98]"
          style={{ background: lottery.color }}>
          Generate Numbers
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
          {results.map((r, i) => (
            <div key={i} className={`${i > 0 ? 'pt-3 border-t border-gray-100' : ''}`}>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-gray-400 w-5">{String.fromCharCode(65 + i)}</span>
                {r.main.map((n) => (
                  <LotteryBall key={`m${n}`} n={n} max={lottery.mainNumbers.max} />
                ))}
                {r.bonus && r.bonus.map((n) => (
                  <LotteryBall key={`b${n}`} n={n} max={lottery.bonusNumbers!.max} isBonus />
                ))}
              </div>
              {r.bonus && (
                <p className="text-[10px] text-gray-400 mt-1 ml-5">
                  Main: {r.main.join(', ')} · {r.bonusName}: {r.bonus.join(', ')}
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button onClick={async () => {
              const text = results.map((r) => {
                const main = r.main.join(', ');
                const bonus = r.bonus ? ` + ${r.bonusName}: ${r.bonus.join(', ')}` : '';
                return `${main}${bonus}`;
              }).join('\n');
              await navigator.clipboard.writeText(text);
              setMsg('Copied!');
              setTimeout(() => setMsg(''), 2000);
            }} className="flex-1 py-2.5 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
              📋 Copy
            </button>
            <button onClick={handleShare}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition"
              style={{ background: lottery.color }}>
              Share
            </button>
          </div>
          {msg && <p className="text-center text-xs text-green-600">{msg}</p>}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
        This is a random number generator for entertainment purposes only.<br />
        Not affiliated with any official lottery organization.<br />
        Always purchase tickets through official channels.
      </p>

      {/* Link to other lotteries */}
      <div className="mt-8">
        <p className="text-xs text-gray-500 font-medium mb-2">Other Lotteries</p>
        <div className="flex flex-wrap gap-1.5">
          {worldLotteries.filter((l) => l.id !== selectedId).map((l) => {
            const slugMap: Record<string, string> = {
              'us-powerball': 'powerball', 'us-megamillions': 'mega-millions', 'euromillions': 'euromillions',
              'eurojackpot': 'eurojackpot', 'uk-lottery': 'uk-lottery', 'japan-loto6': 'japan-loto6',
              'australia-powerball': 'australia-powerball', 'brazil-megasena': 'mega-sena', 'canada-lottomax': 'lotto-max',
            };
            const slug = slugMap[l.id];
            if (!slug && l.id === 'korea-lotto') return (
              <Link key={l.id} href="/lotto" className="px-2.5 py-1 bg-gray-50 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition">
                {l.country} {l.name}
              </Link>
            );
            if (!slug) return null;
            return (
              <Link key={l.id} href={`/lotto/${slug}`} className="px-2.5 py-1 bg-gray-50 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition">
                {l.country} {l.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
