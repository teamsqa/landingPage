'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import SocialButtons from './SocialButtons';
import CookieBanner from './CookieBanner';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'pt-20'}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <SocialButtons />}
      {!isAdminRoute && <CookieBanner />}
    </>
  );
}