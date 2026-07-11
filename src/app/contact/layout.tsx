import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | DHLM Studio',
  description: 'Contact DHLM Studio — questions, corrections, partnerships, or press inquiries. We respond within 24 hours.',
  alternates: { canonical: 'https://dhlm-studio.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
