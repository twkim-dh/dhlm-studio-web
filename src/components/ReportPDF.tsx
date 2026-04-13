'use client';
/**
 * ReportPDF — triggers the browser's native Print dialog (Ctrl+P / Cmd+P).
 * The print layout is defined via @media print in globals.css.
 * This approach gives perfect table rendering, correct text flow, and
 * zero dependency on html2canvas or html2pdf.js.
 */

export interface ReportPDFProps {
  slug?: string;
  title?: string;
  date?: string;
  description?: string;
  category?: string;
  ticker?: string;
  beafScore?: number;
  grade?: string;
  type?: string;
  body?: string;
}

export default function ReportPDF({ slug }: ReportPDFProps) {
  if (!slug) return null;
  return (
    <a
      href={`/pdf/${slug}.pdf`}
      download
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
        padding: '8px 14px', borderRadius: 8,
        cursor: 'pointer',
        background: '#111827', border: '1px solid #1E293B',
        color: '#94A3B8',
        textDecoration: 'none',
        transition: 'opacity 0.2s',
      }}
      title="Download PDF Report"
    >
      ⬇ PDF
    </a>
  );
}
