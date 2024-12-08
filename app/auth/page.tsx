import { getServerSession, NextAuthOptions } from 'next-auth';
import { redirect } from 'next/navigation';

import { AuthBlock } from '@/components/auth-block';
import { authOptions } from '@/lib/auth-options';
import { ParamsProps } from '@/types';

export default async function AuthenticationPage({ searchParams }: ParamsProps) {
  const { page } = searchParams;
  const session = await getServerSession(authOptions as unknown as NextAuthOptions);

  if (session?.user) {
    redirect('/dashboard');
  }

  return <AuthBlock page={page} />;
}
