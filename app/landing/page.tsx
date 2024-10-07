import Image from 'next/image';

import { Header } from '@/components/landing-page/header';
import { BlobBackground } from '@/components/landing-page/hero-section/blob-bground';
import { HeroSection } from '@/components/landing-page/hero-section/hero';
import Iphone15Pro from '@/components/ui/iphone-15-pro';

export default async function LandingPage() {
  return (
    <section className='inset- h-[calc(100vh)] overflow-auto bg-black'>
      <BlobBackground blobBground='inset-[5rem] bottom-[20rem] md:inset-[15rem] md:bottom-[20rem]'>
        <Header />
        <div className='mx-auto max-w-7xl'>
          <HeroSection />
        </div>
        <div className='flex items-center justify-center gap-x-4'>
          <Image
            className='rounded-lg'
            src='/images/landing/image1.png'
            alt='Dashboard image'
            width={287}
            height={623}
          />
          <Image
            className='rounded-lg'
            src='/images/landing/image2.png'
            alt='Dashboard image'
            width={287}
            height={623}
          />
        </div>
      </BlobBackground>
      <section className='mx-auto my-4 max-w-xs'>
        <Iphone15Pro className='size-full' src='/images/landing/image1.png' />
      </section>
    </section>
  );
}
