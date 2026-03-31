# DHLM Studio - Current State Analysis

**Date**: 2026-03-31
**Project**: dhlm-studio.com (Next.js 16 Dark Fintech Data Platform)
**Stack**: Next.js 16.2.0, React 19.2.4, Tailwind CSS v4, TypeScript 5

---

## 1. Directory Structure

```
src/
  app/
    layout.tsx              # Root layout (fonts, meta, GA, AdSense, JSON-LD)
    page.tsx                # Home page ('use client')
    globals.css             # Tailwind v4 import + CSS variables
    favicon.ico
    not-found.tsx           # Custom 404
    robots.ts               # robots.txt generator
    sitemap.ts              # Dynamic sitemap
    opengraph-image.tsx     # OG image generator (edge runtime)
    about/page.tsx          # Static about page
    privacy/page.tsx        # Static privacy policy
    terms/page.tsx          # Static terms of service
    blog/
      page.tsx              # Blog listing (server component)
      [slug]/page.tsx       # Blog post detail (SSG via generateStaticParams)
    markets/
      page.tsx              # Markets hub ('use client')
      [ticker]/page.tsx     # Stock detail (server component, SSG+ISR via FMP)
      bless/page.tsx        # "Bless My Stock" mini-app ('use client')
      gainers/page.tsx      # Gainers list ('use client')
      losers/page.tsx       # Losers list ('use client')
      most-active/page.tsx  # Most active list ('use client')
      search/page.tsx       # Stock search ('use client')
    creators/page.tsx       # Creator rankings (server component)
    rankings/
      page.tsx              # Rankings hub ('use client')
      crypto/page.tsx       # Crypto rankings ('use client')
    lotto/
      page.tsx              # Korea Lotto PRO chat ('use client')
      [game]/
        page.tsx            # World lottery SSG (server component)
        WorldLotteryClient.tsx  # Client component for lottery UI
    tools/
      page.tsx              # Tools hub (server component)
      qr-generator/
        page.tsx            # QR page (server wrapper)
        QrGenerator.tsx     # QR client component
      password-generator/
        page.tsx            # Password page
        PasswordGen.tsx     # Password client component
    api/
      markets/route.ts       # Alpha Vantage + FMP (gainers/losers/actives)
      markets/search/route.ts # FMP stock search
      crypto/route.ts        # CoinGecko top 20
      rankings/route.ts      # World Bank (GDP/population)
      companies/route.ts     # FMP stock screener (top companies)
      exchange/route.ts      # exchangerate-api.com (USD rates)
      lotto/[round]/route.ts # dhlottery.co.kr proxy
      cron/lotto/route.ts    # Vercel cron for lotto updates
      og/route.tsx           # Dynamic OG image generation (edge)
  components/
    Header.tsx              # Fixed nav, mobile drawer, scroll-aware
    Footer.tsx              # Minimal footer with links
  data/
    blog-posts.ts           # 20 blog posts (hardcoded)
    markets.ts              # 10 static stock profiles
    lotto/
      all-draws.json        # Historical lotto draw data
      recent-draws.ts       # Recent draw data
  lib/
    lotto-generator.ts      # Lottery number generation
    world-lottery.ts        # 24 world lottery definitions + generator
public/
    favicon.svg, ads.txt, llms.txt
    file.svg, globe.svg, next.svg, vercel.svg, window.svg
```

### AS-IS
- 48 source files total in `src/`
- Clean App Router structure with proper route groups
- 2 shared components (Header, Footer)
- 3 data files, 2 lib files

### Issues
- **Only 2 shared components**. Many UI patterns (card, tag, badge, metric box, section header) are redefined inline across pages.
- **No dedicated `types/` directory**. Interfaces like `Mover`, `Coin` are redefined per file.
- **No `utils/` directory**. Formatting helpers (`fmtCap`, `fmtRev`, `fmt`, `fmtPrice`) are duplicated across files.

### Notes
- The `lotto/all-draws.json` file is referenced but draw data is also hardcoded directly in `lotto/page.tsx` (lines 32-38).
- `llms.txt` in public/ is an SEO-forward practice for LLM crawlers.

---

## 2. Pages & Routes

| Route | Type | Component | Rendering |
|-------|------|-----------|-----------|
| `/` | page.tsx | `Home` | **Client** (`'use client'`) |
| `/markets` | page.tsx | `MarketsPage` | **Client** |
| `/markets/[ticker]` | page.tsx | `StockPage` | **Server + SSG** (`generateStaticParams` from 10 stocks) |
| `/markets/bless` | page.tsx | `BlessMyStock` | **Client** |
| `/markets/gainers` | page.tsx | `GainersPage` | **Client** |
| `/markets/losers` | page.tsx | `LosersPage` | **Client** |
| `/markets/most-active` | page.tsx | `MostActivePage` | **Client** |
| `/markets/search` | page.tsx | `SearchPage` | **Client** |
| `/creators` | page.tsx | `CreatorsPage` | **Server** (static data, metadata export) |
| `/rankings` | page.tsx | `RankingsPage` | **Client** |
| `/rankings/crypto` | page.tsx | `CryptoPage` | **Client** |
| `/lotto` | page.tsx | `LottoPro` | **Client** |
| `/lotto/[game]` | page.tsx | Server wrapper -> `WorldLotteryClient` | **Server + SSG** (`generateStaticParams` from 24 slugs) |
| `/blog` | page.tsx | `BlogPage` | **Server** (static data) |
| `/blog/[slug]` | page.tsx | `BlogPostPage` | **Server + SSG** (`generateStaticParams` from 20 posts) |
| `/tools` | page.tsx | `ToolsPage` | **Server** |
| `/tools/qr-generator` | page.tsx | Server wrapper -> `QrGenerator` | **Server** |
| `/tools/password-generator` | page.tsx | Server wrapper -> `PasswordGen` | **Server** |
| `/about` | page.tsx | `AboutPage` | **Server** |
| `/privacy` | page.tsx | `PrivacyPage` | **Server** |
| `/terms` | page.tsx | `TermsPage` | **Server** |
| `/not-found` | not-found.tsx | `NotFound` | **Server** |

**API Routes**: 8 total
| Route | Source | Cache TTL |
|-------|--------|-----------|
| `/api/markets` | Alpha Vantage + FMP | 5 min |
| `/api/markets/search` | FMP search-name | No cache |
| `/api/crypto` | CoinGecko | 1 min |
| `/api/rankings` | World Bank | 24 hr |
| `/api/companies` | FMP stock-screener | 10 min |
| `/api/exchange` | exchangerate-api.com | 1 hr |
| `/api/lotto/[round]` | dhlottery.co.kr | 1 hr |
| `/api/cron/lotto` | dhlottery.co.kr | Vercel cron |
| `/api/og` | ImageResponse (edge) | N/A |

### AS-IS
- 22 pages + 8 API routes + 1 dynamic OG route
- SSG used for stock detail (10 tickers), blog posts (20 slugs), world lotteries (24 slugs)
- Total sitemap URLs: ~58+ (static + dynamic stocks + lotteries + blog posts)

### Issues
- **Home page is fully client-rendered** (`'use client'` on line 1 of `page.tsx`). This means the entire home page ships as JavaScript, no SSR/SSG for the static content sections (Categories, Creators, Rankings hardcoded data).
- **Rankings page is fully client-rendered** despite having all static fallback data that could SSR.
- **Gainers/Losers/Most-Active are near-identical components** (~70 lines each) that could be a single parameterized component.
- `/api/markets` is called redundantly by home page, markets page, gainers page, losers page, and most-active page -- each fetching the full payload (gainers+losers+actives) even when only one subset is needed.

### Notes
- `next.config.ts` defines 30+ redirect rules for deleted legacy pages, indicating significant recent pruning.
- `generateStaticParams` is used correctly in `[ticker]`, `[slug]`, and `[game]` routes.

---

## 3. Styling

### AS-IS
- **Primary approach: Inline styles** (React `style={{}}` objects). Used on approximately 95%+ of all elements across all pages.
- **Tailwind CSS v4**: Imported via `@import "tailwindcss"` in `globals.css` (line 1), with `@tailwindcss/postcss` plugin. However, Tailwind utility classes are used sparingly:
  - `Header.tsx`: `className="hidden md:flex"` (line 49), `className="md:hidden"` (line 52) for responsive nav breakpoints.
  - `layout.tsx`: `className="min-h-screen flex flex-col"` on body (line 119).
  - `WorldLotteryClient.tsx`: Uses Tailwind classes more extensively (`className="rounded-full flex items-center..."`)
  - `lotto/[game]/page.tsx`: Uses Tailwind classes (`className="max-w-lg mx-auto px-4 py-20 text-center"`)
- **CSS Variables**: Defined in `globals.css` `:root` (lines 3-25). Used via `var(--sans)`, `var(--serif)`, `var(--mono)` in inline styles.
- **`@theme inline` block**: Tailwind v4 theme customization in `globals.css` (lines 27-31).
- **`data-area` attribute system**: `[data-area="korea"]` and `[data-area="tools"]` override `--area-bg` and `--area-text` to white/dark (line 33-34). Not currently used in any page.

### Issues
- **Massive inline style duplication**: The same style objects like `{ background: '#111827', borderRadius: 14, border: '1px solid #1E293B' }` are literally repeated 30+ times across files. See `card` const in: `page.tsx:65`, `markets/page.tsx:94`, `creators/page.tsx:22`, `rankings/page.tsx:81`, `rankings/crypto/page.tsx:24`, `gainers/page.tsx:12`, `losers/page.tsx:12`, `most-active/page.tsx:12`, `search/page.tsx:13`.
- **Inconsistent styling approach**: WorldLotteryClient uses Tailwind classes while all other pages use inline styles. This creates a split codebase.
- **`data-area` system is defined but unused**. No page sets `data-area="korea"` or `data-area="tools"` on any element.
- **Hard-coded color values** instead of CSS variables. For example, `'#0B0F19'` appears instead of `var(--bg)`, `'#111827'` instead of `var(--card)`, etc. The variables exist but are not used in inline styles.
- **No CSS Modules or styled-components**: Zero `.module.css` files.

### Notes
- The inline style approach makes the codebase readable in isolation (each component is self-contained) but creates enormous duplication and makes global theme changes extremely labor-intensive.
- `style={{ background: '#0B0F19', minHeight: '100vh' }}` appears as the root wrapper in every single page.

---

## 4. Fonts

### AS-IS
- **Noto Sans KR** (Korean body text): Loaded via `next/font/google` in `layout.tsx:7-11`. Weights: 400, 500, 700, 900. CSS variable: `--font-noto-sans-kr`. Applied as `font-sans` fallback via Tailwind theme.
- **Playfair Display** (serif headings): Loaded via `next/font/google` in `layout.tsx:14-18`. Weights: 700, 800, 900. CSS variable: `--font-playfair`. Referenced as `var(--serif)` in inline styles.
- **DM Sans** (primary sans-serif): Loaded via Google Fonts `<link>` tag in `<head>` (layout.tsx:87). Weights: 400, 500, 600, 700, 800. Referenced as `var(--sans)` in inline styles.
- **IBM Plex Mono** (monospace): Loaded via same Google Fonts `<link>` tag (layout.tsx:87). Weights: 400, 500, 600, 700. Referenced as `var(--mono)` in inline styles.

**Additionally**, `page.tsx:74` re-loads the same fonts with another `<link>` tag inside the component (also including Playfair Display), creating a duplicate request.

### Issues
- **DM Sans and IBM Plex Mono are loaded via `<link>` tag** instead of `next/font/google`. This defeats Next.js font optimization (no automatic self-hosting, no font-display optimization, potential FOUT/CLS).
- **Duplicate font loading**: `page.tsx:74` adds another `<link>` to Google Fonts inside a client component, loading the same fonts again.
- **Noto Sans KR is loaded via `next/font/google` but barely used**. The `body` inline style in `layout.tsx:119` explicitly sets `fontFamily: "'DM Sans', -apple-system, sans-serif"`, overriding the Noto Sans KR that was set up via CSS variable.
- **Four font families** is a lot -- consider if all are necessary.

### Notes
- Font variable setup: `--font-noto-sans-kr` (Next.js), `--serif` (CSS var -> Playfair), `--sans` (CSS var -> DM Sans), `--mono` (CSS var -> IBM Plex Mono).
- The Korean Lotto page uses `fontFamily: "'Noto Sans KR', sans-serif"` directly.

---

## 5. Color Palette

### AS-IS - Complete Color Map

**Defined in `globals.css` `:root`:**
| Variable | Hex | Usage |
|----------|-----|-------|
| `--bg` | `#0B0F19` | Page background (dark navy) |
| `--card` | `#111827` | Card backgrounds |
| `--border` | `#1E293B` | Card/section borders |
| `--elevated` | `#1C2333` | Elevated surfaces |
| `--text-primary` | `#F1F5F9` | Primary text (near white) |
| `--text-secondary` | `#94A3B8` | Secondary text |
| `--text-muted` | `#64748B` | Muted text |
| `--text-dim` | `#475569` | Dim text |
| `--accent` | `#C73E3A` | Brand red accent |
| `--green` | `#00D474` | Positive/up values |
| `--red-neg` | `#FF4545` | Negative/down values |
| `--blue` | `#3B82F6` | Info blue |
| `--gold` | `#D4A843` | Gold/rankings |
| `--purple` | `#A78BFA` | Creators section |

**Hard-coded hex values used in components (not using CSS variables):**
| Hex | Usage |
|-----|-------|
| `#0B0F19` | Page background (repeated in every page) |
| `#0D1117` | Deeper card bg (metric boxes, ticker badges) |
| `#111827` | Card backgrounds |
| `#1E293B` | Borders |
| `#1C2333` | Scrolled nav background |
| `#1F2937` | Inner borders |
| `#374151` | Button borders |
| `#334155` | Disclaimer text |
| `#475569` | Dim text, placeholders |
| `#6B7280` | Muted labels |
| `#64748B` | Secondary descriptions |
| `#94A3B8` | Body text in articles |
| `#E2E8F0` | Card titles |
| `#F1F5F9` | Primary headings |
| `#C73E3A` | Brand accent (DHLM red) |
| `#E85D59` | Gradient variant of accent |
| `#00D474` | Positive green |
| `#FF4545` | Negative red |
| `#D4A843` | Gold for rankings |
| `#A78BFA` | Purple for creators |
| `#3B82F6` | Blue for info |
| `#F59E0B` | Amber for crypto |
| `#60A5FA` | Light blue for tickers |
| `#10B981` | Status green (live indicators) |
| `#FF0000` | YouTube red |
| `#00F2EA` | TikTok cyan |
| `#E4405F` | Instagram pink |
| `#F5F5F5` | X/Twitter white |

### Issues
- **CSS variables defined but not used in inline styles**. All components hardcode hex values directly, making the CSS variable system in `globals.css` entirely decorative.
- **Slight color inconsistencies**: `#6B7280` and `#64748B` are both used for "muted" text in different files. `#1E293B` and `#1F2937` are both used for borders.
- **No dark/light mode toggle** -- the theme is permanently dark.

---

## 6. Components

### AS-IS

**Shared Components (2):**

1. **`Header.tsx`** (67 lines)
   - Fixed position navbar with scroll detection
   - Desktop nav links (hidden/flex via `md:` breakpoint)
   - Mobile hamburger -> right-side drawer overlay
   - Custom SVG logo (`DhlmMono`) with gradient
   - `DhlmMono` is also exported for use elsewhere

2. **`Footer.tsx`** (36 lines)
   - Simple flex layout with copyright
   - Links: About, Privacy, Terms, Contact
   - Market data disclaimer

**Page-local components (not shared):**
- `Counter` (page.tsx:9) -- Intersection Observer animated counter
- `Tag` (page.tsx:28) -- Small colored label
- `Change` (page.tsx:32) -- Percentage change badge
- `LiveMarketsPreview` (page.tsx:214) -- Home page market preview
- `CryptoPreview` (page.tsx:268) -- Home page crypto preview
- `StockCard` (markets/page.tsx:105) -- Expandable stock card with roast
- `MetricBox` (markets/page.tsx:96) -- Small metric display
- `FortuneBuddha` (bless/page.tsx:35) -- SVG Buddha illustration
- `LogoSymbol` (lotto/page.tsx:8) -- Lotto logo SVG
- `Ball` (lotto/page.tsx:22) -- Lotto number ball
- `Bubble` (lotto/page.tsx:40) -- Chat bubble for lotto
- `WorldLotteryClient` (lotto/[game]/WorldLotteryClient.tsx) -- Full lottery client app
- `QrGenerator` (tools/qr-generator/QrGenerator.tsx) -- QR code generator
- `PasswordGen` (tools/password-generator/PasswordGen.tsx) -- Password generator

### Issues
- **No reusable UI component library**. Components like `Tag`, `MetricBox`, `Ball`, card layouts, section headers are redefined inline in each page.
- **`card` style object is re-declared** in 9+ different files with identical values.
- **`sectionLabel` and `sectionTitle` style helpers** exist only in `page.tsx` but the same patterns are manually copied in all other pages.
- **`generateRoast` function** (markets/page.tsx, lines 17-92) is 75 lines of hardcoded text. Could be extracted to a data file.

### Notes
- Header uses `useEffect` for scroll detection -- an appropriate pattern for a fixed nav.
- Header mobile drawer correctly disables body scroll via `document.body.style.overflow`.

---

## 7. Responsive Design

### AS-IS
- **Tailwind breakpoint usage**: Only in `Header.tsx` -- `hidden md:flex` (desktop nav links), `md:hidden` (hamburger).
- **CSS `clamp()` usage**: Home hero heading uses `fontSize: 'clamp(36px, 5.5vw, 58px)'` (page.tsx:79). Blog post heading uses `fontSize: 'clamp(24px, 4vw, 36px)'` (blog/[slug]/page.tsx:42).
- **`maxWidth` containers**: Consistently applied -- `maxWidth: 1100` (home sections), `maxWidth: 720` (markets, detail pages), `maxWidth: 800` (blog), `maxWidth: 680` (about, privacy), `maxWidth: 600` (tools), `maxWidth: 520` (bless), `maxWidth: 480` (lotto chat).
- **`flexWrap: 'wrap'`**: Used on many flex containers (tag lists, stats, quick links).
- **`auto-fit` grid**: Categories section uses `gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'` (page.tsx:189), tools uses `minmax(280px, 1fr)`.
- **Lotto page**: Uses `height: '100vh'` with `flex` layout for a full-screen chat interface.

### Issues
- **No media queries anywhere** (neither CSS nor Tailwind). Responsive behavior relies entirely on `flexWrap`, `clamp()`, and `auto-fit` grids.
- **Crypto rankings grid** uses `gridTemplateColumns: '36px 2fr 1fr 1fr 1fr'` (crypto/page.tsx:65) which will overflow on small screens. No responsive alternative is provided.
- **Stock card expanded metrics grid** uses `gridTemplateColumns: 'repeat(4, 1fr)'` (markets/page.tsx:132) which will be cramped on mobile.
- **No `viewport meta tag`** explicitly set (Next.js adds it by default, but worth verifying).
- **Header spacer** is a fixed `height: 64` div (Header.tsx:57) which may not match actual nav height on different screen sizes.

### Notes
- The inline-style approach makes responsive design difficult -- you cannot use media queries in React inline styles without JS-based solutions.
- The overall layout is reasonably mobile-friendly due to column flex and wrap, but specific components (crypto table, stock metrics grid) will break on narrow viewports.

---

## 8. Animations

### AS-IS

**CSS Animations (defined in `<style>` tags):**

1. **Lotto page** (lotto/page.tsx:207-209):
   - `@keyframes td` -- typing dots bounce (`translateY(-3px)`)

2. **Bless My Stock page** (bless/page.tsx:242-249):
   - `@keyframes pulse` -- opacity pulse for blessing animation
   - `@keyframes glow` -- scale + opacity for Buddha glow
   - `@keyframes twinkle` -- opacity blink for stars
   - `@keyframes spin` -- continuous rotation for decorative circle
   - `@keyframes loading` -- translateX progress bar

**CSS Transitions (inline):**
- Header nav: `transition: "all 0.3s"` for background/padding on scroll (Header.tsx:41)
- Mobile drawer: `transition: "transform 0.2s"` for slide-in (Header.tsx:59)
- Stock roast reveal: `transition: 'all 0.5s'` for opacity + translateY (markets/page.tsx:162)
- Quick nav links: `transition: 'border-color 0.2s'` (page.tsx:94)

**JavaScript Animations:**
- `Counter` component (page.tsx:9-26): IntersectionObserver-triggered count-up animation using `requestAnimationFrame` with cubic easing.
- Blessing flow (bless/page.tsx): `setTimeout` chains for 3-second blessing animation.
- Lotto chat (lotto/page.tsx): Simulated typing delay with `setTyping(true)` and 1200ms timeout.

### Issues
- **No `framer-motion` usage despite being a dependency** (`"framer-motion": "^12.38.0"` in package.json). This is ~120KB of unused JavaScript being shipped (if not tree-shaken by bundler).
- **CSS animations defined in `<style>` tags inside components** instead of `globals.css`. These get re-injected on every render.
- **No `prefers-reduced-motion` respect** for any animation.

### Notes
- The `Counter` component is well-implemented with IntersectionObserver for performance.
- Animation usage is restrained and purposeful -- mainly in the two "fun" pages (Bless My Stock, Lotto PRO).

---

## 9. SEO

### AS-IS

**`layout.tsx` Metadata (lines 23-63):**
- `metadataBase`: `https://dhlm-studio.com`
- `title.default`: Dynamic year-based title with `template: '%s | DHLM Studio'`
- `description`: Rich keyword-dense description
- `keywords`: 14 keywords covering main features
- `openGraph`: Full configuration with title, description, url, siteName, locale, type, images
- `twitter`: `summary_large_image` card
- `alternates.canonical`: Set to base URL
- `robots`: index/follow with googleBot max-preview directives

**JSON-LD (layout.tsx lines 94-117):**
- `Organization` schema: name, url, logo, description, sameAs (GitHub), contactPoint
- `WebSite` schema: name, url, description

**Per-page Metadata:**
- `about/page.tsx`: Custom title + description
- `creators/page.tsx`: Custom title + description
- `blog/page.tsx`: Custom title + description
- `blog/[slug]/page.tsx`: `generateMetadata` from blog post data
- `markets/[ticker]/page.tsx`: `generateMetadata` with live FMP data
- `lotto/[game]/page.tsx`: `generateMetadata` from lottery definitions (includes `alternates.languages`)
- `tools/page.tsx`, `tools/qr-generator/page.tsx`: Custom title + description
- `privacy/page.tsx`: Custom title + description

**OG Image Generation:**
- `opengraph-image.tsx` (edge runtime): Generates branded 1200x630 OG image
- `/api/og` route: Dynamic OG image with title/subtitle params

**Sitemap (`sitemap.ts`):**
- Covers: main pages, individual stocks (10), lotto games (24), blog posts (20), tools, static pages
- Uses `changeFrequency` and `priority` appropriately

**Robots (`robots.ts`):**
- Simple allow-all with sitemap reference

**`llms.txt`:**
- AI crawler-friendly summary of site content

**`ads.txt`:**
- Google AdSense publisher verification

### Issues
- **No JSON-LD on individual pages**. Stock pages lack `Product`/`FinancialProduct` schema. Blog posts lack `Article` schema. This is a major SEO gap.
- **Home page (`page.tsx`) has NO metadata export** because it uses `'use client'`. The layout.tsx default metadata applies, but page-specific enrichment is lost.
- **Markets page has NO metadata export** (client component). Same for rankings, crypto, lotto main.
- **OG image references `/og-default.png`** (layout.tsx:43) but this file does NOT exist in `public/`. The `opengraph-image.tsx` generates images dynamically, but the static fallback reference is broken.
- **GA tracking ID is placeholder** (`G-XXXXXXXXXX` in layout.tsx:79,84). Analytics is not actually running.
- **No `SearchAction` in WebSite JSON-LD**. The search functionality exists (`/markets/search`) but is not declared to search engines.
- **`llms.txt` references `/compare`** which redirects to `/rankings` (deleted route).

### Notes
- The lotto `[game]` pages have excellent multilingual `alternates` with `hreflang` attributes.
- `changeFrequency` values in sitemap are well-calibrated (daily for markets, weekly for creators, monthly for tools).

---

## 10. Performance

### AS-IS

**Image Optimization:**
- **`next/image` is NOT used anywhere**. All images use native `<img>` tags:
  - Stock logos: `<img src={s.image}...>` (markets/page.tsx:116)
  - Crypto icons: `<img src={c.image}...>` (crypto/page.tsx:83, page.tsx:291)
  - Stock detail: `<img src={stock.image}...>` (markets/[ticker]/page.tsx:113)
- External image sources: FMP (company logos), CoinGecko (crypto icons)

**Code Splitting:**
- Next.js automatic code splitting per route is active
- `WorldLotteryClient` is properly separated as a client component imported by a server component wrapper

**Lazy Loading:**
- No explicit `React.lazy()` or `dynamic()` imports used
- No `loading.tsx` files for any route (no Suspense boundaries)

**Caching:**
- API routes implement in-memory caching with TTLs (5min to 24hr)
- `{ cache: 'no-store' }` used on all external API fetches (correct for real-time data)
- No ISR (`revalidate`) on any page

**Dependencies:**
| Package | Size Impact |
|---------|-------------|
| `framer-motion` ^12.38.0 | ~120KB (UNUSED) |
| `html2canvas` ^1.4.1 | ~200KB |
| `recharts` ^3.8.0 | ~400KB (usage not visible in current pages) |
| `react` 19.2.4 | ~45KB |
| `next` 16.2.0 | Framework |

**Bundle Analysis:**
- Home page is `'use client'` with inline data arrays and helper functions (~310 lines), shipping all of it as client JS.
- `markets/page.tsx` contains ~296 lines including the massive `generateRoast` function (75 lines of string templates).

### Issues
- **No `next/image` optimization** means no automatic WebP conversion, no responsive srcset, no lazy loading, no blur placeholders. Every `<img>` is a raw fetch.
- **`framer-motion` is installed but unused** -- should be removed to reduce bundle size.
- **`recharts` is installed but not visibly used** in any current page -- should be verified or removed.
- **`html2canvas` is installed** -- likely used in QR generator for download, but still a heavy dependency.
- **No `loading.tsx` or Suspense boundaries** for any route. Users see no loading states during route transitions.
- **No ISR (`revalidate`)** on stock detail pages, which fetch live data on every request.
- **Home page ships as full client JS** despite having mostly static content.

### Notes
- In-memory API caching is a good approach for Vercel serverless functions (shared across warm instances).
- The markets API enriches top 3 gainers with FMP profile + financials, adding latency to API response (~3 sequential fetches per gainer).

---

## 11. Data Fetching

### AS-IS

**External APIs Used:**

| API | Route | Free Tier Limits |
|-----|-------|-----------------|
| Alpha Vantage | `/api/markets` | 25 req/day (free key) |
| Financial Modeling Prep (FMP) | `/api/markets`, `/api/companies`, `/api/markets/search`, `/markets/[ticker]` | 250 req/day |
| CoinGecko | `/api/crypto` | 30 req/min |
| World Bank Open Data | `/api/rankings` | Unlimited |
| exchangerate-api.com | `/api/exchange` | Rate limited |
| dhlottery.co.kr | `/api/lotto/[round]`, `/api/cron/lotto` | Server blocks noted |

**Fetching Patterns:**
- **Client-side**: Most pages use `useEffect` + `fetch('/api/...')` pattern
- **Server-side**: `markets/[ticker]/page.tsx` fetches FMP data directly in the server component (not via API route)
- **No SWR or React Query** -- all fetching is raw `fetch` in `useEffect`
- **Error handling**: Mostly `.catch(() => {})` (silent failures)

### Issues
- **Silent error swallowing**: `.catch(() => {})` on all client-side fetches (page.tsx:228, 275; markets/page.tsx:199; etc). Users see empty states with no retry mechanism.
- **No loading skeletons**: Loading states are plain text "Loading live data..." or "Loading crypto data..."
- **No retry logic** on API failures.
- **Alpha Vantage demo key**: `const AV_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo'` (markets/route.ts:3). The demo key has severe rate limits.
- **FMP key fallback**: `const FMP_KEY = process.env.FMP_API_KEY || ''` -- empty string fallback means features silently break without env vars.
- **dhlottery.co.kr blocks requests** from Vercel (noted in code comments). The API proxy may not work in production.
- **Redundant API calls**: Multiple pages fetch `/api/markets` for the full dataset even when they only need one category.

### Notes
- The caching strategy is sound -- different TTLs for different data freshness requirements.
- The `markets/[ticker]` page correctly uses server-side fetching with `Promise.all` for parallel profile + financials requests.
- Exchange rate API is defined but `/api/exchange` is not consumed by any current page.

---

## 12. Accessibility

### AS-IS
- **ARIA labels**: None. Zero `aria-label`, `aria-labelledby`, `aria-describedby`, or `role` attributes across the entire codebase.
- **Semantic HTML**: `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<h1>`-`<h3>` are used appropriately.
- **`alt` text on images**: Most `<img>` tags have `alt=""` (empty) or `alt={c.name}` (crypto icons). Stock logos use `alt=""`.
- **`lang` attribute**: Set to `"en"` on `<html>` (layout.tsx:72).
- **Focus styles**: None defined. Default browser focus outlines are likely suppressed by `* { margin: 0 }` (globals.css:38).
- **Color contrast**: Primary text `#F1F5F9` on `#0B0F19` background = 15.3:1 ratio (excellent). Secondary text `#94A3B8` on `#0B0F19` = 6.6:1 (good). Muted text `#475569` on `#0B0F19` = 3.3:1 (borderline, fails WCAG AA for normal text). Disclaimer text `#334155` on `#0B0F19` = 2.3:1 (fails).

### Issues
- **Zero ARIA attributes** in the entire project. No `aria-label` on navigation, buttons, inputs, or interactive elements.
- **Hamburger button has no accessible label** (Header.tsx:52). It uses div-based "bars" with no text alternative.
- **Mobile drawer close button** uses `&times;` character with no `aria-label` (Header.tsx:60).
- **Color-only information**: Positive/negative stock changes are differentiated only by color (green vs red) with no icon, prefix text, or aria annotation for color-blind users.
- **Interactive cards** use `cursor: 'pointer'` and `onClick` on `<div>` elements (markets/page.tsx:114) instead of `<button>`. These are not keyboard accessible.
- **Skip to content** link is missing.
- **Low contrast text**: `#475569` on `#0B0F19` (3.3:1) and `#334155` on `#0B0F19` (2.3:1) fail WCAG AA.
- **No keyboard navigation** handling. Tab order is default, no focus management for mobile drawer or modals.

### Notes
- The semantic HTML structure is a solid foundation that screen readers can parse.
- The `+`/`-` prefix on change values (e.g., `+12%`, `-3%`) partially addresses color-only information.

---

## 13. Icons & Images

### AS-IS
- **No icon library** (no Heroicons, Lucide, FontAwesome, etc.)
- **Emoji used as icons**: Extensively throughout the project. Examples: `📈`, `🔥`, `🏆`, `🪙`, `🎯`, `🧮`, `🔍`, `🟢`, `🔴`, `📊`, `🙏`, `🪷` (used for Bless My Stock).
- **Custom SVG**: `DhlmMono` logo (Header.tsx:15-28), `LogoSymbol` (lotto/page.tsx:8-19), `FortuneBuddha` (bless/page.tsx:35-66).
- **External images**: Stock logos (FMP), crypto icons (CoinGecko) via `<img>` tags.
- **Static SVGs in public/**: `favicon.svg`, `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` (mostly unused Next.js defaults).
- **Favicon**: `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />` (layout.tsx:75).

### Issues
- **No `next/image` for external images** -- loses optimization benefits.
- **Emoji rendering varies by OS/browser** -- looks different on Windows vs Mac vs Android.
- **No image CDN** or optimization pipeline for external images.
- **Public directory contains unused default files**: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` are Next.js scaffolding leftovers.
- **No `og-default.png`** in public/ despite being referenced in layout.tsx OG metadata.

---

## 14. Third-Party Integrations

### AS-IS

**Google Analytics 4 (layout.tsx:78-85):**
- Script tags in `<head>` for GA4
- **Tracking ID is placeholder**: `G-XXXXXXXXXX` (not a real ID)
- Implementation: Standard gtag.js snippet

**Google AdSense (layout.tsx:88-92):**
- Script loaded asynchronously
- Publisher ID: `ca-pub-5182634360822108`
- `ads.txt` file present in public/
- **No actual ad units placed** on any page

**External Data APIs:**
- Alpha Vantage (stock market data)
- Financial Modeling Prep (stock profiles, search, companies)
- CoinGecko (cryptocurrency data)
- World Bank Open Data (GDP, population)
- exchangerate-api.com (forex rates)
- dhlottery.co.kr (Korean lottery data)

**Google Fonts:**
- Loaded via `<link>` tag (DM Sans, IBM Plex Mono) and `next/font/google` (Noto Sans KR, Playfair Display)

### Issues
- **GA4 is not functional** -- placeholder tracking ID means zero analytics data is being collected.
- **AdSense script loads on every page** but no ad units are rendered, adding unnecessary load.
- **No cookie consent banner** despite using GA4 and AdSense (GDPR/privacy concern for EU visitors).
- **No error tracking** (no Sentry, LogRocket, etc.)
- **No analytics alternative** -- no Vercel Analytics, Plausible, or similar.

### Notes
- All API keys are properly stored as environment variables (not hardcoded in source).
- The AdSense publisher ID (`ca-pub-5182634360822108`) is correct per the project memory reference.
- `html2canvas` in dependencies suggests screenshot/download functionality (likely in QR generator).
- `recharts` in dependencies suggests chart features that may be planned or in deleted pages.

---

## Summary of Critical Issues

| Priority | Issue | Impact |
|----------|-------|--------|
| HIGH | GA4 tracking ID is placeholder | Zero analytics |
| HIGH | `next/image` not used anywhere | Poor LCP, no image optimization |
| HIGH | Home page is fully client-rendered | Poor SEO, slow initial load |
| HIGH | No ARIA attributes anywhere | Accessibility compliance failure |
| HIGH | `og-default.png` missing from public/ | Broken OG image fallback |
| MEDIUM | CSS variables defined but unused in styles | Theme changes require editing 40+ files |
| MEDIUM | Massive inline style duplication | Maintenance burden |
| MEDIUM | framer-motion installed but unused | ~120KB wasted bundle size |
| MEDIUM | No loading.tsx / Suspense boundaries | No route transition feedback |
| MEDIUM | Silent error swallowing | Users see blank states on failures |
| MEDIUM | No cookie consent banner | GDPR risk |
| LOW | Duplicate Google Fonts link in page.tsx | Extra network request |
| LOW | data-area system unused | Dead code |
| LOW | llms.txt references deleted /compare route | Inaccurate AI crawler info |
| LOW | Unused public/ SVG files | Clutter |

---

## File Counts Summary

- **Total source files**: 48
- **Pages**: 22 (14 client, 8 server/SSG)
- **API Routes**: 9 (including cron and OG)
- **Components**: 2 shared + 14 page-local
- **Data files**: 3
- **Library files**: 2
- **SSG params**: 54 (10 stocks + 24 lotteries + 20 blog posts)
- **Redirects**: 30+ in next.config.ts
- **World lotteries**: 24 countries
- **Blog posts**: 20
- **Static stock profiles**: 10
