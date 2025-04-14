import { CostSummary } from '@/components/subscriptions/utils/get-subscription-costs';
import { useCurrency } from '@/hooks/use-currency';

interface SubscriptionCostsInterface {
  subscriptionCosts: CostSummary;
}

export const SubscriptionCosts = ({ subscriptionCosts }: SubscriptionCostsInterface) => {
  return (
    <div className='flex flex-col gap-x-2 sm:flex-row sm:items-center'>
      <RenderBlock
        label='All subs'
        month={subscriptionCosts.totalSubsmonthly}
        annual={subscriptionCosts.totalSubsAnnually}
      />
      <RenderBlock
        label='Active subs'
        month={subscriptionCosts.activeSubsMonthly}
        annual={subscriptionCosts.activeSubsAnnually}
      />
    </div>
  );
};

function RenderBlock({ label, month, annual }: { month: number; annual: number; label: string }) {
  const { currency } = useCurrency();

  return (
    <p className='text-xs sm:text-sm'>
      <span className='text-primary'>{label}:</span> {month}{' '}
      <span className='text-[10px]'>{currency}/month</span> {annual}{' '}
      <span className='text-[10px]'>{currency}/year</span>
    </p>
  );
}
