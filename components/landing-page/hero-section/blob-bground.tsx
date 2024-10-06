import { ReactNode } from 'react';

interface BlobBackgroundProps {
  children: ReactNode;
}

export const BlobBackground = ({ children }: BlobBackgroundProps) => {
  return (
    <div className='relative min-h-screen overflow-hidden bg-black'>
      <div
        className='absolute inset-16 md:inset-48'
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(119, 204, 0, 0.6), transparent),
            radial-gradient(circle at 80% 90%, rgba(140, 0, 255, 0.6), transparent)
          `,
          filter: 'blur(120px)',
        }}
        // style={{
        //   background: `
        //     radial-gradient(circle at 20% 20%, rgba(140, 0, 255, 0.6), transparent),
        //     radial-gradient(circle at 80% 30%, rgba(0, 150, 255, 0.6), transparent),
        //     radial-gradient(circle at 50% 80%, rgba(150, 255, 0, 0.6), transparent)
        //   `,
        //   filter: 'blur(50px)',
        // }}
      />
      <div className='relative z-10 text-slate-100'>{children}</div>
    </div>
  );
};
