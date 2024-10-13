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
      gsap
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
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: '-=200 top',
            end: '+=100px',
            scrub: true,
            // markers: true,
          },
        })
        .fromTo('.dashboard-info-text', { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 1 });
      // Displaying the dashboard-frame
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: '-100 top',
            end: '+=200px',
            scrub: true,
            // markers: true,
          },
        })
        .fromTo('.dashboard-frame', { opacity: 0 }, { opacity: 1 })
        .to('.dashboard-frame', { opacity: 0 });

      // Fading out right-image-dashboard and dashboard-info-text and displaying transactions-info-text
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: '+=200 top', // Start 200px from the top of the container when the viewport's top reaches it
            end: '+=200px', // Finishing the animation 400px later
            scrub: true,
            // markers: true,
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
      // Displaying the transactions-frame
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: '+=400 top',
            end: '+=200px',
            scrub: true,
            // markers: true,
          },
        })
        .fromTo('.transactions-frame', { opacity: 0 }, { opacity: 1 })
        .to('.transactions-frame', { opacity: 0 });

      // Displaying the subscriptions-info-text, fading out center-image-transactions and transactions-info-text
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: '+=700 top', // Start 200px from the top of the container when the viewport's top reaches it
            end: '+=200px', // Finishing the animation 400px later
            scrub: true,
            // markers: true,
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
      // Displaying the subscriptions-frame
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: '+=900 top',
            end: '+=200px',
            scrub: true,
            // markers: true,
          },
        })
        .fromTo('.subscriptions-frame', { opacity: 0 }, { opacity: 1 })
        .to('.subscriptions-frame', { opacity: 0 });

      // Makes the iphone15 mockup sticky while scrolling
      // Keeping in last position scroll trigger to not interfere on the scroll order
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

      <div className='dashboard-info-text absolute -left-[275px] top-1/2 max-w-[250px]'>
        <p className='text-balance'>Get a quick overview of your transactions in the dashboard</p>
        <Image
          alt='arrow'
          src='/images/landing/red-right-arrow.webp'
          className='absolute -right-[80px] -top-[40px]'
          width={110}
          height={75}
        />
        <div
          className='dashboard-frame absolute -right-[317px] -top-[35px] h-[315px] w-[268px] rounded-xl rounded-bl-[25px] rounded-br-3xl border-2'
          style={{ borderColor: '#e91223' }}
        />
      </div>
      <div className='transactions-info-text absolute -right-[255px] top-[185px] max-w-[250px]'>
        <p className='text-balance'>Add transactions fast with a form or multiple via CSV upload</p>
        <Image
          alt='arrow'
          src='/images/landing/orange-left-arrow.webp'
          className='absolute -left-[50px] top-[30px]'
          width={95}
          height={75}
        />
        <div
          className='transactions-frame absolute -left-[286px] top-[85px] h-[35px] w-[245px] rounded-lg border-2'
          style={{ borderColor: '#f68420' }}
        />
      </div>
      <div className='subscriptions-info-text absolute -left-[255px] top-[300px] max-w-[250px]'>
        <p>
          Manage your subscriptions in one place.
          <span className='block'>Set reminders for renewals.</span>
        </p>
        <Image
          alt='arrow'
          src='/images/landing/white-right-arrow.webp'
          className='absolute -right-[45px] -top-[95px]'
          width={120}
          height={75}
        />
        <div
          className='subscriptions-frame absolute -right-[307px] -top-[74px] h-[44px] w-[278px] rounded-lg border-2'
          style={{ borderColor: '#e8e8e8' }}
        />
      </div>
    </div>
  );
};
