import Image from 'next/image';

interface DashboardInfoProps {
  hasEnoughHeight: boolean;
}

const DASHBOARD_INFO_TEXT = 'Get a quick overview of your transactions in the dashboard';

export const DashboardInfo = ({ hasEnoughHeight }: DashboardInfoProps) => {
  return (
    <div className='dashboard-info-text absolute -left-[200px] top-1/2 max-w-[200px]'>
      <p className='invisible text-balance md:visible'>{DASHBOARD_INFO_TEXT}</p>
      <Image
        alt='arrow'
        src='/images/landing/red-right-arrow.webp'
        className='invisible absolute -right-[50px] -top-[40px] md:visible'
        width={110}
        height={75}
      />
      <div
        className='dashboard-frame absolute -right-[291px] -top-[35px] h-[315px] w-[268px] rounded-xl rounded-bl-[25px] rounded-br-3xl border-2'
        style={{ borderColor: '#e91223' }}
      />
      {hasEnoughHeight && (
        <div className='visible absolute -bottom-[290px] -right-[300px] max-w-[250px] md:invisible'>
          <Image
            alt='arrow'
            src='/images/landing/red-up-arrow.webp'
            className='absolute -top-[65px] right-[30px]'
            width={70}
            height={75}
          />
          <p className='text-balance'>{DASHBOARD_INFO_TEXT}</p>
        </div>
      )}
    </div>
  );
};
