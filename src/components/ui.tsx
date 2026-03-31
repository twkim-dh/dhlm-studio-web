/**
 * DHLM-STUDIO Shared UI Components
 * Extracted from repeated patterns across 9+ page files.
 * Use these instead of copy-pasting inline style objects.
 */

import React from 'react';

/* ═══ Design Tokens ═══ */
export const colors = {
  bg: '#0B0F19',
  card: '#111827',
  cardDeep: '#0D1117',
  border: '#1E293B',
  borderInner: '#1F2937',
  elevated: '#1C2333',
  hover: '#263347',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDim: '#5A6577', // upgraded from #475569 for WCAG AA (4.5:1)
  accent: '#C73E3A',
  green: '#00D474',
  red: '#FF4545',
  blue: '#3B82F6',
  blueLight: '#60A5FA',
  gold: '#D4A843',
  purple: '#A78BFA',
  amber: '#F59E0B',
  statusGreen: '#10B981',
} as const;

/* ═══ Card ═══ */
export function Card({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        background: colors.card,
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ═══ Section Header ═══ */
export function SectionHeader({
  tag,
  tagColor,
  title,
  linkText,
  linkHref,
}: {
  tag: string;
  tagColor: string;
  title: string;
  linkText?: string;
  linkHref?: string;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: tagColor, letterSpacing: 3, marginBottom: 4 }}>{tag}</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 800, color: colors.textPrimary, margin: 0 }}>{title}</h2>
      </div>
      {linkText && linkHref && (
        <a href={linkHref} style={{ fontSize: 12, color: tagColor, fontWeight: 600, fontFamily: 'var(--sans)' }}>{linkText}</a>
      )}
    </div>
  );
}

/* ═══ Change Badge ═══ */
export function ChangeBadge({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' }) {
  const isUp = value >= 0;
  const fontSize = size === 'sm' ? 12 : 13;
  const padding = size === 'sm' ? '2px 7px' : '3px 10px';
  return (
    <span style={{
      fontSize,
      fontWeight: 700,
      padding,
      borderRadius: 6,
      background: isUp ? '#00D4741A' : '#FF45451A',
      color: isUp ? colors.green : colors.red,
      fontFamily: 'var(--mono)',
    }}>
      {isUp ? '+' : ''}{value.toFixed(1)}%
    </span>
  );
}

/* ═══ MetricBox ═══ */
export function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '10px 8px', borderRadius: 10, background: colors.cardDeep, textAlign: 'center', border: `1px solid ${colors.borderInner}` }}>
      <div style={{ fontSize: 9, color: colors.textMuted, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, fontFamily: 'var(--mono)', marginTop: 3 }}>{value}</div>
    </div>
  );
}

/* ═══ Tag ═══ */
export function Tag({ children, color = colors.textMuted }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: `${color}14`, color, fontFamily: 'var(--mono)' }}>
      {children}
    </span>
  );
}

/* ═══ Live Badge ═══ */
export function LiveBadge({ source }: { source: string }) {
  return (
    <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: '#00D47418', color: colors.statusGreen, fontWeight: 700, fontFamily: 'var(--mono)' }}>
      ● LIVE{source ? ` — ${source}` : ''}
    </span>
  );
}

/* ═══ Page Wrapper ═══ */
export function PageWrapper({ children, maxWidth = 720 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth, margin: '0 auto', padding: '80px 16px' }}>
        {children}
      </div>
    </div>
  );
}

/* ═══ Skeleton Loader ═══ */
export function Skeleton({ width, height = 16, borderRadius = 6 }: { width?: number | string; height?: number; borderRadius?: number }) {
  return (
    <div
      style={{
        width: width || '100%',
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${colors.card} 25%, ${colors.elevated} 50%, ${colors.card} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

/* ═══ Skeleton Card ═══ */
export function SkeletonCard() {
  return (
    <Card style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <Skeleton width={40} height={40} borderRadius={10} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={10} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <Skeleton width={80} height={18} />
        <Skeleton width={50} height={16} borderRadius={5} />
      </div>
    </Card>
  );
}
