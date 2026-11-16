'use client';

import { ClerkFailed, ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs';
import DemoLoginButton from '@/components/auth/DemoLoginButton';
import { AuthWidgetSkeleton } from '@/components/auth/AuthFormSkeleton';
import { useState } from 'react';

const LoginPage = () => {
  const [isDemoLoginPending, setIsDemoLoginPending] = useState(false);

  return (
    <section className='flex min-h-[65vh] min-w-0 items-center justify-center px-3 py-8 sm:px-4 sm:py-10'>
      <div className='w-full min-w-0 max-w-[450px] overflow-hidden rounded-xl border bg-background shadow-lg'>
        <div className='flex min-h-[34rem] justify-center p-4 sm:p-5'>
          {isDemoLoginPending ? (
            <AuthWidgetSkeleton variant='login' />
          ) : (
            <>
              <ClerkLoading>
                <AuthWidgetSkeleton variant='login' />
              </ClerkLoading>

              <ClerkLoaded>
                <SignIn
                  routing='path'
                  path='/login'
                  signUpUrl='/register'
                  fallbackRedirectUrl='/'
                  signUpFallbackRedirectUrl='/'
                  fallback={<AuthWidgetSkeleton variant='login' />}
                />
              </ClerkLoaded>

              <ClerkFailed>
                <p
                  className='w-full max-w-[400px] self-center rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground'
                  role='alert'
                >
                  Sign-in could not load. Refresh the page and try again.
                </p>
              </ClerkFailed>
            </>
          )}
        </div>

        {process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === 'true' && (
          <section className='border-t bg-card p-5 text-center'>
            <h2 className='text-lg font-semibold'>Explore the demo</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Continue with a demo admin session.
            </p>
            <div className='mt-4'>
              <DemoLoginButton onPendingChange={setIsDemoLoginPending} />
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

export default LoginPage;
