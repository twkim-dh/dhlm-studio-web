export default function Loading() {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ width: 120, height: 20, borderRadius: 6, background: '#111827' }} />
          <div style={{ width: 80, height: 14, borderRadius: 4, background: '#111827' }} />
        </div>
        <div style={{ height: 80, borderRadius: 14, background: '#111827', border: '1px solid #1E293B', marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 40, borderRadius: 8, background: '#111827' }} />)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ height: 72, borderRadius: 14, background: '#111827', border: '1px solid #1E293B', animation: 'shimmer 1.5s infinite', backgroundImage: 'linear-gradient(90deg, #111827 25%, #1C2333 50%, #111827 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
