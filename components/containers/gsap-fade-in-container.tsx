'use client';

import React, { isValidElement, ReactElement, useRef } from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface GSAPAnimatedContainerProps {
  children: React.ReactNode;
  delayStep?: number;
  disableMobileAnimations?: boolean;
}

export const GSAPFadeInContainer = ({
  children,
  delayStep = 0.2,
  disableMobileAnimations = false,
}: GSAPAnimatedContainerProps) => {
  const childrenRefs = useRef<HTMLElement[]>([]);

  useGSAP(() => {
    gsap.matchMedia().add(
      {
        isMobile: `(min-width: 300px)`,
        isDesktop: `(min-width: 768px)`,
      },
      context => {
        const isDesktop = context.conditions?.isDesktop;
        const useFadeInFromTop = isDesktop || disableMobileAnimations;

        childrenRefs.current.forEach((childElement, index) => {
          if (!childElement) return;

          const delay = useFadeInFromTop ? delayStep * index : 0;
          const startXAxis = useFadeInFromTop ? 0 : 50 * (index % 2 === 0 ? 1 : -1);

          gsap.fromTo(
            childElement,
            { opacity: 0, y: useFadeInFromTop ? 25 : 0, x: startXAxis },
            {
              delay,
              opacity: 1,
              y: 0,
              x: 0,
              duration: 1,
              scrollTrigger: {
                trigger: childElement,
                start: 'top 90%',
                once: true,
              },
            }
          );
        });
      }
    );
  }, [children, delayStep, disableMobileAnimations]);

  const assignRef = (ref: HTMLElement | null, index: number) => {
    if (ref) childrenRefs.current[index] = ref;
  };

  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return React.cloneElement(child as ReactElement<{ ref?: React.Ref<HTMLElement> }>, {
            ref: (ref: HTMLElement | null) => assignRef(ref, index), // Assign ref dynamically
          });
        }
        return child;
      })}
    </>
  );
};
