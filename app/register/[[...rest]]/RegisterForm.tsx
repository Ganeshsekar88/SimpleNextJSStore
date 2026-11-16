import { ClerkFailed, ClerkLoaded, ClerkLoading, SignUp } from '@clerk/nextjs';
import AuthFormSkeleton, {
  AuthWidgetSkeleton,
} from '@/components/auth/AuthFormSkeleton';

const RegisterPage = () => {
  return (
    <>
      <ClerkLoading>
        <AuthFormSkeleton variant='register' />
      </ClerkLoading>

      <ClerkLoaded>
        <div className='flex min-h-[50vh] items-center justify-center px-4 py-8'>
          <div className='w-full max-w-[450px] overflow-hidden rounded-xl border bg-background shadow-lg'>
            <div className='flex justify-center p-4'>
              <SignUp
                routing='hash'
                fallback={<AuthWidgetSkeleton variant='register' />}
              />
            </div>
          </div>
        </div>
      </ClerkLoaded>

      <ClerkFailed>
        <div className='flex min-h-[50vh] items-center justify-center px-4 py-8'>
          <p
            className='w-full max-w-[450px] rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground shadow-lg'
            role='alert'
          >
            Account registration could not load. Refresh the page and try again.
          </p>
        </div>
      </ClerkFailed>
    </>
  );
};

export default RegisterPage;
