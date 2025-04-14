'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Separator } from '@/components//ui/separator';
import { CreateSubscriptionModal } from '@/components/modal/subscriptions/create-subscription-modal';
import { SubscriptionCosts } from '@/components/subscriptions/subscription-costs';
import { getSubscriptionCosts } from '@/components/subscriptions/utils/get-subscription-costs';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/components/ui/use-toast';
import { useFetch } from '@/hooks/use-fetch';
import type { Subscription } from '@/types';
import { URL_GET_SUBSCRIPTION } from '@/utils/const';
import { columns } from '../tables/subscriptions-tables/columns';
import { SubscriptionTable } from '../tables/subscriptions-tables/subscription-table';
import { LoadingSpinner } from '../ui/spinner';

interface ResponseSubscriptions {
  ok: boolean;
  error?: string;
  subscriptions?: Subscription[];
}

export const SubscriptionContent = () => {
  const [openCreateSubModal, setOpenCreateSubModal] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    const response = await fetchPetition<ResponseSubscriptions>({
      url: URL_GET_SUBSCRIPTION,
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(response.error ?? 'Network response was not ok');
    }
    return response.subscriptions;
  };

  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [URL_GET_SUBSCRIPTION],
    queryFn: fetchSubscriptions,
  });

  useEffect(() => {
    if (error && !isLoading) {
      toast({
        title: 'There has been an error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, isLoading]);

  const subscriptionCosts = getSubscriptionCosts(userData);

  return (
    <>
      <CreateSubscriptionModal
        isOpen={openCreateSubModal}
        onClose={() => setOpenCreateSubModal(false)}
        refetch={refetch}
      />
      <div className='space-y-1'>
        <div className='flex items-start justify-between'>
          <Heading
            maxWidthClass='max-w-[calc(100%-180px)]'
            title='Subscriptions'
            description="Manage all your subscriptions to ensure you're not paying for anything you don't use"
          />
          <Button variant='default' onClick={() => setOpenCreateSubModal(true)}>
            <Plus className='mr-2 size-4' /> Add subscriptions
          </Button>
        </div>
        {subscriptionCosts && <SubscriptionCosts subscriptionCosts={subscriptionCosts} />}
      </div>
      <Separator />
      {error ? (
        <p className='pt-2 text-center'>
          There was an error retrieving the subscriptions. Please try again later
        </p>
      ) : isLoading ? (
        <div className='flex items-center justify-center pt-10'>
          <LoadingSpinner size={140} />
        </div>
      ) : !userData || userData?.length === 0 ? (
        <div className='flex items-end justify-center gap-x-2 pt-2'>
          <p>Seems like you dont have any subscription. </p>
          <Button
            className='h-[22px] p-0'
            variant='link'
            onClick={() => setOpenCreateSubModal(true)}
          >
            Want to add some?
          </Button>
        </div>
      ) : (
        <SubscriptionTable columns={columns} data={userData} />
      )}
    </>
  );
};
