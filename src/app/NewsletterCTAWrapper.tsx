'use client';
import dynamic from 'next/dynamic';

const NewsletterCTA = dynamic(() => import('@/components/NewsletterCTA'), { ssr: false });

export default function NewsletterCTAWrapper({ source }: { source: string }) {
  return <NewsletterCTA source={source} />;
}
