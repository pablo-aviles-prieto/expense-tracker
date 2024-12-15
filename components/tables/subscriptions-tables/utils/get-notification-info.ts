import { Icons } from '@/components/icons';

import '@/types';

interface StatusInfoResponse {
  text: string;
  icon: keyof typeof Icons;
  color: string;
}

export const getNotificationInfo = (notify: boolean): StatusInfoResponse | null => {
  switch (notify) {
    case false:
      return { text: 'OFF', icon: 'notifyOff', color: 'text-destructive' };
    case true:
      return { text: 'ON', icon: 'notifyOn', color: 'text-success' };
  }
};
