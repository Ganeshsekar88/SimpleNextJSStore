import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function CartItemSkeleton() {
  return (
    <Card
      className='mb-4 flex min-w-0 flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-center md:gap-x-4'
      aria-hidden='true'
    >
      <Skeleton className='h-24 w-24 shrink-0 sm:h-32 sm:w-32' />

      <div className='min-w-0 flex-1 space-y-2'>
        <Skeleton className='h-5 w-3/4 max-w-64' />
        <Skeleton className='h-4 w-1/2 max-w-40' />
      </div>

      <div className='flex min-w-0 items-center justify-between gap-4 md:flex-col md:items-start md:justify-center'>
        <div className='flex items-center gap-2'>
          <Skeleton className='size-8 rounded-md' />
          <Skeleton className='h-4 w-6' />
          <Skeleton className='size-8 rounded-md' />
        </div>
        <Skeleton className='h-8 w-16' />
      </div>

      <Skeleton className='h-5 w-20 md:ml-auto' />
    </Card>
  );
}

function CartTotalsSkeleton() {
  return (
    <div aria-hidden='true'>
      <Card className='space-y-4 p-6 sm:p-8'>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className='space-y-3'>
            <div className='flex justify-between gap-4'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-16' />
            </div>
            <div className='h-px w-full bg-border' />
          </div>
        ))}
        <div className='flex justify-between gap-4 pt-2'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-5 w-20' />
        </div>
      </Card>
      <Skeleton className='mt-6 h-10 w-full rounded-md sm:mt-8' />
    </div>
  );
}

export function CartItemsSkeleton() {
  return (
    <section
      className='min-w-0'
      aria-busy='true'
      aria-label='Loading cart'
    >
      <header className='min-w-0'>
        <Skeleton className='mb-8 h-8 w-44 sm:h-9 sm:w-52' aria-hidden='true' />
        <div className='h-px w-full bg-border' aria-hidden='true' />
      </header>

      <div className='mt-8 grid min-w-0 gap-4 lg:grid-cols-12'>
        <div className='min-w-0 lg:col-span-8' aria-hidden='true'>
          {Array.from({ length: 2 }, (_, index) => (
            <CartItemSkeleton key={index} />
          ))}
        </div>
        <div className='min-w-0 lg:col-span-4 lg:pl-4'>
          <CartTotalsSkeleton />
        </div>
      </div>
    </section>
  );
}

export function EmptyCartSkeleton() {
  return (
    <section
      className='min-w-0 space-y-5 sm:space-y-6'
      aria-busy='true'
      aria-label='Loading empty cart'
    >
      <header className='min-w-0 space-y-2' aria-hidden='true'>
        <Skeleton className='h-8 w-44 sm:h-9 sm:w-52' />
        <Skeleton className='h-4 w-full max-w-md' />
      </header>
      <div
        className='rounded-xl border bg-muted/20 px-4 py-6 sm:px-6 sm:py-8'
        aria-hidden='true'
      >
        <Skeleton className='h-4 w-40 max-w-full' />
      </div>
    </section>
  );
}
