import type { Metadata } from 'next';
import { getLotteryBySlug, slugToId } from '@/lib/world-lottery';
import WorldLotteryClient from './WorldLotteryClient';

export function generateStaticParams() {
  return Object.keys(slugToId).map((game) => ({ game }));
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }): Promise<Metadata> {
  const { game } = await params;
  const lottery = getLotteryBySlug(game);
  if (!lottery) return { title: 'Lottery Number Generator' };
  return {
    title: lottery.seoTitle,
    description: lottery.seoDesc,
    openGraph: {
      title: `${lottery.seoTitle} | DHLM Studio`,
      description: lottery.seoDesc,
      locale: 'en_US',
      alternateLocale: 'ko_KR',
    },
    alternates: {
      canonical: `https://dhlm-studio.com/lotto/${game}`,
      languages: {
        en: `https://dhlm-studio.com/lotto/${game}`,
        ko: `https://dhlm-studio.com/lotto/${game}`,
        'x-default': `https://dhlm-studio.com/lotto/${game}`,
      },
    },
  };
}

export default async function LotteryGamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const lottery = getLotteryBySlug(game);
  if (!lottery) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Lottery Not Found</h1>
        <p className="text-gray-500 mt-2">The requested lottery game does not exist.</p>
      </div>
    );
  }
  return <WorldLotteryClient lotteryId={lottery.id} />;
}
