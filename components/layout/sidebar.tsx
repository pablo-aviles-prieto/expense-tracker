import { DashboardNav } from '@/components/layout/dashboard-nav';
import { cn } from '@/lib/utils';
import { navItems } from '@/utils/const';

export default function Sidebar() {
  return (
    <nav className={cn(`relative hidden h-screen w-72 border-r pt-16 lg:block 2xl:border-l`)}>
      <div className='space-y-4 py-4'>
        <div className='px-3 py-2'>
          <div className='space-y-1'>
            <h2 className='mb-2 px-4 text-xl font-semibold tracking-tight'>Overview</h2>
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
