import Image from 'next/image';

export const TransactionsInfo = () => {
  return (
    <div className='transactions-info-text absolute -right-[255px] top-[calc(50%-265px)] max-w-[225px]'>
      <p className='invisible text-balance md:visible'>
        Add transactions fast with a form or multiple via CSV upload
      </p>
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
    </div>
  );
};
