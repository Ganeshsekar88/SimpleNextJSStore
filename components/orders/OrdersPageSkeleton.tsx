import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function OrdersIntroSkeleton() {
  return (
    <header className='flex flex-col gap-6 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8'>
      <div className='w-full min-w-0 space-y-2' aria-hidden='true'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-8 w-40 sm:h-9 sm:w-48' />
        <Skeleton className='h-4 w-full max-w-xl' />
      </div>
      <div className='flex w-full items-center gap-3 sm:w-48' aria-hidden='true'>
        <Skeleton className='h-10 w-10 rounded-lg' />
        <Skeleton className='h-4 w-28' />
      </div>
    </header>
  );
}

function OrdersMobileSkeleton() {
  return (
    <div className='divide-y md:hidden' aria-hidden='true'>
      {Array.from({ length: 6 }, (_, index) => (
        <article key={index} className='min-w-0 space-y-4 p-4 sm:p-5'>
          <div className='flex items-start justify-between gap-4'>
            <div className='min-w-0 flex-1 space-y-2'>
              <Skeleton className='h-3 w-16' />
              <div className='mt-2 space-y-1.5'>
                <div className='flex items-start justify-between gap-2'>
                  <Skeleton className='h-4 w-28 max-w-[70%]' />
                  <Skeleton className='h-3 w-10 shrink-0' />
                </div>
                <div className='flex items-start justify-between gap-2'>
                  <Skeleton className='h-4 w-20 max-w-[70%]' />
                  <Skeleton className='h-3 w-10 shrink-0' />
                </div>
              </div>
            </div>
            <div className='min-w-0 space-y-2 text-right'>
              <Skeleton className='ml-auto h-3 w-20' />
              <Skeleton className='ml-auto h-5 w-24 max-w-full' />
            </div>
          </div>
          <div className='grid min-w-0 grid-cols-2 gap-x-4 gap-y-3'>
            <div className='min-w-0 space-y-2'>
              <Skeleton className='h-3 w-8' />
              <Skeleton className='h-4 w-20 max-w-full' />
            </div>
            <div className='min-w-0 space-y-2 text-right'>
              <Skeleton className='ml-auto h-3 w-16' />
              <Skeleton className='ml-auto h-4 w-20 max-w-full' />
            </div>
          </div>
          <div className='grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 border-t pt-3'>
            <div className='min-w-0 space-y-2'>
              <Skeleton className='h-3 w-24 max-w-full' />
              <Skeleton className='h-4 w-20 max-w-full' />
            </div>
            <div className='min-w-0 space-y-2'>
              <Skeleton className='h-3 w-16 max-w-full' />
              <Skeleton className='h-3 w-full max-w-32' />
              <Skeleton className='h-3 w-3/4 max-w-24' />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3 border-t pt-3'>
            <Skeleton className='h-3 w-10' />
            <Skeleton className='h-4 w-32 max-w-[70%]' />
          </div>
        </article>
      ))}
    </div>
  );
}

function OrdersDesktopSkeleton() {
  const columns = 'grid-cols-[1.6fr_1fr_0.7fr_0.9fr_1.2fr_1.7fr_1.1fr]';

  return (
    <div className='hidden overflow-x-auto md:block' aria-hidden='true'>
      <div className='min-w-[1100px]'>
        <div className={`grid ${columns} items-center gap-4 border-b bg-muted/50 px-5 py-3`}>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='ml-auto h-3 w-20' />
          <Skeleton className='ml-auto h-3 w-8' />
          <Skeleton className='ml-auto h-3 w-16' />
          <Skeleton className='mx-auto h-3 w-28 max-w-full' />
          <Skeleton className='ml-auto h-3 w-20' />
          <Skeleton className='ml-auto h-3 w-12' />
        </div>
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className={`grid ${columns} items-center gap-4 border-b px-5 py-4 last:border-0`}
          >
            <div className='space-y-1.5'>
              <Skeleton className='h-4 w-36 max-w-full' />
              <Skeleton className='h-4 w-28 max-w-full' />
            </div>
            <Skeleton className='ml-auto h-4 w-20 max-w-full' />
            <Skeleton className='ml-auto h-4 w-20 max-w-full' />
            <Skeleton className='ml-auto h-4 w-20 max-w-full' />
            <Skeleton className='mx-auto h-6 w-24 rounded-full' />
            <Skeleton className='ml-auto h-4 w-full max-w-40' />
            <Skeleton className='ml-auto h-4 w-28 max-w-full' />
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersPaginationSkeleton() {
  return (
    <div className='flex flex-col gap-3 border-t bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6' aria-hidden='true'>
      <Skeleton className='h-4 w-36' />
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-16' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-12' />
      </div>
    </div>
  );
}

export function OrdersPageSkeleton() {
  return (
    <section className='min-w-0 space-y-6 sm:space-y-8' aria-busy='true' aria-label='Loading your orders'>
      <OrdersIntroSkeleton />
      <Card className='min-w-0 overflow-hidden rounded-2xl shadow-sm'>
        <div className='flex flex-col gap-2 border-b bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
          <div className='space-y-2' aria-hidden='true'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-52 max-w-full' />
          </div>
          <Skeleton className='h-4 w-20' aria-hidden='true' />
        </div>
        <OrdersMobileSkeleton />
        <OrdersDesktopSkeleton />
        <OrdersPaginationSkeleton />
      </Card>
    </section>
  );
}
