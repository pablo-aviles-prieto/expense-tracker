import { Metadata } from 'next';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import { redirect } from 'next/navigation';

import { ContactSection } from '@/components/landing-page/contact-section/contact-section';
import { FeaturesSection } from '@/components/landing-page/features-section/features';
import { Header } from '@/components/landing-page/header';
import { BlobBackground } from '@/components/landing-page/hero-section/blob-bground';
import { HeroSection } from '@/components/landing-page/hero-section/hero';
import { ImagesSection } from '@/components/landing-page/images-section/images-section';
import { OpenSourceSection } from '@/components/landing-page/open-source-section';
import { authOptions } from '@/lib/auth-options';

export const metadata: Metadata = {
  title: 'Expense Tracker - Discover what we can offer you',
};

export default async function LandingPage() {
  const session = await getServerSession(authOptions as unknown as NextAuthOptions);
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <section className='space-y-52 overflow-auto overflow-x-hidden bg-black'>
      <section className='space-y-8'>
        <BlobBackground blobBground='inset-[5rem] bottom-[20rem] md:inset-[15rem] md:bottom-[20rem]'>
          <Header />
          <div className='container mx-auto mt-6 lg:mt-36'>
            <HeroSection />
          </div>
        </BlobBackground>
        <section className='spacing-the-header h-[200px] md:h-0' />
        <ImagesSection />
        <section className='spacing-the-scroll-animation h-[1100px]' />
      </section>
      <FeaturesSection />
      <OpenSourceSection />
      <ContactSection />
    </section>
  );
}
