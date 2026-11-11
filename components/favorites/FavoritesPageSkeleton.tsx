import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function FavoriteCardSkeleton() {
  return (
    <Card className='relative min-w-0 overflow-hidden' aria-hidden='true'>
      <CardContent className='p-4'>
        <Skeleton className='h-52 w-full rounded-xl sm:h-56' />
        <div className='mt-4 space-y-3'>
          <Skeleton className='mx-auto h-5 w-3/4 max-w-64' />
          <Skeleton className='mx-auto h-4 w-1/3 max-w-28' />
        </div>
      </CardContent>
      <Skeleton className='absolute right-7 top-7 size-10 rounded-full' />
    </Card>
  );
}

export function FavoritesPageSkeleton() {
  return (
    <section
      className='min-w-0'
      aria-busy='true'
      aria-label='Loading favorites'
    >
      <header className='min-w-0 space-y-2'>
        <Skeleton className='h-8 w-40 sm:h-9 sm:w-48' aria-hidden='true' />
        <Skeleton className='h-4 w-full max-w-md' aria-hidden='true' />
      </header>

      <div
        className='grid min-w-0 grid-cols-1 gap-4 pt-8 sm:grid-cols-2 sm:pt-10 lg:grid-cols-3'
        aria-hidden='true'
      >
        {Array.from({ length: 6 }, (_, index) => (
          <FavoriteCardSkeleton key={index} />
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
