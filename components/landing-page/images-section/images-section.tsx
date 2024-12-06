'use client';

import { useEffect, useRef, useState } from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { DashboardInfo } from './dashboard-info';
import { SubscriptionsInfo } from './subscriptions-info';
import { TransactionsInfo } from './transactions-info';

gsap.registerPlugin(ScrollTrigger);

const IPHONE_MOCKUP_HEIGHT = 590;

export const ImagesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Checking if the viewport height is high enough to display the iphone height + 90px on top and bottom
  const hasEnoughHeight = viewportHeight >= IPHONE_MOCKUP_HEIGHT + 90 * 2;

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.outerHeight);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  useGSAP(
    () => {
      gsap.matchMedia().add(
        {
          // Condition created to trigger the animation if it has 300px or more
          isMobile: `(min-width: 300px)`,
          // Condition for screens 768px and up
          isDesktop: `(min-width: 768px)`,
        },
        context => {
          const isDesktop = context.conditions?.isDesktop;
          const startingCenterImageOpacity = isDesktop ? 1 : 0;
          gsap
            .timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: 200,
                end: 350,
                scrub: true,
              },
            })
            .fromTo(
              '.center-image-transactions',
              { opacity: startingCenterImageOpacity },
              { opacity: 1, duration: 0.5 }
            );
        }
      );

      // Animating the 3 images into the iphone15 mockup
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 200,
            end: 500,
            scrub: true,
          },
        })
        .fromTo('.left-image-subscriptions', { x: -150, y: -350 }, { x: 300, y: 10, duration: 1 })
        .fromTo('.center-image-transactions', { x: 0, y: -350 }, { x: -0, y: 10, duration: 1 }, '<')
        .fromTo(
          '.right-image-dashboard',
          { x: 150, y: -350 },
          { x: -300, y: 10, duration: 1 },
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
        <img
          className='left-image-subscriptions h-[565px] w-[281px] rounded-lg'
          src='/images/landing/subscriptions-image.png'
          alt='Subscriptions image'
        />
        <img
          className='center-image-transactions h-[565px] w-[281px] rounded-lg'
          src='/images/landing/transactions-image.png'
          alt='Transactions image'
        />
        <img
          className='right-image-dashboard h-[565px] w-[281px] rounded-lg'
          src='/images/landing/dashboard-image.png'
          alt='Dasboard image'
        />
      </div>

      {/* iPhone mockup */}
      <img
        alt='iphone15 mockup'
        src='/images/landing/iphone15-mockup.webp'
        className='absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2'
        style={{ height: IPHONE_MOCKUP_HEIGHT }}
      />

      <DashboardInfo hasEnoughHeight={hasEnoughHeight} />
      <TransactionsInfo hasEnoughHeight={hasEnoughHeight} />
      <SubscriptionsInfo hasEnoughHeight={hasEnoughHeight} />
    </div>
  );
};
