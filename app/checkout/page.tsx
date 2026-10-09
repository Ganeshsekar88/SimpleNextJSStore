import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';
import LoadingContainer from '@/components/global/LoadingContainer';

export default function CheckoutPage() {
  return (
      <Suspense fallback={<LoadingContainer />}>
      <CheckoutForm />
    </Suspense>
  );
}