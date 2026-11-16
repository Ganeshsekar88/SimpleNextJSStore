'use client';

import { ClerkFailed, ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { AuthWidgetSkeleton } from '@/components/auth/AuthFormSkeleton';
import DemoLoginButton from '@/components/auth/DemoLoginButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type BtnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: BtnSize;
};

export function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      disabled={pending}
      className={cn('capitalize', className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();
  const label = isFavorite ? 'Remove from favorites' : 'Add to favorites';

  return (
    <Button
      type='submit'
      size='icon'
      variant='outline'
      className='p-2 cursor-pointer'
      aria-label={label}
    >
      {pending ? (
        <ReloadIcon className='animate-spin' />
      ) : isFavorite ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  );
};

function SignInDialog({
  redirectUrl,
  trigger,
}: {
  redirectUrl?: string;
  trigger: ReactNode;
}) {
  const [isDemoLoginPending, setIsDemoLoginPending] = useState(false);
  const demoLoginEnabled = process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === 'true';

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className='max-h-[90vh] max-w-[450px] overflow-y-auto p-0'>
        <DialogTitle className='sr-only'>Sign in</DialogTitle>
        <div className='w-full min-w-0 overflow-hidden'>
          <div className='flex min-h-[34rem] min-w-0 justify-center p-4 sm:p-5'>
            {isDemoLoginPending ? (
              <AuthWidgetSkeleton variant='login' />
            ) : (
              <>
                <ClerkLoading>
                  <AuthWidgetSkeleton variant='login' />
                </ClerkLoading>

                <ClerkLoaded>
                  <SignIn
                    routing='hash'
                    forceRedirectUrl={redirectUrl}
                    signUpForceRedirectUrl={redirectUrl}
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

          {demoLoginEnabled && (
            <section className='border-t bg-card p-5 text-center'>
              <h2 className='text-lg font-semibold'>Explore the demo</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Continue with a demo admin session.
              </p>
              <DemoLoginButton onPendingChange={setIsDemoLoginPending} />
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const CardSignInButton = ({
  redirectUrl,
}: {
  redirectUrl?: string;
}) => (
  <SignInDialog
    redirectUrl={redirectUrl}
    trigger={
      <Button
        type='button'
        size='icon'
        variant='outline'
        className='p-2 cursor-pointer'
        aria-label='Sign in to add to favorites'
      >
        <FaRegHeart />
      </Button>
    }
  />
);

export const ProductSignInButton = ({
  redirectUrl,
}: {
  redirectUrl?: string;
}) => (
  <SignInDialog
    redirectUrl={redirectUrl}
    trigger={
      <Button type='button' size='default' className='mt-8'>
        Please Sign In
      </Button>
    }
  />
);
