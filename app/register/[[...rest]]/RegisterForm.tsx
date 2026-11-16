import { ClerkFailed, ClerkLoaded, ClerkLoading, SignUp } from '@clerk/nextjs';
import { AuthWidgetSkeleton } from '@/components/auth/AuthFormSkeleton';

const RegisterPage = () => {
  return (
    <section className='flex min-h-[65vh] min-w-0 items-center justify-center px-3 py-8 sm:px-4 sm:py-10'>
      <div className='w-full min-w-0 max-w-[450px] overflow-hidden rounded-xl border bg-background shadow-lg'>
        <div className='flex min-h-[36rem] justify-center p-4 sm:p-5'>
          <ClerkLoading>
            <AuthWidgetSkeleton variant='register' />
          </ClerkLoading>

          <ClerkLoaded>
            <SignUp
              routing='path'
              path='/register'
              signInUrl='/login'
              fallbackRedirectUrl='/'
              signInFallbackRedirectUrl='/'
              fallback={<AuthWidgetSkeleton variant='register' />}
            />
          </ClerkLoaded>

          <ClerkFailed>
            <p
              className='w-full max-w-[450px] rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground shadow-lg'
              role='alert'
            >
              Account registration could not load. Refresh the page and try
              again.
            </p>
          </ClerkFailed>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
