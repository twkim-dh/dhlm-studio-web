/**
 * Date formatting utilities — US English style only.
 * All dates stored in data files are ISO YYYY-MM-DD strings.
 *
 * fmtDateShort('2026-04-08') → 'Apr 8, 2026'   (cards, lists, compact)
 * fmtDateLong('2026-04-08')  → 'April 8, 2026'  (page headers, bylines)
 * fmtDateCompact('2026-04-08') → 'Apr 8'         (tables, tight spaces, same-year data)
 */

export function fmtDateShort(date: string): string {
  if (!date) return '';
  try {
    const d = date.includes('T') ? new Date(date) : new Date(date + 'T12:00:00Z');
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return date; }
}

export function fmtDateLong(date: string): string {
  if (!date) return '';
  try {
    const d = date.includes('T') ? new Date(date) : new Date(date + 'T12:00:00Z');
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return date; }
}

export function fmtDateCompact(date: string): string {
  if (!date) return '';
  try {
    const d = date.includes('T') ? new Date(date) : new Date(date + 'T12:00:00Z');
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    });
  } catch { return date; }
}
