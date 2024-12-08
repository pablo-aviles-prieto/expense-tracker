import Image from 'next/image';

interface TransactionsInfoProps {
  hasEnoughHeight: boolean;
}

const TRANSACTIONS_INFO_TEXT = 'Add transactions fast with a form or multiple via CSV upload';

export const TransactionsInfo = ({ hasEnoughHeight }: TransactionsInfoProps) => {
  return (
    <div className='transactions-info-text absolute -right-[255px] top-[calc(50%-265px)] max-w-[225px]'>
      <p className='invisible text-balance md:visible'>{TRANSACTIONS_INFO_TEXT}</p>
      <Image
        alt='arrow'
        src='/images/landing/orange-left-arrow.webp'
        className='invisible absolute -left-[75px] top-[55px] md:visible'
        width={95}
        height={75}
      />
      <div
        className='transactions-frame absolute -left-[311px] top-[113px] h-[35px] w-[245px] rounded-lg border-2'
        style={{ borderColor: '#f68420' }}
      />
      {hasEnoughHeight && (
        <div className='visible absolute -bottom-[545px] right-[280px] w-[250px] md:invisible'>
          <Image
            alt='arrow'
            src='/images/landing/orange-up-arrow.webp'
            className='absolute -top-[90px] right-[60px]'
            width={100}
            height={120}
          />
          <p className='text-balance'>{TRANSACTIONS_INFO_TEXT}</p>
        </div>
      )}
    </div>
  );
};
