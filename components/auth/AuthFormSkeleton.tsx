import { Skeleton } from '@/components/ui/skeleton';

type AuthFormSkeletonProps = {
  variant: 'login' | 'register';
};

function AuthFieldSkeleton() {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-3.5 w-24' aria-hidden='true' />
      <Skeleton className='h-10 w-full rounded-md' aria-hidden='true' />
    </div>
  );
}

export function AuthWidgetSkeleton({ variant }: AuthFormSkeletonProps) {
  const isRegister = variant === 'register';

  return (
    <div
      className='mx-auto w-full min-w-0 max-w-[400px] space-y-4'
      aria-busy='true'
      aria-label={`Loading ${variant === 'login' ? 'sign in' : 'sign up'} form`}
    >
      <div className='flex flex-col items-center gap-3 pb-2 text-center'>
        <Skeleton className='size-10 rounded-full' aria-hidden='true' />
        <Skeleton className='h-6 w-48 max-w-full' aria-hidden='true' />
        <Skeleton className='h-4 w-60 max-w-full' aria-hidden='true' />
      </div>

      <Skeleton className='h-10 w-full rounded-md' aria-hidden='true' />

      <div className='flex items-center gap-3 py-1' aria-hidden='true'>
        <Skeleton className='h-px flex-1' />
        <Skeleton className='h-3 w-8' />
        <Skeleton className='h-px flex-1' />
      </div>

      <AuthFieldSkeleton />
      {isRegister && <AuthFieldSkeleton />}

      <Skeleton className='h-10 w-full rounded-md' aria-hidden='true' />

      <div className='flex justify-center pt-1' aria-hidden='true'>
        <Skeleton className='h-3 w-40 max-w-full' />
      </div>
    </div>
  );
}

export default function AuthFormSkeleton({ variant }: AuthFormSkeletonProps) {
  const isRegister = variant === 'register';

  return (
    <section
      className='flex min-h-[65vh] min-w-0 items-center justify-center px-3 py-8 sm:px-4 sm:py-10'
      aria-busy='true'
      aria-label={`Loading ${isRegister ? 'account registration' : 'sign in'}`}
    >
      <div className='w-full min-w-0 max-w-[450px] overflow-hidden rounded-xl border bg-background shadow-lg'>
        <div className='p-4 sm:p-5'>
          <AuthWidgetSkeleton variant={variant} />
        </div>

        {!isRegister && process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === 'true' && (
          <div className='space-y-3 border-t bg-card p-5 text-center sm:p-6'>
            <Skeleton className='mx-auto h-5 w-40 max-w-full' aria-hidden='true' />
            <Skeleton className='mx-auto h-4 w-56 max-w-full' aria-hidden='true' />
            <Skeleton className='h-10 w-full rounded-md' aria-hidden='true' />
          </div>
        )}
      </div>
    </section>
  );
}
