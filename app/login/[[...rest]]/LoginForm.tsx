import { ClerkFailed, ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs';
import DemoLoginButton from '@/components/auth/DemoLoginButton';
import AuthFormSkeleton, {
  AuthWidgetSkeleton,
} from '@/components/auth/AuthFormSkeleton';

const LoginPage = () => {
  return (
    <>
      <ClerkLoading>
        <AuthFormSkeleton variant='login' />
      </ClerkLoading>

      <ClerkLoaded>
        <div className='flex min-h-[50vh] items-center justify-center px-4 py-8'>
          <div className='w-full max-w-[450px] overflow-hidden rounded-xl border bg-background shadow-lg'>
            <div className='flex justify-center p-4'>
              <SignIn
                routing='hash'
                fallback={<AuthWidgetSkeleton variant='login' />}
              />
            </div>

            {process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === 'true' && (
              <section className='border-t bg-card p-5 text-center'>
                <h2 className='text-lg font-semibold'>Explore the demo</h2>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Continue with a demo admin session.
                </p>
                <div className='mt-4'>
                  <DemoLoginButton />
                </div>
              </section>
            )}
          </div>
        </div>
      </ClerkLoaded>

      <ClerkFailed>
        <div className='flex min-h-[50vh] items-center justify-center px-4 py-8'>
          <p
            className='w-full max-w-[450px] rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground shadow-lg'
            role='alert'
          >
            Sign-in could not load. Refresh the page and try again.
          </p>
        </div>
      </ClerkFailed>
    </>
  );
};

export default LoginPage;
