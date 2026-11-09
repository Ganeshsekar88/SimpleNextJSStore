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
      const payload = await response.json();

      if (!response.ok || typeof payload.token !== 'string') {
        throw new Error('Demo sign-in is unavailable right now.');
      }

      const { error } = await signIn.ticket({ ticket: payload.token });
      if (error) throw new Error(error.message);
      if (signIn.status !== 'complete') {
        throw new Error('The demo account needs additional Clerk setup.');
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
    } catch {
      setErrorMessage(
        'Demo sign-in could not finish. Check that the demo account has no MFA or required session tasks.'
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
