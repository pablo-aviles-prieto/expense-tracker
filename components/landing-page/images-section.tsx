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
          { x: -150, y: -350, opacity: 1 },
          { x: 300, y: 10, opacity: 1, duration: 1 }
        )
        .fromTo(
          '.center-image',
          { x: 0, y: -350, opacity: 1 },
          { x: -0, y: 10, opacity: 1, duration: 1 },
          '<'
        )
        .fromTo(
          '.right-image',
          { x: 150, y: -350, opacity: 1 },
          { x: -300, y: 10, opacity: 1, duration: 1 },
          '<'
        );

      // Pin the section after the animation
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300px', // Adjust this value based on how long you want the section pinned
        pin: true,
        pinSpacing: false,
        scrub: true,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className='relative mx-auto flex max-w-xs items-center justify-center gap-x-4'
    >
      <div className='images-wrapper flex items-center justify-center gap-x-4'>
        <Image
          className='left-image rounded-lg'
          src='/images/landing/image3.png'
          alt='Dashboard image'
          width={287}
          height={623}
        />
        <Image
          className='center-image rounded-lg'
          src='/images/landing/image2.png'
          alt='Dashboard image'
          width={287}
          height={623}
        />
        <Image
          className='right-image rounded-lg'
          src='/images/landing/image1.png'
          alt='Dashboard image'
          width={287}
          height={623}
        />
      </div>

      {/* iPhone mockup */}
      <Image
        alt='iphone15 mockup'
        src='/images/landing/iphone15-mockup.png'
        className='absolute top-0 h-[590px] w-full'
        width={287}
        height={623}
      />
    </div>
  );
};
