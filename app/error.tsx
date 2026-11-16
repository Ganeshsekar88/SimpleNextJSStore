'use client';

import ErrorFallback from '@/components/global/ErrorFallback';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback onRetry={reset} digest={error.digest} />;
}
