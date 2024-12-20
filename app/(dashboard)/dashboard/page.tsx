import { getServerSession, type NextAuthOptions } from 'next-auth';

import { Dashboard } from '@/components/dashboard/components/dashboard-block';
import { authOptions } from '@/lib/auth-options';
import { ParamsProps } from '@/types';

export default async function page({ searchParams }: ParamsProps) {
  const session = await getServerSession(authOptions as unknown as NextAuthOptions);
  const { viewport } = searchParams;

  return <Dashboard session={session} viewport={viewport} />;
}
