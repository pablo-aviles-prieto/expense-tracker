import { Features } from '@/components/landing-page/features-section/features';
import { Header } from '@/components/landing-page/header';
import { BlobBackground } from '@/components/landing-page/hero-section/blob-bground';
import { HeroSection } from '@/components/landing-page/hero-section/hero';
import { ImagesSection } from '@/components/landing-page/images-section/images-section';

export default function LandingPage() {
  return (
    <section className='space-y-8 overflow-auto overflow-x-hidden bg-black'>
      <BlobBackground blobBground='inset-[5rem] bottom-[20rem] md:inset-[15rem] md:bottom-[20rem]'>
        <Header />
        <div className='container mx-auto'>
          <HeroSection />
        </div>
      </BlobBackground>
      <ImagesSection />
      <section className='spacing-the-scroll-animation h-[1300px]' />
      <Features />
      <section className='h-[400px] text-center'>Open source code</section>
      <section className='h-[400px] text-center'>Contact/suggestions via mail/github</section>
    </section>
  );
}
