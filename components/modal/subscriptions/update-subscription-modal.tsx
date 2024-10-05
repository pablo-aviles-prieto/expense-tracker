'use client';

import { useEffect, useState } from 'react';

import { type RefetchOptions } from '@tanstack/react-query';

import { SubscriptionForm } from '@/components/forms/subscriptions/subscription-form';
import { Modal } from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useFetch } from '@/hooks/use-fetch';
import { SubscriptionFormValue } from '@/schemas/create-subscription-schema';
import type { EnhancedSubscription, UserSubscriptionUpdateResponse } from '@/types';
import { URL_UPDATE_SUBSCRIPTION } from '@/utils/const';

interface UpdateSubscriptionModalProps {
  isOpen: boolean;
  rowData: EnhancedSubscription;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: (options?: RefetchOptions | undefined) => any;
}

export const UpdateSubscriptionModal: React.FC<UpdateSubscriptionModalProps> = ({
  isOpen,
  onClose,
  refetch,
  rowData,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: SubscriptionFormValue) => {
    const { update, id: toastId } = toast({
      title: 'Updating subscription...',
      description: 'Please wait while the update is being processed',
      variant: 'default',
    });
    setUpdateLoading(true);

    const parsedRes = await fetchPetition<UserSubscriptionUpdateResponse>({
      url: URL_UPDATE_SUBSCRIPTION,
      method: 'PUT',
      body: { subscriptionData: data },
    });

    if (parsedRes.error) {
      update({
        id: toastId,
        title: 'Error updating...',
        description: parsedRes.error,
        variant: 'destructive',
      });
    }
    if (parsedRes.result) {
      update({
        id: toastId,
        title: 'Successfully updated',
        description: 'The subscription has been successfully updated',
        variant: 'success',
      });
      onClose();
    }
    refetch();
    setUpdateLoading(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='Update the subscription'
      description='Fill all the inputs to update the subscription'
      isOpen={isOpen}
      onClose={onClose}
    >
      <ScrollArea maxHeight={450}>
        <SubscriptionForm
          loading={updateLoading}
          onCancel={onClose}
          submitHandler={onSubmit}
          initData={rowData}
        />
      </ScrollArea>
    </Modal>
  );
};
