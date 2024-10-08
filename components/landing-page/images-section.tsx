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

      const threeImagesTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 200,
          end: 500,
          scrub: true,
          // markers: true,
        },
      });

      threeImagesTimeline
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

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=800px',
        pin: true,
        pinSpacing: false,
        scrub: true,
        markers: true,
      });

      // Additional timeline for the dashboard-info to appear and right-image to move to the right
      const dashboardImageTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100px',
          scrub: true,
          markers: true,
        },
      });

      // Animate the opacity and movement of the dashboard info and right-image
      dashboardImageTimeline
        .fromTo(
          '.dashboard-info',
          { opacity: 0, x: -50 }, // Start invisible and slightly to the left
          { opacity: 1, x: 0, duration: 1 } // Fade in and move to original position
        )
        .to(
          '.right-image',
          { x: 300, opacity: 0, duration: 1 }, // Move right-image to the right and fade it out
          '<' // Start this animation at the same time as the previous one
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className='relative mx-auto flex h-screen max-w-xs items-center justify-center gap-x-4'
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
        className='absolute left-1/2 top-1/2 h-[590px] w-full -translate-x-1/2 -translate-y-1/2'
        width={287}
        height={623}
      />

      <p className='dashboard-info absolute -left-[250px] top-1/2 max-w-[200px] text-balance'>
        In the dashboard you can see all the data
      </p>
    </div>
  );
};
