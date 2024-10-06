import { Header } from '@/components/landing-page/header';
import { BlobBackground } from '@/components/landing-page/hero-section/blob-bground';
import { HeroSection } from '@/components/landing-page/hero-section/hero';

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
