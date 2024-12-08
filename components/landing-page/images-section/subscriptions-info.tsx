import Image from 'next/image';

interface SubscriptionsInfoProps {
  hasEnoughHeight: boolean;
}

const SUBSCRIPTIONS_INFO_TEXT_1 = 'Manage your subscriptions in one place.';
const SUBSCRIPTIONS_INFO_TEXT_2 = 'Set reminders for renewals';

export const SubscriptionsInfo = ({ hasEnoughHeight }: SubscriptionsInfoProps) => {
  return (
    <div className='subscriptions-info-text absolute -left-[215px] top-[calc(50%-123px)] max-w-[210px]'>
      <p className='invisible md:visible'>
        {SUBSCRIPTIONS_INFO_TEXT_1}
        <span className='block'>{SUBSCRIPTIONS_INFO_TEXT_2}</span>
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
      {hasEnoughHeight && (
        <div className='test visible absolute -bottom-[405px] -right-[322px] w-[310px] md:invisible'>
          <Image
            alt='arrow'
            src='/images/landing/white-up-arrow.webp'
            className='absolute -top-[90px] right-[120px]'
            width={100}
            height={120}
          />
          <p className='text-balance'>
            {SUBSCRIPTIONS_INFO_TEXT_1}
            <span className='block'>{SUBSCRIPTIONS_INFO_TEXT_2}</span>
          </p>
        </div>
      )}
    </div>
  );
};
