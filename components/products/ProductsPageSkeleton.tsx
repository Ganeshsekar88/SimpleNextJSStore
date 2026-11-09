import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

type ProductLayout = 'grid' | 'list';

function ProductGridSkeleton() {
  return (
    <div className='grid min-w-0 gap-4 pt-12 md:grid-cols-2 lg:grid-cols-3' aria-hidden='true'>
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index} className='min-w-0 overflow-hidden'>
          <CardContent className='p-4'>
            <Skeleton className='h-52 w-full rounded-xl sm:h-56' />
            <div className='mt-4 space-y-3'>
              <Skeleton className='mx-auto h-5 w-3/4' />
              <Skeleton className='mx-auto h-4 w-1/3' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProductListSkeleton() {
  return (
    <div className='mt-12 grid min-w-0 gap-y-6 sm:gap-y-8' aria-hidden='true'>
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index} className='min-w-0 overflow-hidden'>
          <CardContent className='grid min-w-0 gap-4 p-4 sm:p-6 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:items-center md:gap-6 md:p-8'>
            <Skeleton className='h-64 w-full rounded-md md:h-48 md:w-48' />
            <div className='min-w-0 space-y-3'>
              <Skeleton className='h-6 w-3/4 max-w-64' />
              <Skeleton className='h-4 w-32 max-w-full' />
            </div>
            <Skeleton className='h-5 w-24 md:ml-auto' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProductPaginationSkeleton() {
  return (
    <div className='mt-8 flex flex-col gap-3 border-t bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6' aria-hidden='true'>
      <Skeleton className='h-4 w-36' />
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-16' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-12' />
      </div>
    </div>
  );
}

export function ProductsPageSkeleton({ layout }: { layout: ProductLayout }) {
  return (
    <section className='min-w-0' aria-busy='true' aria-label={`Loading products in ${layout} view`}>
      <div className='flex min-w-0 items-center justify-between gap-4' aria-hidden='true'>
        <Skeleton className='h-6 w-28' />
        <div className='flex gap-2 sm:gap-4'>
          <Skeleton className='h-9 w-9 rounded-md' />
          <Skeleton className='h-9 w-9 rounded-md' />
        </div>
      </div>
      <Separator className='mt-4' />
      {layout === 'list' ? <ProductListSkeleton /> : <ProductGridSkeleton />}
      <ProductPaginationSkeleton />
    </section>
  );
}
