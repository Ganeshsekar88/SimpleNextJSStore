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
      {Array.from({ length: 5 }, (_, index) => (
        <article key={index} className='min-w-0 space-y-4 p-4 sm:p-5'>
          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-8 w-10 rounded-full' />
            </div>
            <div className='min-w-0 space-y-2 text-right'>
              <Skeleton className='ml-auto h-3 w-20' />
              <Skeleton className='ml-auto h-5 w-24 max-w-full' />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
            <div className='min-w-0 space-y-2'>
              <Skeleton className='h-3 w-8' />
              <Skeleton className='h-4 w-20 max-w-full' />
            </div>
            <div className='min-w-0 space-y-2 text-right'>
              <Skeleton className='ml-auto h-3 w-16' />
              <Skeleton className='ml-auto h-4 w-20 max-w-full' />
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
  return (
    <div className='hidden overflow-x-auto md:block' aria-hidden='true'>
      <div className='min-w-[640px]'>
        <div className='grid grid-cols-[1.3fr_1.2fr_1fr_1.2fr_1.6fr] items-center gap-4 border-b bg-muted/50 px-5 py-3'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='ml-auto h-3 w-20' />
          <Skeleton className='ml-auto h-3 w-8' />
          <Skeleton className='ml-auto h-3 w-16' />
          <Skeleton className='ml-auto h-3 w-12' />
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className='grid grid-cols-[1.3fr_1.2fr_1fr_1.2fr_1.6fr] items-center gap-4 border-b px-5 py-4 last:border-0'
          >
            <Skeleton className='h-8 w-10 rounded-full' />
            <Skeleton className='ml-auto h-4 w-24 max-w-full' />
            <Skeleton className='ml-auto h-4 w-20 max-w-full' />
            <Skeleton className='ml-auto h-4 w-20 max-w-full' />
            <Skeleton className='ml-auto h-4 w-32 max-w-full' />
          </div>
        ))}
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
      </Card>
    </section>
  );
}
