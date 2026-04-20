import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 410 Gone: permanently deleted pages — signals to Google these are gone, not moved
const GONE_PATHS = new Set([
  '/blog/bitcoin-deep-dive-april-2026',
  '/blog/lotto-statistics',
  '/blog/powerball-vs-mega-millions-better-odds',
]);

export function middleware(request: NextRequest) {
  if (GONE_PATHS.has(request.nextUrl.pathname)) {
    return new NextResponse('Gone', { status: 410 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/blog/bitcoin-deep-dive-april-2026',
    '/blog/lotto-statistics',
    '/blog/powerball-vs-mega-millions-better-odds',
  ],
};
