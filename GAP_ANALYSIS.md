# DHLM-STUDIO Gap Analysis 2026

> **Platform**: dhlm-studio.com -- Dark-themed fintech data platform
> **Stack**: Next.js 16, React 19, Tailwind CSS v4, TypeScript 5
> **Scale**: 48 source files, 22 pages, 9 API routes, 87+ URLs
> **Date**: 2026-03-31
> **Sources**: Current State Analysis, Competitor Benchmark (20 sites), 2026 Web Design Trend Analysis

---

## Table of Contents

1. [4-1. Layout & Structure](#4-1-layout--structure)
2. [4-2. Typography](#4-2-typography)
3. [4-3. Color & Theme](#4-3-color--theme)
4. [4-4. Animation & Interaction](#4-4-animation--interaction)
5. [4-5. Data Visualization](#4-5-data-visualization)
6. [4-6. Mobile UX](#4-6-mobile-ux)
7. [4-7. Performance & Core Web Vitals](#4-7-performance--core-web-vitals)
8. [4-8. SEO & Metadata](#4-8-seo--metadata)
9. [4-9. Content Strategy](#4-9-content-strategy)
10. [4-10. Monetization & Ads](#4-10-monetization--ads)
11. [4-11. Accessibility & i18n](#4-11-accessibility--i18n)
12. [4-12. AI Features & Differentiation](#4-12-ai-features--differentiation)
13. [Priority Matrix](#priority-matrix)

---

## 4-1. Layout & Structure

### AS-IS

The entire codebase uses React inline `style={{}}` objects with card-based layouts. Every page wraps content in a container pattern:

```tsx
<div style={{ background: '#0B0F19', minHeight: '100vh' }}>
  <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 20px 60px' }}>
```

**Card component is redefined identically in 9+ files:**
- `page.tsx:65` -- `{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B' }`
- `markets/page.tsx:94` -- same object
- `creators/page.tsx:22` -- same object
- `rankings/page.tsx:81` -- same object
- `rankings/crypto/page.tsx:24` -- same object
- `gainers/page.tsx:12`, `losers/page.tsx:12`, `most-active/page.tsx:12`, `search/page.tsx:13` -- same object

Grid usage is limited to `repeat(auto-fit, minmax(240px, 1fr))` for categories and `repeat(auto-fit, minmax(280px, 1fr))` for tools. No CSS Grid named areas, no Bento Grid, no container queries anywhere.

**Only 2 shared components** exist (Header, Footer). All other UI patterns -- Tag, MetricBox, Change badge, section headers, card layouts -- are redefined inline per page.

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Bento Grid layout** | Stock Analysis uses varied card sizes; Finviz iconic heatmap treemap; TradingView multi-panel workspace | 67% of top 100 SaaS sites use Bento Grids (Bento 2.0); +47% dwell time, +38% CTR |
| **Shared component library** | Every top site (Stripe, Linear, Vercel) has consistent card/badge/metric components | Component-driven architecture is table stakes |
| **CSS Grid with named areas** | TradingView: resizable panels; Bloomberg: varied card sizes per section | Container Queries enable self-aware tiles |
| **Visual hierarchy via size variation** | Bloomberg: large hero story + smaller sidebar items; Coinbase: large price card + smaller metric cards | Bento Grid creates hierarchy through tile size, not just content |
| **Responsive grid breakpoints** | CompaniesMarketCap: 4-col > 2-col > 1-col; Stock Analysis: fluid grid with breakpoints | Mobile-first responsive grids are baseline requirement |

### TO-BE

- Homepage uses a Bento Grid with large hero tile (live market overview), medium tiles (sector highlights), and small tiles (quick stats).
- A shared component library (`src/components/ui/`) provides Card, MetricBox, Tag, Badge, SectionHeader, and Skeleton components.
- CSS Grid with container queries enables each tile to adapt its internal layout based on its own width, not the page width.
- All pages use consistent spacing scale and container widths derived from the design system.

### Concrete Actions

**1. Create shared Card component** (`src/components/ui/Card.tsx`):

```tsx
// src/components/ui/Card.tsx
interface CardProps {
  variant?: 'default' | 'elevated' | 'glass';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({ variant = 'default', hover = true, className, children }: CardProps) {
  return (
    <div className={cn(
      'rounded-2xl border transition-all duration-200',
      variant === 'default' && 'bg-[var(--bg-surface)] border-[var(--border-subtle)]',
      variant === 'elevated' && 'bg-[var(--bg-elevated)] border-[var(--border-default)]',
      variant === 'glass' && 'bg-[rgba(21,29,46,0.7)] backdrop-blur-xl border-[rgba(255,255,255,0.08)]',
      hover && 'hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(6,182,212,0.08)]',
      className
    )}>
      {children}
    </div>
  );
}
```

**2. Implement Bento Grid for homepage** (`src/components/ui/BentoGrid.tsx`):

```css
/* globals.css */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  container-type: inline-size;
}

.bento-tile--hero   { grid-column: span 2; grid-row: span 2; }
.bento-tile--wide   { grid-column: span 2; }
.bento-tile--tall   { grid-row: span 2; }

@media (max-width: 1024px) {
  .bento-grid { grid-template-columns: repeat(2, 1fr); }
  .bento-tile--hero { grid-column: span 2; grid-row: span 1; }
}

@media (max-width: 640px) {
  .bento-grid { grid-template-columns: 1fr; gap: 12px; }
  .bento-tile--hero,
  .bento-tile--wide { grid-column: span 1; }
}
```

**3. Add Container Queries for self-aware tiles:**

```css
/* globals.css */
.bento-tile {
  container-type: inline-size;
}

@container (max-width: 300px) {
  .bento-tile .metric-row { flex-direction: column; gap: 8px; }
  .bento-tile .chart-area { display: none; }
}

@container (min-width: 500px) {
  .bento-tile .metric-row { flex-direction: row; gap: 16px; }
  .bento-tile .detail-panel { display: block; }
}
```

**4. Standardize container widths as CSS variables:**

```css
/* globals.css */
:root {
  --container-wide: 1200px;   /* homepage, dashboard */
  --container-default: 1000px; /* markets hub, rankings */
  --container-narrow: 720px;  /* detail pages, blog posts */
  --container-tight: 520px;   /* tools, single-purpose */
}
```

**5. Create shared UI component index** -- Minimum components to extract:

| Component | Currently Defined In | Times Duplicated |
|---|---|---|
| `Card` | 9+ page files | 9+ |
| `MetricBox` | markets/page.tsx:96 | 3+ |
| `Tag` | page.tsx:28 | 4+ |
| `Change` (percentage badge) | page.tsx:32 | 5+ |
| `SectionHeader` | page.tsx (sectionLabel/sectionTitle) | 8+ |
| `Skeleton` | (does not exist) | N/A -- new |
| `EmptyState` | (does not exist) | N/A -- new |

---

## 4-2. Typography

### AS-IS

Four font families are loaded through a mix of methods:

| Font | Loading Method | Weights | CSS Variable | Used For |
|---|---|---|---|---|
| **Noto Sans KR** | `next/font/google` (layout.tsx:7-11) | 400, 500, 700, 900 | `--font-noto-sans-kr` | Korean text (barely used -- overridden by DM Sans) |
| **Playfair Display** | `next/font/google` (layout.tsx:14-18) | 700, 800, 900 | `--font-playfair` / `var(--serif)` | Headings (home hero, section titles) |
| **DM Sans** | `<link>` Google Fonts tag (layout.tsx:87) | 400-800 | `var(--sans)` | Primary body text across all pages |
| **IBM Plex Mono** | `<link>` Google Fonts tag (layout.tsx:87) | 400-700 | `var(--mono)` | Numbers, data, code-like content |

**Critical issue**: `page.tsx:74` re-loads the same fonts with another `<link>` tag inside the client component, creating a duplicate request.

The body inline style in `layout.tsx:119` explicitly sets `fontFamily: "'DM Sans', -apple-system, sans-serif"`, completely overriding the Noto Sans KR variable font setup.

No typographic scale exists. Font sizes are ad-hoc inline values: hero uses `clamp(36px, 5.5vw, 58px)`, cards use `fontSize: 17`, metric labels use `fontSize: 12`, with no consistent stepping.

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Consolidated font loading** | Linear, Vercel, Stock Analysis all load Inter via `next/font` only | Variable fonts reduce HTTP requests; `next/font` self-hosts for performance |
| **Variable font** | Linear uses Inter Variable; Vercel uses Inter Variable | Variable fonts enable smooth weight transitions and responsive typography |
| **Typographic scale** | Stripe: 80/36/17px hierarchy; Linear: 72/28/17px with -0.04em tracking | Bold oversized headlines (48-72px) with tiny data text creates striking hierarchy |
| **Tabular numbers** | Stock Analysis, CompaniesMarketCap use `font-variant-numeric: tabular-nums` | Essential for aligning financial data columns |
| **No motion typography** | Robinhood: counting number animations; Linear: heading animations | Kinetic typography for market data updates is a 2026 trend |

### TO-BE

- Three font families maximum, all loaded via `next/font/google` for automatic self-hosting and optimization.
- A defined typographic scale with 5-6 size steps used consistently across all pages.
- Tabular numbers enabled globally for all financial data.
- Duplicate font `<link>` tags eliminated entirely.

### Concrete Actions

**1. Consolidate to 3 fonts via `next/font/google` only:**

```tsx
// layout.tsx -- replace all font loading with:
import { Inter, Playfair_Display, IBM_Plex_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

// On <html>:
<html className={`${inter.variable} ${playfair.variable} ${ibmPlexMono.variable}`}>
```

> **Decision point**: Keep DM Sans instead of Inter if brand identity is important. Both are excellent choices. Inter is the industry standard (Linear, Vercel, Stock Analysis, CompaniesMarketCap), but DM Sans has a warmer character. If keeping DM Sans, load it via `next/font/google` instead of `<link>`.

**2. Remove all `<link>` Google Fonts tags:**
- Delete the `<link>` in `layout.tsx:87`
- Delete the duplicate `<link>` in `page.tsx:74`
- Remove Noto Sans KR if not needed for Korean content (or keep only for the lotto page)

**3. Define typographic scale in globals.css:**

```css
/* globals.css */
:root {
  --font-sans: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-serif: var(--font-playfair), Georgia, serif;
  --font-mono: var(--font-ibm-plex-mono), 'Courier New', monospace;

  /* Typographic Scale (Major Third -- 1.25 ratio) */
  --text-xs: 0.75rem;    /* 12px -- labels, timestamps */
  --text-sm: 0.875rem;   /* 14px -- secondary text, table data */
  --text-base: 1rem;     /* 16px -- body text */
  --text-lg: 1.125rem;   /* 18px -- card titles */
  --text-xl: 1.25rem;    /* 20px -- section subtitles */
  --text-2xl: 1.5rem;    /* 24px -- section titles */
  --text-3xl: 1.875rem;  /* 30px -- page subtitles */
  --text-4xl: 2.25rem;   /* 36px -- page titles */
  --text-5xl: 3rem;      /* 48px -- hero subtitle */
  --text-6xl: 3.75rem;   /* 60px -- hero headline */
}
```

**4. Enable tabular numbers globally for financial data:**

```css
/* globals.css */
.tabular-nums {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}

/* Apply to all data-displaying elements */
td, .metric-value, .price, .change, [data-numeric] {
  font-variant-numeric: tabular-nums;
}
```

**5. Apply tight tracking on headlines** (matching Linear/Stripe):

```css
h1, .heading-hero { letter-spacing: -0.04em; }
h2, .heading-page { letter-spacing: -0.02em; }
h3, .heading-section { letter-spacing: -0.01em; }
```

---

## 4-3. Color & Theme

### AS-IS

CSS variables are defined in `globals.css :root` (lines 3-25) but are **never used in component inline styles**. The entire codebase hardcodes hex values directly:

**Defined variables (decorative -- unused in components):**
| Variable | Hex | Purpose |
|---|---|---|
| `--bg` | `#0B0F19` | Page background |
| `--card` | `#111827` | Card background |
| `--border` | `#1E293B` | Borders |
| `--elevated` | `#1C2333` | Elevated surfaces |
| `--text-primary` | `#F1F5F9` | Primary text |
| `--text-secondary` | `#94A3B8` | Secondary text |
| `--accent` | `#C73E3A` | Brand red |

**Hardcoded hex values found in components:** 25+ unique hex values including near-duplicates:
- Borders: `#1E293B` and `#1F2937` (both used for "borders" in different files)
- Muted text: `#6B7280` and `#64748B` (both used for "muted" text)
- Card backgrounds: `#111827` and `#0D1117` (two similar dark values)

The background `#0B0F19` is a neutral dark gray with minimal character. No navy tinting, no layered elevation system. Cards and background have only one level of contrast difference.

Brand accent is `#C73E3A` (muted red). Market positive/negative colors are `#00D474` (saturated green) and `#FF4545` (saturated red) -- both too vibrant for extended viewing on dark backgrounds.

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Actual CSS variable usage** | Every modern site uses a token system | CSS custom properties are the foundation of maintainable theming |
| **Navy-tinted background** | TradingView: `#131722`; Stock Analysis dark: `#0B1121`; Stripe: `#0A2540` | Deep moody colors (`#0C1222` navy-black) create brand identity vs generic gray-black |
| **Layered elevation (3-4 levels)** | TradingView: `#131722` > `#1E222D` > `#2A2E39`; Linear: `#000` > `#0A0A0A` > `#141414` > `#1C1C1C` | Off-black with 3-4 surface levels is the 2026 dark mode standard |
| **Desaturated market colors** | TradingView: `#26A69A` / `#EF5350` (muted); Bloomberg: `#3DAA4F` / `#E8353D` | Desaturate to 70-80% for dark mode eye comfort |
| **Teal accent color** | Stripe: `#80E9FF` (cyan); Coinbase: `#00D395` (teal-green) | Teal is WGSN/Coloro 2026 Color of the Year |
| **Neon glow micro-accents** | Linear: purple glow on cards; Vercel: gradient border glow; Robinhood: green glow on CTA | Controlled neon glow on dark backgrounds creates premium feel |

### TO-BE

- All components reference CSS variables, never hardcoded hex.
- Navy-tinted background (`#0C1222`) replaces neutral gray-black.
- 4-level elevation system creates visual depth hierarchy.
- Teal (`#06B6D4`) introduced as primary accent alongside existing red brand color.
- Desaturated market indicator colors reduce eye fatigue.
- Neon glow accents on interactive elements create premium fintech feel.

### Concrete Actions

**1. Replace entire `:root` color system in `globals.css`:**

```css
:root {
  /* ===== DHLM STUDIO 2026 COLOR SYSTEM ===== */

  /* Backgrounds -- Navy-tinted Layered Elevation */
  --bg-base:       #0C1222;   /* Level 0: deepest -- page background */
  --bg-surface:    #151D2E;   /* Level 1: cards, panels */
  --bg-elevated:   #1E2A3A;   /* Level 2: elevated cards, modals, dropdowns */
  --bg-hover:      #263347;   /* Level 3: hover states, active items */

  /* Text Hierarchy */
  --text-primary:  #E8ECF1;   /* Main text -- off-white, never pure #FFFFFF */
  --text-secondary:#8B95A5;   /* Descriptions, labels */
  --text-muted:    #5A6577;   /* Disabled, placeholders (WCAG AA at 16px+) */
  --text-dim:      #475569;   /* Decorative only -- NOT for readable text */

  /* Brand Accent */
  --accent:        #C73E3A;   /* DHLM Red -- keep for brand identity */
  --accent-hover:  #E85D59;   /* Red hover state */

  /* Primary Interactive (NEW -- Teal) */
  --accent-teal:   #06B6D4;   /* Primary CTA, links, active states */
  --accent-teal-hover: #22D3EE;
  --accent-glow:   rgba(6, 182, 212, 0.15);  /* Box-shadow glow */

  /* Semantic Colors -- Desaturated for Dark Mode */
  --positive:      #34D399;   /* Market up -- emerald (was #00D474) */
  --negative:      #F87171;   /* Market down -- soft red (was #FF4545) */
  --warning:       #FBBF24;   /* Alerts */
  --info:          #60A5FA;   /* Information */

  /* Utility */
  --gold:          #F59E0B;   /* Rankings, premium features */
  --purple:        #A78BFA;   /* Creators section */

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default:rgba(255, 255, 255, 0.10);
  --border-strong: rgba(255, 255, 255, 0.16);

  /* Shadows & Glows */
  --shadow-card:   0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.5);
  --glow-teal:     0 0 20px rgba(6, 182, 212, 0.3);
  --glow-positive: 0 0 12px rgba(52, 211, 153, 0.2);
  --glow-negative: 0 0 12px rgba(248, 113, 113, 0.2);
}
```

**2. Migrate inline styles to CSS variables** (per-file find-and-replace):

| Find (Inline Style) | Replace With |
|---|---|
| `background: '#0B0F19'` | `className="bg-[var(--bg-base)]"` |
| `background: '#111827'` | `className="bg-[var(--bg-surface)]"` |
| `border: '1px solid #1E293B'` | `className="border border-[var(--border-default)]"` |
| `color: '#F1F5F9'` | `className="text-[var(--text-primary)]"` |
| `color: '#94A3B8'` | `className="text-[var(--text-secondary)]"` |
| `color: '#00D474'` | `className="text-[var(--positive)]"` |
| `color: '#FF4545'` | `className="text-[var(--negative)]"` |

**3. Register Tailwind theme tokens** (globals.css `@theme` block):

```css
@theme inline {
  --color-bg-base: var(--bg-base);
  --color-bg-surface: var(--bg-surface);
  --color-bg-elevated: var(--bg-elevated);
  --color-bg-hover: var(--bg-hover);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-accent-teal: var(--accent-teal);
  --color-positive: var(--positive);
  --color-negative: var(--negative);
}
```

This enables Tailwind classes like `bg-bg-surface`, `text-text-primary`, `text-positive`, etc.

---

## 4-4. Animation & Interaction

### AS-IS

**Existing animations (very limited):**

| Animation | Location | Type |
|---|---|---|
| Counter count-up | `page.tsx:9-26` | IntersectionObserver + requestAnimationFrame |
| Typing dots bounce | `lotto/page.tsx:207-209` | CSS `@keyframes td` (translateY) |
| Blessing pulse | `bless/page.tsx:242-249` | CSS `@keyframes pulse, glow, twinkle, spin, loading` |
| Header scroll transition | `Header.tsx:41` | CSS `transition: all 0.3s` |
| Mobile drawer slide | `Header.tsx:59` | CSS `transition: transform 0.2s` |
| Roast reveal | `markets/page.tsx:162` | CSS `transition: all 0.5s` |

**framer-motion is installed (`^12.38.0`) but completely unused.** This adds ~120KB to the JavaScript bundle for zero benefit.

**No skeleton loaders exist.** Loading states are plain text strings like "Loading live data..." or "Loading crypto data...".

**No `prefers-reduced-motion` media query** is respected anywhere -- all animations play regardless of user accessibility settings.

All CSS animations are defined in `<style>` tags inside components instead of `globals.css`, meaning they are re-injected on every render.

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Scroll-triggered animations** | Stripe: orchestrated fade/slide sequences; Robinhood: parallax + fade; Coinbase: smooth scroll reveals; Linear: subtle fade with Y offset | Scroll-triggered motion is the #1 JS animation trend in 2026; +40-60% content comprehension |
| **Micro-interactions** | TradingView: chart crosshair; Linear: button glow on hover; Vercel: gradient border on hover | Functional micro-interactions are primary UI communication method in 2026 |
| **Skeleton loaders** | Stock Analysis: clean loading states; Bloomberg: fast with lazy-load shimmer | Skeleton screens perceived 20-30% faster than spinners |
| **prefers-reduced-motion** | All modern sites respect this; WCAG requirement | Mandatory for accessibility compliance |
| **Page/route transitions** | Linear: smooth fade; Vercel: snappy transitions | No `loading.tsx` files exist -- zero route transition feedback |
| **Data update animations** | TradingView: price flash on change; Yahoo Finance: ticker auto-scroll; Worldometers: live counter increment | Number counting animations and price flash are standard for financial data |

### TO-BE

- Scroll-triggered fade-in animations on all major page sections using Framer Motion (already installed) or CSS Scroll-Driven Animations API.
- Skeleton loaders replace text-based loading states.
- Micro-interactions on hover (card lift, glow border), button press (scale down), and data updates (number pulse).
- All animations wrapped in `prefers-reduced-motion` checks.
- `loading.tsx` files provide route transition feedback.

### Concrete Actions

**1. Choose animation strategy** -- Two options:

**Option A: Use Framer Motion (already installed, ~120KB, feature-rich):**

```tsx
// src/components/ui/FadeIn.tsx
'use client';
import { motion } from 'framer-motion';

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
```

**Option B: Remove Framer Motion, use CSS Scroll-Driven Animations (0KB, native, 60fps):**

```css
/* globals.css */
@keyframes fade-slide-in {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  animation: fade-slide-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}

/* Staggered children */
.animate-on-scroll:nth-child(2) { animation-delay: 80ms; }
.animate-on-scroll:nth-child(3) { animation-delay: 160ms; }
.animate-on-scroll:nth-child(4) { animation-delay: 240ms; }
```

> **Recommendation**: Use Option A (Framer Motion) since it is already installed and provides more control. If bundle size becomes critical, switch to Option B later.

**2. Create Skeleton loader component:**

```tsx
// src/components/ui/Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-[var(--bg-elevated)]', className)}
      role="status"
      aria-label="Loading"
    />
  );
}

// Usage example -- MarketCard skeleton:
export function MarketCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
```

**3. Add shimmer animation to globals.css:**

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    var(--bg-hover) 50%,
    var(--bg-elevated) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

**4. Add micro-interaction CSS:**

```css
/* globals.css */

/* Button press feedback */
.btn-press:active {
  transform: scale(0.97);
  transition: transform 0.1s ease;
}

/* Card hover lift + glow */
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-teal);
}

/* Data update pulse */
@keyframes number-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; color: var(--accent-teal); }
}
.number-updated {
  animation: number-pulse 0.6s ease;
}
```

**5. Respect prefers-reduced-motion:**

```css
/* globals.css -- MUST be included */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .animate-on-scroll { animation: none; opacity: 1; transform: none; }
}
```

**6. Create `loading.tsx` for key routes:**

```tsx
// src/app/markets/loading.tsx
import { MarketCardSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] pt-20 px-5">
      <div className="max-w-[var(--container-default)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <MarketCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

Create `loading.tsx` for: `/markets`, `/rankings`, `/rankings/crypto`, `/creators`, `/blog`.

**7. Move all `<style>` animations to globals.css:**
- Move `@keyframes td` from `lotto/page.tsx`
- Move all 5 keyframes from `bless/page.tsx`
- Centralize in `globals.css` so they are parsed once

---

## 4-5. Data Visualization

### AS-IS

**Zero charts or graphs exist on any page.** All data is displayed as text numbers inside card layouts:

- Stock data: price, change percentage, market cap -- all plain text in `<span>` tags
- Crypto data: rank, price, 24h change -- all plain text in grid cells
- Rankings: GDP, population -- all plain text in card layouts
- Market movers: name, price, change -- all plain text

`recharts` package (`^3.8.0`, ~400KB) is installed in `package.json` but is **not imported or used in any file**. This is pure dead weight in the dependency tree.

The only visual data representation is color-coding (green for positive, red for negative percentage changes).

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Sparkline charts** | Yahoo Finance: sparklines next to every ticker; Bloomberg: sparklines in market overview; Coinbase: 24h sparklines on price cards | Mini charts provide instant visual context for numeric data |
| **Interactive price charts** | TradingView: best-in-class candlestick/line charts; Stock Analysis: TradingView-powered charts; Macrotrends: Highcharts long-term charts | Stock pages without charts are incomplete in 2026 |
| **Sector heatmap** | Finviz: iconic treemap heatmap (most shared visualization in finance); TradingView: sector heatmaps | Treemap heatmaps are highly shareable and provide at-a-glance market overview |
| **Chart color system** | TradingView: `#131722` bg, `#2962FF` line; consistent palette across all charts | Dark mode charts need semi-transparent grid lines, limited palette (5-7 colors max) |
| **Revenue/earnings charts** | Stock Analysis: bar charts for quarterly financials; Macrotrends: historical line charts | Visual financial data is table stakes for stock detail pages |

### TO-BE

- Sparkline charts embedded in market overview cards and ticker displays.
- Full interactive price charts on individual stock detail pages (`/markets/[ticker]`).
- Sector heatmap on the markets hub page.
- Consistent chart color palette across all visualizations.
- recharts actively used or replaced with a lighter alternative.

### Concrete Actions

**1. Create a sparkline component using recharts (already installed):**

```tsx
// src/components/charts/Sparkline.tsx
'use client';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color, height = 40 }: SparklineProps) {
  const isPositive = data.length > 1 && data[data.length - 1] >= data[0];
  const lineColor = color || (isPositive ? 'var(--positive)' : 'var(--negative)');
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={lineColor}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**2. Add sparklines to market overview cards** (markets/page.tsx):

```tsx
// Inside StockCard component -- add after price display:
<div style={{ width: 80, height: 32 }}>
  <Sparkline data={stock.historicalPrices || []} />
</div>
```

**3. Define chart color palette in globals.css:**

```css
:root {
  /* Chart Palette -- Dark Mode Optimized */
  --chart-1: #06B6D4;  /* Cyan/Teal (primary) */
  --chart-2: #34D399;  /* Emerald */
  --chart-3: #F59E0B;  /* Amber */
  --chart-4: #F87171;  /* Red */
  --chart-5: #A78BFA;  /* Purple */
  --chart-6: #FB923C;  /* Orange */

  /* Chart Grid & Axes */
  --chart-grid: rgba(255, 255, 255, 0.06);
  --chart-axis-label: #9CA3AF;
  --chart-tooltip-bg: rgba(21, 29, 46, 0.95);
}
```

**4. Create reusable chart theme config:**

```tsx
// src/lib/chart-theme.ts
export const darkChartTheme = {
  grid: {
    stroke: 'rgba(255, 255, 255, 0.06)',
    strokeDasharray: '3 3',
  },
  axis: {
    tick: { fill: '#9CA3AF', fontSize: 12 },
    line: { stroke: 'rgba(255, 255, 255, 0.06)' },
  },
  tooltip: {
    contentStyle: {
      background: 'rgba(21, 29, 46, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      color: '#E8ECF1',
      fontSize: 13,
      backdropFilter: 'blur(12px)',
    },
  },
};
```

**5. Add mini area chart to stock detail page** (`/markets/[ticker]`):

```tsx
// src/components/charts/PriceChart.tsx
'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { darkChartTheme } from '@/lib/chart-theme';

interface PriceChartProps {
  data: { date: string; price: number }[];
  positive: boolean;
}

export function PriceChart({ data, positive }: PriceChartProps) {
  const color = positive ? 'var(--positive)' : 'var(--negative)';
  const gradientId = positive ? 'gradient-positive' : 'gradient-negative';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...darkChartTheme.grid} />
        <XAxis dataKey="date" {...darkChartTheme.axis} />
        <YAxis {...darkChartTheme.axis} />
        <Tooltip {...darkChartTheme.tooltip} />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

**6. Verify recharts is actually needed:**
- If only sparklines are needed, consider `@visx/sparkline` (~8KB) or pure SVG path instead of recharts (~400KB).
- If recharts is kept, ensure tree-shaking is working: import only `{ LineChart, Line, ResponsiveContainer }` rather than full library.

---

## 4-6. Mobile UX

### AS-IS

**No media queries exist anywhere** in the codebase (neither CSS `@media` nor Tailwind responsive classes), with one exception: `Header.tsx` uses `hidden md:flex` and `md:hidden` for navigation breakpoints.

Mobile responsiveness relies entirely on:
- `flexWrap: 'wrap'` on flex containers
- `clamp()` for hero heading: `fontSize: 'clamp(36px, 5.5vw, 58px)'`
- `auto-fit` grids: `gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'`

**Known breakages on mobile:**
- Crypto rankings grid uses `gridTemplateColumns: '36px 2fr 1fr 1fr 1fr'` -- will overflow on screens < 640px
- Stock card metrics grid uses `gridTemplateColumns: 'repeat(4, 1fr)'` -- cramped/unreadable on mobile
- No bottom navigation -- all navigation requires reaching the top of the page
- No touch gestures (swipe, pull-to-refresh)
- Inline styles make responsive design structurally impossible (no media queries in React style objects)

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Bottom tab navigation** | Yahoo Finance: bottom tab bar on mobile; TradingView: native app bottom nav | Thumb-driven design with bottom-third interactions is standard for fintech mobile |
| **Responsive data tables** | CompaniesMarketCap: horizontal scroll on narrow tables; Stock Analysis: responsive with priority columns | Data tables must adapt for mobile (hide low-priority columns, stack, or scroll) |
| **Touch gestures** | TradingView: pinch-to-zoom on charts; Coinbase: pull-to-refresh price data | Swipe, pull-to-refresh are expected mobile interactions for real-time data |
| **Mobile-first media queries** | Every competitor uses responsive breakpoints | DHLM's inline styles prevent all media queries |
| **PWA features** | None of the 20 competitors offer PWA (opportunity!) | PWA enables offline caching, push notifications, add-to-homescreen |

### TO-BE

- Bottom tab navigation on mobile for primary sections.
- All grids use Tailwind responsive classes instead of inline styles.
- Data tables adapt for mobile with horizontal scroll or column priority.
- Pull-to-refresh on data-fetching pages.
- Future: PWA manifest for offline market summaries.

### Concrete Actions

**1. Create mobile bottom navigation:**

```tsx
// src/components/BottomNav.tsx
'use client';

const tabs = [
  { href: '/markets', icon: '📊', label: 'Markets' },
  { href: '/rankings', icon: '🏆', label: 'Rankings' },
  { href: '/',         icon: '🏠', label: 'Home' },
  { href: '/blog',     icon: '📝', label: 'Blog' },
  { href: '/tools',    icon: '🧰', label: 'Tools' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden
                 bg-[var(--bg-surface)]/95 backdrop-blur-xl
                 border-t border-[var(--border-subtle)]
                 safe-area-inset-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-2 text-xs',
              pathname === tab.href
                ? 'text-[var(--accent-teal)]'
                : 'text-[var(--text-muted)]'
            )}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

**2. Add safe area padding for bottom nav:**

```css
/* globals.css */
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Add bottom padding to all pages so content is not hidden behind bottom nav */
@media (max-width: 768px) {
  main { padding-bottom: 80px; }
}
```

**3. Fix crypto table for mobile** (rankings/crypto/page.tsx):

Replace `gridTemplateColumns: '36px 2fr 1fr 1fr 1fr'` with:

```tsx
// Use Tailwind responsive classes:
<div className="grid grid-cols-[36px_2fr_1fr] md:grid-cols-[36px_2fr_1fr_1fr_1fr] gap-2">
  {/* Hide Market Cap and Volume columns on mobile */}
  <div className="hidden md:block">Market Cap</div>
  <div className="hidden md:block">Volume</div>
</div>
```

**4. Fix stock card metrics for mobile:**

Replace `gridTemplateColumns: 'repeat(4, 1fr)'` with:

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
```

**5. Add pull-to-refresh for data pages:**

```tsx
// Simple pull-to-refresh using touch events:
// Consider using a lightweight library like `react-pull-to-refresh` or implement native:
function usePullToRefresh(onRefresh: () => Promise<void>) {
  // Track touchstart Y, calculate pull distance, trigger refresh at threshold
  // Show loading indicator during refresh
}
```

**6. Migrate inline styles to Tailwind responsive classes (systematic approach):**

Priority order for migration:
1. All grid/flexbox layout properties (breakage risk)
2. Font sizes (readability)
3. Padding/margin (spacing)
4. Backgrounds/borders (consistency)

Example migration for a typical page wrapper:

```tsx
// BEFORE:
<div style={{ background: '#0B0F19', minHeight: '100vh' }}>
  <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 20px 60px' }}>

// AFTER:
<div className="min-h-screen bg-[var(--bg-base)]">
  <div className="max-w-[1100px] mx-auto px-5 pt-20 pb-16 md:px-8">
```

---

## 4-7. Performance & Core Web Vitals

### AS-IS

**Image optimization: NONE.**
- `next/image` is not used anywhere in the codebase.
- All images use native `<img>` tags: stock logos (FMP), crypto icons (CoinGecko).
- No `srcset`, no `loading="lazy"`, no WebP/AVIF conversion, no blur placeholders.

**Bundle bloat from unused dependencies:**

| Package | Size | Status |
|---|---|---|
| `framer-motion` ^12.38.0 | ~120KB | **Installed, UNUSED** |
| `recharts` ^3.8.0 | ~400KB | **Installed, UNUSED** |
| `html2canvas` ^1.4.1 | ~200KB | Used in QR generator only |
| **Total waste** | **~520KB** | Dead code shipped to every user |

**Client-side rendering overuse:**
- Home page (`page.tsx`) is `'use client'` on line 1 despite containing mostly static content (categories, creator highlights, ranking previews).
- Rankings page is fully client-rendered with all static fallback data.
- Gainers, Losers, Most-Active are near-identical ~70-line client components that could be a single parameterized server component.

**No loading states:**
- Zero `loading.tsx` files anywhere (no Suspense boundaries for route transitions).
- No React `Suspense` boundaries for client-side data loading.

**No ISR (Incremental Static Regeneration):**
- Stock detail pages fetch live data on every request instead of using `revalidate`.

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **next/image** | Stock Analysis: optimized images; Vercel: WebP/AVIF with blur | next/image provides automatic WebP, srcset, lazy loading, blur placeholders |
| **Server components for static content** | Every Next.js site (Linear, Vercel) uses RSC for static sections | Home page shipping as 100% client JS is a critical LCP penalty |
| **Tree-shaking / dead code removal** | All top sites have lean bundles | 520KB of unused dependencies is unacceptable |
| **Suspense boundaries** | Stock Analysis: clean loading states; Bloomberg: lazy-load content | loading.tsx and Suspense are built into Next.js App Router |
| **ISR for semi-static data** | Stock Analysis: revalidates stock pages | revalidate: 300 on stock pages caches for 5 min, reducing API calls and improving TTFB |

### TO-BE

- All images use `next/image` with proper `width`, `height`, `sizes`, and `placeholder="blur"`.
- Home page split into server component (static sections) + client islands (live data).
- Unused dependencies removed or actively utilized.
- `loading.tsx` files for all data-fetching routes.
- ISR on stock detail and blog pages.

### Concrete Actions

**1. Replace all `<img>` with `next/image`:**

```tsx
// BEFORE (markets/page.tsx:116):
<img src={s.image} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />

// AFTER:
import Image from 'next/image';
<Image
  src={s.image}
  alt={`${s.name} logo`}
  width={40}
  height={40}
  className="rounded-full"
  unoptimized  // Required for external domains if not configured
/>
```

Configure `next.config.ts` for external image domains:

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'financialmodelingprep.com' },
      { protocol: 'https', hostname: 'assets.coingecko.com' },
    ],
  },
};
```

**2. Remove or utilize unused dependencies:**

```bash
# If NOT using framer-motion or recharts:
npm uninstall framer-motion recharts

# If using them (recommended -- they add value):
# Keep both, but ensure they are actually imported in components.
# recharts: add sparkline charts (see section 4-5)
# framer-motion: add scroll animations (see section 4-4)
```

**3. Split home page into server + client islands:**

```tsx
// src/app/page.tsx -- Convert to SERVER component (remove 'use client')
import { LiveMarketsPreview } from '@/components/home/LiveMarketsPreview';
import { CryptoPreview } from '@/components/home/CryptoPreview';
import { Suspense } from 'react';
import { MarketCardSkeleton } from '@/components/ui/Skeleton';

// Static sections render on server (zero JS shipped):
export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      {/* Static hero -- server rendered, zero JS */}
      <section className="...">
        <h1>...</h1>
        <p>...</p>
      </section>

      {/* Static categories -- server rendered */}
      <section>...</section>

      {/* Dynamic market data -- client island with Suspense */}
      <Suspense fallback={<MarketCardSkeleton />}>
        <LiveMarketsPreview />
      </Suspense>

      {/* Dynamic crypto data -- client island */}
      <Suspense fallback={<MarketCardSkeleton />}>
        <CryptoPreview />
      </Suspense>

      {/* Static creators/rankings sections -- server rendered */}
      <section>...</section>
    </main>
  );
}
```

**4. Add ISR to stock detail pages:**

```tsx
// src/app/markets/[ticker]/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes
```

**5. Deduplicate Gainers/Losers/MostActive into one component:**

```tsx
// src/app/markets/[category]/page.tsx
// Replace three separate files with one parameterized route:
export function generateStaticParams() {
  return [
    { category: 'gainers' },
    { category: 'losers' },
    { category: 'most-active' },
  ];
}

export default function MarketCategoryPage({ params }: { params: { category: string } }) {
  // Single component with category-based data fetching and title
}
```

**6. Add metadata export to home page** (currently impossible with `'use client'`):
Once home page is a server component, add:

```tsx
export const metadata = {
  title: 'DHLM Studio - Global Financial Data & Market Intelligence',
  description: '...',
};
```

---

## 4-8. SEO & Metadata

### AS-IS

**Strong foundation:**
- `layout.tsx` exports comprehensive metadata: title template, description, keywords, OG, Twitter cards, robots directives.
- JSON-LD in `layout.tsx` (lines 94-117): `Organization` + `WebSite` schemas.
- Dynamic `sitemap.ts` covers all routes with appropriate `changeFrequency` and `priority`.
- `robots.ts` with sitemap reference.
- `opengraph-image.tsx` generates branded OG images at the edge.
- `/api/og` provides dynamic OG image generation.
- `llms.txt` for AI crawler friendliness.
- `ads.txt` for AdSense verification.
- Blog pages, stock detail pages, and lottery pages have `generateMetadata` with dynamic data.
- Lottery pages have excellent multilingual `hreflang` alternates.

**Critical gaps:**
- **Home page has NO metadata export** (`'use client'` prevents `export const metadata`). Falls back to layout defaults.
- **Markets, Rankings, Crypto, Lotto main pages have no metadata** (all `'use client'`).
- **GA4 tracking ID is `G-XXXXXXXXXX`** (placeholder) -- zero analytics data being collected.
- **`og-default.png` does not exist in `public/`** despite being referenced in layout.tsx:43.
- **No per-page JSON-LD**: stock pages lack `FinancialProduct` schema; blog posts lack `Article` schema.
- **No `SearchAction` in WebSite schema** despite search existing at `/markets/search`.
- **`llms.txt` references `/compare`** which redirects to `/rankings` (stale content).

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Article JSON-LD on blog posts** | Bloomberg: `NewsArticle` schema; Stock Analysis: structured data per stock | Rich snippets in search results increase CTR by 20-30% |
| **Per-page JSON-LD** | Every serious finance site has schema per page type | Google requires specific schema per content type for rich results |
| **SearchAction schema** | Yahoo Finance, TradingView: sitelinks search box in Google | Enables Google sitelinks search box for direct stock lookup |
| **Working analytics** | Every competitor has analytics | Cannot measure or improve without data |
| **Stock price schema** | Yahoo Finance: stock price structured data | Enables live stock price in Google search results |
| **BreadcrumbList schema** | Stock Analysis, Macrotrends: breadcrumb navigation | Breadcrumbs in search results improve navigation and CTR |

### TO-BE

- Every page has optimized metadata (convert client pages to server or use `generateMetadata`).
- Per-page JSON-LD for all content types (Article, FinancialProduct, FAQPage, BreadcrumbList).
- SearchAction schema enables Google sitelinks search box.
- GA4 with real tracking ID collecting user behavior data.
- All broken references fixed.

### Concrete Actions

**1. Fix GA4 tracking immediately:**

```tsx
// layout.tsx -- Replace G-XXXXXXXXXX with real GA4 measurement ID:
const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // Set in Vercel env vars

// Only render script if GA_ID exists:
{GA_ID && (
  <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    <Script id="gtag-init" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
    </Script>
  </>
)}
```

**2. Add JSON-LD to blog posts** (`blog/[slug]/page.tsx`):

```tsx
export default function BlogPostPage({ params }) {
  const post = getPost(params.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'DHLM Studio',
      url: 'https://dhlm-studio.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DHLM Studio',
      logo: { '@type': 'ImageObject', url: 'https://dhlm-studio.com/favicon.svg' },
    },
    mainEntityOfPage: `https://dhlm-studio.com/blog/${params.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ... page content ... */}
    </>
  );
}
```

**3. Add SearchAction to WebSite JSON-LD** (layout.tsx):

```tsx
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DHLM Studio',
  url: 'https://dhlm-studio.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://dhlm-studio.com/markets/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};
```

**4. Add BreadcrumbList JSON-LD to stock detail pages:**

```tsx
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Markets', item: 'https://dhlm-studio.com/markets' },
    { '@type': 'ListItem', position: 2, name: stock.name, item: `https://dhlm-studio.com/markets/${ticker}` },
  ],
};
```

**5. Create `og-default.png`:**
Either generate one and place in `public/`, or update `layout.tsx:43` to point to the dynamic `opengraph-image.tsx` route.

**6. Fix `llms.txt`:** Replace `/compare` with `/rankings`.

**7. Add metadata to client-rendered pages** by converting them to server components (see section 4-7) or using `generateMetadata`:

```tsx
// For pages that must remain 'use client', create a server wrapper:
// src/app/rankings/page.tsx (server)
export const metadata = {
  title: 'Global Rankings - GDP, Population & Economic Data',
  description: '...',
};

// Import the client component:
import RankingsClient from './RankingsClient';
export default function RankingsPage() {
  return <RankingsClient />;
}
```

---

## 4-9. Content Strategy

### AS-IS

- 20 English blog posts in `src/data/blog-posts.ts`, hardcoded as static data.
- Year-based keyword strategy in titles (e.g., "Best Stocks 2026", "Crypto Trends 2026").
- Blog pages are server-rendered with `generateStaticParams` for all 20 slugs.
- No auto-updating content. All blog content is manually written and static.
- No programmatic SEO pages (e.g., auto-generated pages for "top gainers today" or "AAPL stock forecast 2026").

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Auto-updating content** | Yahoo Finance: daily market summaries; MarketWatch: market wrap articles | AI-generated daily content keeps the site fresh for crawlers |
| **Programmatic SEO pages** | Macrotrends: individual pages per metric per stock (massive SEO surface); Stock Analysis: comprehensive per-stock pages | More indexable URLs = more organic traffic |
| **Data-driven blog** | Our World in Data: narrative + interactive charts; Bloomberg: data-enriched articles | Data storytelling increases comprehension 40-60% |
| **Korean content** | Playboard: Korean/English/Japanese | Bilingual KR/EN content captures underserved Korean market data audience |
| **User-facing RSS/API** | Our World in Data: every chart has embed/download buttons | Shareable data widgets increase backlinks |

### TO-BE

- Daily auto-generated market summary pages ("Top Gainers Today", "Market Recap YYYY-MM-DD").
- Expanded programmatic SEO: per-stock pages for all screened companies (not just 10).
- Blog posts enriched with inline charts and live data widgets.
- Korean-language blog section or bilingual toggle for key content.

### Concrete Actions

**1. Create programmatic daily market pages:**

```tsx
// src/app/markets/daily/[date]/page.tsx
export async function generateStaticParams() {
  // Generate last 30 days
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push({ date: d.toISOString().split('T')[0] });
  }
  return dates;
}

export async function generateMetadata({ params }: { params: { date: string } }) {
  return {
    title: `Stock Market Summary - ${params.date}`,
    description: `Top gainers, losers, and most active stocks for ${params.date}. Real-time market data and analysis.`,
  };
}
```

**2. Expand SSG stock pages** from 10 to all screened companies:

```tsx
// src/app/markets/[ticker]/page.tsx
export async function generateStaticParams() {
  // Fetch full stock list from FMP screener instead of static 10
  const res = await fetch(`https://financialmodelingprep.com/api/v3/stock-screener?...`);
  const stocks = await res.json();
  return stocks.slice(0, 100).map((s: any) => ({ ticker: s.symbol }));
}
```

**3. Add structured data pages to sitemap:**

```tsx
// src/app/sitemap.ts -- add daily summary URLs:
const dailyUrls = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return {
    url: `https://dhlm-studio.com/markets/daily/${d.toISOString().split('T')[0]}`,
    lastModified: d,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  };
});
```

**4. Enrich blog posts with inline data components:**

```tsx
// In blog post content, embed live data widgets:
<LiveStockWidget ticker="AAPL" />  // Shows current price + sparkline
<MarketComparisonChart tickers={['KOSPI', 'SPX']} /> // Inline comparison
```

---

## 4-10. Monetization & Ads

### AS-IS

Google AdSense is approved and configured:
- Publisher ID: `ca-pub-5182634360822108`
- `ads.txt` present in `public/`
- AdSense script loads asynchronously on every page (layout.tsx:88-92)

However, **zero ad units are placed anywhere** in the codebase. The AdSense script loads for every visitor, adding to page weight, but generates zero revenue.

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Ad unit placement** | Macrotrends: AdSense blocks in sidebar and between content; Social Blade: ads integrated throughout | AdSense requires `<ins>` elements with data attributes to actually render ads |
| **Strategic ad positioning** | Yahoo Finance: ads between article cards; Bloomberg: premium vs free content split | Non-intrusive ad placement between content sections is the norm |
| **Ad-free premium tier** | TradingView: freemium; Bloomberg: paywall; Stock Analysis: premium features | Premium tier is the 2026 monetization standard for data platforms |

### TO-BE

- AdSense display ads placed strategically without disrupting data consumption.
- Desktop: sidebar ads on wider layouts, in-feed ads between cards.
- Mobile: in-feed ads between content sections.
- Future: premium tier with ad-free experience and additional features.

### Concrete Actions

**1. Create reusable AdUnit component:**

```tsx
// src/components/ads/AdUnit.tsx
'use client';
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export function AdUnit({ slot, format = 'auto', className }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div className={cn('ad-container my-6', className)} aria-hidden="true">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5182634360822108"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

**2. Place ads strategically (non-intrusive positions):**

| Position | Page | Format |
|---|---|---|
| Between 3rd and 4th market card | `/markets` | In-feed (rectangle) |
| After market analysis section | `/markets/[ticker]` | Horizontal banner |
| Between blog post paragraphs (after 3rd) | `/blog/[slug]` | In-article |
| Sidebar on desktop | `/rankings` | Vertical skyscraper |
| Between tool sections | `/tools` | In-feed |
| After Gainers list | `/markets/gainers` | Horizontal |

**3. Conditionally load AdSense script** (currently loads on every page):

```tsx
// layout.tsx -- Only load AdSense if not in development:
{process.env.NODE_ENV === 'production' && (
  <Script
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5182634360822108"
    strategy="lazyOnload"  // Change from 'async' to 'lazyOnload' for better CWV
    crossOrigin="anonymous"
  />
)}
```

**4. Add ad styling that respects dark theme:**

```css
/* globals.css */
.ad-container {
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
}

/* Label for transparency */
.ad-container::before {
  content: 'Advertisement';
  display: block;
  font-size: 10px;
  color: var(--text-muted);
  padding: 4px 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## 4-11. Accessibility & i18n

### AS-IS

**ARIA attributes: ZERO** across the entire codebase. No `aria-label`, `aria-labelledby`, `aria-describedby`, or `role` attributes on any element.

**Contrast failures:**
| Text Color | Background | Ratio | WCAG AA (normal) | WCAG AA (large) |
|---|---|---|---|---|
| `#F1F5F9` (primary) | `#0B0F19` | 15.3:1 | PASS | PASS |
| `#94A3B8` (secondary) | `#0B0F19` | 6.6:1 | PASS | PASS |
| `#475569` (dim) | `#0B0F19` | **3.3:1** | **FAIL** | PASS (barely) |
| `#334155` (disclaimer) | `#0B0F19` | **2.3:1** | **FAIL** | **FAIL** |

**Other accessibility issues:**
- Hamburger button (Header.tsx:52) has no accessible label -- uses `<div>` bars with no text.
- Mobile drawer close button uses `&times;` with no `aria-label`.
- Stock change indicators rely solely on color (green/red) -- no icon, no prefix for color-blind users.
- Interactive cards use `cursor: 'pointer'` + `onClick` on `<div>` elements -- not keyboard accessible, no focus ring.
- No skip-to-content link.
- No focus styles defined (defaults likely suppressed by CSS reset).
- No `<main>` landmark used consistently.
- Stock logos use `alt=""` (empty) -- should describe the company.

**Semantic HTML (positive):** `<nav>`, `<footer>`, `<section>`, `<article>`, `<h1>`-`<h3>` are used appropriately. `lang="en"` set on `<html>`.

**i18n: None.** The site is English-only despite having Korean market data and the Lotto page being Korea-specific. Noto Sans KR is loaded but barely used.

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **ARIA labels everywhere** | All modern sites (Stripe, Linear, Coinbase) have comprehensive ARIA | WCAG 2.2 AA compliance is a legal requirement in many jurisdictions |
| **Skip-to-content** | Bloomberg, Yahoo Finance: skip links for keyboard users | First element for keyboard/screen reader users |
| **Focus management** | Linear: visible focus rings with brand color; Vercel: keyboard navigation | Focus visibility is a WCAG 2.2 requirement |
| **Color + icon for stock direction** | TradingView: arrow icons + color; Yahoo Finance: arrow + color + prefix text | Color-only information fails WCAG 1.4.1 |
| **Dark mode contrast** | TradingView: `#D1D4DC` text on `#131722` (11.5:1) | All text must meet 4.5:1 minimum for normal, 3:1 for large |
| **Multi-language support** | Playboard: KR/EN/JP toggle; CompaniesMarketCap: EN default with country filters | Korean market data platform should serve Korean-speaking users |

### TO-BE

- All interactive elements have ARIA labels.
- WCAG AA compliance for all text contrast ratios.
- Skip-to-content link, visible focus styles, keyboard navigation.
- Stock direction conveyed by icon + color + text prefix (not color alone).
- Future: Korean language toggle for key pages.

### Concrete Actions

**1. Add skip-to-content link** (layout.tsx, first child of `<body>`):

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
             focus:px-4 focus:py-2 focus:bg-[var(--accent-teal)] focus:text-white
             focus:rounded-lg focus:text-sm focus:font-medium"
>
  Skip to main content
</a>

// Then on each page's main content:
<main id="main-content">
```

**2. Fix ARIA on Header hamburger and close buttons:**

```tsx
// Header.tsx hamburger button (line 52):
<button
  onClick={() => setOpen(true)}
  aria-label="Open navigation menu"
  aria-expanded={open}
  className="md:hidden p-2"
>
  {/* three bar lines */}
</button>

// Header.tsx close button (line 60):
<button
  onClick={() => setOpen(false)}
  aria-label="Close navigation menu"
  className="p-2"
>
  &times;
</button>
```

**3. Fix contrast ratios:**

```css
:root {
  /* BEFORE -> AFTER */
  --text-muted: #5A6577;   /* Was #475569 (3.3:1) -> Now 4.6:1 against #0C1222 */
  /* For disclaimer text that was #334155: */
  --text-disclaimer: #5A6577;  /* Minimum 4.5:1 on --bg-base */
}
```

> Note: `#5A6577` on `#0C1222` = ~4.6:1 (passes WCAG AA for normal text at 16px).
> If smaller text (12-14px) is needed, use `--text-secondary` (#8B95A5, 7.2:1) instead.

**4. Add direction icons to stock changes** (alongside color):

```tsx
// src/components/ui/Change.tsx
export function Change({ value }: { value: number }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium tabular-nums',
        isPositive && 'text-[var(--positive)]',
        !isPositive && !isNeutral && 'text-[var(--negative)]',
        isNeutral && 'text-[var(--text-secondary)]'
      )}
      aria-label={`${isPositive ? 'Up' : 'Down'} ${Math.abs(value).toFixed(2)} percent`}
    >
      {/* Arrow icon -- not color-dependent */}
      <span aria-hidden="true">{isPositive ? '\u25B2' : '\u25BC'}</span>
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}
```

**5. Add visible focus styles:**

```css
/* globals.css */
:focus-visible {
  outline: 2px solid var(--accent-teal);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

**6. Fix interactive card keyboard accessibility:**

```tsx
// BEFORE (markets/page.tsx:114):
<div onClick={() => toggleExpand(i)} style={{ cursor: 'pointer' }}>

// AFTER:
<button
  onClick={() => toggleExpand(i)}
  onKeyDown={(e) => e.key === 'Enter' && toggleExpand(i)}
  aria-expanded={expanded === i}
  aria-label={`${stock.name} - click to ${expanded === i ? 'collapse' : 'expand'} details`}
  className="w-full text-left cursor-pointer"
>
```

**7. Add meaningful alt text to images:**

```tsx
// BEFORE:
<img src={s.image} alt="" />

// AFTER:
<Image src={s.image} alt={`${s.name} (${s.symbol}) company logo`} />
```

---

## 4-12. AI Features & Differentiation

### AS-IS

**Brutal Edge (Stock Roasts):**
- `generateRoast` function in `markets/page.tsx` (lines 17-92): 75 lines of hardcoded Trump-style roasts for individual stocks.
- 40+ unique roast templates with stock-specific references.
- Roast is revealed with a click-to-expand animation (`transition: all 0.5s`).
- Text-only output -- no visual share cards, no OG images, no social sharing buttons.

**Bless My Stock:**
- `bless/page.tsx`: Animated Buddha illustration, 3-second blessing ceremony, donation concept.
- 5 CSS keyframe animations (pulse, glow, twinkle, spin, loading).
- Interactive flow: enter stock name > blessing animation > "blessed" confirmation.
- Unique concept not found on any competitor.

Both features are genuinely unique differentiators in the financial data space. No competitor offers anything remotely similar.

### GAP

| What's Missing | Competitor Reference | 2026 Trend Reference |
|---|---|---|
| **Share cards for roasts** | Our World in Data: every chart has shareable URL + embed | Shareable content generates backlinks and social traffic |
| **OG images for individual roasts** | Twitter/X: quote cards with styled text; Reddit: screenshot sharing | Dynamic OG images make social shares visually appealing |
| **Animated roast reveals** | Robinhood: number counting; Linear: subtle motion reveals | Kinetic typography and reveal animations increase engagement |
| **Social sharing buttons** | Every content site (Bloomberg, MarketWatch) has share buttons | One-click sharing to Twitter, Reddit, KakaoTalk |
| **Viral mechanics** | Worldometers: real-time counters are compulsively shareable | Gamification: daily roast, streak tracking, roast of the day |

### TO-BE

- Each stock roast has a unique shareable URL with a dynamic OG image.
- Social sharing buttons (Twitter, Reddit, KakaoTalk, copy link) on every roast.
- Animated text reveal for roasts (typewriter effect or word-by-word).
- "Roast of the Day" feature on homepage for daily engagement.
- Bless My Stock generates a shareable "blessing certificate" image.

### Concrete Actions

**1. Create shareable roast page** (`/markets/[ticker]/roast`):

```tsx
// src/app/markets/[ticker]/roast/page.tsx
export async function generateMetadata({ params }: { params: { ticker: string } }) {
  const roast = generateRoast(params.ticker);
  return {
    title: `${params.ticker} Stock Roast - Brutal Edge Analysis`,
    description: roast.substring(0, 160),
    openGraph: {
      images: [`/api/og/roast?ticker=${params.ticker}`],
    },
  };
}
```

**2. Create dynamic OG image for roasts** (`/api/og/roast`):

```tsx
// src/app/api/og/roast/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get('ticker') || 'AAPL';
  const roast = generateRoast(ticker);

  return new ImageResponse(
    (
      <div style={{
        width: 1200, height: 630,
        background: 'linear-gradient(135deg, #0C1222, #151D2E)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: 60,
        fontFamily: 'Inter',
      }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: '#E8ECF1', marginBottom: 24 }}>
          {ticker}
        </div>
        <div style={{
          fontSize: 28, color: '#8B95A5', textAlign: 'center',
          maxWidth: 900, lineHeight: 1.4,
        }}>
          &ldquo;{roast}&rdquo;
        </div>
        <div style={{
          fontSize: 20, color: '#C73E3A', marginTop: 40,
          fontWeight: 600,
        }}>
          DHLM Studio - Brutal Edge Analysis
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

**3. Add social sharing component:**

```tsx
// src/components/ui/ShareButtons.tsx
'use client';

interface ShareButtonsProps {
  url: string;
  text: string;
  ticker: string;
}

export function ShareButtons({ url, text, ticker }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${ticker} just got ROASTED: "${text.substring(0, 100)}..." `);

  return (
    <div className="flex items-center gap-3 mt-4">
      {/* Twitter/X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                   text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm
                   transition-colors duration-200"
        aria-label="Share on Twitter"
      >
        Share on X
      </a>

      {/* Reddit */}
      <a
        href={`https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                   text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm
                   transition-colors duration-200"
        aria-label="Share on Reddit"
      >
        Share on Reddit
      </a>

      {/* Copy Link */}
      <button
        onClick={() => { navigator.clipboard.writeText(url); /* show toast */ }}
        className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                   text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm
                   transition-colors duration-200"
        aria-label="Copy link to clipboard"
      >
        Copy Link
      </button>

      {/* KakaoTalk */}
      <a
        href={`https://sharer.kakao.com/talk/friends/picker/link?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                   text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm
                   transition-colors duration-200"
        aria-label="Share on KakaoTalk"
      >
        KakaoTalk
      </a>
    </div>
  );
}
```

**4. Add typewriter animation for roast reveal:**

```tsx
// src/components/ui/TypewriterText.tsx
'use client';
import { useState, useEffect } from 'react';

export function TypewriterText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!isComplete && <span className="animate-pulse text-[var(--accent-teal)]">|</span>}
    </span>
  );
}
```

**5. Extract roast data to separate file:**

```tsx
// src/data/roasts.ts
export const stockRoasts: Record<string, string[]> = {
  AAPL: [
    "Apple is so overpriced, even their stock thinks it deserves a premium...",
    // ... more roasts per stock
  ],
  TSLA: [
    // ...
  ],
  // Universal fallbacks:
  _default: [
    "This stock is like a participation trophy...",
    // ...
  ],
};

export function getRandomRoast(ticker: string): string {
  const roasts = stockRoasts[ticker] || stockRoasts._default;
  return roasts[Math.floor(Math.random() * roasts.length)];
}
```

**6. Add "Roast of the Day" to homepage:**

```tsx
// In homepage hero or featured section:
<Card variant="glass" className="p-6 border-[var(--accent)] border-opacity-30">
  <div className="text-xs text-[var(--accent)] font-medium uppercase tracking-wider mb-2">
    Roast of the Day
  </div>
  <div className="text-lg text-[var(--text-primary)] mb-3">
    <TypewriterText text={dailyRoast} />
  </div>
  <ShareButtons url={`https://dhlm-studio.com/markets/${dailyTicker}/roast`} text={dailyRoast} ticker={dailyTicker} />
</Card>
```

---

## Priority Matrix

### Effort vs Impact Scoring

| # | Category | Impact (1-5) | Effort (1-5) | Priority Score | Timeline |
|---|---|---|---|---|---|
| **4-3** | Color & Theme (CSS vars migration) | 5 | 3 | **HIGH** | Week 1-2 |
| **4-7** | Performance (next/image, RSC split, deps) | 5 | 3 | **HIGH** | Week 1-2 |
| **4-8** | SEO (GA4, JSON-LD, metadata) | 5 | 2 | **HIGH** | Week 1 |
| **4-11** | Accessibility (ARIA, contrast, focus) | 5 | 2 | **HIGH** | Week 1-2 |
| **4-2** | Typography (font consolidation) | 4 | 2 | **HIGH** | Week 1 |
| **4-1** | Layout (shared components, Bento Grid) | 4 | 4 | **MEDIUM** | Week 2-3 |
| **4-4** | Animation (scroll, skeletons, loading.tsx) | 4 | 3 | **MEDIUM** | Week 2-3 |
| **4-6** | Mobile UX (bottom nav, responsive grids) | 4 | 3 | **MEDIUM** | Week 2-4 |
| **4-10** | Monetization (ad unit placement) | 4 | 1 | **MEDIUM** | Week 2 |
| **4-5** | Data Visualization (sparklines, charts) | 4 | 4 | **MEDIUM** | Week 3-4 |
| **4-12** | AI Features (share cards, social) | 3 | 3 | **LOW** | Week 4-6 |
| **4-9** | Content Strategy (programmatic SEO) | 3 | 4 | **LOW** | Week 4-8 |

### Recommended Implementation Order

**Phase 1: Foundation (Week 1-2)** -- Fix what is broken or wasting resources.
1. Fix GA4 tracking ID and create `og-default.png`
2. Consolidate fonts to `next/font/google` only
3. Migrate CSS color system to variables
4. Add ARIA labels, skip-to-content, fix contrast
5. Remove unused dependencies OR start using them
6. Convert home page to server component + client islands

**Phase 2: Enhancement (Week 2-4)** -- Add what competitors have that we lack.
1. Build shared component library (Card, Skeleton, Change, MetricBox)
2. Implement Bento Grid layout on homepage
3. Add skeleton loaders and `loading.tsx` files
4. Create bottom navigation for mobile
5. Place AdSense ad units
6. Add sparkline charts to market cards

**Phase 3: Differentiation (Week 4-8)** -- Build what nobody else has.
1. Shareable roast pages with dynamic OG images
2. Social sharing buttons on all content
3. Scroll-triggered animations
4. Interactive price charts on stock detail pages
5. Programmatic daily market summary pages
6. Per-page JSON-LD for rich search results

---

*Generated: 2026-03-31 | Based on analysis of 20 competitor sites, 16 trend categories, and full source code audit of 48 files*
