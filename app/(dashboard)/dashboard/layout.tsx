import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className='mx-auto flex h-screen max-w-screen-2xl overflow-hidden'>
        <Sidebar />
        <main className='w-full overflow-hidden pt-16'>{children}</main>
      </div>
    </>
  );
}
