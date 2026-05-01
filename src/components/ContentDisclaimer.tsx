export default function ContentDisclaimer() {
  return (
    <div style={{
      marginTop: 40,
      padding: '16px 20px',
      borderRadius: 10,
      background: '#0D1117',
      border: '1px solid #1E293B',
    }}>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 9,
        fontWeight: 800,
        color: '#C73E3A',
        letterSpacing: 2,
        marginBottom: 8,
      }}>
        ⚠ DISCLAIMER
      </div>
      <p style={{
        fontSize: 11,
        color: '#475569',
        lineHeight: 1.7,
        margin: 0,
      }}>
        This content is for educational and informational purposes only. It does not constitute
        financial advice, investment advice, or any recommendation to buy or sell securities.
        Investment decisions should be made based on your own research and consultation with
        qualified financial advisors. Past performance does not guarantee future results.
        Brutal Edge and DHLM Studio do not assume any liability for losses incurred from
        investment decisions made based on this content.
      </p>
    </div>
  );
}
