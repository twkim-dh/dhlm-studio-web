export default function Loading() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ width: 200, height: 14, borderRadius: 4, background: '#111827', marginBottom: 8 }} />
        <div style={{ width: 300, height: 32, borderRadius: 6, background: '#111827', marginBottom: 24 }} />
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ width: 100, height: 36, borderRadius: 8, background: '#111827' }} />)}
        </div>
        <div style={{ borderRadius: 18, border: '1px solid #1E293B', overflow: 'hidden' }}>
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div key={i} style={{ height: 56, borderBottom: '1px solid #1E293B', background: '#111827', animation: 'shimmer 1.5s infinite', backgroundImage: 'linear-gradient(90deg, #111827 25%, #1C2333 50%, #111827 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
