'use client';

export default function ShareButton({ title, text }: { title: string; text: string }) {
  return (
    <button onClick={() => {
      if (navigator.share) { navigator.share({ title, text }).catch(() => {}); }
      else { navigator.clipboard.writeText(text); }
    }} className="text-[13px] transition-colors hover:text-[#C73E3A]" style={{ color: '#BCBCBC' }}>
      Share this event
    </button>
  );
}
