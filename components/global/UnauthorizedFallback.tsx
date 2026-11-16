'use client';

import { ArrowLeft, LockKeyhole, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FallbackCard from '@/components/global/FallbackCard';
import { SignInDialog } from '@/components/form/Buttons';
import { Button } from '@/components/ui/button';

export default function UnauthorizedFallback() {
  const pathname = usePathname() || '/';

  return (
    <FallbackCard
      code='401 · SIGN IN REQUIRED'
      eyebrow='Members area'
      title='Sign in to continue.'
      description='This part of the store is saved for your account. Sign in and we’ll bring you right back here.'
      icon={<LockKeyhole aria-hidden='true' className='h-7 w-7' />}
      actions={
        <>
          <SignInDialog
            redirectUrl={pathname}
            trigger={
              <Button className='h-11 rounded-xl px-5'>
                <LogIn aria-hidden='true' className='mr-2 h-4 w-4' />
                Sign in to continue
              </Button>
            }
          />
          <Button
            asChild
            className='h-11 rounded-xl px-5'
            variant='outline'
          >
            <Link href='/'>
              <ArrowLeft aria-hidden='true' className='mr-2 h-4 w-4' />
              Back to store
            </Link>
          </Button>
        </>
      }
    />
  );
}
