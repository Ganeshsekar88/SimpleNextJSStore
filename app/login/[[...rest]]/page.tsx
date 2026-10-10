import { Suspense } from 'react';
import LoginForm from './LoginForm';
import LoadingContainer from '@/components/global/LoadingContainer';

export default function LoginPage() {
  return (
      <Suspense fallback={<LoadingContainer />}>
      <LoginForm />
    </Suspense>
  );
}