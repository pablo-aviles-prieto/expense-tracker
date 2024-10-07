'use client';

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image';

export const ImagesSection = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 200,
          end: 500,
          scrub: true,
          markers: true,
        },
      });

      timeline
        .fromTo(
          '.left-image',
          { x: -200, y: -350, opacity: 1 },
          { x: 150, y: 10, opacity: 1, duration: 1 }
        )
        .fromTo(
          '.right-image',
          { x: 350, y: -350, opacity: 1 },
          { x: -150, y: 10, opacity: 1, duration: 1 },
          '<'
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className='images-wrapper flex items-center justify-center gap-x-4'>
      <Image
        className='left-image z-50 rounded-lg'
        src='/images/landing/image1.png'
        alt='Dashboard image'
        width={287}
        height={623}
      />
      <Image
        className='right-image z-50 rounded-lg'
        src='/images/landing/image2.png'
        alt='Dashboard image'
        width={287}
        height={623}
      />
    </div>
  );
};
