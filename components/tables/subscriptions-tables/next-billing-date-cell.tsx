'use client';

import { useDateFormat } from '@/hooks/use-date-format';
import { BillingPeriod } from '@/types';
import { getNextBillingDate } from '@/utils/get-next-billing-date';

type NextBillingDateCellProps = {
  startDateStr: string;
  billingPeriod: BillingPeriod;
};

export const NextBillingDateCell = ({ startDateStr, billingPeriod }: NextBillingDateCellProps) => {
  const { dateFormat } = useDateFormat();
  const parsedDate = getNextBillingDate({
    billingPeriod,
    startDateStr,
    dateFormat,
  });
  return <p className='w-[136px] text-center'>{parsedDate}</p>;
};
