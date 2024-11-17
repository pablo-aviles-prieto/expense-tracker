import Image from 'next/image';

export const SubscriptionsInfo = () => {
  return (
    <div className='subscriptions-info-text absolute -left-[215px] top-[calc(50%-123px)] max-w-[210px]'>
      <p className='invisible md:visible'>
        Manage your subscriptions in one place.
        <span className='block'>Set reminders for renewals.</span>
      </p>
      <Image
        alt='arrow'
        src='/images/landing/white-right-arrow.webp'
        className='invisible absolute -right-[47px] -top-[92px] md:visible'
        width={120}
        height={75}
      />
      <div
        className='subscriptions-frame absolute -right-[307px] -top-[74px] h-[44px] w-[278px] rounded-lg border-2'
        style={{ borderColor: '#e8e8e8' }}
      />
    </div>
  );
};
