export interface DisintegratableSVGProps {
  turbulenceFrequency: number;
  displacementScale: number;
  transparency: number;
  svgUrl?: string;
}

// DOCS: https://wheretheroadmapends.com/rocketship.html
export const DisintegratableSVG = (props: DisintegratableSVGProps) => {
  return (
    <div className='h-[150px] w-full'>
      <svg viewBox='0 0 1800 250' width='100%' height='100%' preserveAspectRatio='none'>
        <filter id='disintegrate'>
          <feTurbulence baseFrequency={props.turbulenceFrequency} numOctaves='5' result='noise' />
          <feDisplacementMap
            in='SourceGraphic'
            in2='noise'
            scale={props.displacementScale}
            xChannelSelector='R'
          />
          <feOffset dx={-props.displacementScale / 10} dy={-props.displacementScale / 10} />
          <feComponentTransfer>
            <feFuncA type='table' tableValues={'0 0 0 ' + props.transparency} />
          </feComponentTransfer>
        </filter>

        <g filter='url(#disintegrate)'>
          <text
            x='50%'
            y='50%'
            textAnchor='middle'
            // fontSize='80'
            className='font-rifton text-xl sm:text-3xl md:text-4xl xl:text-5xl'
            // fontFamily='Rifton, sans-serif'
            fill='white'
          >
            Manage your transactions and subscriptions with ease
          </text>
          {/* <image width='100%' height='100%' href={props.svgUrl} /> */}
        </g>
      </svg>
    </div>
  );
};
