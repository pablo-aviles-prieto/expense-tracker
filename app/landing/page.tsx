import Image from 'next/image';

import { Header } from '@/components/landing-page/header';
import { BlobBackground } from '@/components/landing-page/hero-section/blob-bground';
import { HeroSection } from '@/components/landing-page/hero-section/hero';
import { ImagesSection } from '@/components/landing-page/images-section';

export default function LandingPage() {
  return (
    <section className='overflow-auto bg-black'>
      <BlobBackground blobBground='inset-[5rem] bottom-[20rem] md:inset-[15rem] md:bottom-[20rem]'>
        <Header />
        <div className='mx-auto max-w-7xl'>
          <HeroSection />
        </div>
      </BlobBackground>
      <section className='relative mx-auto max-w-xs'>
        <ImagesSection />
        <Image
          alt='iphone15 mockup'
          src='/images/landing/iphone15-mockup.png'
          className='absolute top-0 size-full h-[590px]'
          width={287}
          height={623}
        />
      </section>
      <section className='h-[1000px]'>
        <p>Hey</p>
      </section>
    </section>
  );
}
