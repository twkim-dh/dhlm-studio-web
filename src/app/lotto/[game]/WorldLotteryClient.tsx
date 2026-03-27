'use client';

import { useState } from 'react';
import Link from 'next/link';
import { worldLotteries, getLotteryById, generateLottery, formatShareText, type LotteryDef, type GeneratedResult } from '@/lib/world-lottery';

function BallColor(n: number, max: number): string {
  const pct = n / max;
  if (pct <= 0.2) return '#8B2500';
  if (pct <= 0.4) return '#1A237E';
  if (pct <= 0.6) return '#1B5E20';
  if (pct <= 0.8) return '#C5981A';
  return '#2C1810';
}

function Ball({ n, max, size = 40, isBonus = false }: { n: number; max: number; size?: number; isBonus?: boolean }) {
  return (
    <div className="inline-flex items-center gap-1">
      {isBonus && <span className="font-bold text-xs" style={{ color: '#8D8478' }}>+</span>}
      <div className="rounded-full flex items-center justify-center font-bold text-white text-sm"
        style={{ width: size, height: size, background: isBonus ? '#C5981A' : BallColor(n, max), boxShadow: '0 2px 4px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.2)' }}>
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

  const generate = () => { setResults(generateLottery(lottery, sets)); setMsg(''); };

  const slugMap: Record<string, string> = {
    'us-powerball': 'powerball', 'us-megamillions': 'mega-millions', 'euromillions': 'euromillions',
    'eurojackpot': 'eurojackpot', 'uk-lottery': 'uk-lottery', 'japan-loto6': 'japan-loto6',
    'australia-powerball': 'australia-powerball', 'brazil-megasena': 'mega-sena', 'canada-lottomax': 'lotto-max',
  };

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      {/* Header */}
      <div className="py-8 text-center">
        <p className="text-[10px] tracking-[0.4em] mb-1" style={{ color: '#8B2500' }}>DHLM STUDIO</p>
        <h1 className="text-2xl font-bold tracking-[0.1em]"
          style={{ fontFamily: 'var(--font-noto-serif-kr), serif', color: '#2C1810' }}>
          {lottery.country} {lottery.lang.title}
        </h1>
        <p className="text-xs mt-1" style={{ color: '#8D8478' }}>{lottery.name}</p>
        <div className="w-8 h-[2px] mx-auto mt-3" style={{ background: '#8B2500' }} />
      </div>

      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Lottery selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide mb-5">
          {worldLotteries.map((l) => (
            <button key={l.id} onClick={() => { setSelectedId(l.id); setResults([]); }}
              className={`shrink-0 px-3 py-2 rounded text-center text-xs font-medium transition ${
                selectedId === l.id ? 'bg-[#8B2500] text-white' : 'bg-white text-[#2C1810]'
              }`} style={{ borderRadius: '4px', border: selectedId === l.id ? 'none' : '1px solid #D5CEC3' }}>
              {l.country} {l.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-white border rounded p-4 mb-4" style={{ borderColor: '#D5CEC3', borderRadius: '4px' }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{lottery.country}</span>
            <div>
              <p className="font-bold text-base" style={{ color: '#2C1810' }}>{lottery.name}</p>
              <p className="text-xs" style={{ color: '#8D8478' }}>
                {lottery.mainNumbers.count} {lottery.lang.numbers} ({lottery.mainNumbers.min}-{lottery.mainNumbers.max})
                {lottery.bonusNumbers && ` + ${lottery.bonusNumbers.count} ${lottery.bonusNumbers.name} (${lottery.bonusNumbers.min}-${lottery.bonusNumbers.max})`}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#A5A09A' }}>{lottery.lang.draw}: {lottery.drawDays.join(', ')} · {lottery.ageRestriction}</p>
            </div>
          </div>
        </div>

        {/* Generate */}
        <div className="flex gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-white border rounded px-3" style={{ borderColor: '#D5CEC3', borderRadius: '4px' }}>
            <span className="text-xs" style={{ color: '#8D8478' }}>{lottery.lang.sets}</span>
            {[1, 3, 5].map((n) => (
              <button key={n} onClick={() => setSets(n)}
                className={`w-7 h-7 rounded text-xs font-bold transition ${sets === n ? 'bg-[#8B2500] text-white' : 'text-[#8D8478]'}`}>
                {n}
              </button>
            ))}
          </div>
          <button onClick={generate}
            className="flex-1 py-3 text-white rounded font-bold text-sm transition active:scale-[0.98]"
            style={{ background: '#8B2500', borderRadius: '4px' }}>
            {lottery.lang.generate}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white border rounded p-4 space-y-3" style={{ borderColor: '#D5CEC3', borderRadius: '4px' }}>
            {results.map((r, i) => (
              <div key={i} className={i > 0 ? 'pt-3 border-t border-[#E0D8CC]' : ''}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold w-5" style={{ color: '#C5981A' }}>{String.fromCharCode(65 + i)}</span>
                  {r.main.map((n) => <Ball key={`m${n}`} n={n} max={lottery.mainNumbers.max} />)}
                  {r.bonus?.map((n) => <Ball key={`b${n}`} n={n} max={lottery.bonusNumbers!.max} isBonus />)}
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-3 border-t border-[#E0D8CC]">
              <button onClick={async () => {
                const text = results.map(r => `${r.main.join(', ')}${r.bonus ? ` + ${r.bonusName}: ${r.bonus.join(', ')}` : ''}`).join('\n');
                await navigator.clipboard.writeText(text); setMsg('Copied!'); setTimeout(() => setMsg(''), 2000);
              }} className="flex-1 py-2.5 rounded text-sm font-medium transition" style={{ background: '#E8E2D8', borderRadius: '4px', color: '#2C1810' }}>
                📋 {lottery.lang.copy}
              </button>
              <button onClick={async () => {
                const text = results.map(r => formatShareText(lottery, r)).join('\n\n');
                if (navigator.share) { try { await navigator.share({ title: `${lottery.name}`, text }); return; } catch {} }
                await navigator.clipboard.writeText(text); setMsg('Copied!'); setTimeout(() => setMsg(''), 2000);
              }} className="flex-1 py-2.5 rounded text-sm font-medium text-white transition" style={{ background: '#8B2500', borderRadius: '4px' }}>
                {lottery.lang.share}
              </button>
            </div>
            {msg && <p className="text-center text-xs text-green-700">{msg}</p>}
          </div>
        )}

        {/* Other lotteries */}
        <div className="mt-8">
          <p className="text-xs font-medium mb-2" style={{ color: '#8D8478' }}>{lottery.lang.otherLotteries}</p>
          <div className="flex flex-wrap gap-1.5">
            <Link href="/lotto" className="px-2.5 py-1 bg-white border rounded text-[10px] transition hover:border-[#C5981A]"
              style={{ color: '#2C1810', borderColor: '#D5CEC3', borderRadius: '4px' }}>
              🇰🇷 Korea 6/45
            </Link>
            {worldLotteries.filter(l => slugMap[l.id] && l.id !== selectedId).map(l => (
              <Link key={l.id} href={`/lotto/${slugMap[l.id]}`}
                className="px-2.5 py-1 bg-white border rounded text-[10px] transition hover:border-[#C5981A]"
                style={{ color: '#2C1810', borderColor: '#D5CEC3', borderRadius: '4px' }}>
                {l.country} {l.name}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] mt-6" style={{ color: '#B5AFA5' }}>
          {lottery.lang.disclaimer}
        </p>
      </div>
    </div>
  );
}
