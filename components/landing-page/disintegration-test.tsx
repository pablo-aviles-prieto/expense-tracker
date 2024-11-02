'use client';

import { useEffect, useState } from 'react';

import { DisintegratableSVG } from '../ui/disintegratable-svg';

export interface DisintegrationDemoProps {
  svgHref?: string;
}

const NUMBER_OF_SCALING_FRAMES = 60;

export const DisintegrationDemo = (props: DisintegrationDemoProps) => {
  // animation will take 1 second, 60 fps
  const scaleFrames: number[] = [];
  for (let i = 0; i < NUMBER_OF_SCALING_FRAMES; i++) {
    scaleFrames.push(i * 8);
    // scaleFrames.push(i * 8);
  }
  const transparencyFrames: number[] = [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // first 20 frames, stay opaque
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1, // next 20 frames, still opaque
    0.9,
    0.9,
    0.8,
    0.8,
    0.7,
    0.7,
    0.6,
    0.6,
    0.5,
    0.5, // next 10 frames, fade to 50%
    0.4,
    0.4,
    0.3,
    0.3,
    0.2,
    0.2,
    0.1,
    0.1,
    0,
    0, // last 10 frames, fade from 50% to 0%
  ];

  const [state, setState] = useState({ animating: false, frequency: 0, frameIdx: 0 });
  // const [state, setState] = useState({ animating: false, frequency: 0.1, frameIdx: 0 });

  const animate = () => {
    if (state.frameIdx > 90) {
      // end the animation
      setState({
        animating: false,
        frequency: 0,
        // frequency: state.frequency,
        frameIdx: 0,
      });
    } else {
      // change the state, using the hardcoded frame values
      setState({
        animating: true,
        frequency: state.frequency,
        frameIdx: state.frameIdx + 1,
      });
    }
  };

  useEffect(() => {
    // keep the animation going if we're rendering one already
    if (state.animating) {
      window.requestAnimationFrame(animate);
    }
  });

  // When we get past the 60th frame, hardcode the values.
  // This effectively pauses the animation for a few frames before resetting.
  const displacementScale = state.animating
    ? scaleFrames[Math.min(NUMBER_OF_SCALING_FRAMES - 1, state.frameIdx)]
    : 10;
  const transparency = state.animating
    ? transparencyFrames[Math.min(transparencyFrames.length - 1, state.frameIdx)]
    : 1;

  return (
    <div>
      <DisintegratableSVG
        turbulenceFrequency={state.frequency}
        displacementScale={displacementScale}
        transparency={transparency}
        svgUrl={props.svgHref}
      />
      <button
        onClick={() => {
          setState({ frameIdx: 0, animating: true, frequency: 0.1 });
          // setState({ frameIdx: 0, animating: true, frequency: state.frequency });
        }}
      >
        Disintegrate!
      </button>
    </div>
  );
};
