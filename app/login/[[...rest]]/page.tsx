import { Suspense } from 'react';
import AuthFormSkeleton from '@/components/auth/AuthFormSkeleton';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
      <Suspense fallback={<AuthFormSkeleton variant='login' />}>
      <LoginForm />
    </Suspense>
  );
}
