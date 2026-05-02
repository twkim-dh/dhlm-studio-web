'use client';
import dynamic from 'next/dynamic';

const MobileNav = dynamic(() => import('@/components/MobileNav'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false });
const NoRightClick = dynamic(() => import('@/components/NoRightClick'), { ssr: false });
const NewsletterModal = dynamic(() => import('@/components/NewsletterModal'), { ssr: false });

export default function ClientWidgets({ showModal }: { showModal: boolean }) {
  return (
    <>
      <NoRightClick />
      <MobileNav />
      <CookieConsent />
      {showModal && <NewsletterModal />}
    </>
  );
}
