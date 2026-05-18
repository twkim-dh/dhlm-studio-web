import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unsubscribe — Brutal Edge',
  description: 'Unsubscribe from Brutal Edge email updates.',
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ status?: string }> | { status?: string };
};

export default async function UnsubscribePage({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams);
  const status = params?.status ?? '';

  return (
    <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full">

        {/* Brand */}
        <p className="text-[10px] font-black tracking-[3px] uppercase text-[#C73E3A] mb-8">
          Brutal Edge™
        </p>

        {status === 'success' ? (
          /* ── Success ── */
          <div>
            <h1 className="font-['Georgia',serif] text-3xl font-black text-[#F1F5F9] leading-tight mb-4">
              Done.
            </h1>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-3">
              You&rsquo;ve been removed from the Brutal Edge mailing list.
              No more reports. No more Daily Briefs.
            </p>
            <p className="text-[#64748B] text-xs leading-relaxed mb-8">
              Changed your mind? You can re-subscribe any time at{' '}
              <a href="https://dhlm-studio.com" className="text-[#94A3B8] underline underline-offset-2">
                dhlm-studio.com
              </a>
              .
            </p>
            <Link
              href="/"
              className="inline-block text-xs font-bold text-[#C73E3A] hover:text-[#F1F5F9] transition-colors"
            >
              ← Back to Brutal Edge
            </Link>
          </div>

        ) : status === 'error' ? (
          /* ── Error ── */
          <div>
            <h1 className="font-['Georgia',serif] text-3xl font-black text-[#F1F5F9] leading-tight mb-4">
              Something went wrong.
            </h1>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-8">
              We couldn&rsquo;t process your request. Enter your email below to unsubscribe manually.
            </p>
            <UnsubscribeForm />
          </div>

        ) : (
          /* ── Default / Invalid ── */
          <div>
            <h1 className="font-['Georgia',serif] text-3xl font-black text-[#F1F5F9] leading-tight mb-4">
              Unsubscribe.
            </h1>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-8">
              Enter your email address to stop receiving Brutal Edge reports and Daily Briefs.
            </p>
            <UnsubscribeForm />
          </div>
        )}

      </div>
    </main>
  );
}

function UnsubscribeForm() {
  return (
    <form action="/api/unsubscribe" method="get" className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-[2px] text-[#64748B] mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full bg-[#111827] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:border-[#C73E3A] transition-colors"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#C73E3A] hover:bg-[#B03330] text-white text-sm font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Unsubscribe →
      </button>
      <p className="text-[10px] text-[#475569] text-center leading-relaxed">
        This will remove you from all Brutal Edge email communications.
      </p>
    </form>
  );
}
