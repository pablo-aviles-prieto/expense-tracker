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

      // Animating the 3 images into the iphone15 mockup
      const threeImagesTimeline = gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 200,
            end: 500,
            scrub: true,
            // markers: true,
          },
        })
        .fromTo(
          '.left-image-subscriptions',
          { x: -150, y: -350, opacity: 1 },
          { x: 300, y: 10, opacity: 1, duration: 1 }
        )
        .fromTo(
          '.center-image-transactions',
          { x: 0, y: -350, opacity: 1 },
          { x: -0, y: 10, opacity: 1, duration: 1 },
          '<'
        )
        .fromTo(
          '.right-image-dashboard',
          { x: 150, y: -350, opacity: 1 },
          { x: -300, y: 10, opacity: 1, duration: 1 },
          '<'
        );

      // Displaying the dashboard-info-text
      const dashboardTextAppearing = gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: '-=200 top',
            end: '+=100px',
            scrub: true,
            // markers: true,
          },
        })
        .fromTo(
          '.dashboard-info-text',
          { opacity: 0, x: -100 }, // Start invisible and slightly to the left
          { opacity: 1, x: 0, duration: 1 } // Fade in and move to original position
        );

      // Fading out right-image-dashboard and dashboard-info-text and displaying transactions-info-text
      const dashboardImageFadingTimeline = gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: '+=200 top', // Start 200px from the top of the container when the viewport's top reaches it
            end: '+=200px', // Finishing the animation 400px later
            scrub: true,
            markers: true,
          },
        })
        .to('.right-image-dashboard', { x: -600, opacity: 0, duration: 1 })
        .to('.dashboard-info-text', { opacity: 0, x: -100 }, '<')
        .fromTo(
          '.transactions-info-text',
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: 1 },
          '<'
        );

      // Displaying the subscriptions-info-text, fading out center-image-transactions and transactions-info-text
      const transactionsImageFadingTimeline = gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: '+=700 top', // Start 200px from the top of the container when the viewport's top reaches it
            end: '+=200px', // Finishing the animation 400px later
            scrub: true,
            markers: true,
          },
        })
        .to('.center-image-transactions', { x: 300, opacity: 0, duration: 1 })
        .to('.transactions-info-text', { opacity: 0, x: 100 }, '<')
        .fromTo(
          '.subscriptions-info-text',
          { opacity: 0, x: -100 },
          { opacity: 1, x: 0, duration: 1 },
          '<'
        );

      // Makes the iphone15 mockup sticky while scrolling
      // Keeping as last scroll trigger to not interfere on the scroll order
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=1300px',
        pin: true,
        pinSpacing: false,
        scrub: false,
        // markers: true,
      });
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
          className='left-image-subscriptions rounded-lg'
          src='/images/landing/image3.png'
          alt='Dashboard image'
          width={287}
          height={623}
        />
        <Image
          className='center-image-transactions rounded-lg'
          src='/images/landing/image2.png'
          alt='Dashboard image'
          width={287}
          height={623}
        />
        <Image
          className='right-image-dashboard rounded-lg'
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

      <p className='dashboard-info-text absolute -left-[275px] top-1/2 max-w-[250px] text-balance'>
        Get a quick overview of your transactions in the dashboard
      </p>
      <p className='transactions-info-text absolute -right-[275px] top-1/2 max-w-[250px] text-balance'>
        Add transactions fast with a form or multiple via CSV upload
      </p>
      <p className='subscriptions-info-text absolute -left-[275px] top-1/2 max-w-[250px] text-balance'>
        Track and manage subscriptions in one place. Set reminders for renewals.
      </p>
    </div>
  );
};
