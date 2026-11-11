import { Suspense } from 'react';
import { fetchProductReviewsByUser } from '@/utils/actions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
  return (
    <Suspense fallback={<ReviewsPageSkeleton />}>
      <ConditionalReviewsSkeleton />
    </Suspense>
  );
}

async function ConditionalReviewsSkeleton() {
  const { reviews } = await fetchProductReviewsByUser(1);
  return reviews.length === 0 ? <EmptyReviewsSkeleton /> : <ReviewsPageSkeleton />;
}

function EmptyReviewsSkeleton() {
  return (
    <section
      className='min-w-0 space-y-5 sm:space-y-6'
      aria-busy='true'
      aria-label='Loading empty reviews'
    >
      <header className='min-w-0 space-y-2' aria-hidden='true'>
        <Skeleton className='h-8 w-40 sm:h-9 sm:w-48' />
        <Skeleton className='h-4 w-full max-w-md' />
      </header>
      <div
        className='rounded-xl border bg-muted/20 px-4 py-6 sm:px-6 sm:py-8'
        aria-hidden='true'
      >
        <Skeleton className='h-4 w-48 max-w-full' />
      </div>
    </section>
  );
}

function ReviewsPageSkeleton() {
  return (
    <section className='min-w-0' aria-busy='true' aria-label='Loading reviews'>
      <header className='space-y-8' aria-hidden='true'>
        <Skeleton className='h-8 w-40 sm:h-9 sm:w-48' />
        <Separator />
      </header>

      <div
        className='mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'
        aria-hidden='true'
      >
        {Array.from({ length: 6 }, (_, index) => (
          <ReviewLoadingCard key={index} />
        ))}
      </div>

      <div
        className='mt-8 flex min-w-0 flex-col gap-3 border-t bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'
        aria-hidden='true'
      >
        <Skeleton className='h-4 w-36 max-w-full' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-16' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-8 w-12' />
        </div>
      </div>
    </section>
  );
}

const ReviewLoadingCard = () => {
  return (
    <Card className='relative min-w-0 overflow-hidden'>
      <CardHeader className='p-4 sm:p-6'>
        <div className='flex min-w-0 items-center gap-4 pr-10'>
          <Skeleton className='size-12 shrink-0 rounded-full' />
          <div className='min-w-0 flex-1 space-y-2'>
            <Skeleton className='h-4 w-3/4 max-w-40' />
            <div className='flex gap-1'>
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className='size-3 rounded-sm' />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-4 pb-4 sm:px-6 sm:pb-6'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-11/12' />
          <Skeleton className='h-4 w-2/3' />
        </div>
      </CardContent>
      <Skeleton className='absolute right-3 top-3 size-8 rounded-md' />
    </Card>
  );
};

export default Loading;
