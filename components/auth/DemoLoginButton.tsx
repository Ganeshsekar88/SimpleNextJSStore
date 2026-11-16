'use client';

import { useSignIn } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

function DemoLoginButton({
  redirectUrl = '/',
  onPendingChange,
}: {
  redirectUrl?: string;
  onPendingChange?: (isPending: boolean) => void;
}) {
  const { signIn } = useSignIn();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const continueAsDemo = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);
    onPendingChange?.(true);
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

      let destination = redirectUrl;
      const { error: finalizeError } = await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          destination = decorateUrl(redirectUrl);
        },
      });
      if (finalizeError) throw new Error(finalizeError.message);

      // finalize() activates the session after its navigate callback returns.
      // Navigate only after it resolves so the protected page request includes
      // the new session instead of rendering and retaining a stale 401 boundary.
      window.location.assign(destination);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Demo sign-in could not finish.'
      );
    } finally {
      // Keep the control reusable after a failed attempt.
      setIsSigningIn(false);
      onPendingChange?.(false);
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
