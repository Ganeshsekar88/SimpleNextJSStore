'use client';

import './globals.css';
import ErrorFallback from '@/components/global/ErrorFallback';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background text-foreground'>
        <ErrorFallback
          onRetry={reset}
          digest={error.digest}
          fullScreen
        />
      </body>
    </html>
  );
}
