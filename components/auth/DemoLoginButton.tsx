'use client';

import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

function DemoLoginButton() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const continueAsDemo = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/demo-sign-in', { method: 'POST' });
      const payload = (await response.json().catch(() => null)) as {
        token?: unknown;
        error?: unknown;
      } | null;

      if (!response.ok) {
        throw new Error(
          typeof payload?.error === 'string'
            ? payload.error
            : `Demo token endpoint failed (${response.status}).`
        );
      }
      if (typeof payload?.token !== 'string') {
        throw new Error('The demo token endpoint returned no token.');
      }

      const { error } = await signIn.ticket({ ticket: payload.token });
      if (error) throw new Error(error.message);
      if (signIn.status !== 'complete') {
        throw new Error(
          `Clerk sign-in stopped at "${signIn.status}". The demo account may have MFA or a required session task.`
        );
      }

      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const destination = decorateUrl('/');
          if (destination.startsWith('http')) {
            window.location.assign(destination);
          } else {
            router.replace(destination);
          }
        },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Demo sign-in could not finish.'
      );
      setIsSigningIn(false);
    }
  };

  return (
    <div className='mt-4'>
      <Button
        type='button'
        className='w-full'
        onClick={continueAsDemo}
        disabled={isSigningIn}
      >
        {isSigningIn ? 'Starting demo…' : 'Continue as demo admin'}
      </Button>
      {errorMessage && (
        <p className='mt-3 text-sm text-destructive' role='alert'>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default DemoLoginButton;
