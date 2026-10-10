import { Suspense } from 'react';
import RegisterForm from './RegisterForm';
import LoadingContainer from '@/components/global/LoadingContainer';

export default function RegisterPage() {
  return (
      <Suspense fallback={<LoadingContainer />}>
      <RegisterForm />
    </Suspense>
  );
}