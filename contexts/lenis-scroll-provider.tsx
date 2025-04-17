'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import gsap from 'gsap';
import { LenisOptions } from 'lenis';
import { ReactLenis, type LenisRef } from 'lenis/react';

export const LenisProvider = ({
  children,
  options,
}: {
  children: ReactNode;
  options?: LenisOptions;
}) => {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        ...options,
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
};
