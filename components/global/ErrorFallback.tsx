'use client';

import Link from 'next/link';
import { AlertTriangle, House, RotateCw } from 'lucide-react';
import FallbackCard from '@/components/global/FallbackCard';
import { Button } from '@/components/ui/button';

type ErrorFallbackProps = {
  onRetry: () => void;
  digest?: string;
  fullScreen?: boolean;
};

export default function ErrorFallback({
  onRetry,
  digest,
  fullScreen = false,
}: ErrorFallbackProps) {
  return (
    <FallbackCard
      code='ERROR'
      eyebrow='A little detour'
      title='We hit a snag.'
      description='This page could not be loaded right now. Give it another try, or head back to the store.'
      icon={<AlertTriangle aria-hidden='true' className='h-7 w-7' />}
      reference={digest}
      fullScreen={fullScreen}
      actions={
        <>
          <Button className='h-11 rounded-xl px-5' onClick={onRetry}>
            <RotateCw aria-hidden='true' className='mr-2 h-4 w-4' />
            Try again
          </Button>
          <Button
            asChild
            className='h-11 rounded-xl px-5'
            variant='outline'
          >
            <Link href='/'>
              <House aria-hidden='true' className='mr-2 h-4 w-4' />
              Back to store
            </Link>
          </Button>
        </>
      }
    />
  );
}
