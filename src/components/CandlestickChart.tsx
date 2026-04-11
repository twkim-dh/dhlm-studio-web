'use client';
/**
 * CandlestickChart — lightweight-charts v5 TradingView-style candle chart.
 * Used in /rankings/crypto/[symbol] page.
 * Props: coinId (for day-selector re-fetch), initialCandles (from server).
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import type { IChartApi } from 'lightweight-charts';

export interface OHLCPoint {
  ts: number;   // Unix ms
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Props {
  coinId: string;
  initialCandles: OHLCPoint[];
}

const DAYS_OPTIONS = [7, 30, 90] as const;

// Convert ms timestamps to lightweight-charts Time (Unix seconds)
function toChartData(candles: OHLCPoint[]) {
  return candles
    .filter(c => c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0)
    .map(c => ({
      time: Math.floor(c.ts / 1000) as unknown as import('lightweight-charts').Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
}

export default function CandlestickChart({ coinId, initialCandles }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef    = useRef<any>(null);

  const [days, setDays]       = useState<number>(30);
  const [candles, setCandles] = useState<OHLCPoint[]>(initialCandles);
  const [loading, setLoading] = useState(false);

  // ── Initialize chart (once on mount) ─────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    let chart: IChartApi | null = null;

    import('lightweight-charts').then(({ createChart, ColorType, CrosshairMode, CandlestickSeries }) => {
      if (!containerRef.current) return;

      chart = createChart(containerRef.current, {
        autoSize: true,           // responsive — no ResizeObserver needed
        height: 280,
        layout: {
          background: { type: ColorType.Solid, color: '#0D1117' },
          textColor: '#64748B',
          fontSize: 10,
        },
        grid: {
          vertLines: { color: '#1E293B' },
          horzLines: { color: '#1E293B' },
        },
        crosshair: { mode: CrosshairMode.Magnet },
        rightPriceScale: {
          borderColor: '#1E293B',
          textColor: '#64748B',
        },
        timeScale: {
          borderColor: '#1E293B',
          timeVisible: true,
          secondsVisible: false,
          fixLeftEdge: true,
          fixRightEdge: true,
        },
        handleScroll: { mouseWheel: false, pressedMouseMove: false },
        handleScale:  { mouseWheel: false, pinch: false },
      });

      // v5 API: chart.addSeries(CandlestickSeries, options)
      const series = chart.addSeries(CandlestickSeries, {
        upColor:        '#00D474',
        downColor:      '#C73E3A',
        borderUpColor:  '#00D474',
        borderDownColor:'#C73E3A',
        wickUpColor:    '#00D47499',
        wickDownColor:  '#C73E3A99',
      });

      chartRef.current  = chart;
      seriesRef.current = series;

      series.setData(toChartData(initialCandles));
      chart.timeScale().fitContent();
    });

    return () => {
      chart?.remove();
      chartRef.current  = null;
      seriesRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Update series data when candles state changes ─────────────────────────
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;
    seriesRef.current.setData(toChartData(candles));
    chartRef.current.timeScale().fitContent();
  }, [candles]);

  // ── Day selector ─────────────────────────────────────────────────────────
  const changeDay = useCallback(async (d: number) => {
    if (d === days || loading) return;
    setDays(d);
    setLoading(true);
    try {
      const res = await fetch(`/api/crypto/ohlc?id=${coinId}&days=${d}`);
      if (res.ok) {
        const json = await res.json();
        setCandles(json.points || []);
      }
    } catch { /* keep existing data */ }
    setLoading(false);
  }, [coinId, days, loading]);

  return (
    <div>
      {/* Day selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, paddingLeft: 4 }}>
        {DAYS_OPTIONS.map(d => (
          <button
            key={d}
            onClick={() => changeDay(d)}
            style={{
              fontFamily:  'var(--mono)',
              fontSize:    9,
              fontWeight:  700,
              padding:     '3px 10px',
              borderRadius: 4,
              border:      `1px solid ${days === d ? '#60A5FA' : '#1E293B'}`,
              background:  days === d ? '#60A5FA18' : 'transparent',
              color:       days === d ? '#60A5FA' : '#475569',
              cursor:      'pointer',
            }}
          >
            {d}D
          </button>
        ))}
        {loading && (
          <span style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--mono)' }}>Loading…</span>
        )}
      </div>

      {/* Chart container — autoSize fills parent width */}
      <div ref={containerRef} style={{ width: '100%' }} />
    </div>
  );
}
