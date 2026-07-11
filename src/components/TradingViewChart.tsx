'use client';
/**
 * TradingViewChart — embeds the free TradingView Advanced Chart widget.
 * Used on /markets/[ticker] stock detail pages.
 */
import { useEffect, useId } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TradingView: { widget: new (config: Record<string, unknown>) => void };
  }
}

// Map FMP exchangeShortName → TradingView exchange prefix
function tvSymbol(ticker: string, exchange?: string): string {
  const ex = (exchange || '').toUpperCase();
  const prefix =
    ex === 'NASDAQ' ? 'NASDAQ' :
    ex === 'NYSE'   ? 'NYSE'   :
    ex === 'AMEX'   ? 'AMEX'   :
    ex === 'NYSEArca' ? 'AMEX'  :
    ''; // TradingView can usually resolve without prefix
  return prefix ? `${prefix}:${ticker.toUpperCase()}` : ticker.toUpperCase();
}

interface Props {
  ticker: string;
  exchange?: string;
}

export default function TradingViewChart({ ticker, exchange }: Props) {
  const uid = useId().replace(/:/g, '');
  const containerId = `tv_${uid}_${ticker.replace(/[^A-Za-z0-9]/g, '_')}`;
  const symbol = tvSymbol(ticker, exchange);

  useEffect(() => {
    // Avoid duplicate script loads
    const SCRIPT_ID = 'tradingview-tv-js';
    const init = () => {
      if (!window.TradingView) return;
      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: 'D',
        timezone: 'America/New_York',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#FAFAF8',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        hide_volume: false,
        container_id: containerId,
      });
    };

    if (document.getElementById(SCRIPT_ID)) {
      // Script already present — just init
      init();
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = init;
    document.head.appendChild(script);
  }, [symbol, containerId]);

  return (
    <div style={{ height: 420, borderRadius: 8, overflow: 'hidden', background: '#FAFAF8' }}>
      <div id={containerId} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
