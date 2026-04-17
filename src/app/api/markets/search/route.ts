// /api/markets/search — deprecated. Returns 410 Gone.
// This endpoint previously called FMP /stable/search on every keystroke.
// Removed to eliminate unbudgeted FMP quota consumption.

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    { error: 'This endpoint has been removed.', results: [] },
    { status: 410 }
  );
}
