'use client';

function getPageList(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

const btn = (active: boolean, disabled?: boolean): React.CSSProperties => ({
  padding: '6px 12px',
  borderRadius: 7,
  border: active ? '1px solid #C73E3A60' : '1px solid #E8E8E4',
  background: active ? '#C73E3A18' : '#FAFAF8',
  color: active ? '#16161A' : disabled ? '#334155' : '#5B6470',
  fontFamily: 'var(--mono)',
  fontSize: 11,
  fontWeight: active ? 800 : 600,
  cursor: disabled ? 'not-allowed' : 'pointer',
  minWidth: 34,
  transition: 'all 0.15s',
  opacity: disabled ? 0.45 : 1,
});

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = getPageList(currentPage, totalPages);

  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap', alignItems: 'center' }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        style={btn(false, currentPage === 1)}
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} style={{ padding: '6px 4px', color: '#8A929C', fontSize: 11 }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            style={btn(p === currentPage)}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        style={btn(false, currentPage === totalPages)}
      >
        Next →
      </button>
    </div>
  );
}
