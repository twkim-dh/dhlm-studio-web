'use client';
/**
 * PrintButton — triggers the browser print dialog so users can save as PDF.
 * Works without any backend or third-party library.
 */
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
        padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
        background: '#111827', border: '1px solid #1E293B',
        color: '#94A3B8',
      }}
      title="Save as PDF"
    >
      ⬇ PDF
    </button>
  );
}
