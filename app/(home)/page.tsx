import { getServerSession, type NextAuthOptions } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';

export default async function Home() {
  const session = await getServerSession(authOptions as unknown as NextAuthOptions);
  redirect(session?.user ? '/dashboard' : '/auth');
}
