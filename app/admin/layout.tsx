import { Separator } from '@/components/ui/separator';
import Sidebar from './Sidebar';
import { Suspense } from 'react';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h2 className='pl-1 text-xl sm:pl-4 sm:text-2xl'>Dashboard</h2>
      <Separator className='mt-2' />
      <section className='mt-6 grid min-w-0 grid-cols-1 gap-6 sm:mt-8 lg:mt-12 lg:grid-cols-12 lg:gap-8'>
        <div className='min-w-0 lg:col-span-2'>
          <Suspense fallback={<p>Loading...</p>}>
            <Sidebar />
          </Suspense>
        </div>
        <div className='min-w-0 lg:col-span-10'>{children}</div>
      </section>
    </>
  );
}
export default DashboardLayout;
