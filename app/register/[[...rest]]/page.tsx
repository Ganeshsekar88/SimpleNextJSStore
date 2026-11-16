import { Suspense } from 'react';
import AuthFormSkeleton from '@/components/auth/AuthFormSkeleton';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
      <Suspense fallback={<AuthFormSkeleton variant='register' />}>
      <RegisterForm />
    </Suspense>
  );
}
