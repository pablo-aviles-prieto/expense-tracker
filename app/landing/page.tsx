import { BlobBackground } from '@/components/landing-page/blob-bground';
import { Header } from '@/components/landing-page/header';
import { HeroSection } from '@/components/landing-page/hero';

export default async function LandingPage() {
  return (
    <BlobBackground>
      <Header />
      <section className='mx-auto max-w-7xl'>
        <HeroSection />
      </section>
    </BlobBackground>
  );
}
